"""Explicit maintainer operation, never called by the website/build. OSM ODbL 1.0."""
from pathlib import Path
import subprocess,json,hashlib,datetime,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[2]; dest=root/'data/campus/raw';dest.mkdir(parents=True,exist_ok=True)
url='https://api.openstreetmap.org/api/0.6/map?bbox=121.1835,24.964,121.198,24.973'
tmp=dest/'ncu.pending.osm'
subprocess.run(['curl','--fail','--silent','--show-error','--location','--max-time','90','--user-agent','NCU-Festival-Map-Research/1.0 (manual campus extract)',url,'-o',str(tmp)],check=True)
ET.parse(tmp);tmp.replace(dest/'ncu.osm')
meta={'source':url,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'license':'ODbL-1.0','attribution':'© OpenStreetMap contributors','licenseUrl':'https://www.openstreetmap.org/copyright','classification':'community-maintained','sha256':hashlib.sha256((dest/'ncu.osm').read_bytes()).hexdigest(),'bbox':[121.1835,24.964,121.198,24.973]}
(dest/'source.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Saved validated raw extract and provenance. Run npm run map:data next.')
