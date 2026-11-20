document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 720px)").matches) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const productGrid = document.querySelector("#product-grid");
  if (productGrid) {
    const cards = Array.from(productGrid.querySelectorAll(".catalog-card"));
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    const searchInput = document.querySelector("#product-search");
    const resultsCount = document.querySelector("#results-count");
    const emptyResults = document.querySelector("#empty-results");
    let activeCategory = "all";

    const updateProducts = () => {
      const query = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach((card) => {
        const categoryMatches = activeCategory === "all" || card.dataset.category === activeCategory;
        const searchMatches = card.dataset.name.includes(query) || card.textContent.toLowerCase().includes(query);
        const isVisible = categoryMatches && searchMatches;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "product" : "products"}`;
      emptyResults.hidden = visibleCount > 0;
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.filter;
        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });
        updateProducts();
      });
    });

    searchInput.addEventListener("input", updateProducts);
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
    const successMessage = document.querySelector("#form-success");
    const errorMessages = {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      subject: "Please enter a subject.",
      message: "Please enter a message of at least 10 characters."
    };

    const validateField = (field) => {
      const isValid = field.checkValidity();
      const errorElement = document.querySelector(`#${field.name}-error`);
      field.setAttribute("aria-invalid", String(!isValid));
      errorElement.textContent = isValid ? "" : errorMessages[field.name];
      return isValid;
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.hasAttribute("aria-invalid")) validateField(field);
      });
      field.addEventListener("blur", () => {
        if (field.value.trim()) validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const isFormValid = fields.map(validateField).every(Boolean);

      if (!isFormValid) {
        fields.find((field) => !field.checkValidity())?.focus();
        return;
      }

      form.reset();
      fields.forEach((field) => {
        field.removeAttribute("aria-invalid");
        document.querySelector(`#${field.name}-error`).textContent = "";
      });
      successMessage.hidden = false;
    });
  }
});
