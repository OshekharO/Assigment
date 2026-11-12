(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Close Bootstrap navbar after selecting a link on mobile
  var navCollapse = document.getElementById("mainNav");
  if (navCollapse && window.bootstrap) {
    navCollapse.querySelectorAll(".nav-link, .btn").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992 && navCollapse.classList.contains("show")) {
          var instance = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
          instance.hide();
        }
      });
    });
  }

  // Smooth scroll for in-page anchors with header offset
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      var target = document.querySelector(href);
      if (!target) {
        return;
      }
      event.preventDefault();
      var header = document.querySelector("header.sticky-top");
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
      window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  // Scroll reveal
  var revealElements = document.querySelectorAll(".reveal-target");
  if (prefersReduced) {
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // Tagline word reveal
  var taglineSection = document.getElementById("tagline");
  var taglineWords = document.querySelectorAll(".tagline-word");

  function revealTaglineWords() {
    taglineWords.forEach(function (word, index) {
      if (prefersReduced) {
        word.classList.add("visible");
      } else {
        setTimeout(function () {
          word.classList.add("visible");
        }, index * 180);
      }
    });
  }

  if (taglineSection && taglineWords.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealTaglineWords();
    } else {
      var taglineObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealTaglineWords();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      taglineObserver.observe(taglineSection);
    }
  }

  // Demo form validation and simulated submit
  var form = document.getElementById("demo-form");
  var submitButton = document.getElementById("submit-button");
  var formStatus = document.getElementById("form-status");
  var formSuccess = document.getElementById("form-success");
  var resetButton = document.getElementById("reset-form");

  if (!form) {
    return;
  }

  var fields = [
    { id: "name", message: "Please enter your full name." },
    { id: "email", message: "Please enter a valid work email address." },
    { id: "company-size", message: "Please select a company size." },
    { id: "message", message: "Please enter a message." }
  ];

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");
    if (!input || !errorEl) {
      return;
    }
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorEl.textContent = message;
  }

  function clearFieldError(fieldId) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");
    if (!input || !errorEl) {
      return;
    }
    input.classList.remove("is-invalid");
    errorEl.textContent = "";
  }

  fields.forEach(function (field) {
    var input = document.getElementById(field.id);
    if (input) {
      input.addEventListener("input", function () {
        clearFieldError(field.id);
        if (formStatus) {
          formStatus.textContent = "";
        }
      });
      input.addEventListener("change", function () {
        clearFieldError(field.id);
      });
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var hasError = false;
    fields.forEach(function (field) {
      clearFieldError(field.id);
      var input = document.getElementById(field.id);
      var value = input ? String(input.value || "").trim() : "";
      if (!value) {
        setFieldError(field.id, field.message);
        hasError = true;
      } else if (field.id === "email" && !isValidEmail(value)) {
        setFieldError(field.id, field.message);
        hasError = true;
      } else if (input) {
        input.classList.add("is-valid");
      }
    });

    if (hasError) {
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Requesting demo...";
    if (formStatus) {
      formStatus.textContent = "";
    }
    if (formSuccess) {
      formSuccess.hidden = true;
    }

    setTimeout(function () {
      submitButton.disabled = false;
      submitButton.textContent = "Request demo";
      form.reset();
      fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        if (input) {
          input.classList.remove("is-valid", "is-invalid");
        }
      });
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.focus();
      }
    }, 1200);
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (formSuccess) {
        formSuccess.hidden = true;
      }
      form.reset();
      fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        if (input) {
          input.classList.remove("is-valid", "is-invalid");
        }
        clearFieldError(field.id);
      });
      var nameInput = document.getElementById("name");
      if (nameInput) {
        nameInput.focus();
      }
    });
  }
})();
