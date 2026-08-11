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
// =========================================================
// NOLIA — KOSZYK
// =========================================================

const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');

const minusBtn = document.getElementById('minusBtn');
const plusBtn = document.getElementById('plusBtn');
const removeProduct = document.getElementById('removeProduct');

const quantityElement = document.getElementById('quantity');
const productTotal = document.getElementById('productTotal');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');

const PRODUCT_PRICE = 179.99;

let quantity = 1;


// ===== OTWIERANIE =====

function openCart(){

  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');

  cartDrawer.setAttribute('aria-hidden', 'false');

  document.body.classList.add('cart-open');
}


// ===== ZAMYKANIE =====

function closeCart(){

  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');

  cartDrawer.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('cart-open');
}


cartBtn?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);


// ESC zamyka koszyk

document.addEventListener('keydown', event => {

  if(event.key === 'Escape'){
    closeCart();
  }

});


// ===== AKTUALIZACJA CENY =====

function updateCart(){

  const total = PRODUCT_PRICE * quantity;

  quantityElement.textContent = quantity;

  const formattedPrice =
    total.toLocaleString('pl-PL', {
      style:'currency',
      currency:'PLN'
    });

  productTotal.textContent = formattedPrice;
  cartTotal.textContent = formattedPrice;

  cartBadge.textContent = quantity;

  cartBadge.style.display =
    quantity > 0 ? 'flex' : 'none';
}


// ===== PLUS =====

plusBtn?.addEventListener('click', () => {

  quantity++;

  updateCart();

});


// ===== MINUS =====

minusBtn?.addEventListener('click', () => {

  if(quantity > 1){

    quantity--;

    updateCart();

  }

});


// ===== USUWANIE =====

removeProduct?.addEventListener('click', () => {

  quantity = 0;

  cartBadge.style.display = 'none';

  const cartBody = document.querySelector('.cart-body');
  const cartFooter = document.querySelector('.cart-footer');

  cartBody.innerHTML = `
    <div class="cart-empty">

      <div class="cart-empty-icon">🛍️</div>

      <h3>Twój koszyk jest pusty</h3>

      <p>
        Dodaj Nolia i zadbaj o swój uśmiech.
      </p>

    </div>
  `;

  cartFooter.style.display = 'none';

});


// ===== START =====

updateCart();
