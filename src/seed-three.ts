import * as THREE from 'three';
import { scalePose, scaleColors, SCALE_COUNT } from './seed-form';

// Archived E2 experiment: evaluated and rejected for the public story. No live import.
// Retained only for comparison; no campus coordinates, routing or map dependency.
export function mountSeed(host:HTMLElement,initialPhase:number,status:(message:string)=>void) {
  const mount=host.querySelector<HTMLElement>('.seed-three-mount')!;
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {host.dataset.render='2d';status('此環境無法顯示 3D，保留 2D 構圖。');return()=>{};}
  renderer.setClearColor(0,0);renderer.setPixelRatio(1);
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');mount.append(canvas);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-2.65,2.65,2.65,-2.65,.1,30);camera.position.set(0,0,8);
  const group=new THREE.Group();scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff,2.1));
  const light=new THREE.DirectionalLight(0xffedf5,2);light.position.set(-3,4,6);scene.add(light);
  const geometry=new THREE.BufferGeometry(),positions:number[]=[],indices:number[]=[],open:number[]=[];
  const rows=14,cols=10;
  for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
    const v=y/rows,u=x/cols*2-1,width=Math.pow(Math.sin(Math.PI*(v*.92+.08)),.65);
    // Same scale becoming a notched petal; GPU interpolates the surface once per draw.
    positions.push(u*width,1-v*2-.14*u*u*Math.exp(-v*10),(1-u*u)*Math.sin(Math.PI*v)*.35);
    open.push(u*width,1-v*2-(.14*u*u+.30*(1-Math.abs(u)))*Math.exp(-v*12),(1-u*u)*Math.sin(Math.PI*v)*.10);
  }
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);}
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  geometry.morphAttributes.position=[new THREE.Float32BufferAttribute(open,3)];
  const materials=Array.from({length:3},(_,i)=>new THREE.MeshLambertMaterial({color:scaleColors[i],side:THREE.DoubleSide}));
  const meshes=Array.from({length:SCALE_COUNT},(_,i)=>{const mesh=new THREE.Mesh(geometry,materials[Math.floor(i/5)]);group.add(mesh);return mesh;});
  let phase=initialPhase,frame=0,visible=false,disposed=false,lost=false,px=0,py=0;
  const draw=()=>{frame=0;if(disposed||lost||!visible||document.hidden)return;
    meshes.forEach((mesh,i)=>{const p=scalePose(i,phase);mesh.position.set(p.x,-p.y,p.z);mesh.rotation.set((1-phase)*-.24,Math.sin(i*1.26)*(1-phase)*.35,-p.rotation);mesh.scale.set(p.width,p.height,1);mesh.morphTargetInfluences![0]=phase;});
    group.rotation.set(py,px+(1-phase)*.14,0);renderer.render(scene,camera);host.dataset.render='3d';
  };
  const request=()=>{if(!frame&&!disposed&&!lost&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const resize=()=>{const r=mount.getBoundingClientRect();if(!r.width||!r.height)return;const ratio=Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches?1:1.5,Math.sqrt(900000/(r.width*r.height)));renderer.setSize(Math.round(r.width*ratio),Math.round(r.height*ratio),false);const aspect=r.width/r.height;camera.left=-2.65*aspect;camera.right=2.65*aspect;camera.updateProjectionMatrix();request();};
  const onPhase=(event:Event)=>{phase=(event as CustomEvent<number>).detail;request();};
  const pointer=(event:PointerEvent)=>{if(event.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const r=mount.getBoundingClientRect();px=((event.clientX-r.left)/r.width-.5)*.32;py=((event.clientY-r.top)/r.height-.5)*.24;request();};
  const reset=()=>{px=py=0;request();};
  const loss=(event:Event)=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;host.dataset.render='2d';status('3D 顯示已中斷，保留 2D；切換 2D／3D 可重試。');};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;}});observer.observe(mount);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(mount);
  host.addEventListener('seedphase',onPhase);mount.addEventListener('pointermove',pointer,{passive:true});mount.addEventListener('pointerleave',reset);canvas.addEventListener('webglcontextlost',loss);document.addEventListener('visibilitychange',request);
  resize();status('3D 試作：拖動下方控制，觀察鱗片展開。');
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();host.removeEventListener('seedphase',onPhase);mount.removeEventListener('pointermove',pointer);mount.removeEventListener('pointerleave',reset);canvas.removeEventListener('webglcontextlost',loss);document.removeEventListener('visibilitychange',request);geometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();host.dataset.render='2d';};
}
