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