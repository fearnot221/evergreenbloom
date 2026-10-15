import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { paintSeed } from './seed-form';

gsap.registerPlugin(ScrollTrigger);
import {SeedArt} from './seed-shape';
export {SeedArt} from './seed-shape';

export function SeedStudy({still}:{still:boolean}) {
  const host=useRef<HTMLDivElement>(null), slider=useRef<HTMLInputElement>(null);
  const phase=useRef(.65), scrollPhase=useRef(.65), manual=useRef(false);
  const [motionAllowed,setMotionAllowed]=useState(true);
  useEffect(()=>{
    const el=host.current!,input=slider.current!;
    const draw=(p:number)=>{phase.current=p;input.value=String(Math.round(p*100));paintSeed(el,p);};
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      if(still)return;
      const progress={value:0};
      const tween=gsap.to(progress,{value:1,ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'bottom 25%',scrub:.4},onUpdate:()=>{scrollPhase.current=progress.value;if(!manual.current)draw(progress.value);}});
      return()=>{tween.scrollTrigger?.kill();tween.kill();};
    });
    draw(still||matchMedia('(prefers-reduced-motion: reduce)').matches? .65:phase.current);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>{setMotionAllowed(!still&&!reduced.matches);if(reduced.matches)draw(.65);};change();reduced.addEventListener('change',change);
    return()=>{mm.revert();reduced.removeEventListener('change',change);};
  },[still]);
  return <div className="seed-study" ref={host}>
    <div className="seed-study-picture"><SeedArt phase={.65}/></div>
    <div className="seed-study-controls">
      <div className="seed-study-mode"><span>松果 × 櫻花／數位形態研究，非官方素材</span></div>
      <label htmlFor="seed-phase">收攏 <span>→ 展開 → 綻放</span></label>
      <input ref={slider} id="seed-phase" type="range" min="0" max="100" defaultValue="65" aria-label="形態展開程度" onChange={e=>{manual.current=true;phase.current=Number(e.target.value)/100;paintSeed(host.current!,phase.current);}}/>
      <div className="seed-study-bottom"><button disabled={!motionAllowed} onClick={()=>{manual.current=false;phase.current=still||matchMedia('(prefers-reduced-motion: reduce)').matches? .65:scrollPhase.current;slider.current!.value=String(Math.round(phase.current*100));paintSeed(host.current!,phase.current);}}>{motionAllowed?'隨捲動展開':'靜態構圖'}</button></div>
    </div>
  </div>;
}
