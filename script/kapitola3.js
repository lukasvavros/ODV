document.addEventListener('DOMContentLoaded',()=>{
 const KEY='pra-arduino-theme',btn=document.querySelector('.theme-toggle');
 function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';if(btn){btn.setAttribute('aria-pressed',String(dark));btn.querySelector('.theme-symbol').textContent=dark?'☀':'☾';btn.querySelector('.theme-label').textContent=dark?'Světlý režim':'Tmavý režim';}}
 btn?.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(KEY,document.documentElement.dataset.theme)}catch(e){}syncTheme();});syncTheme();
 const dialog=document.getElementById('pra-chapter-menu'),toggle=document.querySelector('.pra-nav-toggle');
 if(dialog&&toggle){const close=()=>{if(dialog.open)dialog.close();toggle.setAttribute('aria-expanded','false')};toggle.addEventListener('click',()=>{if(dialog.open)close();else{dialog.showModal();toggle.setAttribute('aria-expanded','true')}});dialog.querySelector('[data-nav-close]')?.addEventListener('click',close);dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));dialog.addEventListener('click',e=>{if(e.target===dialog)close()});dialog.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));}
 const current=document.getElementById('odv-current'),out=document.getElementById('odv-calc-output');
 const fmt=n=>new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:2}).format(n);
 function update(){if(!current||!out)return;const input=current.value.trim().replace(',','.');const n=Number(input);if(!input||!Number.isFinite(n)||n<=0||n>10000){out.textContent='Zadejte kladnou hodnotu jmenovitého proudu.';return;}out.innerHTML=[['B',3,5],['C',5,10],['D',10,20]].map(([name,low,high])=>'<div><b>'+name+': '+fmt(n*low)+'–'+fmt(n*high)+' A</b><span>'+low+' až '+high+' × Iₙ</span></div>').join('');}
 current?.addEventListener('input',update);update();
});

// Kapitola 3 – interaktivni vyukova animace termomagnetickeho jistice.
document.addEventListener('DOMContentLoaded',()=>{
 const lab=document.getElementById('odv-breaker-lab');if(!lab)return;
 const svg=document.getElementById('odv-breaker-svg');
 const title=document.getElementById('odv-step-title'),description=document.getElementById('odv-step-description'),tag=document.getElementById('odv-step-tag'),status=document.getElementById('odv-lab-status-text'),dot=document.getElementById('odv-status-dot'),focus=document.getElementById('odv-lab-focus-parts'),svgState=document.getElementById('odv-svg-state');
 const prev=document.getElementById('odv-lab-prev'),next=document.getElementById('odv-lab-next'),play=document.getElementById('odv-lab-play'),reset=document.getElementById('odv-lab-reset');
 const partInfo={
  1:['Pevný kontakt','Společně s pohyblivým kontaktem 2 uzavírá proudovou cestu. Při vybavení jističe se oba kontakty oddělí.'],
  2:['Pohyblivý kontakt','Pohyblivá část spínacího systému. Pružinový mechanismus ji po uvolnění západky oddálí od pevného kontaktu.'],
  3:['Tepelná spoušť – bimetal','Při přetížení se zahřívá a postupně deformuje. Až při dostatečném ohřevu uvolní západku 7.'],
  4:['Zkratová spoušť – elektromagnet','Při velkém zkratovém proudu vytváří magnetickou sílu, která rychle přitáhne pohyblivé jádro 5.'],
  5:['Pohyblivé jádro a úderník','Elektromagnet vtáhne jádro do cívky. Úderník tím mechanicky uvolní západku.'],
  6:['Pružina','Po uvolnění západky dodá energii k rychlému rozpojení kontaktů.'],
  7:['Západka','Za normálního provozu drží spínací mechanismus. Její uvolnění tepelnou nebo zkratovou spouští dovolí vypnutí.'],
  8:['Zhášecí komora','Při rozepnutí kontaktů může vzniknout elektrický oblouk. Zhášecí komora pomáhá oblouk uhasit.']
 };
 const steps={
  overload:[
   ['Běžný provoz','Kontakty 1 a 2 jsou sepnuté. Západka 7 drží mechanismus a obvodem prochází běžný provozní proud.','Obvod je sepnutý',[1,2,7]],
   ['Přetížení ohřívá bimetal','Proud je větší než jmenovitý. Bimetal 3 se postupně zahřívá a prohýbá. Menší přetížení působí delší dobu.','Obvod zatím zůstává sepnutý',[3]],
   ['Uvolnění západky','Po dostatečném ohřátí bimetal 3 uvolní západku 7. Ta přestává držet spínací mechanismus.','Spoušť aktivována',[3,7]],
   ['Pružina rozpojí kontakty','Pružina 6 oddálí pohyblivý kontakt 2 od pevného 1. Při rozpojení může krátce vzniknout elektrický oblouk.','Obvod se rozpojuje',[1,2,6,8]],
   ['Zhášení oblouku','Zhášecí komora 8 pomůže uhasit oblouk. Kontakty zůstávají rozpojené a jistič je vybaven.','Obvod je rozpojený',[1,2,8]]
  ],
  short:[
   ['Běžný provoz','Kontakty 1 a 2 jsou sepnuté. Obvod je připraven k normálnímu provozu.','Obvod je sepnutý',[1,2,7]],
   ['Zkratový proud vybudí elektromagnet','Velký zkratový proud prochází cívkou 4. Ta vytvoří silné magnetické pole.','Obvod je ještě sepnutý',[4]],
   ['Jádro uvolní západku','Elektromagnet 4 vtáhne pohyblivé jádro s úderníkem 5. Úderník uvolní západku 7, dříve než by stačil působit zahřívaný bimetal.','Zkratová spoušť aktivována',[4,5,7]],
   ['Rychlé rozpojení kontaktů','Pružina 6 oddělí kontakty 1 a 2. Elektrický oblouk, který může při vypínání vzniknout, směřuje do zhášecí komory 8.','Obvod se rozpojuje',[1,2,6,8]],
   ['Elektrický oblouk zaniká','Zhášecí komora 8 pomáhá zhasnout oblouk. Jistič zůstává vybavený a obvod rozpojený.','Obvod je rozpojený',[1,2,8]]
  ]
 };
 let mode='overload',step=0,timer=null;
 const setPicked=p=>{
  svg.querySelectorAll('.odv-part').forEach(n=>n.classList.toggle('is-picked',Number(n.dataset.part)===p));
  lab.querySelectorAll('.odv-component-buttons button').forEach(b=>b.classList.toggle('is-active',Number(b.dataset.part)===p));
  const el=document.getElementById('odv-part-explanation');const info=partInfo[p];el.textContent=info?`${p} · ${info[0]} – ${info[1]}`:'Vyberte některou část schématu pro její popis.';
 };
 function stop(){if(timer!==null)clearInterval(timer);timer=null;play.textContent='▶ Přehrát';}
 function render(){
  lab.dataset.mode=mode;lab.dataset.step=String(step);const [t,d,s,active]=steps[mode][step];title.textContent=t;description.textContent=d;status.textContent=s;tag.textContent=`KROK ${step+1} Z 5`;focus.textContent=active.map(n=>`${n} · ${partInfo[n][0]}`).join(' · ');
  const isTrip=step>=3;dot.classList.toggle('is-open',isTrip);svgState.textContent=isTrip?'Kontakty rozpojeny · jistič vybaven':'Kontakty sepnuty · obvod pod proudem';
  svg.classList.toggle('is-tripped',isTrip);svg.classList.toggle('is-arcing',step===3);
  svg.classList.toggle('is-overheated',mode==='overload'&&step>=1);svg.classList.toggle('is-magnetic',mode==='short'&&step>=2);svg.classList.toggle('is-unlatched',step>=2);
  svg.querySelectorAll('.odv-part').forEach(n=>n.classList.toggle('is-active',active.includes(Number(n.dataset.part))));
  lab.querySelectorAll('[data-mode]').forEach(b=>{if(b.matches('button')){const on=b.dataset.mode===mode;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));}});
  lab.querySelectorAll('[data-step]').forEach(b=>{const on=Number(b.dataset.step)===step;b.classList.toggle('is-active',on);if(on)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  prev.disabled=step===0;next.disabled=step===4;
 }
 prev.addEventListener('click',()=>{stop();step=Math.max(0,step-1);render();});
 next.addEventListener('click',()=>{stop();step=Math.min(4,step+1);render();});
 reset.addEventListener('click',()=>{stop();step=0;setPicked(0);render();});
 lab.querySelectorAll('.odv-lab-mode').forEach(b=>b.addEventListener('click',()=>{stop();mode=b.dataset.mode;step=0;setPicked(0);render();}));
 lab.querySelectorAll('.odv-lab-dots button').forEach(b=>b.addEventListener('click',()=>{stop();step=Number(b.dataset.step);render();}));
 play.addEventListener('click',()=>{
  if(timer!==null){stop();return;}if(step>=4)step=0;render();play.textContent='❚❚ Pozastavit';
  timer=setInterval(()=>{if(step<4){step++;render();}else{stop();}},2200);
 });
 function choose(n){stop();setPicked(n);}lab.querySelectorAll('.odv-component-buttons button').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.part))));
 svg.querySelectorAll('.odv-part').forEach(g=>{g.addEventListener('click',()=>choose(Number(g.dataset.part)));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(Number(g.dataset.part));}});});
 render();
});
