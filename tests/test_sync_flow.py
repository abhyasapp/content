"""Offline tests for the Drive sync flow, using an in-memory fake Drive.

Run with:  python -m unittest discover -s tests
"""

import base64
import hashlib
import importlib.util
import json
import os
import tempfile
import threading
import unittest
from pathlib import Path
from unittest import mock

_SPEC = importlib.util.spec_from_file_location(
    "content_sync_flow", Path(__file__).resolve().parent.parent / "scripts" / "sync.py"
)
sync = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(sync)

CHAPTERS_ID = "1CCCCCCCCCCCCCCCCCCCCCCCC"
FID_A = "1AAAAAAAAAAAAAAAAAAAAAAAA"
FID_B = "1BBBBBBBBBBBBBBBBBBBBBBBB"
FID_C = "1DDDDDDDDDDDDDDDDDDDDDDDD"


def question(qid=1, **extra):
    base = {"id": qid, "q": f"{qid}. What is {qid}?", "options": ["a", "b", "c", "d"],
            "correct": 1, "explain": "Because."}
    base.update(extra)
    return base


def chapters_js(*fids):
    leaves = ",".join(f'"leaf{i}": "{fid}"' for i, fid in enumerate(fids))
    return ("const DRIVE = {\"gk\": {\"1\": {\"Sub\": {" + leaves + "}}}};\n").encode("utf-8")


class FakeDrive:
    """Same four methods as ThreadLocalDrive, backed by a dict."""

    def __init__(self, files):
        self.files = dict(files)          # fid -> bytes
        self.downloads = []
        self.stats = []
        self.lock = threading.Lock()
        self.list_fails = False

    @staticmethod
    def md5(data):
        return hashlib.md5(data).hexdigest()

    def download(self, fid):
        with self.lock:
            self.downloads.append(fid)
        if fid not in self.files:
            raise sync.LostFile(fid)
        return self.files[fid]

    def stat(self, fid):
        with self.lock:
            self.stats.append(fid)
        if fid not in self.files:
            raise sync.LostFile(fid)
        return self.md5(self.files[fid])

    def list_md5(self):
        if self.list_fails:
            raise RuntimeError("listing unavailable")
        return {fid: self.md5(data) for fid, data in self.files.items()}


class TempMirror(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        root = Path(self._tmp.name)
        self._orig = (sync.CONTENT_DIR, sync.CHAPTERS_PATH, sync.MANIFEST_PATH)
        sync.CONTENT_DIR = root / "content"
        sync.CHAPTERS_PATH = root / "chapters-data.js"
        sync.MANIFEST_PATH = root / "manifest.json"
        self._env = mock.patch.dict(os.environ, {"CHAPTERS_FILE_ID": CHAPTERS_ID}, clear=False)
        self._env.start()

    def tearDown(self):
        self._env.stop()
        sync.CONTENT_DIR, sync.CHAPTERS_PATH, sync.MANIFEST_PATH = self._orig
        self._tmp.cleanup()

    def drive(self, *fids, **payloads):
        files = {CHAPTERS_ID: chapters_js(*fids)}
        for fid in fids:
            files[fid] = json.dumps(payloads.get(fid, [question()])).encode("utf-8")
        return FakeDrive(files)

    def tree(self):
        out = {}
        for path in sorted(sync.CONTENT_DIR.glob("*.json")):
            out[path.name] = path.read_bytes()
        out["chapters"] = sync.CHAPTERS_PATH.read_bytes() if sync.CHAPTERS_PATH.exists() else b""
        out["manifest"] = sync.MANIFEST_PATH.read_bytes() if sync.MANIFEST_PATH.exists() else b""
        return out


class FullSyncTests(TempMirror):
    def test_first_sync_writes_everything_and_passes_the_check(self):
        drive = self.drive(FID_A, FID_B)
        self.assertEqual(sync.full_sync(drive=drive, workers=2), 0)
        self.assertTrue((sync.CONTENT_DIR / f"{FID_A}.json").exists())
        self.assertTrue((sync.CONTENT_DIR / f"{FID_B}.json").exists())
        manifest = json.loads(sync.MANIFEST_PATH.read_text(encoding="utf-8"))
        self.assertEqual(set(manifest["files"]), {FID_A, FID_B})
        self.assertIn("chapters", manifest)
        self.assertEqual(sync.check_local(), 0)

    def test_chapters_file_is_downloaded_before_any_content_file(self):
        drive = self.drive(FID_A, FID_B)
        sync.full_sync(drive=drive, workers=1)
        self.assertEqual(drive.downloads[0], CHAPTERS_ID)
        self.assertNotIn(CHAPTERS_ID, drive.downloads[1:])

    def test_only_files_named_by_the_chapter_tree_are_fetched(self):
        drive = self.drive(FID_A)
        drive.files[FID_B] = b"[]"          # exists on Drive but is not referenced
        sync.full_sync(drive=drive, workers=2)
        self.assertNotIn(FID_B, drive.downloads)
        self.assertFalse((sync.CONTENT_DIR / f"{FID_B}.json").exists())

    def test_an_idle_second_sync_downloads_and_writes_nothing(self):
        drive = self.drive(FID_A, FID_B)
        sync.full_sync(drive=drive, workers=2)
        before = self.tree()
        drive.downloads.clear()
        self.assertEqual(sync.full_sync(drive=drive, workers=2), 0)
        self.assertEqual(drive.downloads, [CHAPTERS_ID], "only the chapter tree is re-read")
        self.assertEqual(self.tree(), before, "manifest must not change on an idle run")

    def test_only_a_changed_file_is_downloaded_again(self):
        drive = self.drive(FID_A, FID_B)
        sync.full_sync(drive=drive, workers=2)
        drive.files[FID_B] = json.dumps([question(9, q="9. changed?")]).encode("utf-8")
        drive.downloads.clear()
        sync.full_sync(drive=drive, workers=2)
        self.assertEqual(sorted(drive.downloads), sorted([CHAPTERS_ID, FID_B]))
        self.assertIn("changed?", (sync.CONTENT_DIR / f"{FID_B}.json").read_text(encoding="utf-8"))

    def test_a_file_deleted_from_disk_is_restored(self):
        drive = self.drive(FID_A)
        sync.full_sync(drive=drive, workers=1)
        (sync.CONTENT_DIR / f"{FID_A}.json").unlink()
        sync.full_sync(drive=drive, workers=1)
        self.assertTrue((sync.CONTENT_DIR / f"{FID_A}.json").exists())

    def test_a_corrupted_file_on_disk_is_repaired(self):
        drive = self.drive(FID_A)
        sync.full_sync(drive=drive, workers=1)
        (sync.CONTENT_DIR / f"{FID_A}.json").write_text("[]", encoding="utf-8")
        sync.full_sync(drive=drive, workers=1)
        self.assertEqual(sync.check_local(), 0)

    def test_force_redownloads_everything(self):
        drive = self.drive(FID_A, FID_B)
        sync.full_sync(drive=drive, workers=2)
        drive.downloads.clear()
        sync.full_sync(drive=drive, workers=2, force=True)
        self.assertEqual(sorted(drive.downloads), sorted([CHAPTERS_ID, FID_A, FID_B]))

    def test_files_without_a_drive_checksum_are_never_treated_as_unchanged(self):
        drive = self.drive(FID_A)
        drive.list_md5 = lambda: {FID_A: ""}
        sync.full_sync(drive=drive, workers=1)
        drive.downloads.clear()
        sync.full_sync(drive=drive, workers=1)
        self.assertIn(FID_A, drive.downloads)

    def test_failed_bulk_listing_falls_back_to_per_file_lookups(self):
        drive = self.drive(FID_A, FID_B)
        drive.list_fails = True
        self.assertEqual(sync.full_sync(drive=drive, workers=2), 0)
        self.assertEqual(sorted(drive.stats), sorted([FID_A, FID_B]))

    def test_unreferenced_content_is_pruned(self):
        drive = self.drive(FID_A)
        sync.full_sync(drive=drive, workers=1)
        stale = sync.CONTENT_DIR / f"{FID_C}.json"
        stale.write_text("[]", encoding="utf-8")
        sync.full_sync(drive=drive, workers=1)
        self.assertFalse(stale.exists())

    def test_crlf_and_bom_in_chapters_file_are_normalized(self):
        drive = self.drive(FID_A)
        drive.files[CHAPTERS_ID] = b"\xef\xbb\xbf" + chapters_js(FID_A).replace(b"\n", b"\r\n")
        sync.full_sync(drive=drive, workers=1)
        stored = sync.CHAPTERS_PATH.read_bytes()
        self.assertNotIn(b"\r", stored)
        self.assertFalse(stored.startswith(b"\xef\xbb\xbf"))
        self.assertEqual(sync.check_local(), 0)


class FailureTests(TempMirror):
    def test_a_missing_chapters_file_fails_cleanly(self):
        # Regression: this path used an undefined variable and crashed.
        drive = FakeDrive({})
        self.assertEqual(sync.full_sync(drive=drive), 1)

    def test_missing_chapters_id_setting_fails(self):
        with mock.patch.dict(os.environ, {"CHAPTERS_FILE_ID": ""}):
            self.assertEqual(sync.full_sync(drive=FakeDrive({})), 1)

    def test_one_missing_file_writes_nothing_at_all(self):
        drive = self.drive(FID_A, FID_B)
        sync.full_sync(drive=drive, workers=2)
        before = self.tree()
        del drive.files[FID_B]
        drive.files[FID_A] = json.dumps([question(5, q="5. new?")]).encode("utf-8")
        drive.files[CHAPTERS_ID] = chapters_js(FID_A, FID_B, "1EEEEEEEEEEEEEEEEEEEEEEEE")
        self.assertEqual(sync.full_sync(drive=drive, workers=2), 1)
        self.assertEqual(self.tree(), before, "a failed run must leave the tree untouched")

    def test_a_download_that_is_not_a_json_array_fails_the_run(self):
        drive = self.drive(FID_A)
        drive.files[FID_A] = b"<html>quota exceeded</html>"
        self.assertEqual(sync.full_sync(drive=drive, workers=1), 1)
        self.assertFalse((sync.CONTENT_DIR / f"{FID_A}.json").exists())

    def test_a_tree_that_references_no_files_is_refused(self):
        drive = FakeDrive({CHAPTERS_ID: b"const DRIVE = {};"})
        self.assertEqual(sync.full_sync(drive=drive), 1)

    def test_a_tree_that_suddenly_shrinks_is_refused_unless_allowed(self):
        fids = [f"1{str(i).zfill(2)}" + "X" * 21 for i in range(10)]
        drive = self.drive(*fids)
        self.assertEqual(sync.full_sync(drive=drive, workers=4), 0)
        before = self.tree()
        drive.files[CHAPTERS_ID] = chapters_js(fids[0])
        self.assertEqual(sync.full_sync(drive=drive, workers=4), 1)
        self.assertEqual(self.tree(), before)
        self.assertEqual(sync.full_sync(drive=drive, workers=4, allow_shrink=True), 0)
        self.assertEqual(len(list(sync.CONTENT_DIR.glob("*.json"))), 1)

    def test_dry_run_writes_nothing(self):
        drive = self.drive(FID_A)
        self.assertEqual(sync.full_sync(drive=drive, dry_run=True), 0)
        self.assertEqual(self.tree()["manifest"], b"")
        self.assertFalse(sync.CONTENT_DIR.exists())


class EnvAndCredentialTests(unittest.TestCase):
    def test_env_text_parsing(self):
        values = sync.parse_env_text(
            "# comment\n"
            "A=1\n"
            "export B = two words # trailing\n"
            'C="quoted value"\n'
            "D='{\"k\": \"v # not a comment\"}'\n"
            "bad line\n"
            "1BAD=x\n"
            "EMPTY=\n"
        )
        self.assertEqual(values["A"], "1")
        self.assertEqual(values["B"], "two words")
        self.assertEqual(values["C"], "quoted value")
        self.assertEqual(json.loads(values["D"]), {"k": "v # not a comment"})
        self.assertEqual(values["EMPTY"], "")
        self.assertNotIn("1BAD", values)

    def test_load_env_never_overrides_real_environment(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / ".env"
            path.write_text("SYNC_TEST_A=from_file\nSYNC_TEST_B=from_file\n", encoding="utf-8")
            with mock.patch.dict(os.environ, {"SYNC_TEST_A": "from_env"}, clear=False):
                os.environ.pop("SYNC_TEST_B", None)
                sync.load_env(path)
                self.assertEqual(os.environ["SYNC_TEST_A"], "from_env")
                self.assertEqual(os.environ["SYNC_TEST_B"], "from_file")
                os.environ.pop("SYNC_TEST_B", None)

    def test_env_int_clamps_and_survives_garbage(self):
        with mock.patch.dict(os.environ, {"X_N": "999"}):
            self.assertEqual(sync.env_int("X_N", 8, 1, 32), 32)
        with mock.patch.dict(os.environ, {"X_N": "nope"}):
            self.assertEqual(sync.env_int("X_N", 8, 1, 32), 8)

    def _creds(self, **override):
        info = {"client_email": "bot@proj.iam.gserviceaccount.com",
                "private_key": "-----BEGIN PRIVATE KEY-----\nx\n-----END PRIVATE KEY-----\n",
                "token_uri": "https://oauth2.googleapis.com/token"}
        info.update(override)
        return info

    def test_credentials_accept_json_base64_and_file(self):
        info = self._creds()
        text = json.dumps(info)
        cases = [
            {"GDRIVE_CREDENTIALS": text},
            {"GDRIVE_CREDENTIALS": base64.b64encode(text.encode()).decode()},
        ]
        for env in cases:
            sync.load_credentials.cache_clear()
            with mock.patch.dict(os.environ, env, clear=True):
                self.assertEqual(sync.load_credentials()["client_email"], info["client_email"])
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "key.json"
            path.write_text(text, encoding="utf-8")
            sync.load_credentials.cache_clear()
            with mock.patch.dict(os.environ, {"GDRIVE_CREDENTIALS_FILE": str(path)}, clear=True):
                self.assertEqual(sync.load_credentials()["client_email"], info["client_email"])
        sync.load_credentials.cache_clear()

    def test_bad_credentials_give_a_clear_error(self):
        for env in ({}, {"GDRIVE_CREDENTIALS": "not json"},
                    {"GDRIVE_CREDENTIALS": json.dumps({"hello": "world"})}):
            sync.load_credentials.cache_clear()
            with mock.patch.dict(os.environ, env, clear=True):
                with self.assertRaises(RuntimeError):
                    sync.load_credentials()
        sync.load_credentials.cache_clear()


class RetryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            import googleapiclient.errors  # noqa: F401
        except ImportError:
            raise unittest.SkipTest("google-api-python-client not installed")

    def _error(self, status, reason=""):
        from googleapiclient.errors import HttpError
        body = json.dumps({"error": {"errors": [{"reason": reason}]}}).encode()
        resp = mock.Mock(status=status, reason="x")
        return HttpError(resp, body)

    def test_transient_errors_are_retried_then_succeed(self):
        calls = {"n": 0}

        def flaky():
            calls["n"] += 1
            if calls["n"] < 3:
                raise self._error(503)
            return "ok"

        self.assertEqual(sync.with_retry(flaky, "x", sleep=lambda s: None), "ok")
        self.assertEqual(calls["n"], 3)

    def test_rate_limit_403_is_retried_but_permission_403_is_not(self):
        calls = {"n": 0}

        def limited():
            calls["n"] += 1
            if calls["n"] == 1:
                raise self._error(403, "userRateLimitExceeded")
            return "ok"

        self.assertEqual(sync.with_retry(limited, "x", sleep=lambda s: None), "ok")

        calls["n"] = 0

        def forbidden():
            calls["n"] += 1
            raise self._error(403, "forbidden")

        from googleapiclient.errors import HttpError
        with self.assertRaises(HttpError):
            sync.with_retry(forbidden, "x", sleep=lambda s: None)
        self.assertEqual(calls["n"], 1)

    def test_404_becomes_lost_file(self):
        def gone():
            raise self._error(404, "notFound")

        with self.assertRaises(sync.LostFile):
            sync.with_retry(gone, "x", sleep=lambda s: None)

    def test_gives_up_after_the_attempt_limit(self):
        calls = {"n": 0}

        def always():
            calls["n"] += 1
            raise self._error(500)

        from googleapiclient.errors import HttpError
        with self.assertRaises(HttpError):
            sync.with_retry(always, "x", sleep=lambda s: None)
        self.assertEqual(calls["n"], sync.DOWNLOAD_ATTEMPTS)


if __name__ == "__main__":
    unittest.main()
