"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
export function AnimatedFAQ({items}:{items:string[][]}){
  const [open,setOpen]=useState<number|null>(null);
  return <div className="faq-list">{items.map(([question,answer],index)=><article className={`faq-item ${open===index?"faq-open":""}`} key={question}><h3><button id={`faq-question-${index}`} aria-expanded={open===index} aria-controls={`faq-answer-${index}`} onClick={()=>setOpen(open===index?null:index)}>{question}<Plus size={18}/></button></h3><div className="faq-answer" id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`} role="region" aria-hidden={open!==index} inert={open!==index}><div><p>{answer}</p></div></div></article>)}</div>
}
