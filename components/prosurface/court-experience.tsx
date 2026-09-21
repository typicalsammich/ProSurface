"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, RotateCcw, X, Play, Move } from "lucide-react";
import type * as THREE from "three";
import { OpeningSequence } from "./opening-film";
import { SmoothNavigation } from "./smooth-navigation";

type Palette = { name: string; base: string; key: string; surround: string };
type SceneAPI = { enter: () => void; reset: () => void; update: (palette: Palette, sport: string) => void };
const blue: Palette = { name: "Pro blue", base: "#1045ab", key: "#058fce", surround: "#8e999d" };

function CourtScene({palette, sport, cinematic=false, onComplete, onView, apiRef}: {palette:Palette;sport:string;cinematic?:boolean;onComplete?:()=>void;onView?:(view:boolean)=>void;apiRef?:React.RefObject<SceneAPI|null>}) {
 const host=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);const [ready,setReady]=useState(false);
 const latest=useRef({palette,sport,onComplete,onView});latest.current={palette,sport,onComplete,onView};
 useEffect(()=>{
  let dispose=()=>{};let cancelled=false;
  async function setup(){
   const T=await import("three");const {OrbitControls}=await import("three/addons/controls/OrbitControls.js");const {Sky}=await import("three/addons/objects/Sky.js");
   if(cancelled||!host.current)return;
   const root=host.current;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
   let renderer:THREE.WebGLRenderer;
   try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"})}catch{setFailed(true);latest.current.onComplete?.();return}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
   const canvas=renderer.domElement;canvas.setAttribute("aria-label","Interactive 3D court. Click or press Enter to step onto the court. Drag to look around. Escape returns to aerial view.");canvas.tabIndex=cinematic?-1:0;root.appendChild(canvas);
   const scene=new T.Scene();scene.background=new T.Color("#afcee0");scene.fog=new T.Fog("#bbd1d0",75,210);const sky=new Sky();sky.scale.setScalar(450);sky.material.uniforms.turbidity.value=3;sky.material.uniforms.rayleigh.value=1.5;sky.material.uniforms.mieCoefficient.value=.004;sky.material.uniforms.sunPosition.value.set(-14,27,12);sky.material.uniforms.cloudCoverage.value=.32;sky.material.uniforms.cloudDensity.value=.3;scene.add(sky);
   const camera=new T.PerspectiveCamera(43,1,.1,500);camera.position.set(27,29,34);
   const controls=new OrbitControls(camera,canvas);controls.target.set(0,0,0);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI/2.25;controls.autoRotate=!reduced;controls.autoRotateSpeed=.23;controls.enabled=!cinematic;
   scene.add(new T.HemisphereLight(0xd4e8ff,0x506d38,1.8));const sun=new T.DirectionalLight(0xffeccb,2.7);sun.position.set(-14,27,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-28;sun.shadow.camera.right=28;sun.shadow.camera.top=28;sun.shadow.camera.bottom=-28;sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun);
   const cool=new T.DirectionalLight(0xb8d6ef,.65);cool.position.set(20,14,-24);scene.add(cool);
   const mat=(color:string,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
   const mesh=(geo:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0,parent:THREE.Object3D=scene)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
   const box=(w:number,h:number,d:number,material:THREE.Material,x=0,y=0,z=0,parent:THREE.Object3D=scene)=>mesh(new T.BoxGeometry(w,h,d),material,x,y,z,parent);
   const metal=mat("#252f32",.38), white=mat("#edf1e9",.48), concrete=mat("#536062"), grass=mat("#34483b");
   
   // Seeded lawn aggregate and fine blades avoid remote textures and remain crisp at eye height.
   let landscapeSeed=721;const random=()=>{landscapeSeed=(landscapeSeed*16807)%2147483647;return landscapeSeed/2147483647};
   const lawnCanvas=document.createElement("canvas");lawnCanvas.width=lawnCanvas.height=1024;const lawnContext=lawnCanvas.getContext("2d")!;lawnContext.fillStyle="#657b40";lawnContext.fillRect(0,0,1024,1024);
   for(let i=0;i<85000;i++){const x=random()*1024,y=random()*1024;const shade=Math.floor(random()*35);lawnContext.strokeStyle=`rgb(${66+shade},${85+shade},${31+shade*.6})`;lawnContext.lineWidth=.6+random();lawnContext.beginPath();lawnContext.moveTo(x,y);lawnContext.lineTo(x+(random()-.5)*5,y-3-random()*6);lawnContext.stroke()}
   const lawnTexture=new T.CanvasTexture(lawnCanvas);lawnTexture.colorSpace=T.SRGBColorSpace;lawnTexture.wrapS=lawnTexture.wrapT=T.RepeatWrapping;lawnTexture.repeat.set(35,35);lawnTexture.anisotropy=8;
   const lawn=new T.MeshStandardMaterial({map:lawnTexture,roughness:1});box(300,.2,300,lawn,0,-.25,0);box(19.2,.25,32.2,concrete,0,.02,0);
   const pathCanvas=document.createElement("canvas");pathCanvas.width=pathCanvas.height=256;const pc=pathCanvas.getContext("2d")!;pc.fillStyle="#b7b2a0";pc.fillRect(0,0,256,256);for(let i=0;i<9500;i++){const shade=140+Math.floor(random()*65);pc.fillStyle=`rgb(${shade},${shade-4},${shade-13})`;pc.fillRect(random()*256,random()*256,1+random()*2,1+random()*2)}
   const pathTexture=new T.CanvasTexture(pathCanvas);pathTexture.colorSpace=T.SRGBColorSpace;pathTexture.wrapS=pathTexture.wrapT=T.RepeatWrapping;pathTexture.repeat.set(4,14);pathTexture.anisotropy=4;
   const walkway=new T.MeshStandardMaterial({map:pathTexture,roughness:.98});
   for(const x of [-12.5,12.5])box(2.6,.12,43,walkway,x,-.11,0);
   for(const z of [-20.2,20.2])box(27.6,.12,2.6,walkway,0,-.11,z);
   box(2.6,.12,44,walkway,0,-.11,42);box(2.6,.12,5,walkway,0,-.1,17.9);
   const curb=mat("#a09c8c");for(const x of [-14,14])box(.13,.15,43,curb,x,-.08,0);
   // Shared instanced blades add depth around the paths for a modest mobile draw cost.
   const bladeGeometry=new T.BufferGeometry();bladeGeometry.setAttribute("position",new T.Float32BufferAttribute([-.025,0,0,.025,0,0,.02,.22,.015],3));bladeGeometry.computeVertexNormals();
   const blades=new T.InstancedMesh(bladeGeometry,new T.MeshStandardMaterial({color:0x73834b,roughness:1,side:T.DoubleSide}),11000);const dummy=new T.Object3D();let bladeCount=0;
   while(bladeCount<11000){const x=(random()-.5)*100,z=(random()-.5)*100;if(Math.abs(x)<14.3&&Math.abs(z)<22||Math.abs(x)<1.6&&z>18)continue;dummy.position.set(x,-.14,z);dummy.rotation.y=random()*Math.PI;dummy.scale.setScalar(.45+random());dummy.updateMatrix();blades.setMatrixAt(bladeCount,dummy.matrix);blades.setColorAt(bladeCount,new T.Color().setHSL(.20+random()*.045,.28+random()*.2,.22+random()*.13));bladeCount++}blades.instanceMatrix.needsUpdate=true;blades.receiveShadow=true;scene.add(blades);
   // Low planting beds, path bollards and park furniture give the court a lived-in setting.
   for(const x of [-16,16])for(const z of [-18,15]){box(2.1,.18,4,mat("#655944"),x,-.03,z);for(let j=0;j<5;j++){const shrub=mesh(new T.IcosahedronGeometry(.45+random()*.2,1),mat(j%2?"#596e38":"#7c8547"),x+(random()-.5)*1.1,.25,z-1.4+j*.65);shrub.scale.y=.6}}
   for(const x of [-14.4,14.4])for(const z of [-19,-4,19]){box(.12,.85,.12,metal,x,.28,z);box(.15,.07,.15,white,x,.68,z)}
   for(const x of [-11.4,11.4]){const bin=mesh(new T.CylinderGeometry(.28,.25,.85,16),metal,x,.3,15);box(.65,.08,.65,metal,x,.78,15)}

   const surfaceCanvas=document.createElement("canvas");surfaceCanvas.width=1536;surfaceCanvas.height=2560;const ctx=surfaceCanvas.getContext("2d")!;
   const texture=new T.CanvasTexture(surfaceCanvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   const surface=mesh(new T.PlaneGeometry(18.6,31.6),new T.MeshStandardMaterial({map:texture,roughness:.92}),0,.158,0);surface.rotation.x=-Math.PI/2;surface.castShadow=false;
   const basketball=new T.Group();scene.add(basketball);const pickleball=new T.Group();scene.add(pickleball);
   function line(points:THREE.Vector3[],color=0xf0f2ed,parent:THREE.Object3D=scene){const g=new T.BufferGeometry().setFromPoints(points);const l=new T.Line(g,new T.LineBasicMaterial({color,transparent:true,opacity:.76}));parent.add(l);return l}
   function pole(a:THREE.Vector3,b:THREE.Vector3,r:number,material:THREE.Material,parent:THREE.Object3D=scene){const direction=new T.Vector3().subVectors(b,a);const m=mesh(new T.CylinderGeometry(r,r,direction.length(),8),material,0,0,0,parent);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return m}
   for(const sign of [-1,1]){
    const group=new T.Group();group.position.z=sign*13.9;if(sign===1)group.rotation.y=Math.PI;basketball.add(group);
    box(.55,.18,.95,metal,0,.25,-.6,group);pole(new T.Vector3(0,.28,-.7),new T.Vector3(0,3.5,-.7),.115,metal,group);pole(new T.Vector3(0,3.4,-.7),new T.Vector3(0,3.45,.65),.08,metal,group);
    const board=box(1.83,1.07,.065,new T.MeshPhysicalMaterial({color:0xe3f0f7,transparent:true,opacity:.32,roughness:.15,metalness:.15}),0,3.65,.68,group);
    const edge=new T.LineSegments(new T.EdgesGeometry(board.geometry),new T.LineBasicMaterial({color:0xf7ffff}));edge.position.copy(board.position);group.add(edge);
    line([new T.Vector3(-.29,3.4,.724),new T.Vector3(-.29,3.85,.724),new T.Vector3(.29,3.85,.724),new T.Vector3(.29,3.4,.724),new T.Vector3(-.29,3.4,.724)],0xffffff,group);
    const rim=mesh(new T.TorusGeometry(.235,.023,8,36),mat("#f15d30",.4),0,3.21,.96,group);rim.rotation.x=Math.PI/2;
    for(let i=0;i<12;i++){const a=i*Math.PI/6;line([new T.Vector3(Math.cos(a)*.235,3.2,.96+Math.sin(a)*.235),new T.Vector3(Math.cos(a+.32)*.14,2.82,.96+Math.sin(a+.32)*.14)],0xf1eee5,group)}
    for(let j=0;j<3;j++){const points=[];for(let i=0;i<=36;i++){const a=i*Math.PI/18;const r=.23-j*.036;points.push(new T.Vector3(Math.cos(a)*r,3.17-j*.12,.96+Math.sin(a)*r))}line(points,0xe7e6dd,group)}
    box(.38,1.7,.25,mat("#123e91"),0,1.02,-.66,group);
   }
   const netCanvas=document.createElement("canvas");netCanvas.width=128;netCanvas.height=64;const nc=netCanvas.getContext("2d")!;nc.strokeStyle="#b9c7c1";nc.lineWidth=1;for(let x=0;x<128;x+=8){nc.beginPath();nc.moveTo(x,0);nc.lineTo(x,64);nc.stroke()}for(let y=0;y<64;y+=8){nc.beginPath();nc.moveTo(0,y);nc.lineTo(128,y);nc.stroke()}
   const netTex=new T.CanvasTexture(netCanvas);netTex.wrapS=netTex.wrapT=T.RepeatWrapping;netTex.repeat.set(6,1);
   const net=mesh(new T.PlaneGeometry(6.8,.86),new T.MeshStandardMaterial({map:netTex,transparent:true,side:T.DoubleSide,alphaTest:.1}),0,.64,0,pickleball);net.castShadow=false;
   box(6.9,.045,.04,white,0,1.07,0,pickleball);for(const x of [-3.45,3.45]){pole(new T.Vector3(x,.17,0),new T.Vector3(x,1.12,0),.045,metal,pickleball);box(.15,.06,.75,metal,x,.2,0,pickleball)}
   // A thin perimeter fence provides scale without enclosing the camera path.
   const fenceMat=new T.MeshStandardMaterial({map:netTex,transparent:true,opacity:.35,side:T.DoubleSide,depthWrite:false});
   for(const x of [-10.2,10.2]){const panel=mesh(new T.PlaneGeometry(32,2.1),fenceMat,x,1.15,0);panel.rotation.y=Math.PI/2;panel.castShadow=false;for(let z=-16;z<=16;z+=4)pole(new T.Vector3(x,.1,z),new T.Vector3(x,2.25,z),.04,metal);pole(new T.Vector3(x,2.25,-16),new T.Vector3(x,2.25,16),.035,metal)}
   for(const z of [-17,17]){for(const sign of [-1,1]){const panel=mesh(new T.PlaneGeometry(9,2.1),fenceMat,sign*5.7,1.15,z);panel.castShadow=false;pole(new T.Vector3(sign*1.2,2.25,z),new T.Vector3(sign*10.2,2.25,z),.035,metal);for(const x of [1.2,5.7,10.2])pole(new T.Vector3(sign*x,0,z),new T.Vector3(sign*x,2.25,z),.04,metal)}}
   const wood=mat("#91795c");for(const z of [-7,7]){for(let i=0;i<4;i++)box(.105,.08,2.5,wood,11.3+i*.13,.65,z);for(const dz of [-.8,.8])box(.6,.5,.08,metal,11.5,.38,z+dz)}
   const lamp=new T.MeshStandardMaterial({color:0xeaf3ff,emissive:0xd6e5ff,emissiveIntensity:2});for(const x of [-10,10])for(const z of [-12,12]){pole(new T.Vector3(x,0,z),new T.Vector3(x,6.5,z),.085,metal);const head=box(.8,.14,.35,metal,x,6.5,z);head.rotation.z=x<0?-.18:.18;box(.65,.04,.27,lamp,x,6.42,z)}
   // Photographic alpha foliage keeps natural leaf and bark detail at player height.
   const treeTexture=new T.TextureLoader().load("/images/live-oak.png");treeTexture.colorSpace=T.SRGBColorSpace;treeTexture.anisotropy=4;
   const treeMaterial=new T.MeshStandardMaterial({map:treeTexture,alphaTest:.35,side:T.DoubleSide,roughness:1,emissiveMap:treeTexture,emissive:0xffffff,emissiveIntensity:.24});
   const trees:THREE.Mesh[]=[];
   const treePositions=[[-19,-26],[-20,-13],[-21,0],[-20,13],[-20,27],[20,-27],[21,-13],[22,1],[21,15],[-9,-29],[3,-30],[12,-31],[-32,-38],[-17,-45],[1,-43],[21,-46],[36,-34],[-35,-18],[-40,0],[-35,19],[-28,37],[35,-13],[39,4],[35,25],[22,39],[-7,45],[12,51]];
   treePositions.forEach(([x,z],i)=>{const height=10+(i%4)*.85;const tree=mesh(new T.PlaneGeometry(height*1.09,height),treeMaterial,x,height/2-.5,z);tree.receiveShadow=false;if(i%2)tree.scale.x=-1;trees.push(tree)});
   const logoTexture=new T.TextureLoader().load("/images/logo-transparent.png");logoTexture.colorSpace=T.SRGBColorSpace;
   const logoMaterial=new T.MeshBasicMaterial({map:logoTexture,transparent:true,opacity:0,depthWrite:false,toneMapped:false});
   // A white ink treatment keeps the transparent brand mark legible on blue surfacing.
   logoMaterial.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace("#include <map_fragment>","#include <map_fragment>\ndiffuseColor.rgb = vec3(1.0);")};
   const logo=mesh(new T.PlaneGeometry(8,4.07),logoMaterial,0,.2,0);logo.rotation.x=-Math.PI/2;logo.castShadow=false;logo.renderOrder=5;
   function draw(p:Palette,s:string){
    const W=1536,H=2560,X=(v:number)=>(v+9.3)/18.6*W,Y=(v:number)=>(v+15.8)/31.6*H;
    ctx.fillStyle=p.surround;ctx.fillRect(0,0,W,H);ctx.fillStyle=p.base;ctx.fillRect(X(-7.5),Y(-14),X(7.5)-X(-7.5),Y(14)-Y(-14));
    const rect=(x:number,z:number,w:number,h:number,fill?:string)=>{if(fill){ctx.fillStyle=fill;ctx.fillRect(X(x),Y(z),w/18.6*W,h/31.6*H)}else ctx.strokeRect(X(x),Y(z),w/18.6*W,h/31.6*H)};
    const path=(pts:number[][])=>{ctx.beginPath();pts.forEach(([x,z],i)=>i?ctx.lineTo(X(x),Y(z)):ctx.moveTo(X(x),Y(z)));ctx.stroke()};
    const arc=(x:number,z:number,r:number,a=0,b=Math.PI*2)=>{ctx.beginPath();ctx.ellipse(X(x),Y(z),r/18.6*W,r/31.6*H,0,a,b);ctx.stroke()};
    ctx.strokeStyle="#f3f4eb";ctx.lineWidth=5;rect(-7.5,-14,15,28);
    if(s!=="Pickleball"){
     rect(-2.45,-14,4.9,5.8,p.key);rect(-2.45,8.2,4.9,5.8,p.key);ctx.strokeStyle="#f3f4eb";rect(-2.45,-14,4.9,5.8);rect(-2.45,8.2,4.9,5.8);path([[-7.5,0],[7.5,0]]);arc(0,0,1.8);arc(0,-8.2,1.8,0,Math.PI);arc(0,8.2,1.8,Math.PI,Math.PI*2);
     // Three-point arcs and baseline corner segments.
     arc(0,-12.42,6.75,.36,Math.PI-.36);path([[-6.32,-14],[-6.32,-10.05]]);path([[6.32,-14],[6.32,-10.05]]);arc(0,12.42,6.75,Math.PI+.36,Math.PI*2-.36);path([[-6.32,14],[-6.32,10.05]]);path([[6.32,14],[6.32,10.05]]);
    }
    if(s!=="Basketball"){if(s==="Pickleball"){rect(-3.05,-6.7,6.1,13.4,p.key);rect(-3.05,-2.13,6.1,4.26,p.base)}ctx.strokeStyle=s==="Multi-sport"?"#cee9bd":"#ffffff";ctx.lineWidth=4;rect(-3.05,-6.7,6.1,13.4);path([[-3.05,-2.13],[3.05,-2.13]]);path([[-3.05,2.13],[3.05,2.13]]);path([[0,-6.7],[0,-2.13]]);path([[0,2.13],[0,6.7]])}
    // Fine aggregate: deterministic surface grain, avoiding shimmering geometry.
    let seed=19;ctx.globalAlpha=.035;for(let i=0;i<22000;i++){seed=(seed*16807)%2147483647;const x=seed%W;seed=(seed*16807)%2147483647;ctx.fillStyle=i%2?"#fff":"#000";ctx.fillRect(x,seed%H,2,2)}ctx.globalAlpha=1;
    texture.needsUpdate=true;basketball.visible=s!=="Pickleball";pickleball.visible=s!=="Basketball";
   }
   draw(latest.current.palette,latest.current.sport);
   const aerial=new T.Vector3(27,29,34);const eye=new T.Vector3(0,1.87,10.8);const center=new T.Vector3(0,0,0);const eyeTarget=new T.Vector3(0,2,-12);
   // The introduction and court entry use this exact camera spline and easing.
   const flight=new T.CatmullRomCurve3([aerial,new T.Vector3(19,19,27),new T.Vector3(5,6,18),eye]);
   const aerialFilm=new T.CatmullRomCurve3([new T.Vector3(13,34,28),new T.Vector3(5,29,21),new T.Vector3(0,25,16)]);const overhead=new T.PerspectiveCamera();overhead.position.set(0,40,.001);overhead.up.set(1,0,0);overhead.lookAt(0,0,0);const filmStartQuaternion=new T.Quaternion();
   let mode:"orbit"|"enter"|"eye"|"reset"|"intro"=cinematic?"intro":"orbit";
   let started=performance.now(), introEnd=false;let firstFrame=true;let yaw=0,pitch=0;let pointerStart={x:0,y:0},last={x:0,y:0},dragging=false,moved=false;let from=aerial.clone();let fromTarget=center.clone();
   function enter(){if(mode!=="orbit")return;controls.enabled=false;controls.autoRotate=false;from.copy(camera.position);flight.points[0].copy(from);started=performance.now();mode="enter";latest.current.onView?.(true)}
   function reset(){if(mode==="intro"){finish();return}if(mode==="orbit")return;from.copy(camera.position);fromTarget.copy(eyeTarget);mode="reset";started=performance.now();latest.current.onView?.(false)}
   function finish(){if(introEnd)return;introEnd=true;latest.current.onComplete?.()}
   const api={enter,reset,update:draw};if(apiRef)apiRef.current=api;
   const resize=()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<600?57:43;camera.updateProjectionMatrix()};const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(root);resize();
   function down(e:PointerEvent){pointerStart={x:e.clientX,y:e.clientY};last=pointerStart;dragging=true;moved=false}
   function move(e:PointerEvent){if(!dragging)return;if(Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>6)moved=true;if(mode==="eye"){yaw-=(e.clientX-last.x)*.004;pitch=Math.max(-.7,Math.min(.7,pitch+(e.clientY-last.y)*.003));}last={x:e.clientX,y:e.clientY}}
   function up(){if(dragging&&!moved&&!cinematic&&mode==="orbit")enter();dragging=false}
   function key(e:KeyboardEvent){if(e.key==="Enter"||e.key===" "){e.preventDefault();enter()}if(e.key==="Escape")reset();if(mode==="eye"&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();yaw+=e.key==="ArrowLeft"?.12:e.key==="ArrowRight"?-.12:0;pitch=Math.max(-.7,Math.min(.7,pitch+(e.key==="ArrowUp"?-.08:e.key==="ArrowDown"?.08:0)))}}
   canvas.addEventListener("pointerdown",down);window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);canvas.addEventListener("keydown",key);
   const lost=(e:Event)=>{e.preventDefault();setFailed(true);finish()};canvas.addEventListener("webglcontextlost",lost);
   let visible=true;const visibility=new IntersectionObserver(e=>{visible=e[0].isIntersecting},{rootMargin:"100px"});visibility.observe(root);
   const ease=(t:number)=>t*t*t*(t*(t*6-15)+10);const target=new T.Vector3();let lastTime=performance.now();
   renderer.setAnimationLoop((now:number)=>{
    if(document.hidden||(!visible&&!cinematic))return;const delta=Math.min((now-lastTime)/1000,.1);lastTime=now;
    if(mode==="intro"||mode==="enter"){
     const seconds=Math.max(0,(now-started)/1000);const t=Math.min(1,seconds/(mode==="intro"?4.8:2.6));const progress=reduced?1:ease(t);if(mode==="intro"){const approach=reduced?1:ease(Math.min(1,seconds/3.7));camera.position.copy(aerialFilm.getPoint(approach));camera.lookAt(0,0,0);if(seconds>5.2){const turn=ease(Math.min(1,(seconds-5.2)/1.9));filmStartQuaternion.copy(camera.quaternion);const height=camera.aspect<1?47:36;camera.position.lerp(new T.Vector3(0,height,.001),turn);camera.quaternion.slerpQuaternions(filmStartQuaternion,overhead.quaternion,turn)}}else{camera.position.copy(flight.getPoint(progress));target.lerpVectors(center,eyeTarget,progress);camera.lookAt(target)}
     if(mode==="intro"){logoMaterial.opacity=Math.max(0,Math.min(1,(seconds-.55)/1.05))*Math.max(0,Math.min(1,(5.6-seconds)/.8));if(seconds>7.2)finish()}
     else if(t>=1||reduced){mode="eye";yaw=0;pitch=0}
    }else if(mode==="eye"){camera.position.copy(eye);camera.lookAt(eye.x+Math.sin(yaw)*20,eye.y-Math.sin(pitch)*20,eye.z-Math.cos(yaw)*20)}
    else if(mode==="reset"){const t=reduced?1:Math.max(0,Math.min(1,(now-started)/1800));camera.position.lerpVectors(from,aerial,ease(t));target.lerpVectors(fromTarget,center,ease(t));camera.lookAt(target);if(t>=1){mode="orbit";controls.target.copy(center);controls.enabled=true;controls.autoRotate=!reduced;controls.update()}}
    else controls.update(delta);
    sky.material.uniforms.time.value=now*.000015;trees.forEach(tree=>{tree.rotation.y=Math.atan2(camera.position.x-tree.position.x,camera.position.z-tree.position.z)});root.dataset.cameraMode=mode;root.dataset.filmPhase=mode==="intro"?(now-started>2500&&now-started<4800?"logo":"flight"):"none";renderer.render(scene,camera);if(firstFrame){firstFrame=false;setReady(true);started=now}
   });
   dispose=()=>{renderer.setAnimationLoop(null);sizeObserver.disconnect();visibility.disconnect();controls.dispose();canvas.removeEventListener("pointerdown",down);window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);canvas.removeEventListener("keydown",key);canvas.removeEventListener("webglcontextlost",lost);const textures=new Set<THREE.Texture>();const materials=new Set<THREE.Material>();scene.traverse(o=>{const m=o as THREE.Mesh;m.geometry?.dispose();if(m.material){for(const material of Array.isArray(m.material)?m.material:[m.material])materials.add(material)}});materials.forEach(m=>{for(const val of Object.values(m))if(val instanceof T.Texture)textures.add(val);m.dispose()});textures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();if(apiRef)apiRef.current=null};
  }
  setup().catch(()=>{if(!cancelled){setFailed(true);latest.current.onComplete?.()}});
  return()=>{cancelled=true;dispose()};
 },[cinematic,apiRef]);
 useEffect(()=>{apiRef?.current?.update(palette,sport)},[palette,sport,apiRef]);
 return <div ref={host} className={`three-host ${ready?"is-ready":""}`} data-render-state={failed?"fallback":ready?"ready":"loading"}>{!ready&&!failed&&<div className="scene-loading"><span/><p>Preparing your court</p></div>}{failed&&<div className="scene-fallback"><img src="/images/blue-court.jpg" alt="ProSurface multi-sport court"/><p>3D isn’t available on this device. Explore your colors below.</p></div>}</div>
}

export function CourtStudio({palette,sport}:{palette:Palette;sport:string}){
 const api=useRef<SceneAPI|null>(null);const [inside,setInside]=useState(false);
 return <div className={`court-studio ${inside?"inside":""}`} onKeyDown={e=>{if(e.key==="Escape")api.current?.reset()}}><div className="scene-topline"><span><i/> COURT STUDIO</span><span>LIVE 3D / {palette.name.toUpperCase()}</span></div><CourtScene palette={palette} sport={sport} apiRef={api} onView={setInside}/><div className="scene-bottomline"><div><strong>{inside?"THIS IS YOUR HOME COURT.":"A DIFFERENT PERSPECTIVE."}</strong><span>{inside?"Drag to look around · Arrow keys work too":"Drag to orbit · Click the court to step inside"}</span></div><button onClick={()=>inside?api.current?.reset():api.current?.enter()} className="scene-enter">{inside?<RotateCcw size={16}/>:<Maximize2 size={16}/>}<span>{inside?"Aerial view":"Step onto the court"}</span></button></div>{inside&&<button className="scene-exit" aria-label="Return to aerial view" onClick={()=>api.current?.reset()}><X size={18}/></button>}<span className="scene-view-label" aria-live="polite">{inside?"PLAYER PERSPECTIVE · 1.7 M":"AERIAL PERSPECTIVE · DRAG TO EXPLORE"}</span></div>
}

export function OpeningFilm(){return <OpeningSequence renderScene={complete=><CourtScene palette={blue} sport="Basketball" cinematic onComplete={complete}/>}/>}

export function ReplayFilm(){return <button className="replay-film" onClick={()=>window.dispatchEvent(new Event("prosurface:replay"))}><Play size={14}/> Replay the experience</button>}

export function PremiumMotion(){
 const cursor=useRef<HTMLDivElement>(null);const progress=useRef<HTMLDivElement>(null);
 useEffect(()=>{const fine=matchMedia("(pointer: fine)").matches&&!matchMedia("(prefers-reduced-motion: reduce)").matches;let frame=0;let x=-100,y=-100,rx=-100,ry=-100;const ring=cursor.current;const move=(e:PointerEvent)=>{x=e.clientX;y=e.clientY;const target=e.target as Element;ring?.classList.toggle("cursor-active",!!target.closest("a,button,summary,[role=radio],[role=slider],canvas"));ring?.classList.add("cursor-visible")};const leave=()=>ring?.classList.remove("cursor-visible");const scroll=()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.current?.style.setProperty("--progress",String(total>0?scrollY/total:0))};const tick=()=>{rx+=(x-rx)*.2;ry+=(y-ry)*.2;if(ring)ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;frame=requestAnimationFrame(tick)};if(fine){document.addEventListener("pointermove",move);document.addEventListener("pointerleave",leave);frame=requestAnimationFrame(tick)}window.addEventListener("scroll",scroll,{passive:true});scroll();return()=>{cancelAnimationFrame(frame);document.removeEventListener("pointermove",move);document.removeEventListener("pointerleave",leave);window.removeEventListener("scroll",scroll)}},[]);
 return <><SmoothNavigation/><div ref={cursor} className="premium-cursor" aria-hidden="true"/><div ref={progress} className="reading-progress" aria-hidden="true"/></>
}
