/** WGS84 local ENU tangent frame; metre units, east/right, north/up on a plan. */
export interface GeoCoordinate {latitude:number;longitude:number;altitude?:number}
export interface CampusCoordinate {x:number;y:number;up?:number}
export interface WorldCoordinate {x:number;y:number;z:number;frameId:string}
export const FRAME_ID='ncu-wgs84-enu-v1';
export const ORIGIN:GeoCoordinate={latitude:24.9683944,longitude:121.1908057};
const A=6378137,F=1/298.257223563,E2=F*(2-F),RAD=Math.PI/180;
function ecef(p:GeoCoordinate){if(!Number.isFinite(p.latitude)||!Number.isFinite(p.longitude)||Math.abs(p.latitude)>90||Math.abs(p.longitude)>180)throw new Error('Invalid geographic coordinate');const lat=p.latitude*RAD,lon=p.longitude*RAD,n=A/Math.sqrt(1-E2*Math.sin(lat)**2),h=p.altitude??0;return [(n+h)*Math.cos(lat)*Math.cos(lon),(n+h)*Math.cos(lat)*Math.sin(lon),(n*(1-E2)+h)*Math.sin(lat)];}
export function geoToCampus(p:GeoCoordinate,origin=ORIGIN):CampusCoordinate{const a=ecef(p),o=ecef(origin),[dx,dy,dz]=a.map((v,i)=>v-o[i]),lat=origin.latitude*RAD,lon=origin.longitude*RAD;return {x:-Math.sin(lon)*dx+Math.cos(lon)*dy,y:-Math.sin(lat)*Math.cos(lon)*dx-Math.sin(lat)*Math.sin(lon)*dy+Math.cos(lat)*dz,up:Math.cos(lat)*Math.cos(lon)*dx+Math.cos(lat)*Math.sin(lon)*dy+Math.sin(lat)*dz};}
export function campusToGeo(p:CampusCoordinate,origin=ORIGIN):GeoCoordinate{const lat=origin.latitude*RAD,lon=origin.longitude*RAD,u=p.up??0,o=ecef(origin),x=o[0]-Math.sin(lon)*p.x-Math.sin(lat)*Math.cos(lon)*p.y+Math.cos(lat)*Math.cos(lon)*u,y=o[1]+Math.cos(lon)*p.x-Math.sin(lat)*Math.sin(lon)*p.y+Math.cos(lat)*Math.sin(lon)*u,z=o[2]+Math.cos(lat)*p.y+Math.sin(lat)*u;const radius=Math.hypot(x,y);let phi=Math.atan2(z,radius*(1-E2));for(let i=0;i<8;i++){const n=A/Math.sqrt(1-E2*Math.sin(phi)**2);phi=Math.atan2(z+E2*n*Math.sin(phi),radius);}const n=A/Math.sqrt(1-E2*Math.sin(phi)**2);return {latitude:phi/RAD,longitude:Math.atan2(y,x)/RAD,altitude:radius/Math.cos(phi)-n};}
// Flat ground is a visual policy, not the ENU up value or a surveyed elevation.
export function campusToWorld(p:CampusCoordinate,elevation=0):WorldCoordinate{return {x:p.x,y:elevation,z:-p.y,frameId:FRAME_ID};}
export const geoToWorld=(p:GeoCoordinate,elevation=0)=>campusToWorld(geoToCampus(p),elevation);
export const pairToGeo=([longitude,latitude]:number[]):GeoCoordinate=>({longitude,latitude});
export function distance(a:GeoCoordinate,b:GeoCoordinate){const p=geoToCampus(a),q=geoToCampus(b);return Math.hypot(p.x-q.x,p.y-q.y);}
