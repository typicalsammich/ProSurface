"use client";
import { useEffect } from "react";

export function SmoothNavigation(){
  useEffect(()=>{
    let frame=0;
    const cancel=()=>{cancelAnimationFrame(frame);document.documentElement.removeAttribute("data-navigating")};
    const keyCancel=(event:KeyboardEvent)=>{if(["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," ","Escape"].includes(event.key))cancel()};
    const navigate=(event:MouseEvent)=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
      const link=(event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if(!link||link.getAttribute("href")==="#")return;
      const id=decodeURIComponent(link.hash.slice(1));const target=document.getElementById(id);
      if(!target)return;
      event.preventDefault();cancel();
      // Allow a mobile navigation dialog to release its scroll lock first.
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const start=window.scrollY;
        const top=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,start+target.getBoundingClientRect().top-(id==="top"?0:32)));
        const distance=top-start;const duration=matchMedia("(prefers-reduced-motion: reduce)").matches?0:Math.min(1000,520+Math.abs(distance)*.07);
        const begin=performance.now();document.documentElement.dataset.navigating="true";
        history.pushState(null,"",link.hash);
        const tick=(now:number)=>{
          const t=duration?Math.max(0,Math.min(1,(now-begin)/duration)):1;
          const ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
          window.scrollTo({top:start+distance*ease,behavior:"instant"});
          if(t<1)frame=requestAnimationFrame(tick);
          else{document.documentElement.removeAttribute("data-navigating");if(!target.hasAttribute("tabindex")){target.setAttribute("tabindex","-1");target.addEventListener("blur",()=>target.removeAttribute("tabindex"),{once:true})}target.focus({preventScroll:true})}
        };
        frame=requestAnimationFrame(tick);
      }));
    };
    document.addEventListener("click",navigate);window.addEventListener("wheel",cancel,{passive:true});window.addEventListener("touchstart",cancel,{passive:true});window.addEventListener("keydown",keyCancel);
    return()=>{cancel();document.removeEventListener("click",navigate);window.removeEventListener("wheel",cancel);window.removeEventListener("touchstart",cancel);window.removeEventListener("keydown",keyCancel)};
  },[]);
  return null;
}
