import {useEffect,useRef} from 'react';
import {scalePath} from './seed-form';
import {SeedArt} from './seed-shape';

/** Provisional digital grammar. Every petal uses the same notched scale as the opening. */
export function BloomMark({open=false,className=''}:{open?:boolean;className?:string}){
 return <svg className={`bloom-mark ${open?'is-open':''} ${className}`} viewBox="-40 -40 80 80" aria-hidden="true" focusable="false">{Array.from({length:5},(_,i)=><g key={i} transform={`rotate(${i*72})`}><path d={scalePath(1)}/></g>)}</svg>;
}
export function BloomPrint({phase=1,word='',className=''}:{phase?:number;word?:string;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current!;const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){el.classList.add('is-visible');io.disconnect();}},{threshold:.2});io.observe(el);return()=>io.disconnect();},[]);
 return <div className={`bloom-print ${className}`} ref={ref} aria-hidden="true"><SeedArt phase={phase}/>{word&&<span>{word}</span>}</div>;
}
export function BloomDivider(){return <div className="bloom-divider" aria-hidden="true"><i/><BloomMark open/><i/></div>;}
export function MaterialSlot({kind='art',label}:{kind?:'art'|'portrait';label:string}){
 return <figure className={`material-slot material-${kind}`}><div aria-hidden="true"><BloomMark open={kind==='art'}/></div><figcaption>{label}<span>正式素材待提供</span></figcaption></figure>;
}
export function PartnerSpace(){return <div className="partner-space"><p>合作名單與識別素材待確認</p><div className="partner-proof" aria-hidden="true"><span className="logo-wide">橫式素材位置</span><span className="logo-square">方形素材位置</span></div><p className="small-note">示意位置，不代表合作單位、數量或贊助層級。正式標誌將保留原始比例與核准色彩。</p></div>;}
