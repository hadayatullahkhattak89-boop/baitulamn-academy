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

  /* ---------- currency switcher ---------- */
  var PRICING_DATA = {
    PKR: { symbol: "Rs.", standard: "4,000", advanced: "6,000", family: "3,500", suffix: "/ ماہانہ" },
    USD: { symbol: "$", standard: "35", advanced: "55", family: "30", suffix: "/ Month" },
    GBP: { symbol: "£", standard: "28", advanced: "45", family: "25", suffix: "/ Month" },
    AED: { symbol: "AED", standard: "130", advanced: "200", family: "115", suffix: "/ Month" }
  };

  function initCurrencySwitcher() {
    var btns = document.querySelectorAll(".currency-btn");
    if (!btns.length) return;

    function applyCurrency(curr) {
      var data = PRICING_DATA[curr] || PRICING_DATA.PKR;
      btns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-currency") === curr);
      });
      document.querySelectorAll("[data-price-plan]").forEach(function (el) {
        var plan = el.getAttribute("data-price-plan");
        var val = data[plan] || "";
        var amountEl = el.querySelector(".price-amount-val");
        var symEl = el.querySelector(".price-currency-sym");
        var periodEl = el.querySelector(".price-period-val");
        if (amountEl) amountEl.textContent = val;
        if (symEl) symEl.textContent = data.symbol + " ";
        if (periodEl) periodEl.textContent = data.suffix;
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var curr = btn.getAttribute("data-currency");
        applyCurrency(curr);
      });
    });
    applyCurrency("PKR");
  }

  /* ---------- audio recitation player ---------- */
  function initAudioShowcase() {
    var box = document.querySelector(".audio-showcase-box");
    if (!box) return;

    var audio = new Audio();
    var playBtn = box.querySelector(".play-btn-circle");
    var playIcon = box.querySelector(".play-icon");
    var pauseIcon = box.querySelector(".pause-icon");
    var trackBtns = box.querySelectorAll(".audio-track-btn");
    var progressTrack = box.querySelector(".progress-track");
    var progressFill = box.querySelector(".progress-fill");
    var currTimeEl = box.querySelector(".audio-time-curr");
    var durTimeEl = box.querySelector(".audio-time-dur");
    var titleEl = box.querySelector(".audio-current-title");
    var reciterEl = box.querySelector(".audio-current-reciter");

    var currentTrackIndex = 0;
    var tracks = [];

    trackBtns.forEach(function (btn, idx) {
      tracks.push({
        src: btn.getAttribute("data-src"),
        title: btn.getAttribute("data-title"),
        reciter: btn.getAttribute("data-reciter")
      });
      btn.addEventListener("click", function () {
        selectTrack(idx, true);
      });
    });

    function formatTime(s) {
      if (isNaN(s)) return "0:00";
      var m = Math.floor(s / 60);
      var sec = Math.floor(s % 60);
      return m + ":" + (sec < 10 ? "0" + sec : sec);
    }

    function selectTrack(idx, playImmediately) {
      currentTrackIndex = idx;
      trackBtns.forEach(function (b, i) {
        b.classList.toggle("active", i === idx);
      });
      var tr = tracks[idx];
      if (!tr) return;
      audio.src = tr.src;
      if (titleEl) titleEl.textContent = tr.title;
      if (reciterEl) reciterEl.textContent = tr.reciter;
      progressFill.style.width = "0%";
      if (currTimeEl) currTimeEl.textContent = "0:00";

      if (playImmediately) {
        audio.play().then(function () {
          setPlayingUI(true);
        }).catch(function () {});
      } else {
        setPlayingUI(false);
      }
    }

    function setPlayingUI(isPlaying) {
      box.classList.toggle("playing", isPlaying);
      if (playIcon) playIcon.style.display = isPlaying ? "none" : "block";
      if (pauseIcon) pauseIcon.style.display = isPlaying ? "block" : "none";
    }

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (!audio.src) selectTrack(0, true);
        else if (audio.paused) {
          audio.play().then(function () { setPlayingUI(true); }).catch(function () {});
        } else {
          audio.pause();
          setPlayingUI(false);
        }
      });
    }

    audio.addEventListener("timeupdate", function () {
      if (!audio.duration) return;
      var pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = pct + "%";
      if (currTimeEl) currTimeEl.textContent = formatTime(audio.currentTime);
      if (durTimeEl) durTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("loadedmetadata", function () {
      if (durTimeEl) durTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", function () {
      setPlayingUI(false);
      if (progressFill) progressFill.style.width = "0%";
      // Auto-advance to next track
      var nextIdx = (currentTrackIndex + 1) % tracks.length;
      selectTrack(nextIdx, true);
    });

    if (progressTrack) {
      progressTrack.addEventListener("click", function (e) {
        var rect = progressTrack.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var width = rect.width;
        if (audio.duration) {
          audio.currentTime = (clickX / width) * audio.duration;
        }
      });
    }

    // Pre-select track 0 without auto-play
    if (tracks.length > 0) selectTrack(0, false);
  }

  /* ---------- interactive trial modal wizard ---------- */
  function initTrialModal() {
    var overlay = document.querySelector("#trial-modal");
    if (!overlay) return;

    var closeBtns = overlay.querySelectorAll(".modal-close-trigger");
    var nextBtns = overlay.querySelectorAll(".btn-step-next");
    var prevBtns = overlay.querySelectorAll(".btn-step-prev");
    var steps = overlay.querySelectorAll(".wizard-step");
    var stepBadges = overlay.querySelectorAll(".step-item");
    var submitBtn = overlay.querySelector("#trial-submit-btn");
    var successView = overlay.querySelector("#trial-success-view");
    var wizardBody = overlay.querySelector("#trial-wizard-body");
    var currentStep = 1;

    function openModal(preselectedCourse) {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      goToStep(1);
      if (preselectedCourse) {
        var radio = overlay.querySelector('input[name="modal_course"][value="' + preselectedCourse + '"]');
        if (radio) radio.checked = true;
      }
    }

    function closeModal() {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (successView) successView.style.display = "none";
        if (wizardBody) wizardBody.style.display = "block";
      }, 300);
    }

    function goToStep(num) {
      currentStep = num;
      steps.forEach(function (s) {
        s.classList.toggle("active", parseInt(s.getAttribute("data-step")) === num);
      });
      stepBadges.forEach(function (b, i) {
        var sNum = i + 1;
        b.classList.toggle("active", sNum === num);
        b.classList.toggle("completed", sNum < num);
      });
    }

    // Attach open trigger to buttons
    document.querySelectorAll('[data-open-modal="trial"]').forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var course = btn.getAttribute("data-course") || "";
        openModal(course);
      });
    });

    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("active")) closeModal();
    });

    nextBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentStep === 1) {
          var selCourse = overlay.querySelector('input[name="modal_course"]:checked');
          if (!selCourse) {
            alert("براہ کرم کوئی ایک کورس منتخب کریں۔ / Please select a course.");
            return;
          }
        }
        goToStep(currentStep + 1);
      });
    });

    prevBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        goToStep(currentStep - 1);
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var nameInput = overlay.querySelector("#trial-student-name");
        var phoneInput = overlay.querySelector("#trial-student-phone");

        var name = nameInput ? nameInput.value.trim() : "";
        var phone = phoneInput ? phoneInput.value.trim() : "";

        if (!name || !phone) {
          alert("براہ کرم اپنا نام اور واٹس ایپ نمبر درج کریں۔ / Please enter your name and WhatsApp number.");
          return;
        }

        var course = (overlay.querySelector('input[name="modal_course"]:checked') || {}).value || "قاعدہ و ناظرہ";
        var studentType = (overlay.querySelector('input[name="modal_student"]:checked') || {}).value || "بچہ";
        var teacher = (overlay.querySelector('input[name="modal_teacher"]:checked') || {}).value || "کوئی بھی مناسب استاد";
        var timeSlot = (overlay.querySelector('input[name="modal_time"]:checked') || {}).value || "شام / رات";
        var timezone = (overlay.querySelector("#trial-student-tz") || {}).value || "پاکستان (PKT)";

        // Construct clean, professional WhatsApp message
        var msg = "السلام علیکم ورحمۃ اللہ،\n" +
                  "میں بیت الامن آن لائن اکیڈمی میں *مفت ٹرائل کلاس* بک کرنا چاہتا ہوں۔\n\n" +
                  "📌 *طالب علم کا نام:* " + name + "\n" +
                  "📖 *کورس:* " + course + " (" + studentType + ")\n" +
                  "👳‍♂️ *استاد کی ترجیح:* " + teacher + "\n" +
                  "⏰ *مناسب وقت:* " + timeSlot + " [" + timezone + "]\n" +
                  "📞 *واٹس ایپ:* " + phone + "\n\n" +
                  "براہ کرم ٹرائل کلاس کا وقت اور تفصیلات بتائیں۔ جزاکم اللہ خیرا۔";

        var waUrl = "https://wa.me/923459153585?text=" + encodeURIComponent(msg);

        // Async FormSubmit backup to ensure zero lead loss
        try {
          var fd = new FormData();
          fd.append("Name", name);
          fd.append("WhatsApp", phone);
          fd.append("Course", course);
          fd.append("StudentType", studentType);
          fd.append("TeacherPreference", teacher);
          fd.append("PreferredTime", timeSlot);
          fd.append("Timezone", timezone);
          fd.append("_subject", "New Trial Booking Modal Lead — " + name);
          fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: fd });
        } catch (err) {}

        // Show Success screen and open WhatsApp
        if (wizardBody) wizardBody.style.display = "none";
        if (successView) successView.style.display = "block";

        window.open(waUrl, "_blank");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initNavToggle();
    initFaq();
    initContactForm();
    markActiveNav();
    initBackToTop();
    initScrollReveal();
    initCurrencySwitcher();
    initAudioShowcase();
    initTrialModal();
  });
})();
