(() => {
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('burger-icon-open');
  const iconClose = document.getElementById('burger-icon-close');

  const setMenu = (open) => {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    burger?.setAttribute('aria-expanded', String(open));
    iconOpen?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
    burger?.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      setMenu(!isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => setMenu(false))
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) setMenu(false);
    });
  }

  const COOKIE_KEY = 'ksv_cookies_accepted';
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  const close = document.getElementById('cookie-close');
  const hideBanner = (remember) => {
    banner?.classList.add('hidden');
    if (remember) localStorage.setItem(COOKIE_KEY, String(Date.now()));
  };
  if (banner && accept) {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setTimeout(() => banner.classList.remove('hidden'), 1500);
    }
    accept.addEventListener('click', () => hideBanner(true));
    close?.addEventListener('click', () => hideBanner(false));
  }

  let lenis = null;
  if (!prefersReducedMotion && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      });
    });
  }

  const progress = document.getElementById('scroll-progress');
  if (progress) {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const pct = Math.min(1, Math.max(0, scrolled / max));
      progress.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  if (!prefersReducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.25;
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.setProperty('--mx', `${x * strength}px`);
        el.style.setProperty('--my', `${y * strength}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  const mobileCta = document.getElementById('mobile-cta');
  const hero = document.getElementById('hero');
  if (mobileCta && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const shown = !entry.isIntersecting;
        mobileCta.classList.toggle('translate-y-full', !shown);
      });
    }, { threshold: 0.05 });
    io.observe(hero);
  }

  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const pricingPanels = document.querySelectorAll('.pricing-panel');
  if (pricingTabs.length && pricingPanels.length) {
    const activate = (key) => {
      pricingTabs.forEach((tab) => {
        const isActive = tab.getAttribute('data-tab') === key;
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      pricingPanels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.getAttribute('data-panel') !== key);
      });
      if (window.ym && window.YM_COUNTER_ID) {
        window.ym(window.YM_COUNTER_ID, 'reachGoal', 'price_tab_switch');
      }
    };
    pricingTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => activate(tab.getAttribute('data-tab')));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = pricingTabs[(idx + dir + pricingTabs.length) % pricingTabs.length];
        next.focus();
        activate(next.getAttribute('data-tab'));
      });
    });
  }

  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      const goal = el.getAttribute('data-track');
      if (window.ym && window.YM_COUNTER_ID) {
        window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
      }
      if (!window.__trackLog) window.__trackLog = [];
      window.__trackLog.push({ goal, at: new Date().toISOString() });
    });
  });

  const reviewsTrack = document.getElementById('reviews-track');
  const reviewsPrev = document.getElementById('reviews-prev');
  const reviewsNext = document.getElementById('reviews-next');
  if (reviewsTrack && (reviewsPrev || reviewsNext)) {
    const step = () => {
      const first = reviewsTrack.querySelector('.reviews-card');
      if (!first) return reviewsTrack.clientWidth * 0.9;
      const gap = parseFloat(getComputedStyle(reviewsTrack).gap) || 20;
      return first.getBoundingClientRect().width + gap;
    };
    reviewsPrev?.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    reviewsNext?.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.work-view').forEach((view) => {
    const range = view.querySelector('.work-range');
    if (!range) return;
    const apply = (val) => {
      view.style.setProperty('--pos', `${val}%`);
    };
    apply(range.value);
    range.addEventListener('input', () => apply(range.value));
  });

  const privacyModal = document.getElementById('privacy-modal');
  if (privacyModal && typeof privacyModal.showModal === 'function') {
    const openModal = () => {
      if (!privacyModal.open) privacyModal.showModal();
    };
    const closeModal = () => {
      if (privacyModal.open) privacyModal.close();
    };

    document.querySelectorAll('a[href="#privacy"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    privacyModal.querySelectorAll('[data-privacy-close]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });

    privacyModal.addEventListener('click', (e) => {
      const rect = privacyModal.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) closeModal();
    });

    if (location.hash === '#privacy') {
      setTimeout(openModal, 50);
    }
    window.addEventListener('hashchange', () => {
      if (location.hash === '#privacy') openModal();
    });
  }
})();
