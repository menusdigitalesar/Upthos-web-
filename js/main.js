// ═══════════ Upthos ═══════════
// Link de agenda (Calendly/Cal.com). Reemplazar por el real.
const BOOK = '';

// ── Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  const o = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', o);
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// ── CTA agendar: todos los [data-book] abren el link de agenda
document.querySelectorAll('[data-book]').forEach(b => b.setAttribute('href', BOOK));

// ── Count-up stats
(function(){
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fmt = n => n.toLocaleString('es-AR');
  const run = el => {
    const target = +el.dataset.count, suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
    if(reduce){ el.textContent = pre+fmt(target)+suf; return; }
    const dur = 1400, t0 = performance.now();
    const step = now => {
      const p = Math.min((now-t0)/dur, 1), e = 1-Math.pow(1-p,3);
      el.textContent = pre+fmt(Math.round(target*e))+suf;
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ run(e.target); io.unobserve(e.target); }
  }),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));
})();

// ── Reveal observer
const io = new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ── Hero título palabra por palabra
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const h1 = document.querySelector('.hero h1');
  if(!h1) return;
  const out=[]; let i=0;
  h1.childNodes.forEach(node=>{
    if(node.nodeType===3){
      node.textContent.split(/(\s+)/).forEach(tok=>{
        if(tok.trim()===''){ out.push(tok); return; }
        out.push(`<span class="hw" style="display:inline-block;opacity:0;animation:hwIn .7s cubic-bezier(.22,1,.36,1) forwards;animation-delay:${(.08+i*.06).toFixed(2)}s">${tok}</span>`); i++;
      });
    } else if(node.nodeName==='BR'){ out.push('<br>'); }
    else { out.push(`<span class="hw" style="display:inline-block;opacity:0;animation:hwIn .7s cubic-bezier(.22,1,.36,1) forwards;animation-delay:${(.08+i*.06).toFixed(2)}s">${node.outerHTML}</span>`); i++; }
  });
  h1.innerHTML = out.join('');
  if(!document.getElementById('hwKeyframes')){
    const st=document.createElement('style'); st.id='hwKeyframes';
    st.textContent='@keyframes hwIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}';
    document.head.appendChild(st);
  }
})();
