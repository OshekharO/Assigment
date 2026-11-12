// TaskFlow — script.js
// Mobile menu, scroll reveals, tagline reveal, form validation.
// Motion per landing-page-design B7: cubic-bezier(0.22,1,0.36,1), transform/opacity only,
// prefers-reduced-motion respected. No unthrottled scroll listeners.

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var baseCurve = "cubic-bezier(0.22, 1, 0.36, 1)";

  // --- Mobile menu ---
  var menuButton = document.getElementById("menu-button");
  var closeButton = document.getElementById("close-menu-button");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileLinks = mobileMenu.querySelectorAll("a");

  function toggleMenu() {
    var expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("open");
  }

  menuButton.addEventListener("click", toggleMenu);

  closeButton.addEventListener("click", function () {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
    });
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Scroll reveal (B7): sections rise 32px and fade in once ---
  var revealElements = document.querySelectorAll(
    ".benefit, .step, .plan, .tagline-reveal"
  );

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(function (el) {
    if (prefersReduced) {
      el.classList.add("revealed");
    } else {
      var rect = el.getBoundingClientRect();
      var alreadyVisible =
        rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        el.classList.add("revealed");
      } else {
        revealObserver.observe(el);
      }
    }
  });

  // --- Tagline reveal (B11): words activate one at a time on scroll ---
  var taglineWords = document.querySelectorAll(".tagline-word");
  var taglineSection = document.getElementById("tagline");

  if (taglineWords.length > 0 && taglineSection) {
    if (prefersReduced) {
      taglineWords.forEach(function (word) {
        word.classList.add("visible");
      });
    } else {
      var taglineRect = taglineSection.getBoundingClientRect();
      var taglineAlreadyVisible =
        taglineRect.top < window.innerHeight && taglineRect.bottom > 0;

      if (taglineAlreadyVisible) {
        taglineWords.forEach(function (word, index) {
          setTimeout(function () {
            word.classList.add("visible");
          }, index * 120);
        });
      } else {
        var taglineObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                taglineWords.forEach(function (word, index) {
                  setTimeout(function () {
                    word.classList.add("visible");
                  }, index * 120);
                });
                taglineObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        taglineObserver.observe(taglineSection);
      }
    }
  }
          });
        },
        { threshold: 0.15 }
      );
      taglineObserver.observe(taglineSection);
    }
  }

  // --- Form validation and submission ---
  var demoForm = document.getElementById("demo-form");
  var submitButton = document.getElementById("submit-button");
  var formStatus = document.getElementById("form-status");
  var formSuccess = document.getElementById("form-success");
  var resetButton = document.getElementById("reset-form");

  var fields = ["name", "email", "company-size", "message"];

  fields.forEach(function (fieldId) {
    var input = document.getElementById(fieldId);
    input.addEventListener("input", function () {
      clearError(fieldId);
      formStatus.textContent = "";
    });
  });

  demoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var hasError = false;

    var name = document.getElementById("name").value.trim();
    if (name === "") {
      showError("name", "Please enter your full name.");
      hasError = true;
    }

    var email = document.getElementById("email").value.trim();
    if (email === "") {
      showError("email", "Please enter your work email.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      hasError = true;
    }

    var companySize = document.getElementById("company-size").value;
    if (companySize === "") {
      showError("company-size", "Please select a company size.");
      hasError = true;
    }

    var message = document.getElementById("message").value.trim();
    if (message === "") {
      showError("message", "Please enter a message.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Loading state (B9)
    submitButton.disabled = true;
    submitButton.textContent = "Requesting demo";
    formStatus.textContent = "";
    formSuccess.hidden = true;

    setTimeout(function () {
      submitButton.disabled = false;
      submitButton.textContent = "Request demo";
      demoForm.reset();
      formSuccess.hidden = false;
      formSuccess.focus();
    }, 1200);
  });

  resetButton.addEventListener("click", function () {
    formSuccess.hidden = true;
    demoForm.reset();
    formStatus.textContent = "";
  });

  function showError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");
    if (errorEl) {
      errorEl.textContent = message;
    }
    if (input) {
      input.focus();
    }
  }

  function clearError(fieldId) {
    var errorEl = document.getElementById(fieldId + "-error");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
