import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { festival as f } from './content';
import './motion-lab.css';
import { botanical, SkyArt, Bloom } from './bloom-art';
import { createBloomEntrance } from './bloom-motion';

gsap.registerPlugin(ScrollTrigger);
const studies = [
  { id: 'bloom', name: 'Bloom', zh: '展開一個春天', instruction: '向下捲動，讓構圖繼續綻開。向上捲動可以收回。' },
  { id: 'layers', name: 'Layers', zh: '走進海報之間', instruction: '移動游標、捲動，或選擇景深。前景與文字走不同的路。' },
  { id: 'type', name: 'Type', zh: '文字，成為入口', instruction: '向下捲動。讓巨大的字拆開、重組，變成三個可點選的入口。' },
  { id: 'play', name: 'Play', zh: '把春天放進構圖', instruction: '拖曳紙片改變構圖，也可以用下方位置按鈕。點一下文字，讀它的意思。' },
] as const;
type StudyId = typeof studies[number]['id'];
function Layers() { return <><div className="layers-back-scroll"><div className="layers-back-pointer"><div className="layers-sun"/><p className="layers-sky-type" aria-hidden="true">春日</p><SkyArt/></div></div><div className="layers-mid-scroll"><div className="layers-mid-pointer"><h2 className="layers-title" aria-label="松櫻祭"><span aria-hidden="true">松</span><span aria-hidden="true">櫻</span><span aria-hidden="true">祭</span></h2><span className="layers-imprint">NATIONAL CENTRAL UNIVERSITY</span></div></div><div className="layers-front-scroll"><div className="layers-front-pointer"><div className="layers-leaf leaf-left">{botanical('ml-botanical')}</div><div className="layers-leaf leaf-right">{botanical('ml-botanical')}</div><div className="layers-paper"><span>校園之間</span><span>春天之中</span></div></div></div><div className="layers-caption"><strong>風景沒有變，<br/>你與它的距離變了。</strong><span>暫用插畫構圖，非校園地圖</span></div><div className="ml-depth-controls" role="group" aria-label="選擇海報景深"><button data-depth="0" aria-pressed="true">遠景</button><button data-depth="0.5" aria-pressed="false">走近</button><button data-depth="1" aria-pressed="false">穿過前景</button></div></>; }
const typeItems=[{char:'松',label:'祭典故事',target:'motion-story',text:'從校園，長出一個節日。'},{char:'櫻',label:'風景與歷史',target:'motion-lake',text:'中大湖畔，春日與情誼。'},{char:'祭',label:'下一次相聚',target:'motion-edition',text:'下一屆資訊，仍待公布。'}];
function TypeStudy(){return <><div className="type-rule"/><div className="type-anchors">{typeItems.map((item,i)=><a className={`type-anchor type-anchor-${i}`} href={`#${item.target}`} key={item.char} aria-label={item.label}><span className="type-unit" aria-hidden="true"><span className="type-upper">{item.char}</span><span className="type-lower">{item.char}</span></span><span className="type-label">{item.label} <span aria-hidden="true">↗</span></span><span className="type-reading">{item.text}</span></a>)}</div><div className="type-caption"><p>國立中央大學 · 松櫻祭</p><h2>從一個名字，<br/>走向三段故事。</h2></div><p className="type-bottom">字，是風景。也是路標。</p></>;}
function Play(){return <><div className="play-print-lines" aria-hidden="true"/><div className="play-heading"><p>國立中央大學的春日校園祭典</p><h2 className="sr-only">松櫻祭，互動構圖</h2><div className="play-letters" role="group" aria-label="閱讀祭典名稱">{'松櫻祭'.split('').map((c,i)=><button key={c} className="play-letter" data-letter={i} aria-label={`讀「${c}」`} aria-pressed={i===0}><span aria-hidden="true">{c}</span></button>)}</div></div><div className="play-note" aria-live="polite"><strong className="play-note-title">{f.meanings[0].title}</strong><p className="play-note-copy">{f.meanings[0].text}</p></div><button className="play-cutout" aria-label="移動春日紙片；可拖曳，或用方向鍵移動，Home 回到中央"><span className="play-cutout-art">{botanical('ml-botanical')}<span className="play-cutout-caption">把春天<br/>放在這裡</span></span></button><div className="play-placement" role="group" aria-label="春日紙片位置"><button data-place="-1">放左邊</button><button data-place="0">放中間</button><button data-place="1">放右邊</button></div><span className="sr-only play-status" role="status">紙片位於中央</span><p className="play-footnote">一張可以重新安排的海報。不是一場遊戲。</p></>;}

function Study({id,still,finishRef}:{id:StudyId;still:boolean;finishRef:React.MutableRefObject<()=>void>}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add({reduce:'(prefers-reduced-motion: reduce)',desktop:'(min-width: 700px)',all:'(min-width: 0px)'}, context=>{
   const el=root.current!;const scene=el.querySelector<HTMLElement>('.ml-scene')!;
   const q=gsap.utils.selector(el);const reduced=still||!!context.conditions?.reduce;const desktop=!!context.conditions?.desktop;
   el.classList.toggle('ml-is-static',reduced);
   let intro:gsap.core.Timeline|undefined;let scroll:gsap.core.Timeline|undefined;
   const cleanup:Array<()=>void>=[];
   const listen=(target:EventTarget,event:string,fn:EventListener,options?:AddEventListenerOptions)=>{target.addEventListener(event,fn,options);cleanup.push(()=>target.removeEventListener(event,fn,options));};
   const makeScroll=()=>gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:el,start:()=>`top ${document.querySelector('.ml-header')!.getBoundingClientRect().height}px`,end:()=>`+=${Math.max(1,el.offsetHeight-scene.offsetHeight)}`,scrub:.35,invalidateOnRefresh:true,onUpdate:self=>{const read=el.querySelector('.ml-progress-fill') as HTMLElement;read.style.transform=`scaleX(${self.progress})`;}}});
   if(!reduced){
    if(id==='bloom'){
     intro=createBloomEntrance(q);
     scroll=makeScroll().to(q('.bloom-expansion'),{scale:1.16,yPercent:-8,duration:1},0).to(q('.bloom-flower-one'),{xPercent:-65,rotation:-35,duration:1},0).to(q('.bloom-flower-two'),{xPercent:60,rotation:45,duration:1},0).to(q('.bloom-warm'),{opacity:1,duration:1},0).to(q('.bloom-aperture'),{opacity:.7,duration:1},0).to(q('.bloom-word'),{scaleX:desktop?1.15:1.08,yPercent:-12,duration:1},0);
    }
    if(id==='layers'){
     intro=gsap.timeline({defaults:{duration:1.25,ease:'power3.out'}}).from(q('.layers-back-pointer'),{scale:1.35,y:60},0).from(q('.layers-mid-pointer'),{xPercent:-80,rotation:-12},.1).from(q('.leaf-left'),{xPercent:-110,rotation:-60},.25).from(q('.leaf-right'),{xPercent:110,rotation:60},.25).from(q('.layers-paper'),{yPercent:160,rotation:30},.35);
     scroll=makeScroll().to(q('.layers-back-scroll'),{yPercent:-8,scale:1.08,duration:1},0).to(q('.layers-mid-scroll'),{yPercent:-18,scale:.82,rotation:-6,duration:1},0).to(q('.layers-front-scroll'),{yPercent:-30,scale:1.5,duration:1},0);
    }
    if(id==='type'){
     intro=gsap.timeline({defaults:{duration:1.35,ease:'power3.inOut'}}).from(q('.type-upper'),{xPercent:-85,yPercent:-55,skewX:-18,stagger:.08},0).from(q('.type-lower'),{xPercent:85,yPercent:55,skewX:18,stagger:.08},0);
     scroll=makeScroll();
     q('.type-unit').forEach((node:HTMLElement,i:number)=>{scroll!.fromTo(node,{scale:desktop?3.1:2.6,y:desktop?180:165,x:desktop?(1-i)*35:(1-i)*7,rotation:0},{scale:1,y:0,x:0,rotation:0,duration:.8},0);});
     scroll.fromTo(q('.type-label'),{opacity:0,y:45},{opacity:1,y:0,duration:.3},.65).fromTo(q('.type-reading'),{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:.4},.6).fromTo(q('.type-rule'),{scaleX:0},{scaleX:1,duration:.5},.5).to(q('.type-caption'),{yPercent:40,opacity:1,duration:.4},.6);
    }
   }
   const finish=()=>{intro?.progress(1).pause();};finishRef.current=finish;
   // Scrolling or interacting takes over immediately; the entrance never traps input.
   listen(window,'wheel',finish as EventListener,{passive:true});listen(scene,'pointerdown',finish as EventListener,{passive:true});
   listen(window,'keydown',((e:KeyboardEvent)=>{if(['Tab','Enter',' ','ArrowDown','PageDown','End'].includes(e.key))finish();}) as EventListener);
   if(id==='layers'){
    const targets=['.layers-back-pointer','.layers-mid-pointer','.layers-front-pointer'];
    const xTo=targets.map(t=>gsap.quickTo(q(t),'x',{duration:.65,ease:'power3.out'}));
    const yTo=targets.map(t=>gsap.quickTo(q(t),'y',{duration:.65,ease:'power3.out'}));
    let rect=scene.getBoundingClientRect();
    listen(scene,'pointerenter',(()=>{rect=scene.getBoundingClientRect();}) as EventListener);
    listen(scene,'pointermove',((event:PointerEvent)=>{if(reduced||event.pointerType!=='mouse'||intro?.isActive())return;const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;[14,46,100].forEach((amount,i)=>{xTo[i](x*amount);yTo[i](y*amount*.6);});}) as EventListener);
    listen(scene,'pointerleave',(()=>{if(reduced)return;xTo.forEach(t=>t(0));yTo.forEach(t=>t(0));}) as EventListener);
    const depth=gsap.timeline({paused:true}).to(q('.layers-paper'),{x:desktop?-150:-55,y:-50,rotation:-18,scale:1.25,duration:1,ease:'none'},0).to(q('.leaf-left'),{xPercent:-45,rotation:-20,duration:1,ease:'none'},0).to(q('.leaf-right'),{xPercent:40,rotation:20,duration:1,ease:'none'},0);
    let depthTween:gsap.core.Tween|undefined;
    q('[data-depth]').forEach((button:HTMLElement)=>listen(button,'click',((event:MouseEvent)=>{finish();const progress=Number(button.dataset.depth);q('[data-depth]').forEach((b:HTMLElement)=>b.setAttribute('aria-pressed',String(b===button)));depthTween?.kill();if(reduced||event.detail===0)depth.progress(progress);else depthTween=gsap.to(depth,{progress,duration:.8,ease:'power3.inOut'});}) as EventListener));
    cleanup.push(()=>{depthTween?.kill();xTo.forEach(t=>t.tween.kill());yTo.forEach(t=>t.tween.kill());});
   }
   if(id==='play'){
    const cut=q('.play-cutout')[0] as HTMLButtonElement;const art=q('.play-cutout-art')[0];let x=0,y=0,drag=false,startX=0,startY=0,pointerId:number|undefined;
    const toX=gsap.quickTo(cut,'x',{duration:.35,ease:'power3.out'}),toY=gsap.quickTo(cut,'y',{duration:.35,ease:'power3.out'}),tilt=gsap.quickTo(art,'rotation',{duration:.5,ease:'power3.out'});
    const letterTweens=q('.play-letter span').map((node:HTMLElement)=>gsap.quickTo(node,'rotation',{duration:.4,ease:'power3.out'}));
    const move=(nx:number,ny:number,instant=false)=>{const maxX=scene.clientWidth*.32,maxY=scene.clientHeight*.17;x=gsap.utils.clamp(-maxX,maxX,nx);y=gsap.utils.clamp(-maxY,maxY,ny);if(reduced||instant){toX.tween.pause();toY.tween.pause();gsap.set(cut,{x,y});}else{toX(x);toY(y);tilt(x/maxX*14);letterTweens.forEach((t:ReturnType<typeof gsap.quickTo>,i:number)=>t((i-1)*x/maxX*-7));}};
    const announce=()=>{(q('.play-status')[0] as HTMLElement).textContent=`紙片位於${x < -30?'左側':x > 30?'右側':'中央'}`;};
    listen(cut,'pointerdown',((e:PointerEvent)=>{if(e.button!==0)return;drag=true;pointerId=e.pointerId;startX=e.clientX-x;startY=e.clientY-y;cut.setPointerCapture(e.pointerId);cut.dataset.dragging='true';}) as EventListener);
    listen(cut,'pointermove',((e:PointerEvent)=>{if(drag)move(e.clientX-startX,e.clientY-startY);}) as EventListener);
    const end=()=>{if(!drag)return;drag=false;cut.dataset.dragging='false';if(pointerId!==undefined&&cut.hasPointerCapture(pointerId))cut.releasePointerCapture(pointerId);announce();};
    listen(cut,'pointerup',end);listen(cut,'pointercancel',end);listen(cut,'lostpointercapture',end);
    listen(cut,'keydown',((e:KeyboardEvent)=>{const values:Record<string,[number,number]>={ArrowLeft:[x-32,y],ArrowRight:[x+32,y],ArrowUp:[x,y-32],ArrowDown:[x,y+32],Home:[0,0]};if(values[e.key]){e.preventDefault();move(...values[e.key],true);announce();}}) as EventListener);
    q('[data-place]').forEach((button:HTMLElement)=>listen(button,'click',((e:MouseEvent)=>{move(Number(button.dataset.place)*scene.clientWidth*.26,0,e.detail===0);announce();}) as EventListener));
    const reading=[...f.meanings,{title:'一起，成為祭典。',text:f.story}];
    const note=q('.play-note')[0];const feedback=gsap.fromTo(note,{y:10},{y:0,duration:.3,ease:'power3.out',paused:true,immediateRender:false});
    q('[data-letter]').forEach((button:HTMLElement,i:number)=>listen(button,'click',((e:MouseEvent)=>{q('[data-letter]').forEach((b:HTMLElement)=>b.setAttribute('aria-pressed',String(b===button)));(q('.play-note-title')[0] as HTMLElement).textContent=reading[i].title;(q('.play-note-copy')[0] as HTMLElement).textContent=reading[i].text;if(!reduced&&e.detail!==0)feedback.restart();else feedback.progress(1).pause();}) as EventListener));
    cleanup.push(()=>{drag=false;if(pointerId!==undefined&&cut.hasPointerCapture(pointerId))cut.releasePointerCapture(pointerId);toX.tween.kill();toY.tween.kill();tilt.tween.kill();letterTweens.forEach((t:ReturnType<typeof gsap.quickTo>)=>t.tween.kill());});
   }
   const visibility=()=>{if(document.hidden)intro?.pause();else if(intro&&intro.progress()<1)intro.play();};listen(document,'visibilitychange',visibility);
   ScrollTrigger.refresh();
   return ()=>{cleanup.forEach(fn=>fn());finishRef.current=()=>{};el.classList.remove('ml-is-static');};
  },root);
  return ()=>mm.revert();
 },[id,still,finishRef]);
 return <><div ref={root} className={`ml-track ml-${id}`}><section className="ml-scene" aria-label={`${studies.find(s=>s.id===id)!.name} 互動實驗`}><span className="ml-scene-tag">{String(studies.findIndex(s=>s.id===id)+1).padStart(2,'0')} / {id.toUpperCase()} <span>暫用視覺實驗</span></span>{id==='bloom'?<Bloom/>:id==='layers'?<Layers/>:id==='type'?<TypeStudy/>:<Play/>}<div className="ml-progress" aria-hidden="true"><span className="ml-progress-fill"/></div></section></div><section className="ml-readings" aria-label="可直接閱讀的祭典資訊"><p className="ml-reading-intro">動態可以跳過，故事一直都在。</p><article id="motion-story" tabIndex={-1}><span>松</span><div><h2>從校園，長出一個節日。</h2><p>{f.intro}</p></div></article><article id="motion-lake" tabIndex={-1}><span>櫻</span><div><h2>{f.places[1].title}</h2><p>{f.places[1].text}</p></div></article><article id="motion-edition" tabIndex={-1}><span>祭</span><div><h2>{f.edition.title}・尚未公布</h2><p>{f.edition.text}</p></div></article><a href="/e">前往 Direction E ↗</a></section></>;
}
export default function MotionLab(){
 const initial=new URLSearchParams(location.search).get('study');
 const [id,setId]=useState<StudyId>(studies.find(s=>s.id===initial)?.id||'bloom');
 const [still,setStill]=useState(false),[iteration,setIteration]=useState(0);
 const finishRef=useRef<()=>void>(()=>{}),header=useRef<HTMLElement>(null),container=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{let frame=0;const observer=new ResizeObserver(()=>{container.current?.style.setProperty('--lab-head',`${header.current!.offsetHeight}px`);cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>ScrollTrigger.refresh());});observer.observe(header.current!);return()=>{observer.disconnect();cancelAnimationFrame(frame);};},[]);
 useEffect(()=>{document.title=`松櫻祭 · Motion Lab / ${id}`;},[id]);
 const choose=(next:StudyId)=>{window.scrollTo(0,0);setId(next);const url=new URL(location.href);url.searchParams.set('study',next);history.replaceState(null,'',url);};
 return <div className={`motion-lab ${still?'ml-static-request':''}`} ref={container}><a className="skip-link" href="#motion-story">跳過動態，閱讀內容</a><header className="ml-header" ref={header}><div className="ml-topline"><a href="/e">松櫻祭 <span>MOTION LAB</span></a><span>可拋棄的動態實驗 · 非官方視覺</span><div className="ml-transport"><button onClick={()=>{window.scrollTo(0,0);setIteration(i=>i+1);}}>重播</button><button onClick={()=>finishRef.current()}>略過進場</button><button aria-pressed={still} onClick={()=>setStill(!still)}>{still?'靜態：開':'靜態：關'}</button></div></div><nav className="ml-picker" aria-label="切換動態實驗">{studies.map((study,i)=><button key={study.id} aria-pressed={id===study.id} onClick={()=>choose(study.id)}><span>0{i+1}</span><strong>{study.name}</strong><small>{study.zh}</small></button>)}</nav><p className="ml-instruction" aria-live="polite">{studies.find(s=>s.id===id)!.instruction}<a href="#motion-story">直接讀內容 ↓</a></p></header><main><h1 className="sr-only">松櫻祭動態實驗室</h1><Study key={`${id}-${iteration}`} id={id} still={still} finishRef={finishRef}/></main></div>;
}
