// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    // Show or hide menu
    mobileMenu.hidden = !isOpen;

    // Accessibility attribute
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

// Auto-update footer year
const yearSpan = document.querySelector("#year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}