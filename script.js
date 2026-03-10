const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    mobileMenu.hidden = !isOpen;
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

const yearSpan = document.querySelector("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const CART_KEY = "sproutessence_cart";
const WA_NUMBER = "8130377588";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addCartItem(item) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.name === item.name && entry.weight === item.weight);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
}

function renderCart() {
  const cartItems = document.querySelector("#cart-items");
  const cartEmpty = document.querySelector("#cart-empty");
  if (!cartItems || !cartEmpty) return;

  const cart = getCart();
  cartItems.innerHTML = "";

  if (!cart.length) {
    cartEmpty.style.display = "block";
    return;
  }

  cartEmpty.style.display = "none";
  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>Weight: ${item.weight} • ₹${item.price} • Qty: ${item.qty}</p>
      </div>
      <button type="button" class="button button-ghost" data-remove-index="${index}">Remove</button>
    `;
    cartItems.appendChild(row);
  });

  cartItems.querySelectorAll("[data-remove-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-index"));
      const next = getCart();
      next.splice(index, 1);
      saveCart(next);
      renderCart();
    });
  });
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");
if (addToCartButtons.length) {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const container = button.closest(".product-controls");
      const weight = container?.querySelector(".item-weight")?.value || "50g";
      addCartItem({
        name: button.dataset.itemName || "Microgreen pack",
        price: Number(button.dataset.itemPrice || 199),
        weight,
      });
      button.textContent = "Added ✓";
      setTimeout(() => (button.textContent = "Add to cart"), 1200);
    });
  });
}

const clearCartBtn = document.querySelector("#clear-cart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });
}

renderCart();

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      alert("Your cart is empty. Please add items first.");
      return;
    }

    const formData = new FormData(checkoutForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    const orderLines = cart.map((item) => `- ${item.name} (${item.weight}) x ${item.qty} @ ₹${item.price}`).join("\n");
    const message = [
      "New SproutEssence Cart Order",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Address: ${payload.address}`,
      "Order Items:",
      orderLines,
    ].join("\n");

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    saveCart([]);
    checkoutForm.reset();
    window.location.href = "order-confirmation.html";
  });
}
