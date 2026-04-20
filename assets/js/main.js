(() => {
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
      setTimeout(() => banner.classList.remove('hidden'), 1200);
    }
    accept.addEventListener('click', () => hideBanner(true));
    close?.addEventListener('click', () => hideBanner(false));
  }

  const header = document.getElementById('site-header');
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('shadow-[0_8px_32px_rgba(0,0,0,0.4)]', y > 24);
    }
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      const goal = el.getAttribute('data-track');
      if (window.ym && window.YM_COUNTER_ID) {
        window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
      }
      if (!window.__trackLog) window.__trackLog = [];
      window.__trackLog.push({ goal, at: new Date().toISOString() });
    });
  });
})();
