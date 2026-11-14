'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const html=document.documentElement,theme=document.querySelector('.theme-toggle'),key='pra-arduino-theme';
 function syncTheme(){let dark=html.dataset.theme==='dark';if(theme){theme.setAttribute('aria-pressed',String(dark));theme.querySelector('.theme-symbol').textContent=dark?'☀':'☾';theme.querySelector('.theme-label').textContent=dark?'Světlý režim':'Tmavý režim'}}
 theme?.addEventListener('click',()=>{html.dataset.theme=html.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,html.dataset.theme)}catch(_e){}syncTheme()});syncTheme();
 const menu=document.getElementById('chapter-menu'),toggle=document.querySelector('.nav-fab');
 function closeMenu(){if(menu?.open)menu.close();toggle?.setAttribute('aria-expanded','false')}
 toggle?.addEventListener('click',()=>{if(!menu)return;if(menu.open)closeMenu();else{menu.showModal();toggle.setAttribute('aria-expanded','true')}});
 menu?.querySelector('[data-close-menu]')?.addEventListener('click',closeMenu);
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 menu?.addEventListener('click',e=>{if(e.target===menu)closeMenu()});
 menu?.addEventListener('close',()=>toggle?.setAttribute('aria-expanded','false'));
 const viewer=document.getElementById('image-viewer'),viewerImg=viewer?.querySelector('img'),viewerTxt=document.getElementById('viewer-caption');
 document.querySelectorAll('button[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{
  const src=btn.dataset.lightbox||'';if(!viewer||!viewerImg||!viewerTxt||!src.startsWith('picture/kapitola4/'))return;
  viewerImg.src=src;viewerImg.alt=btn.dataset.caption||'Zvětšený obrázek';viewerTxt.textContent=btn.dataset.caption||'';viewer.showModal();
 }));
 viewer?.querySelector('[data-close-viewer]')?.addEventListener('click',()=>viewer.close());
 viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
 viewer?.addEventListener('close',()=>viewerImg?.removeAttribute('src'));

 const choices=document.getElementById('switchlab-choices'),actions=document.getElementById('switchlab-actions'),lamps=document.getElementById('switchlab-lamps');
 const heading=document.getElementById('switchlab-type-name'),explain=document.getElementById('switchlab-explainer'),hint=document.getElementById('switchlab-hint'),status=document.getElementById('switchlab-status'),symbol=document.querySelector('.lab-switch-symbol');
 const config={
 '1':{name:'Jednopólový spínač',description:'Jediný kontakt zapíná nebo vypíná jednu světelnou větev.',keys:[['a','Vypínač č. 1']],bulbs:['Svítidlo']},
 '2':{name:'Dvoupólový spínač',description:'Dva pracovní kontakty jsou mechanicky spojeny a ovládají se současně.',keys:[['a','Dvoupólový spínač']],bulbs:['Spínaný obvod']},
 '3':{name:'Trojpólový spínač',description:'Tři pracovní kontakty se ovládají jedinou klapkou, například pro L1, L2 a L3.',keys:[['a','Trojpólový spínač']],bulbs:['L1','L2','L3']},
 '4':{name:'Skupinový přepínač',description:'Přepínač má polohy: vypnuto, větev A, větev B. Obě větve nelze zapnout současně.',keys:[['mode0','0 · Vypnuto'],['mode1','I · Větev A'],['mode2','II · Větev B']],bulbs:['Svítidlo A','Svítidlo B']},
 '5':{name:'Sériový (lustrový) spínač',description:'Dvě klapky pracují nezávisle a mohou rozsvítit obě světelné větve zároveň.',keys:[['a','Klapka A'],['b','Klapka B']],bulbs:['Svítidlo A','Svítidlo B']},
 '6':{name:'Střídavé přepínače',description:'Dva přepínače řazení 6 umožňují ovládat jednu světelnou větev ze dvou míst.',keys:[['a','Přepínač A'],['b','Přepínač B']],bulbs:['Svítidlo']},
 '7':{name:'Sestava 6–7–6',description:'Jeden křížový přepínač mezi dvěma řazeními 6 umožňuje ovládání ze tří míst.',keys:[['a','Přepínač 6 · A'],['c','Křížový 7'],['b','Přepínač 6 · B']],bulbs:['Svítidlo']},
 '6+6':{name:'Dvojitý střídavý přepínač',description:'Dvě nezávislé světelné větve, každá ovládaná ze dvou míst.',keys:[['a','A · místo 1'],['b','A · místo 2'],['c','B · místo 1'],['d','B · místo 2']],bulbs:['Svítidlo A','Svítidlo B']},
 '6+1':{name:'Kombinace 6 + 1',description:'Jedna světelná větev se ovládá ze dvou míst, druhá jediným spínačem.',keys:[['a','6 · místo 1'],['b','6 · místo 2'],['c','Řazení 1']],bulbs:['Svítidlo A · 6','Svítidlo B · 1']}
 };
 let type='1',position=0;const toggles={a:false,b:false,c:false,d:false};
 const bulbSVG='<svg class="lab-bulb" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="28"/><path d="M31 31L69 69M69 31L31 69"/></svg>';
 function state(){const {a,b,c,d}=toggles;
  switch(type){case '1':case '2':return[a];case '3':return[a,a,a];case '4':return[position===1,position===2];case '5':return[a,b];case '6':return[a===b];case '7':return[(a===b)!==c];case '6+6':return[a===b,c===d];case '6+1':return[a===b,c];default:return[false]}}
 function render(){if(!choices||!actions||!lamps)return;
  const item=config[type],values=state();
  choices.querySelectorAll('[data-switch-type]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.switchType===type)));
  heading.textContent=item.name;explain.textContent=item.description;status.textContent='Řazení '+type+' · '+item.name;
  actions.replaceChildren();item.keys.forEach(([id,label])=>{
   const pressed=id.startsWith('mode')?position===Number(id.slice(-1)):toggles[id];
   const b=document.createElement('button');b.type='button';b.dataset.labAction=id;b.setAttribute('aria-pressed',String(pressed));b.classList.toggle('is-active',pressed);
   b.textContent=id.startsWith('mode')?label:(pressed?'● ':'○ ')+label;actions.append(b)
  });
  lamps.replaceChildren();values.forEach((lit,i)=>{
   let d=document.createElement('div');d.className='lab-lamp-row'+(lit?' is-on':'');d.setAttribute('aria-label',item.bulbs[i]+(lit?' svítí':' nesvítí'));d.innerHTML=bulbSVG;
   const t=document.createElement('span');t.textContent=item.bulbs[i]+(lit?' · svítí':' · zhasnuto');d.append(t);lamps.append(d)
  });
  hint.textContent=values.map((lit,i)=>item.bulbs[i]+': '+(lit?'ZAPNUTO':'VYPNUTO')).join(' • ');
  if(symbol)symbol.textContent=values.some(Boolean)?'━':'╱';
 }
 function reset(){for(let k in toggles)toggles[k]=false;position=0;render()}
 choices?.addEventListener('click',e=>{let b=e.target.closest('[data-switch-type]');if(!b||!config[b.dataset.switchType])return;type=b.dataset.switchType;reset()});
 actions?.addEventListener('click',e=>{let b=e.target.closest('[data-lab-action]');if(!b)return;let id=b.dataset.labAction;
  if(/^mode[012]$/.test(id))position=Number(id.at(-1));else if(Object.prototype.hasOwnProperty.call(toggles,id))toggles[id]=!toggles[id];render()});
 document.getElementById('switchlab-reset')?.addEventListener('click',reset);
 render();
});


/* Interaktivní jednopólový vypínač č.1. Samostatný modul, nezasahuje do laboratoře ostatních řazení. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('odv1-circuit')?.closest('.odv1-simulation');
  if (!root) return;
  const button = root.querySelector('#odv1-toggle');
  const switchHit = root.querySelector('#odv1-svg-toggle');
  const stateBadge = root.querySelector('#odv1-state');
  const title = root.querySelector('#odv1-status-title');
  const description = root.querySelector('#odv1-description');
  const pathStatus = root.querySelector('#odv1-path-switched');
  const lampLabel = root.querySelector('#odv1-light-label');
  let closed = false;
  function render() {
    root.classList.toggle('is-on', closed);
    if (button) {
      button.textContent = closed ? 'Vypnout vypínač' : 'Zapnout vypínač';
      button.setAttribute('aria-pressed', String(closed));
    }
    switchHit?.setAttribute('aria-pressed', String(closed));
    if (stateBadge) { const led=stateBadge.querySelector('.odv1-led');stateBadge.textContent='';if(led)stateBadge.appendChild(led);stateBadge.appendChild(document.createTextNode(closed?'ZAPNUTO':'VYPNUTO')); }
    if (title) title.textContent = closed ? 'Kontakty sepnuty – svítidlo svítí' : 'Kontakty rozpojeny – svítidlo nesvítí';
    if (description) description.textContent = closed ? 'Vypínač spojil fázový vodič L1 se spínaným vodičem ke svítidlu. Obvod se uzavřel přes N a světlo svítí. Ochranný PE zůstává propojený.' : 'Přívodní fáze L1 končí na otevřeném kontaktu vypínače. Ke svítidlu se přes vypínač nepřenáší a svítidlo nesvítí. N i PE zůstávají připojené.';
    if (pathStatus) pathStatus.textContent = closed ? 'Spojeno' : 'Rozpojeno';
    if (lampLabel) lampLabel.textContent = closed ? 'SVÍTÍ' : 'nesvítí';
  }
  function toggle(){closed=!closed;render()}
  button?.addEventListener('click',toggle);
  switchHit?.addEventListener('click',toggle);
  switchHit?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
  root.querySelector('#odv1-reset')?.addEventListener('click',()=>{closed=false;render()});
  root.querySelectorAll('[data-odv1-answer]').forEach(answer=>answer.addEventListener('click',()=>{
    root.querySelectorAll('[data-odv1-answer]').forEach(el=>{el.classList.remove('is-correct','is-incorrect');el.setAttribute('aria-pressed',String(el===answer))});
    const correct=answer.dataset.odv1Answer==='L1';
    answer.classList.add(correct?'is-correct':'is-incorrect');
    const p=root.querySelector('#odv1-quiz-feedback');
    if(p)p.textContent=correct?'Správně. Jednopólový vypínač přerušuje fázový vodič L1.':'Zkus to znovu. N vede přímo ke svítidlu a ochranný PE se nikdy nesmí přerušit.';
  }));
  render();
});
