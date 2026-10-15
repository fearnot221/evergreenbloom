import {geoToCampus,campusToGeo} from './coordinates.ts';
import type {GeoCoordinate} from './coordinates.ts';
import type {PedestrianGraph,DebugRoute} from './types.ts';
/** Connectivity experiment only. No user-facing navigation or accessibility claims. */
export function route(graph:PedestrianGraph,start:string,end:string,closed=new Set<string>()):DebugRoute{
 const nodes=new Map(graph.nodes.map(n=>[n.id,n]));const warnings=['未經現地驗證；僅測試來源拓樸。未知通行權、坡度及障礙不代表可通行。'];
 if(!nodes.has(start)||!nodes.has(end))return {status:'invalid',nodeIds:[],edgeIds:[],distanceMeters:0,warnings};
 const adj=new Map<string,{to:string;id:string;distance:number}[]>();
 for(const e of graph.edges){if(closed.has(e.id)||e.temporaryAvailability==='closed'||e.foot==='no'||e.foot==='private'||e.access==='private'||e.access==='no')continue;const a=nodes.get(e.from),b=nodes.get(e.to);if(!a||!b||[a,b].some(n=>n.access==='no'||n.access==='private'||n.foot==='no'||n.foot==='private'||['wall','fence'].includes(n.barrier??'')))continue;
 const add=(from:string,to:string)=>adj.set(from,[...(adj.get(from)??[]),{to,id:e.id,distance:e.distanceMeters}]);if(e.onewayFoot!=='-1')add(e.from,e.to);if(e.onewayFoot!=='yes')add(e.to,e.from);}
 const cost=new Map([[start,0]]),previous=new Map<string,{node:string;edge:string}>(),pending=new Set([start]);
 while(pending.size){let current=[...pending].reduce((a,b)=>cost.get(a)!<cost.get(b)!?a:b);pending.delete(current);if(current===end)break;for(const edge of adj.get(current)??[]){const next=cost.get(current)!+edge.distance;if(next<(cost.get(edge.to)??Infinity)){cost.set(edge.to,next);previous.set(edge.to,{node:current,edge:edge.id});pending.add(edge.to);}}}
 if(!cost.has(end))return {status:'unreachable',nodeIds:[],edgeIds:[],distanceMeters:0,warnings};
 const nodeIds=[end],edgeIds:string[]=[];let n=end;while(n!==start){const p=previous.get(n)!;edgeIds.unshift(p.edge);nodeIds.unshift(p.node);n=p.node;}return {status:'found',nodeIds,edgeIds,distanceMeters:cost.get(end)!,warnings};
}
/** A candidate projection, not automatic GPS map matching. Accuracy may span multiple paths. */
export function gpsCandidates(graph:PedestrianGraph,position:GeoCoordinate,accuracyMeters:number){
 if(!Number.isFinite(accuracyMeters)||accuracyMeters<0||accuracyMeters>100)return {status:'unreliable' as const,candidates:[]};
 const p=geoToCampus(position),nodes=new Map(graph.nodes.map(n=>[n.id,n]));const candidates=[];
 for(const e of graph.edges){if(e.access==='private'||e.access==='no'||e.foot==='no'||e.foot==='private'||e.temporaryAvailability==='closed')continue;const aa=nodes.get(e.from),bb=nodes.get(e.to);if(!aa||!bb||[aa,bb].some(n=>n.access==='no'||n.access==='private'||n.foot==='no'||n.foot==='private'||['wall','fence'].includes(n.barrier??'')))continue;const a=geoToCampus(aa.geographic),b=geoToCampus(bb.geographic),dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;if(!l)continue;const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)),x=a.x+t*dx,y=a.y+t*dy,offset=Math.hypot(x-p.x,y-p.y);if(offset<=Math.max(10,accuracyMeters))candidates.push({edgeId:e.id,offsetMeters:offset,fraction:t,geographic:campusToGeo({x,y}),verified:false});}
 candidates.sort((a,b)=>a.offsetMeters-b.offsetMeters);return {status:!candidates.length?'outside' as const:candidates.length>1?'ambiguous' as const:'candidate' as const,candidates:candidates.slice(0,5)};
}
