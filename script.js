// Smooth scroll for in-page links
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length > 1) {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
    navList.setAttribute('aria-expanded', String(!expanded));
  });
}

// Gentle parallax on hero background
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const rx = (e.clientX - r.left) / r.width - 0.5;
    const ry = (e.clientY - r.top) / r.height - 0.5;
    hero.style.setProperty('--parx', (rx * 6).toFixed(2) + 'px');
    hero.style.setProperty('--pary', (ry * 6).toFixed(2) + 'px');
  });
}

// Subtle parallax for noir panels
(function noirParallax(){
  const black = document.querySelector('.noir-panels .panel--black');
  const white = document.querySelector('.noir-panels .panel--white');
  if (!black || !white) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      black.style.setProperty('--ty', (-y * 0.03).toFixed(2) + 'px');
      white.style.setProperty('--ty', (-y * 0.06).toFixed(2) + 'px');
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Splash icon persists on top (no auto hide)

// Intro lock: disable scroll until signature finishes
(function introLock(){
  const lock = document.querySelector('.intro-lock');
  document.body.classList.add('no-scroll');
  // Duration matches signature draw (0.6s delay + 2.6s draw + small margin)
  const total = 3200; // ms
  const end = () => {
    document.body.classList.remove('no-scroll');
    if (lock) lock.remove();
  };
  if (document.readyState === 'complete') {
    setTimeout(end, total);
  } else {
    window.addEventListener('load', () => setTimeout(end, total));
  }
})();

// Floating sparkles
// Sparkles are disabled in paper theme
(function sparkles(){
  if (['paper','leather','redhood','film','noir'].includes(document.body.dataset.theme)) return;
  const sky = document.querySelector('.sky');
  if (!sky) return;
  const count = 28;
  const frag = document.createDocumentFragment();
  for (let i=0;i<count;i++){
    const s = document.createElement('span');
    const size = Math.random()*2 + 1; // 1-3px
    s.style.position='absolute';
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.borderRadius='50%';
    s.style.background='rgba(255,255,255,.9)';
    s.style.boxShadow='0 0 8px rgba(255,255,255,.9)';
    const d = 6 + Math.random()*10;
    s.style.animation = `blink ${d}s ease-in-out ${Math.random()*10}s infinite`;
    frag.appendChild(s);
  }
  sky.appendChild(frag);
  const style = document.createElement('style');
  style.textContent = `@keyframes blink{0%,100%{opacity:.2; transform:translateY(0)} 50%{opacity:1; transform:translateY(-2px)}}`;
  document.head.appendChild(style);
})();

// Calendar embed is handled via iframe in HTML

// Simple lightbox for Gallery and Next Live images
(function lightbox(){
  const containers = [
    document.querySelector('#gallery'),
    document.querySelector('#next-live')
  ].filter(Boolean);
  if (!containers.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = '<button class="lb-close" aria-label="Close">Close</button><img alt="preview" />';
  document.body.appendChild(overlay);
  const imgEl = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lb-close');
  const open = (src, alt) => {
    imgEl.src = src;
    imgEl.alt = alt || 'preview';
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    imgEl.removeAttribute('src');
  };
  containers.forEach((container) => {
    container.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      // Avoid intercepting clicks on non-image elements (e.g., buttons)
      if (!container.contains(img)) return;
      e.preventDefault();
      open(img.currentSrc || img.src, img.alt);
    });
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();
