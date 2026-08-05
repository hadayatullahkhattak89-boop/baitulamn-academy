// Bait-ul-Amn Online Academy — shared behaviour

(function () {
  var RTL_LANGS = ["ur", "ar"];
  var SUPPORTED = ["ur", "en", "ar", "zh"];

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute(
      "dir",
      RTL_LANGS.indexOf(lang) > -1 ? "rtl" : "ltr"
    );
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    try {
      localStorage.setItem("baitulamn-lang", lang);
    } catch (e) {}
  }

  function initLangSwitch() {
    var saved = "en";
    try {
      saved = localStorage.getItem("baitulamn-lang") || "en";
    } catch (e) {}
    applyLang(saved);

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      if (!q) return;
      q.addEventListener("click", function () {
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function (o) {
          if (o !== item) o.classList.remove("open");
        });
        item.classList.toggle("open", !wasOpen);
      });
    });
  }

  var FORM_ENDPOINT = "https://formsubmit.co/ajax/hadayatullahkhattak89@gmail.com";

  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var note = document.querySelector("#form-note");
    var error = document.querySelector("#form-error");
    var btn = form.querySelector("button[type=submit]");
    var btnLabel = btn ? btn.querySelector(".btn-label") : null;
    var originalLabel = btnLabel ? btnLabel.innerHTML : null;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (note) note.style.display = "none";
      if (error) error.style.display = "none";
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.7";
      }

      var data = new FormData(form);
      data.append("_subject", "New Trial Class Request — Bait-ul-Amn Academy");
      data.append("_template", "table");
      data.append("_captcha", "false");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(function () {
          if (note) note.style.display = "block";
          form.reset();
        })
        .catch(function () {
          if (error) error.style.display = "block";
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.style.opacity = "1";
          }
        });
    });
  }

  function markActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a[href]").forEach(function (a) {
      if (a.getAttribute("href") === path) a.classList.add("active");
    });
  }

  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 500);
    });
  }

  function initScrollReveal() {
    var selectors = [
      ".section-head", ".card", ".feature-row", ".hiw-step",
      ".split-media", ".split > div:not(.split-media)"
    ];
    var els = document.querySelectorAll(selectors.join(","));
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("reveal-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) {
      el.classList.add("reveal");
      obs.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initNavToggle();
    initFaq();
    initContactForm();
    markActiveNav();
    initBackToTop();
    initScrollReveal();
  });
})();
