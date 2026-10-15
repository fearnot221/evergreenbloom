import {Component,lazy,Suspense,useEffect,useRef,useState} from 'react';
import {Link,NavLink,Navigate,Route,Routes,useLocation,useNavigationType} from 'react-router-dom';
import {snapshot} from './data/festival';
import {PwaStatus} from './pwa';
import {BloomMark} from './bloom-grammar';
import './motion-lab.css';
import './direction-e.css';
import './app.css';
import './bloom-refinement.css';
const Home=lazy(()=>import('./direction-e'));
const Pages=lazy(()=>import('./pages'));
const MapPage=lazy(()=>import('./map/map-page'));
const Lab=lazy(()=>import('./motion-lab'));
const nav=[['/','首頁'],['/about','故事'],['/program','節目'],['/events','活動'],['/map','地圖'],['/news','消息'],['/team','團隊'],['/visit','來訪']];
const positions=new Map<string,number>();
class RouteBoundary extends Component<{children:React.ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<main id="route-content" tabIndex={-1} className="inner-page"><h1>這頁暫時無法展開。</h1><p>可能是連線中斷或頁面尚未儲存。請恢復連線後重新開啟。</p><a href={window.location.href}>重新載入</a> · <a href="/program">開啟節目表</a></main>:this.props.children;}
}
export default function App(){
 const location=useLocation(),navType=useNavigationType();const [menu,setMenu]=useState(false),[english,setEnglish]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),more=useRef<HTMLButtonElement>(null),header=useRef<HTMLElement>(null);
 const previous=useRef(location);const motion=location.pathname==='/motion';
 useEffect(()=>{const el=header.current;if(!el)return;const ro=new ResizeObserver(()=>document.documentElement.style.setProperty('--app-header',`${el.offsetHeight}px`));ro.observe(el);return()=>ro.disconnect();},[motion]);
 useEffect(()=>{if(menu){dialog.current?.showModal();}else if(dialog.current?.open)dialog.current.close();},[menu]);
 useEffect(()=>{
  setMenu(false);setEnglish(false);
  const prior=previous.current;previous.current=location;
  if(prior.key===location.key)return;
  const pathChanged=prior.pathname!==location.pathname;
  if(!pathChanged)return;
  if(motion)return;
  const observer=new MutationObserver(()=>settle());let settled=false;
  const settle=()=>{const main=document.getElementById('route-content');if(!main||!main.getClientRects().length||settled)return;settled=true;observer.disconnect();
   window.scrollTo(0,navType==='POP'?(positions.get(location.key)??0):0);main.focus({preventScroll:true});
   const mark=document.querySelector('.app-brand .bloom-mark');mark?.getAnimations().forEach(animation=>animation.cancel());if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.hasAttribute('data-keyboard'))mark?.animate([{transform:'rotate(-36deg) scale(.8)'},{transform:'rotate(0) scale(1)'}],{duration:200,easing:'cubic-bezier(.23,1,.32,1)'});
  };observer.observe(document.getElementById('route-stage')!,{childList:true,subtree:true});settle();return()=>observer.disconnect();
 },[location,navType]);
 useEffect(()=>{const key=location.key;const save=()=>positions.set(key,scrollY);window.addEventListener('scroll',save,{passive:true});return()=>window.removeEventListener('scroll',save);},[location.key]);
 useEffect(()=>{history.scrollRestoration='manual';const key=()=>document.documentElement.setAttribute('data-keyboard','');const pointer=()=>document.documentElement.removeAttribute('data-keyboard');document.addEventListener('keydown',key);document.addEventListener('pointerdown',pointer);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',pointer);};},[]);
 if(motion)return <Suspense fallback={<p className="route-message">開啟動態研究…</p>}><Lab/></Suspense>;
 return <div className="motion-lab bloom-site festival-app" onKeyDown={event=>{if(event.key==='Escape'&&english){setEnglish(false);document.querySelector<HTMLButtonElement>('.language-trigger')?.focus();}}}>
  <a className="skip-link" href="#route-content">跳至主要內容</a>
  <header className="app-header" id="app-header" ref={header}>
   <div className="app-context"><span>松櫻祭 · FESTIVAL WEB APP</span><span>開發原型／非正式發布</span></div>
   <div className="app-nav"><Link className="app-brand" to="/"><BloomMark open/>松櫻祭<span>國立中央大學</span></Link><nav aria-label="主要導覽">{nav.map(([to,label])=><NavLink key={to} to={to} end={to==='/'}>{label}</NavLink>)}</nav><button className="language-trigger" aria-expanded={english} onClick={()=>setEnglish(!english)} lang="en">EN</button></div>
   {english&&<div className="app-language" lang="en"><strong>Traditional Chinese content only for now.</strong><p>English translations are not yet available. You can continue viewing the Traditional Chinese version.</p><button onClick={()=>setEnglish(false)}>Continue in Traditional Chinese</button></div>}
   <PwaStatus/>
  </header>
  <div id="route-stage"><RouteBoundary key={location.pathname}><Suspense fallback={<main className="route-message" aria-busy="true"><p>正在展開頁面…</p></main>}><Routes>
   <Route path="/" element={<Home/>}/><Route path="/e" element={<Navigate to="/" replace/>}/>
   {['about','program','events','events/:id','news','news/:id','team','visit'].map(path=><Route key={path} path={path} element={<Pages/>}/>)}
   <Route path="/map" element={<MapPage/>}/><Route path="*" element={<main className="inner-page" id="route-content" tabIndex={-1}><h1>這一頁，還未展開。</h1><p>找不到這個頁面。舊 A／B／C／D 原型已移除。</p><Link to="/">回到松櫻祭</Link></main>}/>
  </Routes></Suspense></RouteBoundary></div>
  {location.pathname!=='/'&&<footer className="app-footer"><Link to="/">松櫻祭</Link><p>扎根。生長。相遇。</p><small>探索原型 · 官方品牌、下一屆資料待確認。<br/>內容版本 {snapshot.revision}</small></footer>}
  <nav className="bottom-nav" aria-label="行動導覽"><NavLink to="/" end><span aria-hidden="true">01</span>首頁</NavLink><NavLink to="/program"><span aria-hidden="true">02</span>節目</NavLink><NavLink to="/map"><span aria-hidden="true">03</span>地圖</NavLink><button ref={more} onClick={()=>setMenu(true)} aria-haspopup="dialog" aria-expanded={menu}><span aria-hidden="true">＋</span>更多</button></nav>
  <dialog aria-labelledby="more-title" className="more-menu" ref={dialog} onCancel={()=>setMenu(false)} onClose={()=>{setMenu(false);if(document.activeElement===document.body)more.current?.focus();}}><div className="more-title"><h2 id="more-title">繼續探索</h2><button onClick={()=>{setMenu(false);more.current?.focus();}}>關閉 ×</button></div><nav aria-label="更多頁面">{nav.slice(1).map(([to,label],i)=><Link key={to} to={to} onClick={()=>setMenu(false)}><span>0{i+1}</span>{label}<span>↗</span></Link>)}</nav><p>下一屆資訊待公布。<br/>本應用目前提供明確標示的原型資料。</p></dialog>
 </div>;
}
