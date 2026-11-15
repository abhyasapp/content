"""Sync question content from Google Drive into this repository.

Usage:
  python scripts/sync.py                    # full sync from Drive
  python scripts/sync.py --normalize-local  # re-normalize files already in content/ (no Drive access)
  python scripts/sync.py --check            # validate the local mirror, exit 1 on problems

Full sync needs these environment variables:
  GDRIVE_CREDENTIALS  service-account JSON (secret in CI)
  CHAPTERS_FILE_ID    Drive file ID of chapters-data.js

Every downloaded question file is normalized to a single schema before it is
written, so the checksum in manifest.json describes the normalized text on disk.
"""

import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
SNAPSHOT_FIELDS = 'id,md5Checksum'
RETRY_STATUSES = {403, 429, 500, 502, 503, 504}
DOWNLOAD_ATTEMPTS = 5

CONTENT_DIR = Path('content')
MANIFEST_PATH = Path('manifest.json')
CHAPTERS_PATH = Path('chapters-data.js')

# Options that carry no real answer text (match-the-column tables that were
# not captured during extraction).
PLACEHOLDER_OPTIONS = {'', '...', '\u2026', 'refer to table', 'refer to the table'}

# The stable public qn id the pipeline writes to `public_qn`: level token,
# chapter, subtopic and sequence, either dotted ("50011.110001",
# "G0011.110001") or flat, which is the only shape that can carry a word
# subtopic ("5002mixedqn10001"). Kept in step with qidString() in the backend
# and normalizeQReportQid_() in Apps Script.
PUBLIC_QN_RE = re.compile(r'^[A-Za-z0-9][A-Za-z0-9._]{3,63}$')


# --------------------------------------------------------------------------
# Drive access
# --------------------------------------------------------------------------

def get_drive():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    info = json.loads(os.environ['GDRIVE_CREDENTIALS'])
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds, cache_discovery=False)


class LostFile(Exception):
    """The referenced Drive file no longer exists (HTTP 404)."""


def with_retry(call, label):
    from googleapiclient.errors import HttpError

    for attempt in range(DOWNLOAD_ATTEMPTS):
        try:
            return call()
        except HttpError as exc:
            status = getattr(exc.resp, 'status', None)
            if status == 404:
                raise LostFile(label) from exc
            if status not in RETRY_STATUSES or attempt == DOWNLOAD_ATTEMPTS - 1:
                raise
            time.sleep(2 ** attempt)
    raise AssertionError('unreachable')


def download(drive, fid):
    return with_retry(
        lambda: drive.files().get_media(fileId=fid).execute(),
        f'download {fid}',
    )


def drive_checksum(drive, fid):
    meta = with_retry(
        lambda: drive.files().get(fileId=fid, fields=SNAPSHOT_FIELDS).execute(),
        f'stat {fid}',
    )
    return meta.get('md5Checksum') or ''


def extract_ids(js):
    """Every Drive file ID referenced inside chapters-data.js, sorted."""
    return sorted(set(re.findall(r'"(1[A-Za-z0-9_-]{20,})"', js)))


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


def process_payload(raw, fid, stats):
    """Normalize a downloaded question file and return its canonical text."""
    try:
        data = json.loads(raw.decode('utf-8'))
    except Exception:
        stats['passthrough'] = stats.get('passthrough', 0) + 1
        return raw.decode('utf-8', errors='replace')

    if not isinstance(data, list):
        stats['passthrough'] = stats.get('passthrough', 0) + 1
        return json.dumps(data, ensure_ascii=False, indent=2)

    questions = []
    for index, question in enumerate(data):
        normalized = normalize_question(question, fid, index, stats)
        if normalized is not None:
            questions.append(normalized)
    stats['questions'] = stats.get('questions', 0) + len(questions)
    return json.dumps(questions, ensure_ascii=False, indent=2)


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
    bytes `md5` is taken over, so the pair verifies the file on disk. It used to
    count characters, which under-reported every file holding Devanagari text."""
    raw = text.encode('utf-8')
    return {
        'md5': hashlib.md5(raw).hexdigest(),
        'size': len(raw),
        'drive_md5': drive_md5,
    }


def load_manifest():
    if not MANIFEST_PATH.exists():
        return {'files': {}}
    try:
        return json.loads(MANIFEST_PATH.read_text(encoding='utf-8'))
    except Exception:
        return {'files': {}}


def prune_stale(ids):
    """Delete content files that chapters-data.js no longer references."""
    keep = {f'{fid}.json' for fid in ids}
    removed = []
    for path in CONTENT_DIR.glob('*.json'):
        if path.name not in keep:
            path.unlink()
            removed.append(path.name)
    return removed


def report(stats, files_written, reused, pruned, failures):
    print(f'files written : {files_written}')
    print(f'files reused  : {reused}')
    print(f'files pruned  : {len(pruned)}')
    print(f'questions     : {stats.get("questions", 0)}')
    flags = {k: v for k, v in sorted(stats.items()) if k != 'questions'}
    if flags:
        print('normalization : ' + ', '.join(f'{k}={v}' for k, v in flags.items()))
    if failures:
        print(f'\nFAILED ({len(failures)}):', file=sys.stderr)
        for item in failures:
            print(f'  {item}', file=sys.stderr)


# --------------------------------------------------------------------------
# Modes
# --------------------------------------------------------------------------

def full_sync():
    drive = get_drive()
    try:
        chapters_js = download(drive, os.environ['CHAPTERS_FILE_ID']).decode('utf-8')
    except LostFile:
        print(f"chapters-data.js ({CHAPTERS_FILE_ID}) no longer exists on Drive", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f'could not download chapters-data.js: {exc}', file=sys.stderr)
        return 1
    write_text(CHAPTERS_PATH, chapters_js)

    ids = extract_ids(chapters_js)
    print(f'Found {len(ids)} file references')

    previous = load_manifest().get('files', {})
    manifest = {'files': {}}
    stats = {}
    failures = []
    written = reused = 0

    for fid in ids:
        path = CONTENT_DIR / f'{fid}.json'
        try:
            drive_md5 = drive_checksum(drive, fid)
        except LostFile:
            failures.append(f'{fid}: referenced in chapters-data.js but missing on Drive')
            continue
        except Exception as exc:
            failures.append(f'{fid}: metadata error: {exc}')
            continue

        cached = previous.get(fid)
        if cached and cached.get('drive_md5') == drive_md5 and path.exists():
            manifest['files'][fid] = cached
            reused += 1
            continue

        try:
            raw = download(drive, fid)
        except LostFile:
            failures.append(f'{fid}: referenced in chapters-data.js but missing on Drive')
            continue
        except Exception as exc:
            failures.append(f'{fid}: download error: {exc}')
            continue

        text = process_payload(raw, fid, stats)
        write_text(path, text)
        manifest['files'][fid] = entry_for(text, drive_md5)
        written += 1

    pruned = prune_stale(ids)
    report(stats, written, reused, pruned, failures)

    if failures:
        print('\nSync incomplete - manifest not updated, nothing to commit.', file=sys.stderr)
        return 1

    manifest['updated'] = datetime.now(timezone.utc).isoformat()
    write_text(MANIFEST_PATH, json.dumps(manifest, indent=2))
    print('Sync complete')
    return 0


def normalize_local():
    """Re-normalize the checked-in content/ tree without touching Drive."""
    if not CHAPTERS_PATH.exists():
        print('chapters-data.js not found', file=sys.stderr)
        return 1

    ids = extract_ids(CHAPTERS_PATH.read_text(encoding='utf-8'))
    previous = load_manifest().get('files', {})
    manifest = {'files': {}}
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
        manifest['files'][fid] = entry_for(text, drive_md5)

    pruned = prune_stale(ids)
    report(stats, written, len(ids) - written - len(failures), pruned, failures)

    if failures:
        print('\nNormalization incomplete - manifest not updated.', file=sys.stderr)
        return 1

    manifest['updated'] = datetime.now(timezone.utc).isoformat()
    write_text(MANIFEST_PATH, json.dumps(manifest, indent=2))
    print('Normalization complete')
    return 0


def check_local():
    """Validate the checked-in mirror offline. Exit 1 on any problem.

    The app trusts this tree, so a missing file, a truncated array or a
    duplicated public id is a user-visible fault: a duplicated public qn id is
    two different questions sharing one identity, which is exactly what the id
    scheme exists to prevent.
    """
    problems = []
    notes = []
    if not CHAPTERS_PATH.exists():
        print('chapters-data.js not found', file=sys.stderr)
        return 1

    ids = extract_ids(CHAPTERS_PATH.read_text(encoding='utf-8'))
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
                    problems.append(f'{where}: public_qn {public} is already used by {public_owner[public]}')
                else:
                    public_owner[public] = where

    manifest = load_manifest().get('files', {})
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

    stale = sorted(p.name for p in CONTENT_DIR.glob('*.json')
                   if p.stem not in set(ids))
    if stale:
        notes.append(f'{len(stale)} file(s) in content/ are not referenced by chapters-data.js: '
                     + ', '.join(stale[:5]) + (' ...' if len(stale) > 5 else ''))

    print(f'files        : {len(ids)}')
    print(f'questions    : {questions}')
    print(f'public qn ids: {len(public_owner)}')
    if notes:
        print(f'\nnotes ({len(notes)}):')
        for item in notes[:20]:
            print(f'  {item}')
    if problems:
        print(f'\nPROBLEMS ({len(problems)}):', file=sys.stderr)
        for item in problems[:50]:
            print(f'  {item}', file=sys.stderr)
        return 1
    print('\nContent check passed')
    return 0


def main():
    args = sys.argv[1:]
    if '--check' in args:
        return check_local()
    if '--normalize-local' in args:
        return normalize_local()
    return full_sync()


if __name__ == '__main__':
    sys.exit(main())
