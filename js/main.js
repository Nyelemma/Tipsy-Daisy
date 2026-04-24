(function () {
  "use strict";

  // Footer year
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear().toString();

  // Sticky header shadow
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile navigation
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      const open = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open);
    });
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Subtle parallax on hero
  const heroParallax = document.querySelector(".hero-parallax");
  if (heroParallax && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const y = window.scrollY * 0.15;
        heroParallax.style.transform = "translate3d(0, " + y + "px, 0)";
      },
      { passive: true }
    );
  }

  // Contact form
  const form = document.getElementById("enquiry-form");
  if (form) {
    const success = document.getElementById("form-success");

    function showError(input, message) {
      const wrap = input.closest(".form-field") || input.parentElement;
      let el = wrap.querySelector(".field-error");
      if (!el) {
        el = document.createElement("p");
        el.className = "field-error is-visible";
        el.setAttribute("role", "alert");
        wrap.appendChild(el);
      } else {
        el.classList.add("is-visible");
      }
      el.textContent = message;
    }

    function clearErrors() {
      form.querySelectorAll(".field-error").forEach(function (e) {
        e.classList.remove("is-visible");
        e.textContent = "";
      });
    }

    function validateEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      let ok = true;
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const eventType = form.querySelector("#event-type");
      const message = form.querySelector("#message");

      if (name && !name.value.trim()) {
        showError(name, "Please add your name.");
        ok = false;
      }
      if (email && !email.value.trim()) {
        showError(email, "We need your email to reply.");
        ok = false;
      } else if (email && !validateEmail(email.value)) {
        showError(email, "That doesn’t look like a valid email.");
        ok = false;
      }
      if (eventType && !eventType.value) {
        showError(eventType, "Please choose an event type.");
        ok = false;
      }
      if (message && !message.value.trim()) {
        showError(message, "Tell us a little about your plans.");
        ok = false;
      }

      if (!ok) return;

      form.setAttribute("hidden", "");
      if (success) {
        success.classList.add("is-visible");
        success.focus();
        form.reset();
      }
    });
  }

  // Gallery lightbox
  const lightboxEmptySrc =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPlaceholder = document.getElementById("lightbox-placeholder");
  const lightboxCap = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");

  function openLightbox(src, cap) {
    if (!lightbox) return;
    if (lightboxCap) lightboxCap.textContent = cap || "";
    if (lightboxImg) {
      if (src) {
        lightboxImg.removeAttribute("hidden");
        lightboxImg.src = src;
        lightboxImg.alt = cap || "Gallery image";
        if (lightboxPlaceholder) {
          lightboxPlaceholder.setAttribute("hidden", "");
        }
      } else {
        lightboxImg.src = lightboxEmptySrc;
        lightboxImg.setAttribute("hidden", "");
        if (lightboxPlaceholder) {
          lightboxPlaceholder.removeAttribute("hidden");
        }
      }
    }
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lightboxImg) {
      lightboxImg.src = lightboxEmptySrc;
      lightboxImg.setAttribute("hidden", "");
      lightboxImg.alt = "";
    }
    if (lightboxPlaceholder) {
      lightboxPlaceholder.setAttribute("hidden", "");
    }
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const src = this.getAttribute("data-src");
      const cap = this.getAttribute("data-caption") || "";
      openLightbox(src || null, cap);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();
