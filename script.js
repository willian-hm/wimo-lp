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

  /* ---------- 4. EXTRAS ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
