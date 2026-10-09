/* =========================================================
   WIMO — Landing page · script.js
   1. Animações de entrada  2. Menu mobile  3. Header  4. Extras
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. ANIMAÇÕES DE ENTRADA (fade-in + slide-up) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // anima só uma vez
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Navegadores antigos: mostra tudo sem animação
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 2. MENU MOBILE + SMOOTH SCROLL ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menuToggle');

  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

  // Rolagem suave nos links internos (o CSS já cuida do offset do header)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', id);
      setMenu(false);
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- 3. SOMBRA DO HEADER AO ROLAR ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. BOLHAS ANIMADAS ---------- */
  // Cada bolha sobe em velocidade própria conforme a rolagem (efeito parallax)
  // e balança sozinha via CSS. Ao sair pelo topo, reaparece por baixo.
  const bubbleLayer = document.getElementById('bubbles');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#A8E6D2', '#4FCDAA', '#CDBFF0', '#9C86D0'];
  const count = window.innerWidth < 760 ? 9 : 16;
  const bubbles = [];

  for (let i = 0; i < count; i++) {
    const size = 24 + Math.random() * 90;
    const el = document.createElement('div');
    el.className = 'bubble';
    el.style.width = el.style.height = size + 'px';
    el.style.left = Math.random() * 96 + '%';
    el.style.setProperty('--bubble-color', COLORS[i % COLORS.length]);
    el.style.setProperty('--bubble-opacity', (0.22 + Math.random() * 0.25).toFixed(2));
    el.style.setProperty('--sway', (6 + Math.random() * 6).toFixed(1) + 's');
    el.innerHTML = '<i></i>';
    bubbleLayer.appendChild(el);
    bubbles.push({ el, size, speed: 0.04 + Math.random() * 0.22, base: Math.random() * 1000 });
  }

  let ticking = false;
  const moveBubbles = () => {
    const vh = window.innerHeight;
    const y = window.scrollY;
    bubbles.forEach(b => {
      const range = vh + b.size * 2;
      const pos = (((b.base - y * b.speed) % range) + range) % range;
      b.el.style.transform = `translate3d(0, ${pos - b.size}px, 0)`;
    });
    ticking = false;
  };
  moveBubbles();

  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(moveBubbles); }
    }, { passive: true });
    window.addEventListener('resize', moveBubbles);
  }

  /* ---------- 5. EXTRAS ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();