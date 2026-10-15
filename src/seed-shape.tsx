import {memo} from 'react';
import {scaleColors,scalePath,svgPose,SCALE_COUNT} from './seed-form';
export const SeedArt=memo(function SeedArt({className='',phase=1}:{className?:string;phase?:number}) {
  return <svg className={`seed-art ${className}`} viewBox="0 0 600 600" aria-hidden="true" focusable="false">
    {Array.from({length:SCALE_COUNT},(_,i)=><path key={i} className="seed-scale" data-scale={i} d={scalePath(phase)} transform={svgPose(i,phase)} fill={scaleColors[Math.floor(i/5)%5]} stroke="#a51e59" strokeWidth=".009"/>) }
  </svg>;
});

