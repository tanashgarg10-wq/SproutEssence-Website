const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const UNIT_PRICE = 199;

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

function getCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem("cartItems") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

function addToCart(name, price = UNIT_PRICE) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart(cart);
}

function getCartTotals(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = cart.map((item) => `${item.name} x ${item.quantity}`).join("\n");
  return { total, summary };
}

for (const button of document.querySelectorAll(".add-to-cart-btn")) {
  button.addEventListener("click", () => {
    const itemName = button.dataset.item;
    const price = Number.parseInt(button.dataset.price || String(UNIT_PRICE), 10);
    addToCart(itemName, Number.isNaN(price) ? UNIT_PRICE : price);
    window.location.href = "cart.html";
  });
}

const cartList = document.querySelector("#cart-list");
if (cartList) {
  const cart = getCart();
  const totalElement = document.querySelector("#cart-total");
  const clearButton = document.querySelector("#clear-cart");

  const renderCart = () => {
    const liveCart = getCart();

    if (!liveCart.length) {
      cartList.innerHTML = "<p>Your cart is empty. Add products first.</p>";
      totalElement.textContent = "₹0";
      return;
    }

    cartList.innerHTML = liveCart
      .map(
        (item, index) => `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price} each</p>
          </div>
          <input class="qty-input" type="number" min="1" value="${item.quantity}" data-index="${index}" />
          <button class="button button-ghost" type="button" data-remove-index="${index}">Remove</button>
        </div>`
      )
      .join("");

    const { total } = getCartTotals(liveCart);
    totalElement.textContent = `₹${total}`;

    for (const qtyInput of cartList.querySelectorAll(".qty-input")) {
      qtyInput.addEventListener("input", () => {
        const idx = Number.parseInt(qtyInput.dataset.index, 10);
        const qty = Number.parseInt(qtyInput.value, 10);
        const current = getCart();
        if (!Number.isNaN(idx) && current[idx]) {
          current[idx].quantity = Number.isNaN(qty) || qty < 1 ? 1 : qty;
          saveCart(current);
          renderCart();
        }
      });
    }

    for (const removeButton of cartList.querySelectorAll("[data-remove-index]")) {
      removeButton.addEventListener("click", () => {
        const idx = Number.parseInt(removeButton.dataset.removeIndex, 10);
        const current = getCart();
        current.splice(idx, 1);
        saveCart(current);
        renderCart();
      });
    }
  };

  saveCart(cart);
  renderCart();

  clearButton.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });
}

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  const statusElement = document.querySelector("#checkout-status");
  const orderItemsField = document.querySelector("#order-items");
  const totalField = document.querySelector("#order-total");
  const totalDisplayField = document.querySelector("#order-total-display");

  const cart = getCart();
  const itemFromQuery = new URLSearchParams(window.location.search).get("item");

  if (!cart.length && itemFromQuery) {
    saveCart([{ name: itemFromQuery, price: UNIT_PRICE, quantity: 1 }]);
  }

  const currentCart = getCart();
  const { total, summary } = getCartTotals(currentCart);
  orderItemsField.value = summary;
  totalField.value = String(total);
  totalDisplayField.value = `₹${total}`;

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cartItems = getCart();
    if (!cartItems.length) {
      statusElement.textContent = "Your cart is empty. Please add products first.";
      return;
    }

    const formData = new FormData(checkoutForm);
    const orderData = {
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      address: formData.get("address")?.toString().trim(),
      items: formData.get("items")?.toString().trim(),
      totalPrice: Number.parseInt(formData.get("totalPrice")?.toString() || "0", 10),
      cartItems,
      notes: formData.get("notes")?.toString().trim(),
    };

    statusElement.textContent = "Opening WhatsApp...";

    const lines = [
      "New Order - Sprout Essence",
      `Name: ${orderData.name || ""}`,
      `WhatsApp: ${orderData.phone || ""}`,
      `Email: ${orderData.email || ""}`,
      `Address: ${orderData.address || ""}`,
      "",
      "Items:",
      orderData.items || "",
      "",
      `Total: ₹${orderData.totalPrice}`,
    ];

    if (orderData.notes) {
      lines.push("", `Notes: ${orderData.notes}`);
    }

    const whatsappNumber = "919880709414";
    const whatsappText = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

    sessionStorage.setItem("latestOrderContact", orderData.phone || orderData.email || "");
    window.location.href = whatsappUrl;
  });
}

const successContact = document.querySelector("#success-contact");
if (successContact) {
  const contact = sessionStorage.getItem("latestOrderContact");
  if (contact) {
    successContact.textContent = `We will contact you on: ${contact}`;
  }
}
