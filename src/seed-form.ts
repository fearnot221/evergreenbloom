// Abstract digital study, not botanical anatomy or official festival artwork.
export const SCALE_COUNT = 15;
export const scaleColors = ['#fff0f6', '#ffb7d5', '#ff6ea6', '#c8c6f2', '#ffe0ee'];
export const mix = (a:number,b:number,t:number)=>a+(b-a)*t;
export function scalePose(index:number, phase:number) {
  const layer=Math.floor(index/5), spoke=index%5;
  const angle=spoke*Math.PI*2/5-Math.PI/2;
  const compactAngle=spoke*Math.PI*2/5+layer*.62;
  const radius=[.47,.66,.46][layer];
  const openRadius=[1.30,.90,.48][layer];
  return {
    x:mix(Math.sin(compactAngle)*radius,Math.cos(angle)*openRadius,phase),
    y:mix(.64-layer*.64,Math.sin(angle)*openRadius,phase),
    z:mix(Math.cos(compactAngle)*radius,.14*layer,phase),
    rotation:mix(Math.sin(compactAngle)*.34,angle+Math.PI/2,phase),
    width:mix(.39,.58-layer*.07,phase),
    height:mix(.64,.95-layer*.09,phase),
    fold:mix(.28,.08,phase),
  };
}
export function scalePath(phase:number) {
  const notch=mix(-1,-.77,phase);
  return `M0 1 C-1.22 .48 -1.28 -.46 -.50 -.96 Q-.21 -1.1 0 ${notch} Q.21 -1.1 .5 -.96 C1.28 -.46 1.22 .48 0 1Z`;
}
export function svgPose(index:number,phase:number) {
  const p=scalePose(index,phase);
  return `translate(${300+p.x*115} ${300+p.y*115-p.z*22}) rotate(${p.rotation*180/Math.PI}) scale(${p.width*115} ${p.height*115})`;
}
export function paintSeed(host:Element,phase:number) {
  const p=Math.max(0,Math.min(1,phase));
  host.querySelectorAll<SVGPathElement>('.seed-scale').forEach((path)=>{
    path.setAttribute('d',scalePath(p));path.setAttribute('transform',svgPose(Number(path.dataset.scale),p));
  });
  host.dispatchEvent(new CustomEvent('seedphase',{detail:p}));
}
