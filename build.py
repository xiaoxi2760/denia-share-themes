"""Build one optional WebUI archive without copying the host's classic files."""
from __future__ import annotations
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def build(theme_id: str = 'denia', out_dir: Path | None = None) -> Path:
    if not theme_id or any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789_-' for c in theme_id):
        raise ValueError('Invalid theme id')
    source = ROOT / 'themes' / theme_id
    manifest = json.loads((source / 'theme.json').read_text(encoding='utf8'))
    if manifest['id'] != theme_id:
        raise ValueError('Theme id mismatch')
    out_dir = out_dir or ROOT / 'dist'
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / f"{theme_id}-webui-{manifest['version']}.zip"
    files = [source / 'theme.json'] + sorted(p for p in (source / 'webui').rglob('*') if p.is_file())
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            if path.is_symlink() or '__pycache__' in path.parts:
                raise ValueError('Unexpected file in WebUI source')
            info = zipfile.ZipInfo(path.relative_to(source).as_posix(), (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
        # Distribute the license without altering the legacy WebUI file tree.
        license_info = zipfile.ZipInfo('LICENSE.txt', (2026, 1, 1, 0, 0, 0))
        license_info.compress_type = zipfile.ZIP_DEFLATED
        license_info.external_attr = 0o100644 << 16
        archive.writestr(license_info, (ROOT / 'LICENSE').read_bytes())
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n', encoding='utf8')
    print(json.dumps({'archive':str(output),'files':len(files)+1,'bytes':output.stat().st_size,'sha256':digest}, ensure_ascii=False))
    return output

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('theme', nargs='?', default='denia')
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    build(args.theme, args.out)
