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

function getItemLabel(item) {
  const typeSuffix = item.type ? ` (${item.type})` : "";
  const weightSuffix = item.weightLabel ? ` - ${item.weightLabel}` : "";
  return `${item.name}${typeSuffix}${weightSuffix}`;
}

function addToCart(name, price = UNIT_PRICE, type = "", weightLabel = "50g") {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.name === name && item.price === price && (item.type || "") === type && (item.weightLabel || "") === weightLabel
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, type, weightLabel, price, quantity: 1 });
  }

  saveCart(cart);
}

function getCartTotals(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = cart.map((item) => `${getItemLabel(item)} x ${item.quantity}`).join("\n");
  return { total, summary };
}

for (const button of document.querySelectorAll(".add-to-cart-btn")) {
  const updateButtonText = () => {
    const productInfo = button.closest(".product-info");
    const selectedWeight = productInfo?.querySelector('input[type="radio"][name^="weight-"]:checked');
    const itemName = button.dataset.baseItem || button.dataset.item || "Item";
    const weightLabel = selectedWeight?.dataset.label || "50g";
    button.textContent = `Add ${itemName} (${weightLabel}) to cart`;
  };

  updateButtonText();
  for (const option of document.querySelectorAll('input[type="radio"][name^="weight-"]')) {
    option.addEventListener("change", updateButtonText);
  }

  button.addEventListener("click", () => {
    const productInfo = button.closest(".product-info");
    const selectedWeight = productInfo?.querySelector('input[type="radio"][name^="weight-"]:checked');
    const itemName = button.dataset.baseItem || button.dataset.item;
    const itemType = button.dataset.type || "";
    const price = Number.parseInt(selectedWeight?.dataset.price || button.dataset.price || String(UNIT_PRICE), 10);
    const weightLabel = selectedWeight?.dataset.label || "50g";

    addToCart(itemName, Number.isNaN(price) ? UNIT_PRICE : price, itemType, weightLabel);
    window.location.href = "cart.html";
  });
}

const cartList = document.querySelector("#cart-list");
if (cartList) {
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
            <h4>${getItemLabel(item)}</h4>
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

  renderCart();

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      saveCart([]);
      renderCart();
    });
  }
}

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  const statusElement = document.querySelector("#checkout-status");
  const orderItemsField = document.querySelector("#order-items");
  const totalField = document.querySelector("#order-total");
  const totalDisplayField = document.querySelector("#order-total-display");

  const currentCart = getCart();
  const { total, summary } = getCartTotals(currentCart);
  orderItemsField.value = summary;
  totalField.value = String(total);
  totalDisplayField.value = `₹${total}`;

  checkoutForm.addEventListener("submit", (event) => {
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
      notes: formData.get("notes")?.toString().trim(),
    };

    statusElement.textContent = "Opening WhatsApp...";

    const lines = [
      "New Order - SproutEssence",
      `Name: ${orderData.name || ""}`,
      `WhatsApp: ${orderData.phone || ""}`,
      `Email: ${orderData.email || ""}`,
      `Address: ${orderData.address || ""}`,
      "",
      "Items:",
      orderData.items || "",
    ];

    if (orderData.notes) {
      lines.push("", `Notes: ${orderData.notes}`);
    }

    const whatsappNumber = "81303775888";
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
