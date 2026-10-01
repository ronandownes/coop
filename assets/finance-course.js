(() => {
  const root = document.querySelector('.finance-course');
  if (!root) return;
  const KEY='finance-course:v1';
  const state=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return {}}})();
  state.done=Array.isArray(state.done)?state.done:[];
  state.quiz=state.quiz&&typeof state.quiz==='object'?state.quiz:{};
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const units=[...root.querySelectorAll('[data-fc-unit]')];
  const bar=root.querySelector('[data-fc-progress-bar]');
  const label=root.querySelector('[data-fc-progress-label]');
  const updateProgress=()=>{
    const done=units.filter(u=>state.done.includes(u.dataset.fcUnit)).length;
    const pct=units.length?Math.round(done/units.length*100):0;
    if(bar) bar.style.width=`${pct}%`;
    if(label) label.textContent=`${done}/${units.length} lessons complete`;
    units.forEach(u=>{
      const b=u.querySelector('[data-fc-complete]'); if(!b)return;
      const yes=state.done.includes(u.dataset.fcUnit); b.classList.toggle('is-done',yes); b.textContent=yes?'✓ Completed':'Mark lesson complete';
    });
  };
  root.addEventListener('click',e=>{
    const complete=e.target.closest('[data-fc-complete]');
    if(complete){const unit=complete.closest('[data-fc-unit]');const id=unit?.dataset.fcUnit;if(!id)return;state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();updateProgress();return;}
    const option=e.target.closest('[data-fc-option]');
    if(option){
      const q=option.closest('.fc-check'); if(!q)return;
      const answer=String(q.dataset.answer); const chosen=String(option.dataset.fcOption);
      q.querySelectorAll('[data-fc-option]').forEach(b=>{b.disabled=true;b.classList.toggle('is-correct',String(b.dataset.fcOption)===answer);});
      option.classList.toggle('is-wrong',chosen!==answer);
      const fb=q.querySelector('.fc-feedback'); if(fb){fb.hidden=false;fb.textContent=chosen===answer?`✓ ${q.dataset.correct}`:`↗ ${q.dataset.wrong}`;}
      state.quiz[q.id||q.dataset.q||Math.random().toString(36)]=chosen===answer;save();return;
    }
    const preview=e.target.closest('[data-fc-preview]');
    if(preview){
      const card=preview.closest('.fc-resource'); const id=card?.dataset.youtube; const frame=card?.querySelector('.fc-resource-frame');
      if(!id||!frame)return;
      const open=!frame.hasChildNodes();
      if(open){const iframe=document.createElement('iframe');iframe.loading='lazy';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;iframe.title=card.querySelector('h4')?.textContent||'Finance video';frame.append(iframe);frame.hidden=false;preview.textContent='Hide video';}
      else {frame.replaceChildren();frame.hidden=true;preview.textContent='Watch here';}
      return;
    }
  });
  const num=(form,name)=>Number(form.querySelector(`[name="${name}"]`)?.value);
  root.querySelectorAll('[data-fc-calc]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault(); const type=form.dataset.fcCalc; let text='';
    try{
      if(type==='pv'){const fv=num(form,'fv'),r=num(form,'rate')/100,n=num(form,'years');const v=fv/Math.pow(1+r,n);text=`Present value = €${v.toLocaleString(undefined,{maximumFractionDigits:2})}`;}
      if(type==='npv'){const initial=num(form,'initial'),r=num(form,'rate')/100;const flows=(form.querySelector('[name="flows"]')?.value||'').split(',').map(x=>Number(x.trim())).filter(Number.isFinite);const v=-initial+flows.reduce((s,cf,i)=>s+cf/Math.pow(1+r,i+1),0);text=`NPV = €${v.toLocaleString(undefined,{maximumFractionDigits:2})} · ${v>=0?'positive at this discount rate':'negative at this discount rate'}`;}
      if(type==='bond'){const face=num(form,'face'),coupon=num(form,'coupon')/100,ytm=num(form,'ytm')/100,years=num(form,'years'),freq=num(form,'freq');const periods=Math.round(years*freq),c=face*coupon/freq,pr=ytm/freq;let v=0;for(let t=1;t<=periods;t++)v+=c/Math.pow(1+pr,t);v+=face/Math.pow(1+pr,periods);text=`Bond price ≈ €${v.toLocaleString(undefined,{maximumFractionDigits:2})}`;}
      if(type==='wacc'){const ew=num(form,'ew')/100,dw=num(form,'dw')/100,ke=num(form,'ke')/100,kd=num(form,'kd')/100,tax=num(form,'tax')/100;const v=ew*ke+dw*kd*(1-tax);text=`WACC ≈ ${(v*100).toFixed(2)}%`}
      if(type==='capm'){const rf=num(form,'rf')/100,beta=num(form,'beta'),rm=num(form,'rm')/100;const v=rf+beta*(rm-rf);text=`CAPM expected return / cost of equity ≈ ${(v*100).toFixed(2)}%`}
    }catch(_){text='Check the inputs and try again.'}
    const out=form.querySelector('.fc-result'); if(out)out.textContent=text;
  }));
  updateProgress();
})();
