/* =========================================================
   lackMoon Portfolio — Interactive JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const themeToggle = document.querySelector(".theme-toggle");

  /* ---------------------------------------------------------
     1. Theme toggle
     --------------------------------------------------------- */
  const savedTheme = localStorage.getItem("portfolio-theme");

  // Light mode is the default.
  if (savedTheme === "dark") {
    body.setAttribute("data-theme", "dark");
  } else {
    body.removeAttribute("data-theme");
  }

  const updateThemeButton = () => {
    if (!themeToggle) return;

    const isDark = body.getAttribute("data-theme") === "dark";

    themeToggle.textContent = isDark ? "☀" : "◐";
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
  };

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    const isDark = body.getAttribute("data-theme") === "dark";

    if (isDark) {
      body.removeAttribute("data-theme");
      localStorage.setItem("portfolio-theme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
      localStorage.setItem("portfolio-theme", "dark");
    }

    updateThemeButton();
  });

  /* ---------------------------------------------------------
     2. Mobile navigation
     --------------------------------------------------------- */
  const closeMobileMenu = () => {
    if (!menuToggle || !nav) return;

    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    body.classList.toggle("menu-open", Boolean(isOpen));
  });

  // Close the mobile menu after selecting a navigation item.
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close the menu when clicking outside it.
  document.addEventListener("click", (event) => {
    if (!nav || !menuToggle) return;

    const target = event.target;

    if (
      nav.classList.contains("is-open") &&
      !nav.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMobileMenu();
    }
  });

  /* ---------------------------------------------------------
     3. Header shadow while scrolling
     --------------------------------------------------------- */
  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------
     4. Scroll reveal animations
     --------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    ".section, .hero-content, .hero-visual, .experience-item, " +
    ".project-card, .skill-group, .contact-card"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     5. Stagger project cards / skill groups
     --------------------------------------------------------- */
  const staggerGroups = [
    ".projects-grid .project-card",
    ".skills-grid .skill-group",
    ".experience-list .experience-item"
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${index * 90}ms`);
    });
  });

  /* ---------------------------------------------------------
     6. Active navigation based on current section
     --------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------
     7. Smooth scrolling with sticky-header offset
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header?.offsetHeight ?? 0;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });

      history.replaceState(null, "", targetId);
    });
  });

  /* ---------------------------------------------------------
     8. Project card hover tilt
     --------------------------------------------------------- */
  const canHover =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -5;
        const rotateY = ((x / rect.width) - 0.5) * 5;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     9. Contact form
     --------------------------------------------------------- */
  const contactForm = document.querySelector(".contact-form");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showFormMessage("Please fill in all fields.", true);
      return;
    }

    // This front-end validation is intentionally lightweight.
    // Connect the form to Formspree, Netlify Forms, or your own
    // backend when you want actual message delivery.
    showFormMessage(
      "Thanks! Your message is ready to send. Connect this form to a backend service to receive submissions."
    );
  });

  function showFormMessage(message, isError = false) {
    let messageElement = contactForm?.querySelector(".form-message");

    if (!contactForm) return;

    if (!messageElement) {
      messageElement = document.createElement("p");
      messageElement.className = "form-message";
      contactForm.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.classList.toggle("is-error", isError);
    messageElement.classList.add("is-visible");
  }

  /* ---------------------------------------------------------
     10. Current year
     --------------------------------------------------------- */
  const yearElements = document.querySelectorAll("[data-current-year]");

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});