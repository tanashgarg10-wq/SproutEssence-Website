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

const UNIT_PRICE = 199;

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  const statusElement = document.querySelector("#checkout-status");
  const itemField = document.querySelector("#order-item");
  const quantityField = document.querySelector("#order-quantity");
  const totalField = document.querySelector("#order-total");
  const totalDisplayField = document.querySelector("#order-total-display");
  const itemFromQuery = new URLSearchParams(window.location.search).get("item");

  if (itemFromQuery && itemField && !itemField.value.trim()) {
    itemField.value = itemFromQuery;
  }

  const updateTotal = () => {
    const quantityValue = Number.parseInt(quantityField.value, 10);
    const quantity = Number.isNaN(quantityValue) || quantityValue < 1 ? 1 : quantityValue;
    const totalPrice = UNIT_PRICE * quantity;

    totalField.value = String(totalPrice);
    totalDisplayField.value = `₹${totalPrice}`;
  };

  quantityField.addEventListener("input", updateTotal);
  updateTotal();

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    updateTotal();

    const formData = new FormData(checkoutForm);
    const quantity = Number.parseInt(formData.get("quantity")?.toString() || "1", 10) || 1;
    const itemName = formData.get("itemName")?.toString().trim();

    const orderData = {
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      address: formData.get("address")?.toString().trim(),
      itemName,
      quantity,
      items: `${itemName} x ${quantity}`,
      totalPrice: Number.parseInt(formData.get("totalPrice")?.toString() || "0", 10),
      notes: formData.get("notes")?.toString().trim(),
    };

    statusElement.textContent = "Placing your order...";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Could not place order. Please try again.");
      }

      sessionStorage.setItem("latestOrderContact", orderData.phone || orderData.email || "");
      window.location.href = "order-success.html";
    } catch (error) {
      statusElement.textContent = error.message;
    }
  });
}

const successContact = document.querySelector("#success-contact");
if (successContact) {
  const contact = sessionStorage.getItem("latestOrderContact");
  if (contact) {
    successContact.textContent = `We will contact you on: ${contact}`;
  }
}
