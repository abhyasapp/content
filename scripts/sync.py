#!/usr/bin/env python3
"""Sync the Abhyas question bank from Google Drive into this repository.

Order of work (always the same):
  1. Download chapters-data.js (the navigation tree) from Drive.
  2. Read every file id it references.
  3. Fetch only those question files, in parallel, skipping unchanged ones.
  4. Only when EVERYTHING succeeded, write content/, chapters-data.js and
     manifest.json. A failed run leaves the working tree untouched.

Usage:
  python scripts/sync.py                    # full sync from Drive
  python scripts/sync.py --dry-run          # show what would change, write nothing
  python scripts/sync.py --force            # re-download every file
  python scripts/sync.py --check            # validate the local mirror (offline)
  python scripts/sync.py --normalize-local  # re-normalize content/ (offline)

Configuration comes from environment variables or a local .env file
(see .env.example). In CI they come from GitHub secrets / variables.
"""

import argparse
import base64
import hashlib
import json
import os
import random
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CONTENT_DIR = ROOT / 'content'
MANIFEST_PATH = ROOT / 'manifest.json'
CHAPTERS_PATH = ROOT / 'chapters-data.js'
ENV_PATH = ROOT / '.env'

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
RETRY_STATUSES = {429, 500, 502, 503, 504}
RATE_LIMIT_REASONS = {
    'ratelimitexceeded', 'userratelimitexceeded', 'quotaexceeded',
    'backenderror', 'internalerror',
}
DOWNLOAD_ATTEMPTS = 5
DEFAULT_WORKERS = 8
MAX_WORKERS = 32
# Refuse to publish a tree that suddenly references far fewer files than the
# last good sync: that is almost always a broken chapters-data.js on Drive, and
# pruning would wipe the mirror.
MIN_FILE_RATIO = 0.5

# Options that carry no real answer text (match-the-column tables that were
# not captured during extraction).
PLACEHOLDER_OPTIONS = {'', '...', '\u2026', 'refer to table', 'refer to the table'}

# The stable public qn id the pipeline writes to `public_qn`: level token,
# chapter, subtopic and sequence, either dotted ("50011.110001",
# "G0011.110001") or flat, which is the only shape that can carry a word
# subtopic ("5002mixedqn10001"). Kept in step with qidString() in the backend
# and normalizeQReportQid_() in Apps Script.
PUBLIC_QN_RE = re.compile(r'^[A-Za-z0-9][A-Za-z0-9._]{3,63}$')
FILE_ID_RE = re.compile(r'"(1[A-Za-z0-9_-]{20,})"')


def log(message=''):
    print(message, flush=True)


# --------------------------------------------------------------------------
# Configuration (.env + environment)
# --------------------------------------------------------------------------

def parse_env_text(text):
    """Parse KEY=VALUE lines. Supports `export`, comments and quoted values.

    Single-quoted values are taken literally, so a one-line service-account
    JSON can be pasted as GDRIVE_CREDENTIALS='{...}'.
    """
    values = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if line.startswith('export '):
            line = line[len('export '):].lstrip()
        key, sep, value = line.partition('=')
        key = key.strip()
        if not sep or not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', key):
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in '"\'':
            value = value[1:-1]
        elif ' #' in value:
            value = value.split(' #', 1)[0].rstrip()
        values[key] = value
    return values


def load_env(path=None):
    """Load .env into os.environ without overriding real environment vars."""
    path = Path(path) if path else ENV_PATH
    if not path.is_file():
        return 0
    loaded = 0
    for key, value in parse_env_text(path.read_text(encoding='utf-8')).items():
        if key not in os.environ:
            os.environ[key] = value
            loaded += 1
    return loaded


def env_flag(name):
    return os.environ.get(name, '').strip().lower() in {'1', 'true', 'yes', 'on'}


def env_int(name, default, low, high):
    raw = os.environ.get(name, '').strip()
    if not raw:
        return default
    try:
        return max(low, min(high, int(raw)))
    except ValueError:
        log(f'warning: {name}={raw!r} is not a number, using {default}')
        return default


@lru_cache(maxsize=1)
def load_credentials():
    """Service-account info from GDRIVE_CREDENTIALS or GDRIVE_CREDENTIALS_FILE.

    GDRIVE_CREDENTIALS may be the raw JSON or the same JSON base64-encoded.
    """
    raw = os.environ.get('GDRIVE_CREDENTIALS', '').strip()
    path = os.environ.get('GDRIVE_CREDENTIALS_FILE', '').strip()
    if not raw and path:
        file = Path(path).expanduser()
        if not file.is_absolute():
            file = ROOT / file
        if not file.is_file():
            raise RuntimeError(f'GDRIVE_CREDENTIALS_FILE not found: {file}')
        raw = file.read_text(encoding='utf-8').strip()
    if not raw:
        raise RuntimeError(
            'No Drive credentials. Set GDRIVE_CREDENTIALS (the service-account '
            'JSON) or GDRIVE_CREDENTIALS_FILE.')
    if not raw.startswith('{'):
        try:
            raw = base64.b64decode(raw, validate=True).decode('utf-8')
        except Exception as exc:
            raise RuntimeError(
                'GDRIVE_CREDENTIALS is neither JSON nor base64-encoded JSON') from exc
    try:
        info = json.loads(raw)
    except ValueError as exc:
        raise RuntimeError('GDRIVE_CREDENTIALS is not valid JSON') from exc
    missing = [k for k in ('client_email', 'private_key', 'token_uri') if not info.get(k)]
    if missing:
        raise RuntimeError(
            'GDRIVE_CREDENTIALS is not a service-account key (missing: '
            + ', '.join(missing) + ')')
    return info


# --------------------------------------------------------------------------
# Drive access
# --------------------------------------------------------------------------

class LostFile(Exception):
    """The referenced Drive file no longer exists (HTTP 404)."""


class BadPayload(Exception):
    """A downloaded question file is not a JSON array."""


def _http_reason(exc):
    """The machine-readable reason of a Drive HttpError, lower-cased, or ''."""
    try:
        details = getattr(exc, 'error_details', None) or []
        for item in details:
            reason = item.get('reason') if isinstance(item, dict) else None
            if reason:
                return str(reason).lower()
        body = json.loads(exc.content.decode('utf-8'))
        errors = body.get('error', {}).get('errors') or []
        if errors:
            return str(errors[0].get('reason', '')).lower()
    except Exception:
        pass
    return ''


def with_retry(call, label, sleep=time.sleep):
    """Run `call`, retrying transient failures with exponential backoff.

    Retries: 429/5xx, 403 only when Drive says it is a rate/quota limit (a
    plain 403 permission error is permanent and fails at once), and network
    errors. A 404 raises LostFile.
    """
    from googleapiclient.errors import HttpError

    for attempt in range(DOWNLOAD_ATTEMPTS):
        last = attempt == DOWNLOAD_ATTEMPTS - 1
        try:
            return call()
        except HttpError as exc:
            status = getattr(exc.resp, 'status', None)
            if status == 404:
                raise LostFile(label) from exc
            retryable = status in RETRY_STATUSES or (
                status == 403 and _http_reason(exc) in RATE_LIMIT_REASONS)
            if not retryable or last:
                raise
        except (OSError, TimeoutError):
            if last:
                raise
        sleep(min(30, 2 ** attempt) + random.random())
    raise AssertionError('unreachable')


class DriveClient:
    """Thin wrapper over one googleapiclient Drive service (not thread-safe)."""

    def __init__(self, service):
        self.service = service

    def download(self, fid):
        return with_retry(
            lambda: self.service.files().get_media(
                fileId=fid, supportsAllDrives=True).execute(),
            f'download {fid}')

    def stat(self, fid):
        """md5Checksum of one file ('' when Drive has none)."""
        meta = with_retry(
            lambda: self.service.files().get(
                fileId=fid, fields='id,md5Checksum', supportsAllDrives=True).execute(),
            f'stat {fid}')
        return meta.get('md5Checksum') or ''

    def list_md5(self):
        """{file id: md5Checksum} for every file the service account can see.

        One paginated call replaces hundreds of per-file metadata requests.
        """
        out = {}
        token = None
        while True:
            response = with_retry(
                lambda: self.service.files().list(
                    q='trashed = false', pageSize=1000, pageToken=token,
                    fields='nextPageToken, files(id, md5Checksum)',
                ).execute(),
                'list files')
            for item in response.get('files', []):
                out[item['id']] = item.get('md5Checksum') or ''
            token = response.get('nextPageToken')
            if not token:
                return out


def build_service():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_info(
        load_credentials(), scopes=SCOPES)
    return build('drive', 'v3', credentials=creds, cache_discovery=False)


class ThreadLocalDrive:
    """Gives every worker thread its own client (httplib2 is not thread-safe)."""

    def __init__(self, factory=lambda: DriveClient(build_service())):
        self._factory = factory
        self._local = threading.local()

    def _client(self):
        if not hasattr(self._local, 'client'):
            self._local.client = self._factory()
        return self._local.client

    def download(self, fid):
        return self._client().download(fid)

    def stat(self, fid):
        return self._client().stat(fid)

    def list_md5(self):
        return self._client().list_md5()


def extract_ids(js):
    """Every Drive file ID referenced inside chapters-data.js, sorted."""
    return sorted(set(FILE_ID_RE.findall(js)))


# --------------------------------------------------------------------------
# Question normalization
# --------------------------------------------------------------------------

def _as_index(value, option_count):
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        candidate = value
    elif isinstance(value, str) and value.strip().isdigit():
        candidate = int(value.strip())
    else:
        return None
    return candidate if 0 <= candidate < option_count else None


def clean_public_qn(value, stats):
    """The question's stable public qn id, or None when absent or unusable.

    The id is what the app keys progress, reports and corrections on, so a
    malformed one is dropped and counted rather than passed through as an
    identity nothing can resolve.
    """
    if value is None or value == '':
        return None
    text = value.strip() if isinstance(value, str) else ''
    if not text or not PUBLIC_QN_RE.match(text) or not re.search(r'\d', text):
        stats['bad_public_qn'] = stats.get('bad_public_qn', 0) + 1
        return None
    return text


def normalize_question(question, fid, index, stats):
    """Return one question in the canonical shape: id, q, options, correct, explain.

    Legacy fields `answer` and `explanation` are folded into `correct` and
    `explain`. Questions without an id get a stable one derived from the source
    file and their 1-based position. Unknown extra keys are preserved.
    """
    if not isinstance(question, dict):
        stats['dropped'] = stats.get('dropped', 0) + 1
        return None

    options = question.get('options')
    if not isinstance(options, list):
        options = []
        stats['missing_options'] = stats.get('missing_options', 0) + 1

    qid = question.get('id')
    if qid is None or qid == '':
        qid = f'{fid}-{index + 1}'
        stats['id_backfilled'] = stats.get('id_backfilled', 0) + 1

    raw_correct = question.get('correct', question.get('answer'))
    correct = _as_index(raw_correct, len(options))
    if correct is None:
        stats['missing_correct'] = stats.get('missing_correct', 0) + 1
    if 'answer' in question and 'correct' not in question:
        stats['answer_renamed'] = stats.get('answer_renamed', 0) + 1

    explain = question.get('explain', question.get('explanation'))
    if 'explanation' in question and 'explain' not in question:
        stats['explanation_renamed'] = stats.get('explanation_renamed', 0) + 1
    if not explain:
        stats['missing_explain'] = stats.get('missing_explain', 0) + 1

    if len(options) != 4:
        stats['options_not_4'] = stats.get('options_not_4', 0) + 1
    if any(isinstance(o, str) and o.strip().lower() in PLACEHOLDER_OPTIONS for o in options):
        stats['placeholder_options'] = stats.get('placeholder_options', 0) + 1

    public_qn = clean_public_qn(question.get('public_qn'), stats)

    out = {
        'id': qid,
        'q': question.get('q') if isinstance(question.get('q'), str) else '',
        'options': options,
        'correct': correct,
        'explain': explain if isinstance(explain, str) else '',
    }
    if public_qn:
        out['public_qn'] = public_qn
    for key, value in question.items():
        if key in ('id', 'q', 'options', 'correct', 'answer', 'explain',
                   'explanation', 'public_qn'):
            continue
        out[key] = value
        stats[f'extra_key:{key}'] = stats.get(f'extra_key:{key}', 0) + 1
    return out


def process_payload(raw, fid, stats, strict=False):
    """Normalize a downloaded question file and return its canonical text.

    strict=True (used by the Drive sync) raises BadPayload for anything that is
    not a JSON array, so a corrupted download fails the run instead of being
    mirrored. The offline normalizer stays lenient and passes such files
    through for `--check` to report.
    """
    try:
        data = json.loads(raw.decode('utf-8-sig'))
    except Exception:
        if strict:
            raise BadPayload(f'{fid}: not valid UTF-8 JSON')
        stats['passthrough'] = stats.get('passthrough', 0) + 1
        return raw.decode('utf-8', errors='replace')

    if not isinstance(data, list):
        if strict:
            raise BadPayload(f'{fid}: expected a JSON array of questions')
        stats['passthrough'] = stats.get('passthrough', 0) + 1
        return json.dumps(data, ensure_ascii=False, indent=2)

    questions = []
    for index, question in enumerate(data):
        normalized = normalize_question(question, fid, index, stats)
        if normalized is not None:
            questions.append(normalized)
    stats['questions'] = stats.get('questions', 0) + len(questions)
    return json.dumps(questions, ensure_ascii=False, indent=2)


def merge_stats(total, part):
    for key, value in part.items():
        total[key] = total.get(key, 0) + value


# --------------------------------------------------------------------------
# Files and manifest
# --------------------------------------------------------------------------

def write_text(path, text):
    """Write UTF-8 with LF endings so on-disk bytes match the manifest checksum."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(text)


def entry_for(text, drive_md5=''):
    """Manifest entry for one file. `size` is the byte length, matching the
    bytes `md5` is taken over, so the pair verifies the file on disk."""
    raw = text.encode('utf-8')
    return {
        'md5': hashlib.md5(raw).hexdigest(),
        'size': len(raw),
        'drive_md5': drive_md5,
    }


def chapters_entry(text):
    raw = text.encode('utf-8')
    return {'md5': hashlib.md5(raw).hexdigest(), 'size': len(raw)}


def clean_chapters_text(raw_bytes):
    """chapters-data.js as stored in git: UTF-8, no BOM, LF endings."""
    return raw_bytes.decode('utf-8-sig').replace('\r\n', '\n').replace('\r', '\n')


def load_manifest():
    if not MANIFEST_PATH.exists():
        return {'files': {}}
    try:
        data = json.loads(MANIFEST_PATH.read_text(encoding='utf-8'))
        return data if isinstance(data, dict) else {'files': {}}
    except Exception:
        return {'files': {}}


def save_manifest(files, chapters_text):
    """Write manifest.json only when something in it changed.

    `updated` therefore moves only on real changes, so an idle sync makes no
    commit at all. Returns True when the manifest was written.
    """
    previous = load_manifest()
    new = {'files': files, 'chapters': chapters_entry(chapters_text)}
    if all(previous.get(key) == value for key, value in new.items()):
        return False
    new['updated'] = datetime.now(timezone.utc).isoformat()
    write_text(MANIFEST_PATH, json.dumps(new, indent=2))
    return True


def stale_files(ids):
    """content/*.json that chapters-data.js no longer references."""
    keep = {f'{fid}.json' for fid in ids}
    return sorted(p.name for p in CONTENT_DIR.glob('*.json') if p.name not in keep)


def prune_stale(ids):
    removed = stale_files(ids)
    for name in removed:
        (CONTENT_DIR / name).unlink()
    return removed


def report(stats, files_written, reused, pruned, failures):
    log(f'files written : {files_written}')
    log(f'files reused  : {reused}')
    log(f'files pruned  : {len(pruned)}')
    log(f'questions     : {stats.get("questions", 0)}')
    flags = {k: v for k, v in sorted(stats.items()) if k != 'questions'}
    if flags:
        log('normalization : ' + ', '.join(f'{k}={v}' for k, v in flags.items()))
    if failures:
        print(f'\nFAILED ({len(failures)}):', file=sys.stderr)
        for item in failures[:50]:
            print(f'  {item}', file=sys.stderr)
        if len(failures) > 50:
            print(f'  ... and {len(failures) - 50} more', file=sys.stderr)


def write_step_summary(lines):
    """Append a markdown summary to the GitHub Actions run page, if in CI."""
    target = os.environ.get('GITHUB_STEP_SUMMARY')
    if not target:
        return
    try:
        with open(target, 'a', encoding='utf-8') as handle:
            handle.write('\n'.join(lines) + '\n')
    except OSError:
        pass


# --------------------------------------------------------------------------
# Modes
# --------------------------------------------------------------------------

def _disk_matches(path, entry):
    """True when the file on disk is exactly what the manifest recorded."""
    try:
        raw = path.read_bytes()
    except OSError:
        return False
    return hashlib.md5(raw).hexdigest() == entry.get('md5') and len(raw) == entry.get('size')


def _sync_one(drive, fid, drive_md5s, previous, force):
    """Decide reuse-or-download for one file. Pure: it never touches the disk
    except to read, so a failed run leaves the tree exactly as it was."""
    stats = {}
    drive_md5 = drive_md5s.get(fid)
    if drive_md5 is None:                    # not in the bulk listing
        drive_md5 = drive.stat(fid)
    cached = previous.get(fid)
    if (not force and drive_md5 and cached
            and cached.get('drive_md5') == drive_md5
            and _disk_matches(CONTENT_DIR / f'{fid}.json', cached)):
        return fid, cached, None, stats
    raw = drive.download(fid)
    text = process_payload(raw, fid, stats, strict=True)
    return fid, entry_for(text, drive_md5), text, stats


def full_sync(drive=None, force=False, dry_run=False, allow_shrink=False, workers=None):
    started = time.monotonic()
    chapters_id = os.environ.get('CHAPTERS_FILE_ID', '').strip()
    if not chapters_id:
        print('CHAPTERS_FILE_ID is not set', file=sys.stderr)
        return 1
    workers = workers or env_int('SYNC_WORKERS', DEFAULT_WORKERS, 1, MAX_WORKERS)

    try:
        drive = drive or ThreadLocalDrive()
        # Step 1: the chapter tree comes first; it decides what content exists.
        try:
            chapters_text = clean_chapters_text(drive.download(chapters_id))
        except LostFile:
            print(f'chapters-data.js ({chapters_id}) no longer exists on Drive '
                  '(or is not shared with the service account)', file=sys.stderr)
            return 1
        ids = extract_ids(chapters_text)
    except Exception as exc:
        print(f'could not download chapters-data.js: {exc}', file=sys.stderr)
        return 1

    if not ids:
        print('chapters-data.js references no Drive files - refusing to continue',
              file=sys.stderr)
        return 1
    log(f'chapters-data.js: {len(ids)} file references')

    previous = load_manifest().get('files', {})
    if (previous and not allow_shrink
            and len(ids) < MIN_FILE_RATIO * len(previous)):
        print(f'chapters-data.js now references {len(ids)} files but the last sync '
              f'had {len(previous)}. Refusing to prune the mirror. If this is '
              'intentional, run with --allow-shrink (or ALLOW_SHRINK=1).',
              file=sys.stderr)
        return 1

    # Step 2: one listing call for every md5, then per-file work in parallel.
    try:
        drive_md5s = drive.list_md5()
    except Exception as exc:
        log(f'warning: bulk md5 listing failed ({exc}); falling back to per-file lookups')
        drive_md5s = {}

    log(f'checking {len(ids)} files with {workers} workers' + (' (forced)' if force else ''))
    entries, texts, stats, failures = {}, {}, {}, []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(_sync_one, drive, fid, drive_md5s, previous, force): fid
                   for fid in ids}
        for count, future in enumerate(as_completed(futures), 1):
            fid = futures[future]
            try:
                _, entry, text, part = future.result()
            except LostFile:
                failures.append(f'{fid}: referenced in chapters-data.js but missing on Drive')
            except BadPayload as exc:
                failures.append(str(exc))
            except Exception as exc:
                failures.append(f'{fid}: {type(exc).__name__}: {exc}')
            else:
                entries[fid] = entry
                merge_stats(stats, part)
                if text is not None:
                    texts[fid] = text
            if count % 100 == 0:
                log(f'  {count}/{len(ids)}')

    stale = stale_files(ids)
    written, reused = len(texts), len(entries) - len(texts)
    report(stats, written, reused, stale, failures)

    if failures:
        print('\nSync incomplete - nothing was written to disk.', file=sys.stderr)
        write_step_summary([
            '### Drive sync FAILED',
            f'{len(failures)} file(s) failed; nothing was committed.',
            *[f'- `{item}`' for item in failures[:20]],
        ])
        return 1

    # Step 3: everything succeeded - now (and only now) touch the working tree.
    ordered = {fid: entries[fid] for fid in ids}
    chapters_changed = (not CHAPTERS_PATH.exists()
                        or CHAPTERS_PATH.read_text(encoding='utf-8') != chapters_text)
    manifest_changed = (load_manifest().get('files') != ordered
                        or load_manifest().get('chapters') != chapters_entry(chapters_text))
    changed = bool(texts or stale or chapters_changed or manifest_changed)

    if dry_run:
        log(f'\nDry run: {"changes pending" if changed else "already up to date"} '
            f'({written} to write, {len(stale)} to prune, '
            f'chapters {"changed" if chapters_changed else "same"}). Nothing written.')
        return 0

    for fid, text in texts.items():
        write_text(CONTENT_DIR / f'{fid}.json', text)
    prune_stale(ids)
    if chapters_changed:
        write_text(CHAPTERS_PATH, chapters_text)
    save_manifest(ordered, chapters_text)

    elapsed = time.monotonic() - started
    log(f'\nSync complete in {elapsed:.1f}s' + ('' if changed else ' - already up to date'))
    write_step_summary([
        '### Drive sync ' + ('updated the mirror' if changed else '- already up to date'),
        f'- files: {len(ids)} ({written} written, {reused} reused, {len(stale)} pruned)',
        f'- questions in changed files: {stats.get("questions", 0)}',
        f'- chapters-data.js: {"changed" if chapters_changed else "unchanged"}',
        f'- took {elapsed:.1f}s with {workers} workers',
    ])
    return 0


def normalize_local():
    """Re-normalize the checked-in content/ tree without touching Drive."""
    if not CHAPTERS_PATH.exists():
        print('chapters-data.js not found', file=sys.stderr)
        return 1

    chapters_text = CHAPTERS_PATH.read_text(encoding='utf-8')
    ids = extract_ids(chapters_text)
    previous = load_manifest().get('files', {})
    files = {}
    stats = {}
    failures = []
    written = 0

    for fid in ids:
        path = CONTENT_DIR / f'{fid}.json'
        if not path.exists():
            failures.append(f'{fid}: referenced in chapters-data.js but missing in content/')
            continue
        raw = path.read_bytes()
        text = process_payload(raw, fid, stats)
        drive_md5 = (previous.get(fid) or {}).get('drive_md5', '')
        if raw != text.encode('utf-8'):
            write_text(path, text)
            written += 1
        files[fid] = entry_for(text, drive_md5)

    pruned = prune_stale(ids)
    report(stats, written, len(ids) - written - len(failures), pruned, failures)

    if failures:
        print('\nNormalization incomplete - manifest not updated.', file=sys.stderr)
        return 1

    save_manifest(files, chapters_text)
    log('Normalization complete')
    return 0


QUESTION_NUMBER_RE = re.compile(r'^\s*\d+\s*[.)]\s*')


def question_signature(question):
    """What makes two rows the same question, ignoring the item number.

    A question legitimately appears twice in the corpus: once in a pooled file
    and once in the chapter file it was drawn from. Each file numbers its own
    items, so the text differs by its "12." prefix but the question, its
    options and its answer are identical - and it keeps one public id.
    """
    text = question.get('q')
    if isinstance(text, str):
        text = QUESTION_NUMBER_RE.sub('', text)
    else:
        text = ''
    options = question.get('options')
    options = tuple(str(o) for o in options) if isinstance(options, list) else ()
    return (text.strip(), options, question.get('correct'))


def check_local():
    """Validate the checked-in mirror offline. Exit 1 on any problem.

    The app trusts this tree, so a missing file, a truncated array or a public
    id shared by two different questions is a user-visible fault. A public id is
    allowed to repeat when it repeats the *same* question, which the corpus does
    on purpose (a pooled file and the chapter file it came from); only a repeat
    across different question text, options or answers is a collision.
    """
    problems = []
    notes = []
    if not CHAPTERS_PATH.exists():
        print('chapters-data.js not found', file=sys.stderr)
        return 1

    chapters_raw = CHAPTERS_PATH.read_bytes()
    ids = extract_ids(chapters_raw.decode('utf-8'))
    if not ids:
        problems.append('chapters-data.js references no Drive files')

    questions = 0
    id_owner = {}
    public_owner = {}

    for fid in ids:
        path = CONTENT_DIR / f'{fid}.json'
        if not path.exists():
            problems.append(f'{fid}: referenced by chapters-data.js but missing from content/')
            continue
        try:
            data = json.loads(path.read_text(encoding='utf-8'))
        except Exception as exc:
            problems.append(f'{fid}: not valid JSON ({exc})')
            continue
        if not isinstance(data, list):
            problems.append(f'{fid}: expected a JSON array of questions')
            continue

        questions += len(data)
        local_ids = set()
        for position, question in enumerate(data):
            where = f'{fid}[{position}]'
            if not isinstance(question, dict):
                problems.append(f'{where}: not an object')
                continue

            qid = question.get('id')
            if qid is None or qid == '':
                problems.append(f'{where}: has no id')
            else:
                key = str(qid)
                if key in local_ids:
                    problems.append(f'{where}: duplicate id {key} in the same file')
                local_ids.add(key)
                owner = id_owner.setdefault(key, fid)
                if owner != fid:
                    notes.append(f'{where}: id {key} also appears in {owner}')

            options = question.get('options')
            if not isinstance(options, list):
                problems.append(f'{where}: options is not a list')
            if not isinstance(question.get('q'), str) or not question['q'].strip():
                problems.append(f'{where}: empty question text')
            correct = question.get('correct')
            if (not isinstance(correct, int) or isinstance(correct, bool)
                    or not isinstance(options, list)
                    or not 0 <= correct < len(options)):
                problems.append(f'{where}: correct={correct!r} is not an index into its options')

            public = question.get('public_qn')
            if public is not None:
                if (not isinstance(public, str) or not PUBLIC_QN_RE.match(public)
                        or not re.search(r'\d', public)):
                    problems.append(f'{where}: unusable public_qn {public!r}')
                elif public in public_owner:
                    first_where, first_signature = public_owner[public]
                    if first_signature != question_signature(question):
                        problems.append(
                            f'{where}: public_qn {public} names a different question than {first_where}')
                else:
                    public_owner[public] = (where, question_signature(question))

    manifest_all = load_manifest()
    manifest = manifest_all.get('files', {})
    for fid in ids:
        path = CONTENT_DIR / f'{fid}.json'
        if not path.exists():
            continue
        entry = manifest.get(fid)
        if not entry:
            problems.append(f'{fid}: missing from manifest.json')
            continue
        raw = path.read_bytes()
        if hashlib.md5(raw).hexdigest() != entry.get('md5'):
            problems.append(f'{fid}: md5 in manifest.json does not match the file')
        elif len(raw) != entry.get('size'):
            problems.append(
                f'{fid}: size in manifest.json is {entry.get("size")} but the file is {len(raw)} bytes')

    chapters_entry_saved = manifest_all.get('chapters')
    if chapters_entry_saved:
        if hashlib.md5(chapters_raw).hexdigest() != chapters_entry_saved.get('md5'):
            problems.append('chapters-data.js does not match the checksum in manifest.json')

    stale = stale_files(ids)
    if stale:
        notes.append(f'{len(stale)} file(s) in content/ are not referenced by chapters-data.js: '
                     + ', '.join(stale[:5]) + (' ...' if len(stale) > 5 else ''))

    log(f'files        : {len(ids)}')
    log(f'questions    : {questions}')
    log(f'public qn ids: {len(public_owner)}')
    if notes:
        log(f'\nnotes ({len(notes)}):')
        for item in notes[:20]:
            log(f'  {item}')
    if problems:
        print(f'\nPROBLEMS ({len(problems)}):', file=sys.stderr)
        for item in problems[:50]:
            print(f'  {item}', file=sys.stderr)
        return 1
    log('\nContent check passed')
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(
        description='Sync the Abhyas question bank from Google Drive.')
    parser.add_argument('--check', action='store_true',
                        help='validate the local mirror (offline), exit 1 on problems')
    parser.add_argument('--normalize-local', action='store_true',
                        help='re-normalize content/ without Drive access')
    parser.add_argument('--dry-run', action='store_true',
                        help='fetch and compare, but write nothing')
    parser.add_argument('--force', action='store_true',
                        help='re-download every file even if unchanged')
    parser.add_argument('--allow-shrink', action='store_true',
                        help='allow chapters-data.js to drop most of its files')
    parser.add_argument('--workers', type=int, default=None,
                        help=f'parallel downloads (default {DEFAULT_WORKERS}, max {MAX_WORKERS})')
    args = parser.parse_args(argv)

    load_env()
    if args.check:
        return check_local()
    if args.normalize_local:
        return normalize_local()
    workers = max(1, min(MAX_WORKERS, args.workers)) if args.workers else None
    return full_sync(
        force=args.force or env_flag('FORCE_FULL'),
        dry_run=args.dry_run,
        allow_shrink=args.allow_shrink or env_flag('ALLOW_SHRINK'),
        workers=workers,
    )


if __name__ == '__main__':
    sys.exit(main())
