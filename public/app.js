document.documentElement.classList.add('js');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hasObserver = 'IntersectionObserver' in window;

/* Mobile menu */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  menuButton.hidden = false;
  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    menuButton.firstChild.textContent = open ? menuButton.dataset.close : menuButton.dataset.open;
  };
  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 851px)').addEventListener('change', () => setOpen(false));
}

/* Links to a FAQ question open its answer */
const openDetails = (hash) => {
  const target = hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target instanceof HTMLDetailsElement) target.open = true;
};
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link) openDetails(link.getAttribute('href'));
});
addEventListener('hashchange', () => openDetails(location.hash));
openDetails(location.hash);

/* Header shadow and reading progress */
const header = document.querySelector('.header');
const progress = document.querySelector('.scroll-progress');
let scrollQueued = false;
const onScroll = () => {
  scrollQueued = false;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 8);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
};
addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

/* Reveal blocks as they scroll into view. Hidden states only exist in CSS
   when the visitor accepts motion, so content stays visible otherwise. */
const revealGroups = [
  '.section-heading', '.review-heading', '[data-carousel]',
  '.problem-grid > *', '.treatment-card', '.team-copy > *', '.steps li', '.plan-action',
  '.prices-layout > div:first-child', '.price-row', '.faq-layout > div:first-child', '.faq-item',
  '.location-copy > *', '.location-map', '.final-grid > *', '.bio-grid > div > *', '.timeline li',
  '.cv-content > *', '.cv-list li', '.cv-members li', '.gallery-grid figcaption',
  '.training-grid > *', '.contact-grid > *', '.technique-layout > *', '.footer-grid > div',
];
const revealImages = '.team-grid figure, .location-photo, .gallery-grid figure, .cv-photo';

if (hasObserver) {
  const revealer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  for (const selector of revealGroups) {
    for (const element of document.querySelectorAll(selector)) {
      if (element.classList.contains('reveal') || element.closest('.hero, .page-hero')) continue;
      if (!element.matches('[data-carousel]') && element.closest('[data-carousel]')) continue;
      const siblings = [...element.parentElement.children].filter((child) => child.matches(selector));
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 5) * 90}ms`);
      revealer.observe(element);
    }
  }
  for (const figure of document.querySelectorAll(revealImages)) {
    figure.classList.add('reveal-img');
    revealer.observe(figure);
  }
  addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal, .reveal-img').forEach((element) => element.classList.add('is-visible'));
  });
}

/* Count up the Google rating when it appears */
const counters = document.querySelectorAll('[data-count]');
if (hasObserver && counters.length && !reduceMotion.matches) {
  const lang = document.documentElement.lang || 'es';
  const counterObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counterObserver.unobserve(entry.target);
      const element = entry.target;
      const target = Number.parseFloat(element.dataset.count);
      const decimals = (element.dataset.count.split('.')[1] || '').length;
      const format = (value) => value.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        element.textContent = format(target * (1 - (1 - p) ** 3));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));
}

/* Carousels: native horizontal scroll, enhanced with buttons, drag and (reviews only) autoplay */
for (const carousel of document.querySelectorAll('[data-carousel]')) {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  const controls = carousel.querySelector('.carousel-controls');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const toggle = carousel.querySelector('[data-toggle]');
  const bar = carousel.querySelector('.carousel-progress > span');
  const status = carousel.querySelector('.carousel-status');
  if (!track || slides.length < 2 || !controls) continue;
  const autoplay = carousel.hasAttribute('data-autoplay') && toggle;

  controls.hidden = false;
  carousel.classList.add('is-enhanced');

  const behavior = () => (reduceMotion.matches ? 'auto' : 'smooth');
  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const go = (direction) => {
    if (direction > 0 && track.scrollLeft >= maxScroll() - 4) track.scrollTo({ left: 0, behavior: behavior() });
    else if (direction < 0 && track.scrollLeft <= 4) track.scrollTo({ left: maxScroll(), behavior: behavior() });
    else track.scrollBy({ left: direction * step(), behavior: behavior() });
  };

  const update = () => {
    const max = maxScroll();
    const perView = Math.max(1, Math.round(track.clientWidth / step()));
    const first = Math.round(track.scrollLeft / step());
    const last = Math.min(slides.length, first + perView);
    bar.style.transform = `scaleX(${max > 0 ? Math.max(last / slides.length, track.scrollLeft / max) : 1})`;
    status.textContent = `${last} / ${slides.length}`;
  };
  let updateQueued = false;
  track.addEventListener('scroll', () => {
    if (!updateQueued) {
      updateQueued = true;
      requestAnimationFrame(() => { updateQueued = false; update(); });
    }
  }, { passive: true });
  addEventListener('resize', update);
  update();

  let userPaused = !autoplay || reduceMotion.matches;
  let hovering = false;
  let focused = false;
  let visible = false;
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    if (!userPaused && !hovering && !focused && visible && !document.hidden) {
      timer = setTimeout(() => { go(1); schedule(); }, 5000);
    }
  };
  const setPaused = (paused) => {
    userPaused = paused;
    if (toggle) toggle.textContent = paused ? toggle.dataset.play : toggle.dataset.pause;
    schedule();
  };
  setPaused(userPaused);

  prev.addEventListener('click', () => { go(-1); schedule(); });
  next.addEventListener('click', () => { go(1); schedule(); });
  toggle?.addEventListener('click', () => setPaused(!userPaused));
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) { focused = false; schedule(); }
  });
  track.addEventListener('touchstart', () => setPaused(true), { passive: true });
  document.addEventListener('visibilitychange', schedule);
  if (hasObserver) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: 0.35 }).observe(carousel);
  }

  /* Drag with a mouse, like a touch swipe */
  let dragStart = null;
  let moved = false;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('summary, button')) return;
    dragStart = { x: event.clientX, left: track.scrollLeft };
    moved = false;
  });
  addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const delta = event.clientX - dragStart.x;
    if (!moved && Math.abs(delta) < 6) return;
    if (!moved) { moved = true; track.classList.add('is-dragging'); }
    track.scrollLeft = dragStart.left - delta;
  });
  /* A drag over a card link must not also open the link */
  track.addEventListener('click', (event) => {
    if (moved) { event.preventDefault(); moved = false; }
  }, true);
  track.addEventListener('dragstart', (event) => event.preventDefault());
  addEventListener('pointerup', () => {
    if (!dragStart) return;
    dragStart = null;
    if (!moved) return;
    setTimeout(() => { moved = false; }, 0);
    const left = track.scrollLeft;
    track.classList.remove('is-dragging');
    track.scrollLeft = left;
    track.scrollTo({ left: Math.round(left / step()) * step(), behavior: behavior() });
  });
}
