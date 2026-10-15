"""Deterministic OSM XML -> geographic features. No renderer/world coordinates."""
from pathlib import Path
import json,xml.etree.ElementTree as ET,hashlib,collections
root=Path(__file__).resolve().parents[2];raw=root/'data/campus/raw';source=json.loads((raw/'source.json').read_text())
assert hashlib.sha256((raw/'ncu.osm').read_bytes()).hexdigest()==source['sha256'],'Raw data/provenance mismatch'
r=ET.parse(raw/'ncu.osm').getroot();nodes={n.attrib['id']:n for n in r.findall('node')};ways={w.attrib['id']:w for w in r.findall('way')}
def tags(e):return {t.attrib['k']:t.attrib['v'] for t in e.findall('tag')}
def refs(w):return [n.attrib['ref'] for n in w.findall('nd')]
def point(i):return [float(nodes[i].attrib['lon']),float(nodes[i].attrib['lat'])]
def rings(parts):
 parts=[p[:] for p in parts];out=[]
 while parts:
  chain=parts.pop(0)
  while chain[0]!=chain[-1]:
   for i,p in enumerate(parts):
    if p[0]==chain[-1]:chain+=p[1:];parts.pop(i);break
    if p[-1]==chain[-1]:chain+=list(reversed(p))[1:];parts.pop(i);break
   else:raise ValueError('Incomplete multipolygon: fetch all members; never invent closing segments')
  out.append([point(n) for n in chain])
 return out
def inside(p,ring):
 x,y=p;odd=False
 for a,b in zip(ring,ring[1:]):
  if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:odd=not odd
 return odd
def polygons(rel):
 groups={role:[] for role in ['outer','inner']}
 for m in rel.findall('member'):
  a=m.attrib
  if a['type']=='way' and a['role'] in groups:
   if a['ref'] not in ways:raise ValueError('Missing relation member '+a['ref'])
   groups[a['role']].append(refs(ways[a['ref']]))
 outer=rings(groups['outer']);inner=rings(groups['inner']);return [[o]+[i for i in inner if inside(i[0],o)] for o in outer]
boundary=next(e for e in r.findall('relation') if e.attrib['id']=='18727079');bounds=polygons(boundary)
flat=[p for poly in bounds for p in poly[0]];bbox=[min(p[0] for p in flat),min(p[1] for p in flat),max(p[0] for p in flat),max(p[1] for p in flat)]
def in_campus(p):return any(inside(p,poly[0]) and not any(inside(p,h) for h in poly[1:]) for poly in bounds)
def kind(t):
 if t.get('amenity')=='university':return 'CampusBoundary'
 if t.get('building') not in [None,'no']:return 'Building'
 if t.get('highway') in ['footway','path','steps','pedestrian','cycleway']:return 'Walkway'
 if t.get('highway') in ['service','residential','unclassified','tertiary','secondary','living_street']:return 'Road'
 if t.get('natural')=='water' or t.get('leisure') in ['pitch','track','park','garden'] or t.get('landuse') in ['grass','forest','recreation_ground']:return 'OpenSpace'
 if t.get('entrance') or t.get('barrier') in ['gate','lift_gate']:return 'Entrance'
 return None
features=[];member_ways=set();skipped=[]
def feature(e,k,geometry,nodeids=None):
 t=tags(e);return {'id':e.tag+'/'+e.attrib['id'],'type':k,'name':t.get('name:zh',t.get('name','')),'geometry':geometry,'tags':t,'source':{'id':e.tag+'/'+e.attrib['id'],'version':int(e.attrib['version']),'timestamp':e.attrib.get('timestamp'),'classification':'community-maintained'},**({'nodeIds':nodeids,'nodeMetadata':{i:tags(nodes[i]) for i in nodeids if tags(nodes[i])}} if nodeids else {})}
features.append(feature(boundary,'CampusBoundary',{'type':'MultiPolygon','coordinates':bounds}))
for rel in r.findall('relation'):
 if rel is boundary or tags(rel).get('type')!='multipolygon':continue
 k=kind(tags(rel))
 if not k:continue
 try:ps=polygons(rel)
 except ValueError as error:skipped.append({'id':'relation/'+rel.attrib['id'],'reason':str(error)});continue
 if not any(in_campus(p) for poly in ps for p in poly[0]):continue
 features.append(feature(rel,k,{'type':'MultiPolygon','coordinates':ps}));member_ways.update(m.attrib['ref'] for m in rel.findall('member') if m.attrib['type']=='way')
for w in ways.values():
 if w.attrib['id'] in member_ways:continue
 t=tags(w);k=kind(t)
 if not k or k=='CampusBoundary':continue
 ids=refs(w)
 if any(n not in nodes for n in ids):skipped.append({'id':'way/'+w.attrib['id'],'reason':'missing node'});continue
 pts=[point(i) for i in ids]
 if k in ['Road','Walkway']:
  # Retain only source segments with both vertices inside the actual boundary;
  # never invent a straight connector or snap geometric crossings.
  runs=[];run=[]
  for a,b in zip(ids,ids[1:]):
   if in_campus(point(a)) and in_campus(point(b)):
    if not run:run=[a]
    run.append(b)
   elif run:runs.append(run);run=[]
  if run:runs.append(run)
  for j,run in enumerate(runs):
   f=feature(w,k,{'type':'LineString','coordinates':[point(i) for i in run]},run);f['id']+=f':{j}';features.append(f)
 elif len(pts)>3 and ids[0]==ids[-1] and any(in_campus(p) for p in pts):features.append(feature(w,k,{'type':'Polygon','coordinates':[pts]}))
for i,n in nodes.items():
 k=kind(tags(n))
 if k=='Entrance' and in_campus(point(i)):features.append(feature(n,k,{'type':'Point','coordinates':point(i)}))
features.sort(key=lambda f:f['id'])
meta={'id':'ncu-campus','revision':source['sha256'][:12],'source':source,'bbox':bbox,'origin':{'longitude':round((bbox[0]+bbox[2])/2,7),'latitude':round((bbox[1]+bbox[3])/2,7)},'features':features,'limitations':{'surveyed':False,'terrain':'not imported; render flat','festivalZones':'none confirmed','skipped':skipped}}
out=root/'data/campus/normalized.json';out.write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':'))+'\n');print(collections.Counter(f['type'] for f in features),'bounds',bbox,'origin',meta['origin'],'skipped',skipped)
