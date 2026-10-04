---
layout: doc
permalink: /job-spec-slides.html
handle: Job Spec Slides
title: Job Spec Slides
nav_order: 19
eyebrow: PIVOTAL CORPORATE · JOB SPECIFICATION · SLIDE DECK
study_mode: true
---

> **21 unique slides in the corrected study order.** The duplicate DR3 page in the source PDF has been removed, and the extra explanatory slides are placed beside the part of the specification they support.

<div class="job-spec-slide-actions">
  <button type="button" id="job-spec-fullscreen">Full screen</button>
  <a href="https://docs.google.com/presentation/d/1CG_yaUNqHwJVuglcLoc6CLIq60AG7UGlTv5gwQuNS4s/edit?usp=drivesdk" target="_blank" rel="noopener">Open slide deck ↗</a>
</div>

<div class="job-spec-slide-shell" id="job-spec-slide-shell">
  <iframe
    class="job-spec-slide-frame"
    src="https://docs.google.com/presentation/d/1CG_yaUNqHwJVuglcLoc6CLIq60AG7UGlTv5gwQuNS4s/embed?start=false&loop=false&delayms=60000"
    title="Pivotal Corporate Job Spec Slides"
    allowfullscreen="true"
    mozallowfullscreen="true"
    webkitallowfullscreen="true">
  </iframe>
</div>

<div class="job-spec-slide-note">
  <strong>Order:</strong> Company & role → five supporting study slides → DR overview → DR1–DR4 → JSR overview → JSR1–JSR5.
</div>

[Study the specification →]({{ '/pivotal-corporate-study.html' | relative_url }}) &nbsp; · &nbsp;
[Practise interview retrieval →]({{ '/pivot-drs.html' | relative_url }})

<style>
.job-spec-slide-actions{
  display:flex;
  gap:.75rem;
  flex-wrap:wrap;
  align-items:center;
  margin:1rem 0;
}
.job-spec-slide-actions button,
.job-spec-slide-actions a{
  appearance:none;
  border:1px solid rgba(15,46,76,.18);
  border-radius:.75rem;
  background:#0f2e4c;
  color:#fff !important;
  font:inherit;
  font-weight:700;
  line-height:1;
  padding:.8rem 1rem;
  text-decoration:none;
  cursor:pointer;
}
.job-spec-slide-actions a{
  background:#fff;
  color:#0f2e4c !important;
}
.job-spec-slide-shell{
  width:100%;
  aspect-ratio:16/9;
  background:#0a0f16;
  border-radius:1rem;
  overflow:hidden;
  box-shadow:0 12px 34px rgba(15,46,76,.16);
}
.job-spec-slide-frame{
  display:block;
  width:100%;
  height:100%;
  border:0;
  background:#fff;
}
.job-spec-slide-shell:fullscreen{
  width:100vw;
  height:100vh;
  aspect-ratio:auto;
  border-radius:0;
}
.job-spec-slide-shell:fullscreen .job-spec-slide-frame{
  width:100vw;
  height:100vh;
}
.job-spec-slide-note{
  margin:.9rem 0 1.5rem;
  color:var(--muted, #52606d);
  font-size:.95rem;
}
@media (max-width:700px){
  .job-spec-slide-actions button,
  .job-spec-slide-actions a{flex:1 1 auto;text-align:center;}
}
</style>

<script>
(function(){
  const button=document.getElementById('job-spec-fullscreen');
  const shell=document.getElementById('job-spec-slide-shell');
  if(!button || !shell) return;
  button.addEventListener('click', async function(){
    try{
      if(!document.fullscreenElement){
        await shell.requestFullscreen();
      }else{
        await document.exitFullscreen();
      }
    }catch(e){
      const frame=shell.querySelector('iframe');
      if(frame && frame.requestFullscreen) frame.requestFullscreen();
    }
  });
})();
</script>
