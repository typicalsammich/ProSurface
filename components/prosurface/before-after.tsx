"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  function move(clientX: number) {
    const bounds = frame.current?.getBoundingClientRect();
    if (bounds) setPosition(Math.round(Math.max(0, Math.min(100, (clientX - bounds.left) / bounds.width * 100))));
  }
  return <div className="compare-wrap reveal">
    <div ref={frame} className="comparison" onPointerDown={event => {
      if (event.button !== 0) return;
      activePointer.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      move(event.clientX);
    }} onPointerMove={event => {
      if (activePointer.current === event.pointerId) move(event.clientX);
    }} onPointerUp={event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      activePointer.current = null;
    }} onPointerCancel={() => { activePointer.current = null; }}>
      <img src="/images/after.jpg" alt="Finished room with a glossy light specialty coating" loading="lazy" width="590" height="443" draggable={false}/>
      <img className="comparison-before" src="/images/before-new.jpg" alt="Original unfinished kitchen concrete before coating" loading="lazy" width="1536" height="2048" draggable={false} style={{clipPath:`inset(0 ${100-position}% 0 0)`}}/>
      <span className="compare-label before">BEFORE</span><span className="compare-label after">AFTER</span>
      <div className="compare-line" style={{left:`${position}%`}}>
        <button type="button" role="slider" aria-label="Before and after comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={position} aria-valuetext={`${position}% before, ${100-position}% after`} aria-orientation="horizontal" onKeyDown={event => {
          const increments: Record<string, number> = {ArrowLeft:-2, ArrowRight:2, ArrowDown:-2, ArrowUp:2, PageDown:-10, PageUp:10};
          if (event.key === "Home" || event.key === "End" || event.key in increments) {
            event.preventDefault();
            setPosition(p => event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.max(0, Math.min(100, p + increments[event.key])));
          }
        }}><MoveHorizontal size={22}/></button>
      </div>
    </div>
    <div className="compare-control"><span>Before</span><Slider value={[position]} onValueChange={([value])=>setPosition(value)} min={0} max={100} step={1} aria-label="Before and after reveal position"/><span>After</span></div>
    <p className="compare-note">Drag the image or handle to explore. Same room, photographed from different angles.</p>
  </div>;
}
