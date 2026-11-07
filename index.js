/* Motiv – načtení uložené volby ještě před vykreslením stránky. */
try{const t=localStorage.getItem('pra-arduino-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme='dark'}

/* Přepínač motivu v horní liště. */
document.addEventListener("DOMContentLoaded", () => {
(()=>{const b=document.querySelector('.theme-toggle'),label=b.querySelector('.theme-label'),icon=b.querySelector('svg');function update(){const dark=document.documentElement.dataset.theme==='dark';label.textContent=dark?'Světlý režim':'Tmavý režim';b.setAttribute('aria-pressed',String(dark));icon.innerHTML=dark?'<path d="M20.3 15.5A8.7 8.7 0 0 1 8.5 3.7a8.7 8.7 0 1 0 11.8 11.8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>':'<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'}b.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('pra-arduino-theme',next)}catch(e){}update()});update()})();
});
