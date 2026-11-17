# Abhyas question bank - Drive mirror

Auto-synced mirror of the Abhyas question bank. Twice a day a GitHub Action pulls
`chapters-data.js` from Google Drive, downloads every question file it references
into `content/`, validates the result and commits it. There is no app here: this
repository is the data layer.

## Layout

| Path | What it is |
|---|---|
| `chapters-data.js` | Navigation tree, copied from Drive: `level` -> `chapter` -> `subtopic` -> `leaf: driveFileId` |
| `content/<fileId>.json` | One file per Drive file ID: an array of questions |
| `manifest.json` | Per-file `md5`, `size`, `drive_md5`; a `chapters` checksum; `updated` timestamp |
| `scripts/sync.py` | The sync, plus normalization and validation |
| `tests/` | Offline tests (no Drive access needed) |
| `.github/workflows/sync.yml` | Scheduled sync at 05:00 and 17:00 UTC |
| `.env.example` | Template for local configuration |

Three levels - `gk` (general knowledge), `level5` (Diploma), `level7` (Engineering) -
with 26 chapters. Each chapter ends with two generated buckets: `Mixed Questions`
and `Original Questions`; empty buckets are omitted.

## How the sync works

1. Download `chapters-data.js` first. It decides which content exists.
2. Read the file IDs it references.
3. One Drive listing call fetches every checksum; unchanged files are skipped.
4. Changed files download in parallel (default 8 workers), with retry and backoff.
5. Only if everything succeeded is anything written: `content/`, `chapters-data.js`,
   then `manifest.json`. A failed run leaves the working tree untouched.

`manifest.json` only changes when something really changed, so an idle sync makes no commit.

Safety rails:

- **Fail loudly.** One missing or corrupted file fails the run; nothing is committed.
- **Shrink guard.** If the tree suddenly references less than half of the previous
  file count, the run refuses to prune. Override with `--allow-shrink`.
- **Self-healing.** A file deleted or edited on disk no longer matches the manifest
  checksum and is downloaded again.
- **Stale files are pruned** when `chapters-data.js` stops referencing them.

## Setup for GitHub Actions

Repository -> Settings -> Secrets and variables -> Actions.

| Kind | Name | Required | Value |
|---|---|---|---|
| Secret | `GDRIVE_CREDENTIALS` | yes | The complete service-account JSON key (paste the whole file) |
| Variable | `CHAPTERS_FILE_ID` | no | Drive ID of `chapters-data.js`. Defaults to the ID in the workflow |
| Variable | `SYNC_WORKERS` | no | Parallel downloads, 1-32 (default 8) |

Getting the key (once):

1. Google Cloud Console -> create or pick a project -> **enable the Google Drive API**.
2. IAM & Admin -> Service Accounts -> create one -> Keys -> Add key -> JSON.
3. Open the Drive folder holding `chapters-data.js` and every question file ->
   **Share** it with the service account's `client_email` as **Viewer**.
4. Paste the JSON file's full contents into the `GDRIVE_CREDENTIALS` secret.

Also check Settings -> Actions -> General -> Workflow permissions is **Read and write**
(the workflow requests `contents: write` itself, but an organization policy can override it).

Manual runs: Actions -> *Sync Drive to GitHub* -> Run workflow, with optional
*force_full* (re-download everything) and *allow_shrink*.

## Running locally

```bash
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                   # then fill it in

python scripts/sync.py --dry-run     # see what would change, write nothing
python scripts/sync.py               # real sync
python scripts/sync.py --force       # re-download everything
python scripts/sync.py --check       # validate the mirror, offline
python scripts/sync.py --normalize-local   # re-normalize content/, offline
python -m unittest discover -s tests       # offline tests
```

`.env` is git-ignored and is read by the script automatically. Real environment
variables always win over `.env`.

## Question schema

```json
{
  "id": 53723,
  "q": "1. How many bird species are currently recorded in Nepal?",
  "options": ["884", "912", "925", "904"],
  "correct": 3,
  "explain": "The 904th species is the Collared Kingfisher...",
  "public_qn": "50011.110001"
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | int or string | Source id when the file has one, otherwise a stable `<driveFileId>-<position>`. Unique per question, not per corpus: the same question can appear in pooled and original files |
| `q` | string | Question text |
| `options` | string[] | Usually 4; matching-type questions can have 2, 3 or 5 |
| `correct` | int \| null | 0-based index into `options` |
| `explain` | string | `""` when the source has no explanation |
| `public_qn` | string | Optional stable public id (`50011.110001`, `G0011.110001`, `5002mixedqn10001`). The app keys progress, reports and corrections on it. `--check` rejects one id shared by two *different* questions; a repeat of the *same* question (pooled + chapter file) is allowed |

Extra keys in a source record (`image`, `images`, ...) are preserved. Legacy shapes are
folded in on every sync: `answer` -> `correct`, `explanation` -> `explain`, missing ids backfilled.

Checksums in `manifest.json` are computed over the normalized text with LF endings; `size`
is in bytes, so Devanagari text is measured correctly.

## Known source gaps

- `gk` chapter 3 (IQ) has no content.
- A couple of match-the-column questions lost their table during extraction and have
  placeholder options. Both come from Drive and cannot be repaired here.
