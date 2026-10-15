import gsap from 'gsap';
// Original Motion 01 entrance, preserved as the chosen motion-language anchor.
export function createBloomEntrance(q: ReturnType<typeof gsap.utils.selector>, botanicals=true) {
const timeline=gsap.timeline({defaults:{ease:'power3.inOut'}})
      .fromTo(q('.bloom-aperture'),{clipPath:'ellipse(9% 34% at 50% 50%)'},{clipPath:'ellipse(85% 100% at 50% 50%)',duration:1.55},0)
      .fromTo(q('.bloom-word span'),{yPercent:80,rotation:i=>i===1?0:i===0?-24:24,scaleX:.35},{yPercent:0,rotation:0,scaleX:1,duration:1.2,stagger:.08,ease:'power3.out'},.25)
      .fromTo(q('.shutter-left'),{x:0,xPercent:0,rotation:0},{xPercent:-110,rotation:-16,duration:1.45},0)
      .fromTo(q('.shutter-right'),{x:0,xPercent:0,rotation:0},{xPercent:110,rotation:16,duration:1.45},0)
      ;
if(botanicals)timeline.from(q('.bloom-flower .ml-botanical'),{scale:.45,rotation:i=>i===0?-80:80,yPercent:90,duration:1.35,stagger:.1},.25);
return timeline;
}
