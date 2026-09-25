
(() => {
  const $ = id => document.getElementById(id);
  const moneyM = n => '$' + n.toFixed(2) + 'm';
  const moneyK = n => '$' + Math.round(n) + 'k';
  const pct = n => n.toFixed(1) + '%';
  const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));

  const defaults = {
    'atr42': {value:13, lease:125, decline:5.5},
    'atr72': {value:18, lease:180, decline:5.0},
    'd8-100': {value:3.5, lease:55, decline:7.0},
    'd8-300': {value:5.5, lease:75, decline:6.5},
    'd8-400': {value:12, lease:145, decline:6.0}
  };

  function setOut(id, value){ const el=$(id); if(el) el.textContent=value; }

  function model({value, leaseK, horizon, discount, decline, annualCost}) {
    const rows=[]; let cum=0; let gross=0;
    for(let y=0;y<=horizon;y++){
      const asset=value*Math.pow(1-decline/100,y);
      if(y===0){rows.push({year:0,asset,cum:0,net:0});continue;}
      const lease=leaseK*12/1000;
      const net=lease-annualCost;
      gross+=lease;
      const pv=net/Math.pow(1+discount/100,y);
      cum+=pv;
      rows.push({year:y,asset,cum,net});
    }
    const residual=rows[rows.length-1].asset;
    const residualPV=residual/Math.pow(1+discount/100,horizon);
    return {rows,residual,gross,npv:cum+residualPV};
  }

  function drawLineChart(canvas, series, labels) {
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const W=canvas.width,H=canvas.height,p={l:62,r:24,t:26,b:48};
    ctx.clearRect(0,0,W,H);
    const all=series.flatMap(s=>s.values);
    const max=Math.max(...all,1)*1.12;
    ctx.strokeStyle='#d9dee8'; ctx.lineWidth=1;
    ctx.fillStyle='#667085'; ctx.font='14px system-ui';
    for(let i=0;i<=4;i++){
      const y=p.t+(H-p.t-p.b)*i/4;
      ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(W-p.r,y);ctx.stroke();
      const v=max*(1-i/4);
      ctx.fillText('$'+v.toFixed(v<10?1:0)+'m',8,y+5);
    }
    const n=Math.max(...series.map(s=>s.values.length));
    labels.forEach((lab,i)=>{
      const x=p.l+(W-p.l-p.r)*(n===1?0:i/(n-1));
      if(i===0||i===labels.length-1||i%2===0) ctx.fillText(lab,x-8,H-16);
    });
    const palette=['#172554','#0f766e','#b45309','#7c3aed'];
    series.forEach((s,si)=>{
      ctx.strokeStyle=palette[si%palette.length];ctx.lineWidth=3;ctx.beginPath();
      s.values.forEach((v,i)=>{
        const x=p.l+(W-p.l-p.r)*(s.values.length===1?0:i/(s.values.length-1));
        const y=p.t+(H-p.t-p.b)*(1-v/max);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();
    });
    let lx=p.l;
    series.forEach((s,si)=>{
      ctx.fillStyle=palette[si%palette.length];ctx.fillRect(lx,5,14,4);
      ctx.fillStyle='#344054';ctx.fillText(s.name,lx+20,12);lx+=Math.max(150,s.name.length*8+38);
    });
  }

  function drawBars(canvas, items) {
    if(!canvas)return;
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,p={l:65,r:25,t:30,b:65};
    ctx.clearRect(0,0,W,H);
    const vals=items.map(x=>x.value); const max=Math.max(...vals,1)*1.15; const min=Math.min(0,...vals);
    const span=max-min||1;
    const y=v=>p.t+(H-p.t-p.b)*(max-v)/span;
    ctx.strokeStyle='#d9dee8';ctx.fillStyle='#667085';ctx.font='14px system-ui';
    for(let i=0;i<=4;i++){const v=min+span*i/4, yy=y(v);ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(W-p.r,yy);ctx.stroke();ctx.fillText('$'+v.toFixed(1)+'m',8,yy+5)}
    const bw=(W-p.l-p.r)/(items.length*1.7), gap=(W-p.l-p.r)/items.length;
    const colors=['#9a3412','#172554','#0f766e'];
    items.forEach((it,i)=>{
      const x=p.l+gap*i+(gap-bw)/2, yy=y(it.value), zero=y(0);
      ctx.fillStyle=colors[i%colors.length];ctx.fillRect(x,Math.min(yy,zero),bw,Math.abs(zero-yy));
      ctx.fillStyle='#344054';ctx.fillText(it.label,x-5,H-32);ctx.font='bold 14px system-ui';ctx.fillText(moneyM(it.value),x-5,Math.min(yy,zero)-8);ctx.font='14px system-ui';
    });
  }

  function updateSingle() {
    const type=$('aircraftType').value, d=defaults[type];
    const age=+$('startAge').value,value=+$('startValue').value,leaseK=+$('monthlyLease').value,
      horizon=+$('horizon').value,discount=+$('discountRate').value,decline=+$('valueDecline').value,cost=+$('annualCost').value;
    setOut('ageOut',age+' years');setOut('valueOut',moneyM(value));setOut('leaseOut',moneyK(leaseK)+'/month');
    setOut('horizonOut',horizon+' years');setOut('discountOut',pct(discount));setOut('declineOut',pct(decline));setOut('costOut',moneyM(cost)+'/yr');
    const r=model({value,leaseK,horizon,discount,decline,annualCost:cost});
    $('npvKpi').textContent=moneyM(r.npv);$('residualKpi').textContent=moneyM(r.residual);$('incomeKpi').textContent=moneyM(r.gross);$('endAgeKpi').textContent=(age+horizon)+' yrs';
    drawLineChart($('singleChart'),[
      {name:'Estimated asset value',values:r.rows.map(x=>x.asset)},
      {name:'Cumulative discounted net lease cash',values:r.rows.map(x=>x.cum)}
    ],r.rows.map(x=>'Y'+x.year));
    updateScenarios();
  }

  function updateRelet(){
    const age=+$('reAge').value,lease=+$('reLease').value,delta=+$('newLeaseDelta').value,down=+$('downtime').value,cost=+$('transitionCost').value,h=+$('reHorizon').value;
    setOut('reAgeOut',age+' years');setOut('reLeaseOut',moneyK(lease)+'/month');setOut('newLeaseDeltaOut',(delta>=0?'+':'')+delta+'%');setOut('downtimeOut',down+' months');setOut('transitionCostOut',moneyM(cost));setOut('reHorizonOut',h+' years');
    const dr=8/100, annual=lease*12/1000, newAnnual=annual*(1+delta/100);
    let extend=0,relet=-cost; const ext=[],rel=[];
    for(let y=1;y<=h;y++){
      const e=annual/Math.pow(1+dr,y); extend+=e; ext.push(extend);
      let cash=newAnnual;
      if(y===1) cash*=Math.max(0,12-down)/12;
      const rr=cash/Math.pow(1+dr,y); relet+=rr; rel.push(relet);
    }
    $('extendNpv').textContent=moneyM(extend);$('reletNpv').textContent=moneyM(relet);
    const diff=relet-extend;$('decisionDelta').textContent=(diff>=0?'+':'')+moneyM(diff);
    $('decisionLabel').textContent=diff>0?'Re-lease leads':'Extend leads';
    drawLineChart($('reletChart'),[{name:'Extend current lease',values:[0,...ext]},{name:'Transition & re-lease',values:[-cost,...rel]}],Array.from({length:h+1},(_,i)=>'Y'+i));
  }

  function updateScenarios(){
    if(!$('startValue'))return;
    const base={value:+$('startValue').value,leaseK:+$('monthlyLease').value,horizon:+$('horizon').value,discount:+$('discountRate').value,decline:+$('valueDecline').value,annualCost:+$('annualCost').value};
    const scenarios=[
      {name:'Conservative',leaseK:base.leaseK*.9,discount:clamp(base.discount+2,1,20),decline:clamp(base.decline+2,0,20)},
      {name:'Base',leaseK:base.leaseK,discount:base.discount,decline:base.decline},
      {name:'Upside',leaseK:base.leaseK*1.1,discount:clamp(base.discount-2,1,20),decline:clamp(base.decline-2,0,20)}
    ].map(s=>({...s,result:model({...base,leaseK:s.leaseK,discount:s.discount,decline:s.decline})}));
    $('scenarioCards').innerHTML=scenarios.map(s=>'<article><span>'+s.name+'</span><strong>'+moneyM(s.result.npv)+'</strong><small>Lease '+moneyK(s.leaseK)+'/mo · discount '+pct(s.discount)+' · value decline '+pct(s.decline)+'</small></article>').join('');
    drawBars($('scenarioChart'),scenarios.map(s=>({label:s.name,value:s.result.npv})));
  }

  document.querySelectorAll('.lease-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.lease-tab').forEach(b=>b.classList.toggle('active',b===btn));
    document.querySelectorAll('.lease-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab));
    if(btn.dataset.tab==='scenarios') updateScenarios();
  }));

  ['startAge','startValue','monthlyLease','horizon','discountRate','valueDecline','annualCost'].forEach(id=>$(id)?.addEventListener('input',updateSingle));
  $('aircraftType')?.addEventListener('change',()=>{
    const d=defaults[$('aircraftType').value];
    $('startValue').value=d.value;$('monthlyLease').value=d.lease;$('valueDecline').value=d.decline;updateSingle();
  });
  ['reAge','reLease','newLeaseDelta','downtime','transitionCost','reHorizon'].forEach(id=>$(id)?.addEventListener('input',updateRelet));
  updateSingle();updateRelet();
})();
