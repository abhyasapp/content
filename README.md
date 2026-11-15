# Question bank — Drive mirror

Auto-synced mirror of the Abhyas question bank. Twice a day a GitHub Action pulls
`chapters-data.js` from Google Drive, downloads every question file it references
into `content/`, and commits the result.

There is no app here: this repository is the data layer.

## Layout

| Path | What it is |
|---|---|
| `chapters-data.js` | The navigation tree, copied verbatim from Drive: `level` → `chapter` → `subtopic` → `leaf: driveFileId` |
| `content/<fileId>.json` | One file per Drive file ID: an array of questions |
| `manifest.json` | Per-file `md5`, `size`, Drive `drive_md5`, plus `updated` timestamp |
| `scripts/sync.py` | The sync. Also normalizes and validates every question |
| `.github/workflows/sync.yml` | Runs the sync at 05:00 and 17:00 UTC and commits |

The structure is three levels — `gk` (general knowledge), `level5` (Diploma),
`level7` (Engineering) — with 26 chapters and 187 subtopics in total.

Each chapter ends with two generated buckets: `Mixed Questions` (pooled
unclassified questions) and `Original Questions` (one leaf per source file).
Empty buckets are omitted.

## Question schema

Every question is normalized by `scripts/sync.py` to this shape:

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
| `id` | int or string | Source id when the file has one. Otherwise a stable string `<driveFileId>-<position>`. Ids are unique per question, not per corpus: the same question can appear in pooled and original files. |
| `q` | string | Question text |
| `options` | string[] | Usually 4, not always — matching-type questions can have 2 or 5 |
| `correct` | int \| null | 0-based index into `options`. `null` only when the source has no usable answer key |
| `explain` | string | `""` when the source has no explanation |
| `public_qn` | string | Optional. The stable public question id the pipeline assigns (`LCCCSSSFQQQQ`, published dotted like `50011.110001`, `G0011.110001`, or with a word subtopic like `5002mixedqn10001`). This is what the app keys progress, reports and corrections on, so one id must always name exactly one question: `--check` rejects an id shared by two *different* questions. A question repeated in a pooled file and in the chapter file it came from keeps the same id, which is why a repeat is allowed when the text (ignoring the file's own item number), options and answer match. An unusable value is dropped and counted rather than passed through. |

Extra keys present in a source record (`image`, `images`, …) are preserved as-is.

Legacy shapes are folded into the above on every sync: `answer` becomes
`correct`, `explanation` becomes `explain`, and missing ids are backfilled.

## Running it locally

```bash
# Validate the checked-in mirror (no credentials needed). Exit 1 on problems:
# missing files, truncated arrays, bad ids, unusable or duplicated public_qn,
# a manifest checksum that no longer matches.
python scripts/sync.py --check

# Re-normalize the checked-in content/ tree, no credentials needed
python scripts/sync.py --normalize-local

# Full sync (needs GDRIVE_CREDENTIALS and CHAPTERS_FILE_ID)
pip install google-api-python-client google-auth
python scripts/sync.py

# Schema and mirror check tests
python -m unittest discover -s tests
```

`manifest.json` checksums are computed over the normalized text with LF line
endings, and files are written with LF, so the checksums verify byte-for-byte on
any platform. `size` is the byte length of that same text — it counts bytes, not
characters, so a file full of Devanagari is measured correctly.

## Behavior worth knowing

- **Stale files are pruned.** Any `content/*.json` not referenced by
  `chapters-data.js` is deleted on every sync.
- **Unchanged files are not re-downloaded.** The Drive `md5Checksum` is stored as
  `drive_md5`; matching files are reused.
- **Partial syncs fail loudly.** A refused or failed download makes the run exit
  non-zero with the manifest untouched, so the workflow commits nothing rather
  than a snapshot that looks complete but is missing files. Retries with backoff
  cover transient Drive errors.
- **Known source gaps.** `gk` chapter 3 (IQ) has no content, and a couple of
  match-the-column questions lost their table during extraction, leaving
  placeholder options. Both originate upstream in Drive and cannot be repaired
  here.
