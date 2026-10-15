import { Link } from 'react-router-dom';
import { Featured, ProgramPreview, CampusPreview, PeoplePreview } from './home-extras';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { festival as f } from './content';
import { SeedArt, SeedStudy } from './seed-art';
import { paintSeed } from './seed-form';
import { Bloom, SkyArt } from './bloom-art';
import { createBloomEntrance } from './bloom-motion';
import './motion-lab.css';
import './direction-e.css';

gsap.registerPlugin(ScrollTrigger);

export default function DirectionE() {
  const root=useRef<HTMLDivElement>(null), header=useRef<HTMLElement>(null), finish=useRef(()=>{});
  const entranceSeen=useRef(false);
  const [still,setStill]=useState(false);
  useEffect(()=>{
    // Details change document height; refresh measurements only after that change.
    const refresh=()=>ScrollTrigger.refresh();
    root.current!.addEventListener('toggle',refresh,true);
    return()=>{root.current?.removeEventListener('toggle',refresh,true);};
  },[]);
  useLayoutEffect(()=>{
    document.title='松櫻祭 · 國立中央大學春日祭典';
    header.current=document.getElementById('app-header');
    let frame=0;const observer=new ResizeObserver(()=>{root.current?.style.setProperty('--e-header',`${header.current!.offsetHeight}px`);cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>ScrollTrigger.refresh());});
    observer.observe(header.current!);return()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[]);
  useLayoutEffect(()=>{
    const mm=gsap.matchMedia();
    mm.add({reduce:'(prefers-reduced-motion: reduce)',desktop:'(min-width: 700px)',all:'(min-width: 0px)'},context=>{
      const el=root.current!,q=gsap.utils.selector(el),reduced=still||context.conditions?.reduce;
      el.classList.toggle('e-resolved',!!reduced);
      if(reduced){el.querySelectorAll('.e-seed-hero,.e-seed-rebloom').forEach(art=>paintSeed(art,1));finish.current=()=>{};return()=>el.classList.remove('e-resolved');}
      const intro=createBloomEntrance(q,false);
      const seed={phase:0};
      intro.to(seed,{phase:1,duration:1.4,ease:'power3.inOut',onUpdate:()=>paintSeed(q('.e-seed-hero')[0],seed.phase)},.1);
      // ASSEMBLE uses the exact lab entrance. Smaller identity joins after the main forms.
      intro.from(q('.e-identity'),{clipPath:'inset(0 100% 0 0)',duration:.35,ease:'power2.out'},1.15);
      intro.eventCallback('onComplete',()=>{entranceSeen.current=true;});
      if(entranceSeen.current)intro.progress(1).pause();
      const track=q('.e-hero-track')[0] as HTMLElement,scene=q('.e-world')[0] as HTMLElement;
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,start:()=>`top ${header.current!.offsetHeight}px`,end:()=>`+=${track.offsetHeight-scene.offsetHeight}`,scrub:.35,invalidateOnRefresh:true}})
        .to(q('.e-disperse'),{xPercent:i=>i===0?-95:i===2?95:0,yPercent:i=>i===1?-105:-35,rotation:i=>i===0?-16:i===2?16:0,duration:.7},0)
        .to(q('.bloom-expansion'),{scale:1.16,yPercent:-8,duration:1},0)
        .to(q('.e-seed-hero'),{scale:1.35,yPercent:-15,rotation:12,duration:1},0)
        .to(q('.e-story-wash'),{opacity:1,duration:.55},.35)
        .fromTo(q('.e-story-window'),{clipPath:'inset(50% 50% 50% 50%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.6},.35)
        .to(q('.e-identity'),{opacity:0,duration:.2},.05);
      const desktop=!!context.conditions?.desktop;
      // STORY: only display art moves. Narrative paragraphs stay in normal flow.
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:q('.e-story-body')[0],start:'top 65%',end:'bottom 70%',scrub:.4}})
        .fromTo(q('.e-root-character'),{rotation:-12,xPercent:-12},{rotation:6,xPercent:desktop?-28:-8,yPercent:-12,duration:1},0)
        .fromTo(q('.e-bloom-character'),{rotation:12,yPercent:35},{rotation:-5,yPercent:-6,xPercent:desktop?15:6,duration:1},0)
        ;
      // FLOW: a word crosses the seam and becomes the horizontal news rule.
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:q('.e-news-seam')[0],start:'top bottom',end:'bottom 35%',scrub:.3}})
        .fromTo(q('.e-seam-word'),{xPercent:-18,rotation:-7},{xPercent:10,rotation:0,duration:1},0)
        .fromTo(q('.e-seam-line'),{scaleX:.15},{scaleX:1,duration:1},0);
      // REBLOOM: the same layered geometry opens behind the display type; facts stay still.
      const rebloom={phase:.15};
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:q('.e-rebloom')[0],start:'top 85%',end:'top 20%',scrub:.3}})
        .to(rebloom,{phase:1,duration:1,onUpdate:()=>paintSeed(q('.e-seed-rebloom')[0],rebloom.phase)},0)
        .fromTo(q('.e-depth'),{clipPath:'inset(42% 0% 42% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1},0)
        .fromTo(q('.e-rebloom-title span'),{yPercent:desktop?40:18,rotation:i=>i%2?-8:8},{yPercent:0,rotation:0,stagger:.1,duration:.8},.1);
      // SETTLE: the aperture's underline is inherited by the schedule timeline.
      gsap.fromTo(q('.e-program-thread'),{scaleY:.15},{scaleY:1,ease:'none',scrollTrigger:{trigger:q('#program')[0],start:'top 85%',end:'top 35%',scrub:true}});
      // RETURN: shoreline carries the schedule into campus context, no animated route claims.
      gsap.fromTo(q('.e-shore-line'),{strokeDashoffset:100},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:q('.e-campus-context')[0],start:'top 85%',end:'top 30%',scrub:true}});
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:q('.e-closing')[0],start:'top 90%',end:'top 15%',scrub:.4}})
        .fromTo(q('.e-closing-art'),{clipPath:'ellipse(28% 36% at 50% 60%)'},{clipPath:'ellipse(80% 85% at 50% 60%)',duration:1},0)
        .fromTo(q('.e-closing-glyph'),{yPercent:25,rotation:9},{yPercent:0,rotation:0,duration:1},0);
      const settle=()=>intro.progress(1).pause();finish.current=settle;
      const key=(event:KeyboardEvent)=>{if(['Tab','Enter',' ','PageDown','ArrowDown','End'].includes(event.key))settle();};
      const visibility=()=>{if(document.hidden)intro.pause();else if(intro.progress()<1)intro.play();};
      window.addEventListener('wheel',settle,{passive:true});el.addEventListener('pointerdown',settle,{passive:true});window.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
      return()=>{window.removeEventListener('wheel',settle);el.removeEventListener('pointerdown',settle);window.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);finish.current=()=>{};};
    },root);
    return()=>mm.revert();
  },[still]);
  return <div ref={root} className="motion-lab bloom-site" id="top" onKeyDownCapture={()=>{if(root.current)root.current.dataset.input="keyboard";}} onPointerDownCapture={()=>{if(root.current)root.current.dataset.input="pointer";}}>
    <div className="home-motion-tools"><span>SEED → UNFOLD → BLOSSOM → FESTIVAL</span><button onClick={()=>finish.current()}>略過進場</button><button aria-pressed={still} onClick={()=>setStill(!still)}>{still?'靜態：開':'靜態：關'}</button></div>
    <main id="route-content" tabIndex={-1}>
      <h1 className="sr-only">松櫻祭，國立中央大學的春日校園祭典</h1>
      <div className="e-hero-track"><section className="e-world" aria-label="Bloom 春日主視覺"><Bloom disperse botanicals={false}/><div className="e-seed-hero"><SeedArt/></div><div className="e-identity"><p>{f.descriptor}</p><p>校園風景・學生創意・藝術文化</p></div><div className="e-story-wash" aria-hidden="true"/><div className="e-story-window" aria-hidden="true"><span>從一個名字，向一個春天展開。</span><p>讓春天，<br/><strong>成為中央的日常。</strong></p></div><a href="#edition" className="e-quick-info">下一屆尚未公布 <span>先看活動資訊 ↗</span></a><p className="e-art-caption">暫用插畫與字體實驗，非官方素材或校園地圖</p></section></div>
      <section id="story" className="e-story" tabIndex={-1} aria-labelledby="story-title">
        <div className="e-story-heading"><p className="e-eyebrow">01 / THE ROOTS · 祭典故事</p><h2 id="story-title"><span>一個名字。</span><span>兩種<em>生長</em>。</span></h2><p>{f.intro}</p></div>
        <div className="e-story-body">
          <div className="e-story-stage"><div className="e-story-type" aria-hidden="true"><span className="e-root-character">松</span><span className="e-bloom-character">櫻</span></div><SeedStudy still={still}/><span className="e-story-vertical" aria-hidden="true">SEED ／ UNFOLD ／ BLOSSOM</span></div>
          <div className="e-story-fragments">{f.meanings.map((m,i)=><article className="e-story-fragment" key={m.name}><p className="e-eyebrow">0{i+1} / {m.name}</p><h3>{m.title}</h3><p>{m.text}</p></article>)}<article className="e-story-fragment"><p className="e-eyebrow">03 / 中大湖 · 風景與歷史</p><h3>{f.places[1].title}</h3><p>{f.places[1].text}</p><p>{f.story}</p></article></div>
        </div>
        <Link className="text-link story-more" to="/about">閱讀完整祭典故事與 2026 回顧 ↗</Link><section className="e-history" aria-labelledby="history-title"><div><span>{f.history.label}</span><h3 id="history-title">{f.history.title}</h3><p>{f.history.period}</p></div><div><p>{f.history.text}</p><a href={f.history.url}>{f.history.source} ↗</a></div></section>
      </section>
      <Featured/><div className="e-news-seam" aria-hidden="true"><span className="e-seam-word">生長中的消息</span><span className="e-seam-line"/></div>
      <section id="news" className="e-news" tabIndex={-1} aria-labelledby="news-title"><div className="e-news-heading"><p className="e-eyebrow">02 / NEWS</p><h2 id="news-title">消息，<br/><span>慢慢展開。</span></h2><p>關於下一次相聚，<br/>從這裡開始讀。</p></div><article className="e-news-strip"><div className="e-meta"><span>{f.announcement.label}</span><span>{f.announcement.date}</span></div><h3>{f.announcement.title}</h3><p>{f.announcement.summary}</p><details className="e-unfold"><summary>展開公告<span aria-hidden="true">＋</span></summary><div><p>{f.announcement.detail}</p></div></details><p className="e-source">{f.announcement.source}</p><Link className="text-link" to="/news">所有消息 ↗</Link></article><a className="e-news-next" href="#edition"><span>下一次</span><span>↘</span></a></section>
      <section id="edition" className="e-edition" tabIndex={-1} aria-labelledby="edition-title">
        <div className="e-rebloom"><div className="e-depth e-seed-rebloom"><SeedArt/></div><p className="e-eyebrow">03 / NEXT EDITION · 下一次相聚</p><h2 className="e-rebloom-title" id="edition-title"><span>再</span><span>相</span><span>聚</span><i>。</i></h2><div className="e-rebloom-note"><span>春天會再來。</span><span>下一屆資訊尚未公布。</span></div></div>
        <div className="e-edition-information"><div><p className="e-eyebrow">等待下一個春天</p><p>{f.edition.text}</p><a href="#news">回到最新消息 ↗</a></div><div className="e-ledger"><h3>{f.edition.title}<span>{f.edition.status}</span></h3><dl>{f.edition.fields.map(field=><div key={field.name}><dt>{field.name}</dt><dd>{field.value}</dd></div>)}</dl></div></div>
      </section>
      <section id="program" className="e-program" tabIndex={-1} aria-labelledby="program-title"><div className="e-program-thread" aria-hidden="true"/><div className="e-program-heading"><p className="e-eyebrow">04 / PROGRAM</p><h2 id="program-title">把時間，<br/><em>留給相遇。</em></h2></div><div className="e-program-content"><p className="e-status">節目與時段 / 待公布</p><p>下一屆活動、演出與市集資訊確認後，將在這裡整理。現在還沒有可用於安排行程的節目表。</p><ProgramPreview/></div></section>
      <section id="visit" className="e-visit" tabIndex={-1} aria-labelledby="visit-title"><div className="e-visit-heading"><p className="e-eyebrow">05 / VISIT · 走進中央</p><h2 id="visit-title">祭典在這裡，<br/><span>和校園一起。</span></h2></div><CampusPreview/><div className="e-visit-information"><div><h3>出發之前</h3><p className="e-source">{f.attendee.label}</p></div><dl className="e-visit-rows">{f.attendee.rows.map(row=><div key={row.title}><dt>{row.title}</dt><dd>{row.text}</dd></div>)}</dl></div><a className="e-visit-news" href="#news">出發前，再確認最新消息 ↗</a></section>
    <PeoplePreview/></main>
    <footer className="e-closing"><div className="e-closing-art" aria-hidden="true"><SkyArt/><span className="e-closing-glyph">春</span><SeedArt className="e-closing-seed" phase={.45}/></div><div className="e-closing-copy"><p>扎根。生長。相遇。</p><h2>在中央，<br/>等一個春天。</h2><a href="#top">回到春天的起點 ↑</a></div><div className="e-colophon"><a href="/">松櫻祭</a><span>國立中央大學的春日校園祭典</span><small>Festival Web App · 探索原型，非正式活動網站。<br/>官方視覺與下一屆資訊仍待確認。</small></div></footer>
  </div>;
}
