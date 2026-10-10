import os, re, json, hashlib
from pathlib import Path
from datetime import datetime, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
CHAPTERS_FILE_ID = os.environ['CHAPTERS_FILE_ID']

def get_drive():
    info = json.loads(os.environ['GDRIVE_CREDENTIALS'])
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds, cache_discovery=False)

def download(drive, fid):
    return drive.files().get_media(fileId=fid).execute()

def extract_ids(js):
    return list(set(re.findall(r'"(1[A-Za-z0-9_-]{20,})"', js)))

def main():
    drive = get_drive()

    # 1. Pull chapters-data.js from Drive
    chapters_js = download(drive, CHAPTERS_FILE_ID).decode('utf-8')
    Path('chapters-data.js').write_text(chapters_js, encoding='utf-8')

    # 2. Find every Drive file ID referenced inside it
    ids = extract_ids(chapters_js)
    print(f"Found {len(ids)} file references")

    # 3. Download each question file
    Path('content').mkdir(exist_ok=True)
    manifest = {'files': {}}

    for fid in ids:
        try:
            raw = download(drive, fid)
            try:
                content = json.dumps(json.loads(raw), ensure_ascii=False, indent=2)
            except Exception:
                content = raw.decode('utf-8', errors='replace')

            md5 = hashlib.md5(content.encode()).hexdigest()
            manifest['files'][fid] = {'md5': md5, 'size': len(content)}
            Path(f'content/{fid}.json').write_text(content, encoding='utf-8')
        except Exception as e:
            print(f"skip {fid}: {e}")

    manifest['updated'] = datetime.now(timezone.utc).isoformat()
    Path('manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print("Sync complete")

if __name__ == '__main__':
    main()
