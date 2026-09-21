import { AnimatedFAQ } from "./animated-faq";
import { ArrowUpRight } from "lucide-react";
export function LocalDetails(){
  return <section className="local-details" aria-labelledby="local-heading">
    <div className="local-story reveal"><span className="eyebrow">ROOTED IN DFW. BUILT AROUND YOU.</span><h2 id="local-heading">Your game.<br/><em>Our home turf.</em></h2><p className="local-lead">Court construction & resurfacing<br/>in Dallas–Fort Worth.</p><p>ProSurface Performance Courts serves DFW and beyond with custom athletic courts, court resurfacing, specialty epoxy coatings, and stained and sealed concrete.</p><p>From a backyard basketball court to a dedicated pickleball or tennis surface, start with your location and your vision. We’ll talk through the possibilities for your property.</p><a href="#contact" className="text-link">Tell us where you want to play <ArrowUpRight size={18}/></a><span className="local-phone">A conversation starts here. <a href="tel:+19037327124">(903) 732-7124</a></span></div>
    <div className="project-questions reveal"><span className="eyebrow">BEFORE THE FIRST SERVE</span><AnimatedFAQ items={[
      ["Can you resurface an existing court?","Yes. Court resurfacing is one of our core services. Share photos of the current surface and your location so the team can discuss its condition, color options, and next steps."],
      ["What sports can we plan for?","Basketball, pickleball, tennis, and multi-sport layouts. The right layout depends on your available space and how you want to use it. The court studio is a starting point for that conversation."],
      ["Can I choose my own court colors?","Absolutely. Try the signature palettes or create a custom combination in the court studio. Your selection can be included in your inquiry; final colors and layout are confirmed with the team."],
      ["Do you take projects beyond DFW?","ProSurface serves Dallas–Fort Worth and beyond. Tell us your city and project type so we can confirm availability for your location."],
      ["How do I get a project estimate?","Start with your city, preferred sport or finish, approximate space, and any photos of the existing surface. Call (903) 732-7124 or use the project inquiry to prepare a text for the team."]
    ]}/></div>
  </section>
}
