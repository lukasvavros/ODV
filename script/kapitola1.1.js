
document.addEventListener("DOMContentLoaded", function () {

  /* ======================================================= */
  /* GALERIE */
  /* ======================================================= */

  document.querySelectorAll('.pra-gallery').forEach(function(gallery) {
    const slides = gallery.querySelectorAll('.pra-gallery-image');
    const dots = gallery.querySelectorAll('.pra-gallery-dot');
    const prev = gallery.querySelector('.pra-gallery-arrow.prev');
    const next = gallery.querySelector('.pra-gallery-arrow.next');

    let current = 0;

    function showSlide(index) {
      if (!slides.length) return;

      if (index < 0) {
        index = slides.length - 1;
      }

      if (index >= slides.length) {
        index = 0;
      }

      slides.forEach(function(slide) {
        slide.classList.remove('active');
      });

      dots.forEach(function(dot) {
        dot.classList.remove('active');
      });

      slides[index].classList.add('active');

      if (dots[index]) {
        dots[index].classList.add('active');
      }

      current = index;
    }

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(current + 1);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        showSlide(index);
      });
    });
  });


  /* ======================================================= */
  /* ČESKÁ TYPOGRAFIE */
  /* ======================================================= */

  const root = document.querySelector('.pra-chapter');

  if (!root) {
    return;
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(function(node) {
    const parent = node.parentElement;

    if (!parent) {
      return;
    }

    /*
      Do programového kódu, SVG, stylů a dalších technických prvků
      automaticky nezasahujeme.
    */
    if (
      parent.closest(
        'script, style, pre, code, svg, textarea'
      )
    ) {
      return;
    }

    let value = node.nodeValue;

    /*
      Jednopísmenné české předložky a spojky:
      a, i, k, o, s, u, v, z
      Dostanou za sebe nezlomitelnou mezeru.
    */
    value = value.replace(
      /(^|[\s(„"'])(([AaIiKkOoSsUuVvZz]))[ \t]+(?=\S)/g,
      function(match, before, word) {
        return before + word + '\u00A0';
      }
    );

    /*
      Číslo + běžná jednotka zůstane na jednom řádku.
      Např. 30 mm, 450 V, 16 MHz, 32 KB.
    */
    value = value.replace(
      /(\d)[ \t]+(?=(?:V|A|W|kW|mW|Hz|kHz|MHz|GHz|mm|cm|m|km|Ω|kΩ|MΩ|KB|MB|GB)\b)/g,
      '$1\u00A0'
    );

    /*
      Číslo + % zůstane pohromadě.
    */
    value = value.replace(
      /(\d)[ \t]+%/g,
      '$1\u00A0%'
    );

    node.nodeValue = value;
  });

});


/* Navigace kapitoly a přepínač režimu */
(function(){
  const KEY='pra-arduino-theme';
  const btn=document.querySelector('.theme-toggle');
  function update(){
    const dark=document.documentElement.dataset.theme==='dark';
    if(btn){btn.setAttribute('aria-pressed',String(dark));const label=btn.querySelector('.theme-label');const symbol=btn.querySelector('.theme-symbol');if(label)label.textContent=dark?'Světlý režim':'Tmavý režim';if(symbol)symbol.textContent=dark?'☀':'☾';}
  }
  if(btn)btn.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem(KEY,next)}catch(e){}update();});
  update();
  const dialog=document.querySelector('#pra-chapter-menu'),open=document.querySelector('.pra-nav-toggle');
  if(dialog&&open){
    const close=()=>{if(dialog.open)dialog.close();open.setAttribute('aria-expanded','false')};
    open.addEventListener('click',()=>{if(dialog.open)close();else{dialog.showModal();open.setAttribute('aria-expanded','true')}});
    const closer=dialog.querySelector('[data-nav-close]');if(closer)closer.addEventListener('click',close);
    dialog.addEventListener('close',()=>open.setAttribute('aria-expanded','false'));
    dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  }
})();
