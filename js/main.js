(function () {
  "use strict";

  // Footer year
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear().toString();

  // Floating WhatsApp button (injected on every page)
  const WHATSAPP_URL =
    "https://wa.me/447737043143?text=" +
    encodeURIComponent(
      "Hi Tipsy Daisy, I'd like to enquire about mobile bar hire / catering for my event."
    );
  if (!document.querySelector(".whatsapp-fab")) {
    const wa = document.createElement("a");
    wa.className = "whatsapp-fab";
    wa.href = WHATSAPP_URL;
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.setAttribute("aria-label", "Chat with Tipsy Daisy on WhatsApp");
    wa.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.05 20.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>';
    document.body.appendChild(wa);
  }

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

      // Build a mailto: link to Tipsy Daisy from the form fields and open it
      const RECIPIENT = "Harrietpatterson@live.com";
      const get = function (id) {
        const el = form.querySelector("#" + id);
        return el && el.value ? el.value.trim() : "";
      };
      const eventTypeField = form.querySelector("#event-type");
      const eventTypeLabel =
        eventTypeField && eventTypeField.selectedIndex > -1
          ? eventTypeField.options[eventTypeField.selectedIndex].text
          : get("event-type");

      const subject = "Event enquiry from " + (get("name") || "website");
      const lines = [
        "Name: " + get("name"),
        "Email: " + get("email"),
        "Phone: " + (get("phone") || "—"),
        "Event type: " + (eventTypeLabel || "—"),
        "Event date: " + (get("event-date") || "—"),
        "Location: " + (get("location") || "—"),
        "Guest numbers: " + (get("guests") || "—"),
        "",
        "Message:",
        get("message"),
      ];
      const mailto =
        "mailto:" +
        RECIPIENT +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\r\n"));

      window.location.href = mailto;

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
