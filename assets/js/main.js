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
    const toggle = (open) => {
      setMenu(open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      toggle(!isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => toggle(false))
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) toggle(false);
    });
  }

  const COOKIE_KEY = 'ksv_cookies_accepted';
  const COOKIE_TTL = 180 * 24 * 60 * 60 * 1000;
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  const close = document.getElementById('cookie-close');
  const safeStorageGet = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeStorageSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Safari Private Mode и т.п. */ }
  };
  const hideBanner = (remember) => {
    banner?.classList.add('hidden');
    if (remember) safeStorageSet(COOKIE_KEY, String(Date.now()));
  };
  if (banner && accept) {
    const stored = safeStorageGet(COOKIE_KEY);
    if (!stored || Date.now() - Number(stored) > COOKIE_TTL) {
      setTimeout(() => banner.classList.remove('hidden'), 1500);
    }
    accept.addEventListener('click', () => hideBanner(true));
    close?.addEventListener('click', () => hideBanner(false));
  }

  const progress = document.getElementById('scroll-progress');
  const scrollGoals = { 50: false, 90: false };
  const trackScrollGoal = (pct) => {
    for (const threshold of [50, 90]) {
      if (!scrollGoals[threshold] && pct >= threshold / 100) {
        scrollGoals[threshold] = true;
        const goal = `scroll_${threshold}`;
        if (window.ym && window.YM_COUNTER_ID) {
          window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
        }
      }
    }
  };
  if (progress) {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const pct = Math.min(1, Math.max(0, scrolled / max));
      progress.style.transform = `scaleX(${pct})`;
      trackScrollGoal(pct);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
        let next = null;
        if (e.key === 'ArrowRight') next = pricingTabs[(idx + 1) % pricingTabs.length];
        else if (e.key === 'ArrowLeft') next = pricingTabs[(idx - 1 + pricingTabs.length) % pricingTabs.length];
        else if (e.key === 'Home') next = pricingTabs[0];
        else if (e.key === 'End') next = pricingTabs[pricingTabs.length - 1];
        if (!next) return;
        e.preventDefault();
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

  document.querySelectorAll('.device-row').forEach((row) => {
    const hidden = row.closest('form')?.querySelector('input[type="hidden"][name="device"]');
    row.querySelectorAll('.device-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.device-chip').forEach((c) => {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        if (hidden) hidden.value = chip.getAttribute('data-device') || '';
      });
    });
  });

  if (!prefersReducedMotion) {
    document.querySelectorAll('.svc-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      });
    });
  }

  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) sectionMap.set(sec, link);
  });
  if (sectionMap.size && 'IntersectionObserver' in window) {
    const setActive = (link) => {
      navLinks.forEach((l) => {
        const isActive = l === link;
        l.classList.toggle('text-white', isActive);
        l.classList.toggle('text-white/75', !isActive);
        if (isActive) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    };
    const spy = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const link = sectionMap.get(visible.target);
        if (link) setActive(link);
      }
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sectionMap.forEach((_, sec) => spy.observe(sec));
  }

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
