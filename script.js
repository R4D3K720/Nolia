const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// Opcjonalnie: delikatne podświetlenie kropek opinii podczas przewijania na telefonie.
const track = document.getElementById('reviewsTrack');
const dots = [...document.querySelectorAll('.dots span')];

if (track && dots.length) {
  track.addEventListener('scroll', () => {
    const cards = [...track.querySelectorAll('.review-card')];
    if (!cards.length) return;

    let bestIndex = 0;
    let bestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    dots.forEach((dot, index) => dot.classList.toggle('active', index === bestIndex));
  }, { passive: true });
}


// ===== Animacje przy scrollowaniu =====
const animatedGroups = document.querySelectorAll('.reveal, .reveal-stagger');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -45px 0px'
  });

  animatedGroups.forEach(el => revealObserver.observe(el));
} else {
  animatedGroups.forEach(el => el.classList.add('is-visible'));
}

// ===== Navbar reagujący na scroll =====
const siteHeader = document.querySelector('.site-header');
const updateHeader = () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 14);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// ===== Subtelny efekt parallax hero tylko na desktopie =====
const heroMedia = document.querySelector('.hero-product');
if (heroMedia && window.matchMedia('(min-width: 681px) and (prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const rect = heroMedia.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const shift = Math.max(-10, Math.min(10, (window.innerHeight / 2 - rect.top) * 0.018));
    heroMedia.style.translate = `0 ${shift}px`;
  }, { passive: true });
}
