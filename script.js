// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL = "https://dkdxlxzeqdfjbkzyhwhl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hHFIxnCUsBDQXdSMW8_5Hg_owwNl0V4";

const CREATE_ORDER_URL =
  `${SUPABASE_URL}/functions/v1/create-order`;
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
// =========================================================
// NOLIA — CHECKOUT
// =========================================================

const checkout = document.getElementById('checkout');

const checkoutBack =
  document.getElementById('checkoutBack');

const checkoutExit =
  document.getElementById('checkoutExit');

const checkoutSteps =
  [...document.querySelectorAll('.checkout-step')];

const progressItems =
  [...document.querySelectorAll('.progress-item')];

const deliveryCards =
  [...document.querySelectorAll('.delivery-card')];

const paymentCards =
  [...document.querySelectorAll('.payment-card')];

const lockerFields =
  document.getElementById('lockerFields');

const courierFields =
  document.getElementById('courierFields');

const blikFields =
  document.getElementById('blikFields');

const cardFields =
  document.getElementById('cardFields');

const appleFields =
  document.getElementById('appleFields');


let checkoutStep = 1;

let selectedDelivery = 'paczkomat';

let deliveryPrice = 12.99;

let selectedPayment = 'blik';


/* ================================
   OTWIERANIE CHECKOUT
================================ */

checkoutBtn?.addEventListener('click', () => {

  closeCart();

  checkout.classList.add('open');

  checkout.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'checkout-open'
  );

  updateCheckoutPrices();

});
// ===== KUP TERAZ =====

const buyNowButtons = document.querySelectorAll('.buy-now');

buyNowButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Jeżeli produkt był wcześniej usunięty z koszyka,
    // przywracamy minimum 1 sztukę
    if (quantity < 1) {
      quantity = 1;
      updateCart();
    }

    // Otwórz koszyk
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
  });
});

/* ================================
   ZAMYKANIE
================================ */

function closeCheckout(){

  checkout.classList.remove('open');

  checkout.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'checkout-open'
  );

}


checkoutExit?.addEventListener(
  'click',
  closeCheckout
);


/* ================================
   ZMIANA KROKU
================================ */

function showCheckoutStep(step){

  checkoutStep = step;

  checkoutSteps.forEach(section => {

    const sectionStep =
      Number(section.dataset.step);

    section.classList.toggle(
      'active',
      sectionStep === step
    );

  });


  progressItems.forEach(item => {

    const itemStep =
      Number(item.dataset.progress);

    item.classList.toggle(
      'active',
      itemStep === step
    );

    item.classList.toggle(
      'done',
      itemStep < step
    );

  });


  checkout.scrollTo({
    top:0,
    behavior:'smooth'
  });

}


/* ================================
   WALIDACJA DANYCH
================================ */

function validateCustomer(){

  const fields = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('email'),
    document.getElementById('phone')
  ];

  let valid = true;

  fields.forEach(field => {

    field.classList.remove('error');

    if(!field.value.trim()){

      field.classList.add('error');

      valid = false;

    }

  });


  const email =
    document.getElementById('email');

  if(
    email.value &&
    !email.value.includes('@')
  ){

    email.classList.add('error');

    valid = false;

  }


  return valid;

}


/* ================================
   NEXT
================================ */

document
  .querySelectorAll('.checkout-next')
  .forEach(button => {

    button.addEventListener('click', () => {

      const next =
        Number(button.dataset.next);


      if(
        checkoutStep === 1 &&
        !validateCustomer()
      ){
        return;
      }


      if(checkoutStep === 2){

        if(
          selectedDelivery === 'paczkomat'
        ){

          const locker =
            document.getElementById('locker');

          locker.classList.remove('error');

          if(!locker.value.trim()){

            locker.classList.add('error');

            return;

          }

        }


        if(
          selectedDelivery === 'kurier'
        ){

          const addressFields = [
            document.getElementById('street'),
            document.getElementById('postal'),
            document.getElementById('city')
          ];


          let addressValid = true;


          addressFields.forEach(field => {

            field.classList.remove('error');

            if(!field.value.trim()){

              field.classList.add('error');

              addressValid = false;

            }

          });


          if(!addressValid){
            return;
          }

        }

      }


      showCheckoutStep(next);

      updateCheckoutPrices();

    });

});


/* ================================
   WSTECZ
================================ */

checkoutBack?.addEventListener(
  'click',
  () => {

    if(checkoutStep > 1){

      showCheckoutStep(
        checkoutStep - 1
      );

    }else{

      closeCheckout();

      openCart();

    }

  }
);


/* ================================
   DOSTAWA
================================ */

deliveryCards.forEach(card => {

  card.addEventListener('click', () => {

    deliveryCards.forEach(c =>
      c.classList.remove('selected')
    );

    card.classList.add('selected');


    selectedDelivery =
      card.dataset.delivery;


    deliveryPrice =
      Number(card.dataset.price);


    if(
      selectedDelivery === 'paczkomat'
    ){

      lockerFields.classList.remove(
        'hidden'
      );

      courierFields.classList.add(
        'hidden'
      );

    }else{

      lockerFields.classList.add(
        'hidden'
      );

      courierFields.classList.remove(
        'hidden'
      );

    }


    updateCheckoutPrices();

  });

});


/* ================================
   PŁATNOŚĆ
================================ */

paymentCards.forEach(card => {

  card.addEventListener('click', () => {

    paymentCards.forEach(c =>
      c.classList.remove('selected')
    );

    card.classList.add('selected');


    selectedPayment =
      card.dataset.payment;


    blikFields.classList.toggle(
      'hidden',
      selectedPayment !== 'blik'
    );


    cardFields.classList.toggle(
      'hidden',
      selectedPayment !== 'card'
    );


    appleFields.classList.toggle(
      'hidden',
      selectedPayment !== 'apple'
    );

  });

});


/* ================================
   CENY
================================ */

function formatPLN(value){

  return value.toLocaleString(
    'pl-PL',
    {
      style:'currency',
      currency:'PLN'
    }
  );

}


function updateCheckoutPrices(){

  const products =
    PRODUCT_PRICE * quantity;


  const grandTotal =
    products + deliveryPrice;


  document
    .getElementById('checkoutQuantity')
    .textContent =
    quantity;


  document
    .getElementById('checkoutProducts')
    .textContent =
    formatPLN(products);


  document
    .getElementById('checkoutDelivery')
    .textContent =
    formatPLN(deliveryPrice);


  document
    .getElementById('checkoutGrandTotal')
    .textContent =
    formatPLN(grandTotal);


  document
    .getElementById('payButtonPrice')
    .textContent =
    formatPLN(grandTotal);

}


/* ================================
   BLIK — tylko cyfry
================================ */

const blikCode =
  document.getElementById('blikCode');


blikCode?.addEventListener(
  'input',
  () => {

    blikCode.value =
      blikCode.value
        .replace(/\D/g,'')
        .slice(0,6);

  }
);


/* ================================
   DEMO PŁATNOŚCI
================================ */

const payBtn =
  document.getElementById('payBtn');


payBtn?.addEventListener(
  'click',
  () => {

    /*
      WAŻNE:

      Na tym etapie NIE wykonujemy
      prawdziwej płatności.

      Tutaj później podłączymy
      Stripe / Przelewy24 / innego
      operatora.
    */


    if(selectedPayment === 'blik'){

      if(
        blikCode.value.length !== 6
      ){

        blikCode.classList.add(
          'error'
        );

        return;

      }

    }


    payBtn.disabled = true;

    payBtn.innerHTML = `
      <span>Przetwarzanie...</span>
      <strong>•••</strong>
    `;


    setTimeout(() => {

      const order =
        'NOL-' +
        Math.floor(
          1000 +
          Math.random() * 9000
        );


      document
        .getElementById('orderNumber')
        .textContent =
        order;


      document
        .getElementById('successEmail')
        .textContent =
        document
          .getElementById('email')
          .value;


      showCheckoutStep(4);


      payBtn.disabled = false;

      payBtn.innerHTML = `
        <span>Zamawiam i płacę</span>
        <strong id="payButtonPrice"></strong>
      `;


      updateCheckoutPrices();

    },1200);

  }
);


/* ================================
   KONIEC
================================ */

document
  .getElementById('finishCheckout')
  ?.addEventListener(
    'click',
    () => {

      closeCheckout();

      window.scrollTo({
        top:0,
        behavior:'smooth'
      });

    }
  );
 // =========================================================
// NOLIA — TWORZENIE ZAMÓWIENIA W SUPABASE
// =========================================================

const placeOrderBtn = document.getElementById("placeOrderBtn");
const termsCheckbox = document.getElementById("termsCheckbox");


// =========================================================
// TWORZENIE ZAMÓWIENIA
// =========================================================

async function createOrder() {

  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();


  // =========================
  // WALIDACJA DANYCH
  // =========================

  if (!firstName || !lastName || !email || !phone) {

    alert("Uzupełnij dane klienta.");

    showCheckoutStep(1);

    return null;
  }


  // =========================
  // DOSTAWA
  // =========================

  const selectedDeliveryCard =
    document.querySelector(".delivery-card.selected");


  if (!selectedDeliveryCard) {

    alert("Wybierz sposób dostawy.");

    showCheckoutStep(2);

    return null;
  }


  const deliveryMethod =
    selectedDeliveryCard.dataset.delivery;


  // =========================
  // DANE ZAMÓWIENIA
  // =========================

  const orderData = {

    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,

    quantity: quantity,

    deliveryMethod: deliveryMethod

  };


  // =========================
  // PACZKOMAT
  // =========================

  if (deliveryMethod === "paczkomat") {

    const locker =
      document.getElementById("locker").value.trim();


    if (!locker) {

      alert("Wpisz Paczkomat.");

      showCheckoutStep(2);

      return null;
    }


    orderData.locker = locker;
  }


  // =========================
  // KURIER
  // =========================

  if (deliveryMethod === "kurier") {

    const street =
      document.getElementById("street").value.trim();

    const postalCode =
      document.getElementById("postal").value.trim();

    const city =
      document.getElementById("city").value.trim();


    if (!street || !postalCode || !city) {

      alert("Uzupełnij adres dostawy.");

      showCheckoutStep(2);

      return null;
    }


    orderData.street = street;
    orderData.postalCode = postalCode;
    orderData.city = city;
  }


  // =========================
  // WYSŁANIE DO SUPABASE
  // =========================

  const response = await fetch(
    CREATE_ORDER_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_PUBLISHABLE_KEY
      },

      body: JSON.stringify(orderData)
    }
  );


  // próbujemy odczytać odpowiedź
  let result;

  try {

    result = await response.json();

  } catch {

    throw new Error(
      "Serwer zwrócił nieprawidłową odpowiedź."
    );

  }


  if (!response.ok) {

    console.error(
      "Błąd Supabase:",
      result
    );

    throw new Error(
      result.error ||
      "Nie udało się utworzyć zamówienia."
    );

  }


  return result;
}


// =========================================================
// PRZYCISK „ZAMAWIAM”
// =========================================================

placeOrderBtn?.addEventListener(
  "click",
  async () => {


    // =========================
    // REGULAMIN
    // =========================

    if (!termsCheckbox?.checked) {

      alert(
        "Zaakceptuj regulamin sklepu."
      );

      termsCheckbox?.focus();

      return;
    }


    // =========================
    // BLOKADA PRZYCISKU
    // =========================

    placeOrderBtn.disabled = true;

    const originalHTML =
      placeOrderBtn.innerHTML;


    placeOrderBtn.innerHTML = `
      <span>Tworzymy zamówienie...</span>
      <strong>•••</strong>
    `;


    try {

      // =========================
      // TWORZYMY ZAMÓWIENIE
      // =========================

      const order =
        await createOrder();


      if (!order) {
        return;
      }


      console.log(
        "Utworzono zamówienie:",
        order
      );


      // =========================
      // NUMER ZAMÓWIENIA
      // =========================

      const orderNumber =
        order.orderNumber;


      if (!orderNumber) {

        throw new Error(
          "Serwer nie zwrócił numeru zamówienia."
        );

      }


      document
        .getElementById("orderNumber")
        .textContent =
        orderNumber;


      document
        .getElementById("transferTitle")
        .textContent =
        orderNumber;


      // =========================
      // KWOTA
      // =========================

      const total =
        Number(order.total);


      if (Number.isNaN(total)) {

        throw new Error(
          "Serwer zwrócił nieprawidłową kwotę."
        );

      }


      document
        .getElementById("transferAmount")
        .textContent =
        formatPLN(total);


      // =========================
      // EMAIL
      // =========================

      document
        .getElementById("successEmail")
        .textContent =
        document
          .getElementById("email")
          .value
          .trim();


      // =========================
      // SUKCES
      // =========================

      showCheckoutStep(4);


    } catch (error) {

      console.error(
        "Błąd tworzenia zamówienia:",
        error
      );


      alert(
        "Nie udało się utworzyć zamówienia.\n\n" +
        error.message
      );


    } finally {

      placeOrderBtn.disabled = false;

      placeOrderBtn.innerHTML =
        originalHTML;

    }

  }
);


// =========================================================
// KOPIOWANIE DANYCH PRZELEWU
// =========================================================

document
  .querySelectorAll(".copy-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const element =
          document.getElementById(
            button.dataset.copy
          );


        if (!element) {
          return;
        }


        try {

          await navigator.clipboard.writeText(
            element.textContent.trim()
          );


          const oldText =
            button.textContent;


          button.textContent =
            "Skopiowano ✓";


          setTimeout(() => {

            button.textContent =
              oldText;

          }, 1300);


        } catch (error) {

          console.error(
            "Nie udało się skopiować:",
            error
          );

        }

      }
    );

  });
