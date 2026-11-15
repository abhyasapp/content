"""Offline tests for the question schema and the local mirror check.

Run with:  python -m unittest discover -s tests
"""

import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location(
    "content_sync", Path(__file__).resolve().parent.parent / "scripts" / "sync.py"
)
sync = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(sync)

FID = "1AAAAAAAAAAAAAAAAAAAAAAA"      # matches extract_ids: "1" + 20+ id chars
OTHER_FID = "1BBBBBBBBBBBBBBBBBBBBBBB"


def question(**extra):
    base = {"id": 53723, "q": "1. How many species?", "options": ["a", "b", "c", "d"],
            "correct": 3, "explain": "Because."}
    base.update(extra)
    return base


class NormalizeQuestionTests(unittest.TestCase):
    def test_legacy_fields_are_folded_and_extras_preserved(self):
        stats = {}
        out = sync.normalize_question(
            {"id": 1, "q": "q", "options": ["a"], "answer": "0",
             "explanation": "why", "image": "x"},
            FID, 0, stats,
        )
        self.assertEqual(out["correct"], 0)
        self.assertEqual(out["explain"], "why")
        self.assertNotIn("answer", out)
        self.assertNotIn("explanation", out)
        self.assertEqual(out["image"], "x")

    def test_missing_id_is_backfilled_from_the_file_and_position(self):
        stats = {}
        out = sync.normalize_question(question(id=None), FID, 4, stats)
        self.assertEqual(out["id"], f"{FID}-5")
        self.assertEqual(stats["id_backfilled"], 1)

    def test_published_public_qn_id_is_kept(self):
        for value in ("50011.110001", "G0011.110001", "5002mixedqn10001"):
            stats = {}
            out = sync.normalize_question(question(public_qn=value), FID, 0, stats)
            self.assertEqual(out["public_qn"], value)
            self.assertNotIn("bad_public_qn", stats)
            # It must not also be copied through as an unknown extra key.
            self.assertNotIn("extra_key:public_qn", stats)

    def test_unusable_public_qn_id_is_dropped_and_counted(self):
        for value in ("", "   ", "nonsense", 42, "a b", "50011.110001 " + "x" * 80):
            stats = {}
            out = sync.normalize_question(question(public_qn=value), FID, 0, stats)
            if value == "":
                self.assertNotIn("public_qn", out)
                self.assertNotIn("bad_public_qn", stats, "an absent id is not a fault")
            else:
                self.assertNotIn("public_qn", out)
                self.assertEqual(stats.get("bad_public_qn"), 1)

    def test_non_object_question_is_dropped(self):
        stats = {}
        self.assertIsNone(sync.normalize_question(["not", "a", "dict"], FID, 0, stats))
        self.assertEqual(stats["dropped"], 1)


class MirrorCheckTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        (self.root / "content").mkdir()
        self._orig = (sync.CONTENT_DIR, sync.CHAPTERS_PATH, sync.MANIFEST_PATH)
        sync.CONTENT_DIR = self.root / "content"
        sync.CHAPTERS_PATH = self.root / "chapters-data.js"
        sync.MANIFEST_PATH = self.root / "manifest.json"

    def tearDown(self):
        sync.CONTENT_DIR, sync.CHAPTERS_PATH, sync.MANIFEST_PATH = self._orig
        self._tmp.cleanup()

    def write(self, files):
        """files: {fid: [question, ...]} -> chapters-data.js + content + manifest."""
        leaves = "".join(f'"{fid}"' for fid in files)
        sync.CHAPTERS_PATH.write_text("var chapters = {" + leaves + "};", encoding="utf-8")
        manifest = {"files": {}}
        for fid, questions in files.items():
            text = json.dumps(questions, ensure_ascii=False, indent=2)
            path = sync.CONTENT_DIR / f"{fid}.json"
            path.write_text(text, encoding="utf-8", newline="\n")
            manifest["files"][fid] = sync.entry_for(text)
        sync.MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    def test_a_clean_mirror_passes(self):
        self.write({FID: [question(public_qn="50011.110001")]})
        self.assertEqual(sync.check_local(), 0)

    def test_manifest_size_is_bytes_not_characters(self):
        text = json.dumps([question(explain="देवनागरी")], ensure_ascii=False, indent=2)
        self.assertEqual(sync.entry_for(text)["size"], len(text.encode("utf-8")))
        self.assertGreater(len(text.encode("utf-8")), len(text))

    def test_a_duplicated_public_qn_id_fails(self):
        self.write({
            FID: [question(public_qn="50011.110001")],
            OTHER_FID: [question(id=2, public_qn="50011.110001")],
        })
        self.assertEqual(sync.check_local(), 1)

    def test_a_missing_content_file_fails(self):
        self.write({FID: [question()]})
        (sync.CONTENT_DIR / f"{FID}.json").unlink()
        self.assertEqual(sync.check_local(), 1)

    def test_a_wrong_correct_index_fails(self):
        self.write({FID: [question(correct=9)]})
        self.assertEqual(sync.check_local(), 1)

    def test_a_stale_manifest_checksum_fails(self):
        self.write({FID: [question()]})
        manifest = json.loads(sync.MANIFEST_PATH.read_text(encoding="utf-8"))
        manifest["files"][FID]["md5"] = hashlib.md5(b"not the file").hexdigest()
        sync.MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        self.assertEqual(sync.check_local(), 1)


if __name__ == "__main__":
    unittest.main()
