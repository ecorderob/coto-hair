/* =========================================================
   Coto Hair — Site JS
   - Mobile nav toggle
   - Smooth-scroll close on nav link tap
   - Scroll reveal via IntersectionObserver
   - Current-year stamp
   ========================================================= */

(() => {
  'use strict';

  // ---------- Nav toggle ----------
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const iconOpen = document.querySelector('[data-icon-open]');
  const iconClose = document.querySelector('[data-icon-close]');

  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      // The icons are <svg>, and SVG elements have no .hidden property —
      // assigning to it would only create a JS expando. Toggle the attribute.
      if (iconOpen && iconClose) {
        iconOpen.toggleAttribute('hidden', open);
        iconClose.toggleAttribute('hidden', !open);
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      setOpen(!isOpen);
    });

    // Close on link click (mobile only)
    menu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && window.matchMedia('(max-width: 899px)').matches) {
        setOpen(false);
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });

    // Reset when crossing breakpoint
    const mq = window.matchMedia('(min-width: 900px)');
    mq.addEventListener('change', (ev) => {
      if (ev.matches) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (iconOpen && iconClose) {
          iconOpen.removeAttribute('hidden');
          iconClose.setAttribute('hidden', '');
        }
      }
    });
  }

  // ---------- Scroll reveal ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => io.observe(el));
  }

  // ---------- Year stamp ----------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
