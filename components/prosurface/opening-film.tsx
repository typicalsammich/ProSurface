"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** The actual hero photograph is the last frame of the film, then lands in its page frame. */
export function OpeningSequence({renderScene}:{renderScene:(complete:()=>void)=>ReactNode}) {
  const [show,setShow]=useState(false);
  const [phase,setPhase]=useState<"scene"|"photo"|"landing">("scene");
  const close=useRef<HTMLButtonElement>(null);
  const photo=useRef<HTMLDivElement>(null);
  const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishing=useRef(false);
  const animation=useRef<Animation|null>(null);
  const dismiss=useCallback(()=>{
    timers.current.forEach(clearTimeout);timers.current=[];
    animation.current?.cancel();
    setShow(false);setPhase("scene");finishing.current=false;
    document.documentElement.classList.remove("intro-playing");
    try{sessionStorage.setItem("prosurface-film-seen","yes")}catch{}
  },[]);
  const finish=useCallback(()=>{
    if(finishing.current)return;
    finishing.current=true;
    setPhase("photo");
    timers.current.push(setTimeout(()=>{
      const target=document.querySelector<HTMLElement>(".hero-image");
      const bounds=target?.getBoundingClientRect();
      if(!bounds||!photo.current){dismiss();return}
      setPhase("landing");
      animation.current=photo.current.animate([
        {top:"0px",left:"0px",width:`${innerWidth}px`,height:`${innerHeight}px`,borderRadius:"0px"},
        {top:`${bounds.top}px`,left:`${bounds.left}px`,width:`${bounds.width}px`,height:`${bounds.height}px`,borderRadius:"3px"}
      ],{duration:1100,easing:"cubic-bezier(.22,.72,.18,1)",fill:"forwards"});
      animation.current.finished.then(dismiss).catch(()=>{});
    },700));
  },[dismiss]);
  useEffect(()=>{
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen=false;try{seen=!!sessionStorage.getItem("prosurface-film-seen")}catch{}
    if(!seen&&!reduced)setShow(true);
    const replay=()=>{finishing.current=false;setPhase("scene");setShow(true)};
    window.addEventListener("prosurface:replay",replay);
    return()=>{window.removeEventListener("prosurface:replay",replay);timers.current.forEach(clearTimeout);animation.current?.cancel();document.documentElement.classList.remove("intro-playing")};
  },[]);
  useEffect(()=>{
    if(!show)return;
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    document.documentElement.classList.add("intro-playing");
    window.scrollTo({top:0,behavior:"instant"});
    document.body.style.overflow="hidden";
    const main=document.getElementById("top");main?.setAttribute("inert","");
    close.current?.focus({preventScroll:true});
    const key=(event:KeyboardEvent)=>{if(event.key==="Escape")dismiss();if(event.key==="Tab"){event.preventDefault();close.current?.focus()}};
    const resized=()=>{if(finishing.current)dismiss()};
    window.addEventListener("keydown",key);window.addEventListener("resize",resized);
    const timeout=setTimeout(dismiss,16000);
    return()=>{clearTimeout(timeout);document.body.style.overflow=overflow;main?.removeAttribute("inert");window.removeEventListener("keydown",key);window.removeEventListener("resize",resized);previous?.focus({preventScroll:true})};
  },[show,dismiss]);
  if(!show)return null;
  return <div className={`opening-film is-${phase}`} role="dialog" aria-modal="true" aria-label="Welcome to ProSurface">
    <div className="film-scene">{renderScene(finish)}<div className="film-vignette"/></div>
    <div ref={photo} className="film-photo"><img src="/images/blue-court.jpg" alt="" width="590" height="332"/><div className="image-shade"/></div>
    <div className="film-top"><span>PROSURFACE <small>PERFORMANCE COURTS</small></span><button ref={close} onClick={dismiss}>Skip intro <ArrowUpRight size={17}/></button></div>
    <div className="film-caption"><span>BUILT AROUND YOU.</span><h2>Welcome to<br/><em>your home court.</em></h2></div>
    <div className="film-footer"><span>THE PROSURFACE EXPERIENCE</span><div className="film-progress"/><span>DFW & BEYOND</span></div>
  </div>;
}
