/* ============================================================
   Nilu Bhai Shoes — E-commerce product page
   Gallery, lightbox, cart, quantity, mobile nav
   ============================================================ */

"use strict";

const PRODUCT = {
  name: "Fall Limited Edition Sneakers",
  price: 125.0,
  images: [
    { src: "./images/image-product-1.jpg", thumb: "./images/image-product-1-thumbnail.jpg" },
    { src: "./images/image-product-2.jpg", thumb: "./images/image-product-2-thumbnail.jpg" },
    { src: "./images/image-product-3.jpg", thumb: "./images/image-product-3-thumbnail.jpg" },
    { src: "./images/image-product-4.jpg", thumb: "./images/image-product-4-thumbnail.jpg" },
  ],
};

const state = {
  imageIndex: 0,
  quantity: 0,
  cartCount: 0, // total units in cart
};

const formatPrice = (value) => `$${value.toFixed(2)}`;

/* ---------- Element refs ---------- */

const mainImage = document.getElementById("mainImage");
const galleryMain = document.getElementById("galleryMain");
const pageThumbs = document.querySelectorAll(".gallery__thumbs .thumb");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxThumbs = document.querySelectorAll(".lightbox__thumbs .thumb");

const prevImageBtn = document.getElementById("prevImage");
const nextImageBtn = document.getElementById("nextImage");

const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const qtyValue = document.getElementById("qtyValue");

const addToCartBtn = document.getElementById("addToCart");
const cartToggle = document.getElementById("cartToggle");
const cartBadge = document.getElementById("cartBadge");
const cartDropdown = document.getElementById("cartDropdown");
const cartBody = document.getElementById("cartBody");

const mobileNav = document.getElementById("mobileNav");
const menuOpen = document.getElementById("menuOpen");

/* ---------- Gallery ---------- */

function setImage(index) {
  state.imageIndex = (index + PRODUCT.images.length) % PRODUCT.images.length;
  const { src } = PRODUCT.images[state.imageIndex];
  const alt = `${PRODUCT.name}, view ${state.imageIndex + 1}`;

  mainImage.src = src;
  mainImage.alt = alt;
  lightboxImage.src = src;
  lightboxImage.alt = alt;

  pageThumbs.forEach((thumb, i) => {
    thumb.classList.toggle("is-active", i === state.imageIndex);
    thumb.setAttribute("aria-current", i === state.imageIndex ? "true" : "false");
  });
  lightboxThumbs.forEach((thumb, i) => {
    thumb.classList.toggle("is-active", i === state.imageIndex);
    thumb.setAttribute("aria-current", i === state.imageIndex ? "true" : "false");
  });
}

pageThumbs.forEach((thumb) =>
  thumb.addEventListener("click", () => setImage(Number(thumb.dataset.index)))
);
lightboxThumbs.forEach((thumb) =>
  thumb.addEventListener("click", () => setImage(Number(thumb.dataset.index)))
);

prevImageBtn.addEventListener("click", () => setImage(state.imageIndex - 1));
nextImageBtn.addEventListener("click", () => setImage(state.imageIndex + 1));

/* ---------- Lightbox (desktop only) ---------- */

let lastFocusedElement = null;

function openLightbox() {
  if (window.matchMedia("(max-width: 56.25rem)").matches) return;
  lastFocusedElement = document.activeElement;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

galleryMain.addEventListener("click", openLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target.closest("[data-lightbox-close]")) closeLightbox();
});
document.getElementById("lbPrev").addEventListener("click", () => setImage(state.imageIndex - 1));
document.getElementById("lbNext").addEventListener("click", () => setImage(state.imageIndex + 1));

/* ---------- Quantity stepper ---------- */

function setQuantity(value) {
  state.quantity = Math.max(0, value);
  qtyValue.textContent = state.quantity;
}

qtyMinus.addEventListener("click", () => setQuantity(state.quantity - 1));
qtyPlus.addEventListener("click", () => setQuantity(state.quantity + 1));

/* ---------- Cart ---------- */

function renderCart() {
  if (state.cartCount === 0) {
    cartBody.innerHTML = '<p class="cart__empty">Your cart is empty.</p>';
    cartBadge.hidden = true;
    return;
  }

  const total = PRODUCT.price * state.cartCount;

  cartBody.innerHTML = `
    <div class="cart__item">
      <img class="cart__thumb" src="${PRODUCT.images[0].thumb}" alt="" width="50" height="50">
      <div class="cart__details">
        <span class="cart__name">${PRODUCT.name}</span>
        <span>${formatPrice(PRODUCT.price)} x ${state.cartCount}</span><span class="cart__total">${formatPrice(total)}</span>
      </div>
      <button class="cart__remove" id="cartRemove" aria-label="Remove item from cart">
        <svg width="14" height="16" viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" fill="#C3CAD9" fill-rule="nonzero"/></svg>
      </button>
    </div>
    <button class="cart__checkout">Checkout</button>
  `;

  cartBadge.hidden = false;
  cartBadge.textContent = state.cartCount;

  document.getElementById("cartRemove").addEventListener("click", () => {
    state.cartCount = 0;
    renderCart();
  });
}

function toggleCart(forceOpen = false) {
  const willOpen = forceOpen || cartDropdown.hidden;
  cartDropdown.hidden = !willOpen;
  cartToggle.setAttribute("aria-expanded", String(willOpen));
  // The dropdown hangs from the (non-sticky) header; keep it in view on mobile.
  if (willOpen && window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
}

addToCartBtn.addEventListener("click", () => {
  if (state.quantity === 0) return;
  state.cartCount += state.quantity;
  renderCart();
  setQuantity(0);
  toggleCart(true);
});

cartToggle.addEventListener("click", () => toggleCart());

/* ---------- Mobile menu ---------- */

function toggleMenu(open) {
  mobileNav.hidden = !open;
  menuOpen.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    mobileNav.querySelector(".mobile-nav__close").focus();
  } else {
    menuOpen.focus();
  }
}

menuOpen.addEventListener("click", () => toggleMenu(true));
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("[data-menu-close]")) toggleMenu(false);
});

/* ---------- Keyboard: Escape closes overlays ---------- */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!lightbox.hidden) closeLightbox();
  if (!mobileNav.hidden) toggleMenu(false);
  if (!cartDropdown.hidden) toggleCart();
});

/* ---------- Init ---------- */

setImage(0);
renderCart();
