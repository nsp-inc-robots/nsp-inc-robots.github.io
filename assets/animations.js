/* =====================================================
   NSP inc. — Page Animations v1
   Apple-inspired scroll-reveal & entrance system
   ===================================================== */

(function () {
  'use strict';

  /* Skip if reduced motion preferred or browser too old */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof IntersectionObserver === 'undefined') return;

  /* ─── IntersectionObserver ─── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.07,
    rootMargin: '0px 0px -44px 0px'
  });

  /* ─── Helpers ─── */
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /* Mark element for scroll-reveal */
  function scrollReveal(el, delay) {
    if (!el) return;
    el.setAttribute('data-anim', '');
    if (delay) el.style.transitionDelay = delay + 's';
    io.observe(el);
  }

  /* Stagger direct children of a grid container */
  function staggerGrid(gridSel, step) {
    $$(gridSel).forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, i) {
        scrollReveal(child, i * step);
      });
    });
  }

  /* Apply CSS keyframe entrance (hero elements) */
  function heroEnter(el, delay) {
    if (!el) return;
    el.classList.add('hero-enter');
    el.style.animationDelay = delay + 's';
  }

  /* ─── Main init ─── */
  function init() {

    /* ── index.html hero: staggered entrance on page load ── */
    var heroWrap = document.querySelector('.hero-section > .container');
    if (heroWrap) {
      $$(  '.section-eyebrow', heroWrap).forEach(function (el) { heroEnter(el, 0); });
      $$('.display-text',      heroWrap).forEach(function (el) { heroEnter(el, 0.14); });
      $$('h1',                 heroWrap).forEach(function (el) { heroEnter(el, 0.14); });
      $$('.lead-text',         heroWrap).forEach(function (el) { heroEnter(el, 0.28); });
      $$('.hero-actions',      heroWrap).forEach(function (el) { heroEnter(el, 0.42); });
    }

    /* ── press article hero: staggered entrance on page load ── */
    var pressHero = document.querySelector('.press-hero > .container');
    if (pressHero) {
      $$('.press-back',  pressHero).forEach(function (el) { heroEnter(el, 0); });
      $$('.press-meta',  pressHero).forEach(function (el) { heroEnter(el, 0.12); });
      $$('.press-title', pressHero).forEach(function (el) { heroEnter(el, 0.24); });
    }

    /* ── press index hero ── */
    var pressIndex = document.querySelector('.section-header');
    if (pressIndex && !heroWrap && !pressHero) {
      /* first section header on pages without a dedicated hero */
    }

    /* ── scroll-reveal: single elements ── */
    [
      '.section-header',
      '.cta-heading',
      '.cta-sub',
      '.contact-offer-list',
      '.articles-more',
      '.footer-inner',
    ].forEach(function (sel) {
      $$(sel).forEach(function (el) { scrollReveal(el, 0); });
    });

    /* lead-text outside hero zones */
    $$('.lead-text').forEach(function (el) {
      if (!el.closest('.hero-section') && !el.closest('.press-hero')) {
        scrollReveal(el, 0);
      }
    });

    /* ── staggered grids ── */
    staggerGrid('.services-grid', 0.12);
    staggerGrid('.products-grid', 0.10);
    staggerGrid('.articles-grid', 0.08);
    staggerGrid('.contact-grid',  0.10);

    /* ── press body: block-by-block scroll reveal ── */
    $$('.press-body').forEach(function (body) {
      Array.from(body.children).forEach(function (child) {
        scrollReveal(child, 0);
      });
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
