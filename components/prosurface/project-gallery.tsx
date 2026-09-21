"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, Minimize2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const collection = [
  {name:"A home-court advantage.",type:"BASKETBALL + PICKLEBALL",image:"blue-court.jpg",description:"Bold blues. Clean lines. Two ways to play in one dedicated space.",mood:"THE SIGNATURE",detail:"Room for a rivalry. Space for everyone.",colors:["#1045ab","#058fce","#8e999d"]},
  {name:"Your own kind of courtside.",type:"RESIDENTIAL MULTI-SPORT",image:"woodland-court.jpg",description:"Earth-toned surfacing brings basketball and pickleball into a wooded backyard setting.",mood:"THE RETREAT",detail:"A place to play. A reason to stay outside.",colors:["#28583e","#bc7450","#b5a286"]},
  {name:"Made to stand out.",type:"COVERED BASKETBALL",image:"gold-court.jpg",description:"A striking purple-and-gold court gives this covered play space its own identity.",mood:"THE STATEMENT",detail:"Your colors. Your unmistakable identity.",colors:["#35213f","#e1ab23","#f6edd2"]},
  {name:"A different kind of runway.",type:"SPECIALTY COATINGS / HANGAR",image:"hangar.jpg",description:"A red, black, and gray specialty floor finish brings a bold visual rhythm to this aircraft hangar.",mood:"THE ARRIVAL",detail:"Exceptional spaces start underfoot.",colors:["#db2028","#25292b","#b8bfbd"]},
  {name:"Light. Space. Possibility.",type:"RESIDENTIAL SPECIALTY COATING",image:"after.jpg",description:"A glossy, light-colored coating transforms the feel of this bright residential interior.",mood:"THE TRANSFORMATION",detail:"The same room. An entirely new feeling.",colors:["#e8e9e5","#d0c5ae","#a28761"]},
];

export function ProjectGallery({index,onIndexChange,onInquiry,restoreFocus}:{index:number|null;onIndexChange:(index:number|null)=>void;onInquiry:()=>void;restoreFocus:()=>void}){
  const [immersive,setImmersive]=useState(false);
  const start=useRef<{x:number;y:number}|null>(null);
  const item=index===null?null:collection[index];
  const change=(step:number)=>{if(index!==null)onIndexChange((index+step+collection.length)%collection.length)};
  useEffect(()=>{
    if(index===null){setImmersive(false);return}
    const adjacent=new Image();adjacent.src=`/images/${collection[(index+1)%collection.length].image}`;
  },[index]);
  return <Dialog open={index!==null} onOpenChange={open=>{if(!open)onIndexChange(null)}}><DialogContent className={`collection-dialog ${immersive?"collection-immersive":""}`} onCloseAutoFocus={event=>{event.preventDefault();restoreFocus()}} onKeyDown={event=>{
    if((event.target as HTMLElement).closest("input,textarea"))return;
    if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();change(event.key==="ArrowRight"?1:-1)}
  }}>{item&&<>
    <div className="collection-topbar"><span>PROSURFACE <i>/</i> SELECTED SPACES</span><button onClick={()=>setImmersive(!immersive)} aria-label={immersive?"Show project details":"Expand project photograph"}>{immersive?<Minimize2 size={17}/>:<Expand size={17}/>}</button></div>
    <div className="collection-stage" onPointerDown={e=>{if((e.target as Element).closest("button"))return;if(e.button===0){start.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}}} onPointerUp={e=>{if(start.current){const dx=e.clientX-start.current.x,dy=e.clientY-start.current.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3)change(dx<0?1:-1)}start.current=null}} onPointerCancel={()=>{start.current=null}}>
      <img key={item.image} src={`/images/${item.image}`} width="590" height={index===0?332:443} alt={item.description} draggable={false}/>
      <span className="collection-stage-tag">{item.mood}</span>
      <div className="collection-navigation"><button aria-label="Previous project" onClick={()=>change(-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{String((index??0)+1).padStart(2,"0")} <i>/</i> {String(collection.length).padStart(2,"0")}</span><button aria-label="Next project" onClick={()=>change(1)}><ArrowRight size={20}/></button></div>
    </div>
    <div className="collection-story" key={item.name}><span className="eyebrow">{item.type}</span><DialogTitle>{item.name}</DialogTitle><DialogDescription>{item.description}</DialogDescription><div className="collection-materials"><span>THE COLOR STORY</span><div>{item.colors.map(color=><i key={color} style={{background:color}}/>)}</div></div><p className="collection-note">{item.detail}</p><button className="button blue" onClick={onInquiry}>Start something like this <ArrowUpRight size={18}/></button></div>
    <div className="collection-bottom"><span>A CLOSER LOOK <small>Swipe or use the arrow keys</small></span><div className="collection-thumbnails" aria-label="Choose a project">{collection.map((project,i)=><button key={project.image} className={index===i?"active":""} aria-label={`View ${project.name}`} aria-current={index===i?"true":undefined} onClick={()=>onIndexChange(i)}><img src={`/images/${project.image}`} alt="" width="100" height="70"/><span>{project.mood.replace("THE ","")}</span></button>)}</div></div>
  </>}</DialogContent></Dialog>
}
