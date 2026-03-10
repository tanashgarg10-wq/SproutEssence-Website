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

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: formData.get("items"),
      weight: formData.get("weight"),
      plan: formData.get("plan"),
    };

    const message = [
      "New SproutEssence Order",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Address: ${payload.address}`,
      `Items: ${payload.items}`,
      `Weight: ${payload.weight}`,
      `Plan: ${payload.plan}`,
    ].join("\n");

    const url = `https://wa.me/918130377588?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    alert("Thank you! You will be contacted shortly.");
    checkoutForm.reset();
  });
}
