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

  /* =========================================================
     LIVE PRAYER TIMES ENGINE & DISPLAY BOARD
     Inspired by Mosque Display: Live Clock, Countdown, Circular Badges & Dates
     ========================================================= */
  function initPrayerTimes() {
    var boards = document.querySelectorAll(".prayer-display-board");
    if (!boards.length) return;

    var CITIES = {
      "lahore": { name: "Lahore, Pakistan", nameUr: "لاہور، پاکستان", nameAr: "لاهور، باكستان", lat: 31.5204, lng: 74.3587, tz: 5, fajrAngle: 18, ishaAngle: 18, methodTitle: "University of Islamic Sciences, Karachi" },
      "karachi": { name: "Karachi, Pakistan", nameUr: "کراچی، پاکستان", nameAr: "كراتشي، باكستان", lat: 24.8607, lng: 67.0011, tz: 5, fajrAngle: 18, ishaAngle: 18, methodTitle: "University of Islamic Sciences, Karachi" },
      "islamabad": { name: "Islamabad, Pakistan", nameUr: "اسلام آباد، پاکستان", nameAr: "إسلام آباد، باكستان", lat: 33.6844, lng: 73.0479, tz: 5, fajrAngle: 18, ishaAngle: 18, methodTitle: "University of Islamic Sciences, Karachi" },
      "peshawar": { name: "Peshawar, Pakistan", nameUr: "پشاور، پاکستان", nameAr: "بيشاور، باكستان", lat: 34.0151, lng: 71.5249, tz: 5, fajrAngle: 18, ishaAngle: 18, methodTitle: "University of Islamic Sciences, Karachi" },
      "mecca": { name: "Makkah, Saudi Arabia", nameUr: "مکہ مکرمہ، سعودی عرب", nameAr: "مكة المكرمة، السعودية", lat: 21.4225, lng: 39.8262, tz: 3, fajrAngle: 18.5, ishaAngle: 19, methodTitle: "Umm al-Qura University, Makkah" },
      "medina": { name: "Madinah, Saudi Arabia", nameUr: "مدینہ منورہ، سعودی عرب", nameAr: "المدينة المنورة، السعودية", lat: 24.4672, lng: 39.6024, tz: 3, fajrAngle: 18.5, ishaAngle: 19, methodTitle: "Umm al-Qura University, Makkah" },
      "dubai": { name: "Dubai, UAE", nameUr: "دبئی، متحدہ عرب امارات", nameAr: "دبي، الإمارات", lat: 25.2048, lng: 55.2708, tz: 4, fajrAngle: 18.2, ishaAngle: 18.2, methodTitle: "Gulf / UAE Islamic Affairs" },
      "london": { name: "London, UK", nameUr: "لندن، برطانیہ", nameAr: "لندن، المملكة المتحدة", lat: 51.5074, lng: -0.1278, tz: 0, fajrAngle: 15, ishaAngle: 15, methodTitle: "Muslim World League (MWL)" },
      "newyork": { name: "New York, USA", nameUr: "نیویارک، امریکہ", nameAr: "نيويورك، أمريكا", lat: 40.7128, lng: -74.0060, tz: -5, fajrAngle: 15, ishaAngle: 15, methodTitle: "Islamic Society of North America (ISNA)" },
      "toronto": { name: "Toronto, Canada", nameUr: "ٹورنٹو، کینیڈا", nameAr: "تورونتو، كندا", lat: 43.6532, lng: -79.3832, tz: -5, fajrAngle: 15, ishaAngle: 15, methodTitle: "ISNA North America" }
    };

    var HIJRI_MONTHS_EN = [
      "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
      "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
      "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    var HIJRI_MONTHS_UR = [
      "محرم الحرام", "صفر المظفر", "ربیع الاول", "ربیع الثانی",
      "جمادی الاول", "جمادی الثانی", "رجب المرجب", "شعبان المعظم",
      "رمضان المبارک", "شوال المکرم", "ذی القعدہ", "ذی الحجہ"
    ];

    function rad(deg) { return deg * Math.PI / 180.0; }
    function deg(rad) { return rad * 180.0 / Math.PI; }
    function fixHour(h) { return (h % 24 + 24) % 24; }

    function julianDate(year, month, day) {
      if (month <= 2) { year -= 1; month += 12; }
      var A = Math.floor(year / 100);
      var B = 2 - A + Math.floor(A / 4);
      return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    }

    function sunCoords(jd) {
      var d = jd - 2451545.0;
      var g = 357.529 + 0.98560028 * d;
      var q = 280.459 + 0.98564736 * d;
      var l = q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g));
      var e = 23.439 - 0.00000036 * d;
      var ra = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(l)), Math.cos(rad(l)))) / 15;
      var d_ra = fixHour(ra);
      var decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(l))));
      var eqt = q / 15 - d_ra;
      return { decl: decl, eqt: eqt };
    }

    function hourAngle(alpha, lat, decl) {
      var cosH = (Math.sin(rad(alpha)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) /
                 (Math.cos(rad(lat)) * Math.cos(rad(decl)));
      if (cosH > 1) return 0;
      if (cosH < -1) return 12;
      return deg(Math.acos(cosH)) / 15;
    }

    function asrHourAngle(factor, lat, decl) {
      var d = Math.abs(lat - decl);
      var alt = deg(Math.atan(1 / (factor + Math.tan(rad(d)))));
      return hourAngle(alt, lat, decl);
    }

    function computePrayers(date, cityObj, asrHanafi) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var jd = julianDate(year, month, day);
      var s = sunCoords(jd);

      var noon = fixHour(12 + cityObj.tz - cityObj.lng / 15 - s.eqt);
      var sunriseHA = hourAngle(-0.833, cityObj.lat, s.decl);
      var fajrHA = hourAngle(-cityObj.fajrAngle, cityObj.lat, s.decl);
      var ishaHA = hourAngle(-cityObj.ishaAngle, cityObj.lat, s.decl);
      var asrFactor = asrHanafi ? 2 : 1;
      var asrHA = asrHourAngle(asrFactor, cityObj.lat, s.decl);

      var fajr = fixHour(noon - fajrHA);
      var sunrise = fixHour(noon - sunriseHA);
      var dhuhr = noon;
      var asr = fixHour(noon + asrHA);
      var sunset = fixHour(noon + sunriseHA);
      var maghrib = sunset;
      var isha = fixHour(noon + ishaHA);

      // Iqamah standard offsets in minutes (realistic mosque schedule matching the reference)
      return {
        fajr: fajr,
        fajrIqamah: fixHour(fajr + 36 / 60),
        sunrise: sunrise,
        dhuhr: dhuhr,
        dhuhrIqamah: fixHour(dhuhr + 75 / 60),
        asr: asr,
        asrIqamah: fixHour(asr + 35 / 60),
        sunset: sunset,
        maghrib: maghrib,
        maghribIqamah: fixHour(maghrib + 7 / 60),
        isha: isha,
        ishaIqamah: fixHour(isha + 35 / 60),
        jumuah1: "12:35 PM",
        jumuah2: "1:30 PM"
      };
    }

    function formatTime(decHours) {
      var totalMinutes = Math.round(decHours * 60);
      var h = Math.floor(totalMinutes / 60) % 24;
      var m = totalMinutes % 60;
      var ampm = h >= 12 ? "PM" : "AM";
      var h12 = h % 12 || 12;
      return h12 + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
    }

    function getHijriDate(date) {
      // Algorithmic Umm al-Qura civil estimation
      var jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
      var l = Math.floor(jd - 1948440 + 10632);
      var n = Math.floor((l - 1) / 10631);
      l = l - 10631 * n + 354;
      var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) +
              (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
      l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
          (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
      var hm = Math.floor((24 * l) / 709);
      var hd = l - Math.floor((709 * hm) / 24);
      var hy = 30 * n + j - 30;
      var monthIdx = Math.max(0, Math.min(11, hm - 1));
      return {
        day: hd,
        monthEn: HIJRI_MONTHS_EN[monthIdx] || "Jumada al-Awwal",
        monthUr: HIJRI_MONTHS_UR[monthIdx] || "جمادی الاول",
        year: hy
      };
    }

    var selectedCityKey = "lahore";
    var asrHanafi = true;

    try {
      selectedCityKey = localStorage.getItem("baitulamn-prayer-city") || "lahore";
      if (!CITIES[selectedCityKey]) selectedCityKey = "lahore";
    } catch (e) {}

    // Attach city selector events
    document.querySelectorAll(".prayer-city-select").forEach(function (sel) {
      sel.value = selectedCityKey;
      sel.addEventListener("change", function () {
        selectedCityKey = sel.value;
        try { localStorage.setItem("baitulamn-prayer-city", selectedCityKey); } catch (e) {}
        document.querySelectorAll(".prayer-city-select").forEach(function (s) { s.value = selectedCityKey; });
        updateDisplay();
      });
    });

    document.querySelectorAll(".prayer-asr-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        asrHanafi = sel.value === "hanafi";
        updateDisplay();
      });
    });

    function updateDisplay() {
      var now = new Date();
      var city = CITIES[selectedCityKey] || CITIES["lahore"];
      var prayers = computePrayers(now, city, asrHanafi);
      var hijri = getHijriDate(now);

      // Format live current time string
      var curHours = now.getHours();
      var curMins = now.getMinutes();
      var curSecs = now.getSeconds();
      var curDec = curHours + curMins / 60 + curSecs / 3600;
      var ampm = curHours >= 12 ? "PM" : "AM";
      var h12 = curHours % 12 || 12;
      var timeStr = h12 + ":" + (curMins < 10 ? "0" + curMins : curMins) + ":" + (curSecs < 10 ? "0" + curSecs : curSecs) + " " + ampm;

      // Gregorian Date formatted: e.g. "Wednesday, Oct 28"
      var daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var gregStr = daysEn[now.getDay()] + ", " + monthsEn[now.getMonth()] + " " + now.getDate();
      var hijriStr = hijri.day + " " + hijri.monthEn + " " + hijri.year + " AH";
      var hijriStrUr = hijri.day + " " + hijri.monthUr + " " + hijri.year + " ھ";

      // Prayer timing list for sequential checks
      var schedule = [
        { key: "fajr", name: "Fajr", nameUr: "فجر", start: prayers.fajr, iqamah: prayers.fajrIqamah },
        { key: "sunrise", name: "Sunrise", nameUr: "طلوعِ آفتاب", start: prayers.sunrise, iqamah: null },
        { key: "dhuhr", name: "Dhuhr", nameUr: "ظہر", start: prayers.dhuhr, iqamah: prayers.dhuhrIqamah },
        { key: "asr", name: "Asr", nameUr: "عصر", start: prayers.asr, iqamah: prayers.asrIqamah },
        { key: "maghrib", name: "Maghrib", nameUr: "مغرب", start: prayers.maghrib, iqamah: prayers.maghribIqamah },
        { key: "isha", name: "Isha", nameUr: "عشاء", start: prayers.isha, iqamah: prayers.ishaIqamah }
      ];

      // Determine active prayer (current) & next prayer / iqamah
      var activePrayer = "isha"; // default overnight
      var nextTarget = null;
      var nextLabel = "FAJR IQAMAH";

      if (curDec < schedule[0].start) {
        // before Fajr
        activePrayer = "isha";
        nextTarget = schedule[0].iqamah;
        nextLabel = "FAJR IQAMAH";
      } else if (curDec < schedule[1].start) {
        // between Fajr and Sunrise
        activePrayer = "fajr";
        nextTarget = curDec < schedule[0].iqamah ? schedule[0].iqamah : schedule[1].start;
        nextLabel = curDec < schedule[0].iqamah ? "FAJR IQAMAH" : "SUNRISE";
      } else if (curDec < schedule[2].start) {
        // morning after sunrise before Dhuhr
        activePrayer = "sunrise";
        nextTarget = schedule[2].iqamah;
        nextLabel = "DHUHR IQAMAH";
      } else if (curDec < schedule[3].start) {
        // Dhuhr time
        activePrayer = "dhuhr";
        nextTarget = curDec < schedule[2].iqamah ? schedule[2].iqamah : schedule[3].start;
        nextLabel = curDec < schedule[2].iqamah ? "DHUHR IQAMAH" : "ASR START";
      } else if (curDec < schedule[4].start) {
        // Asr time
        activePrayer = "asr";
        nextTarget = curDec < schedule[3].iqamah ? schedule[3].iqamah : schedule[4].start;
        nextLabel = curDec < schedule[3].iqamah ? "ASR IQAMAH" : "MAGHRIB START";
      } else if (curDec < schedule[5].start) {
        // Maghrib time
        activePrayer = "maghrib";
        nextTarget = curDec < schedule[4].iqamah ? schedule[4].iqamah : schedule[5].start;
        nextLabel = curDec < schedule[4].iqamah ? "MAGHRIB IQAMAH" : "ISHA START";
      } else {
        // Isha time
        activePrayer = "isha";
        nextTarget = curDec < schedule[5].iqamah ? schedule[5].iqamah : schedule[0].iqamah + 24;
        nextLabel = curDec < schedule[5].iqamah ? "ISHA IQAMAH" : "FAJR IQAMAH";
      }

      // Calculate countdown to nextTarget
      var diffHours = nextTarget > curDec ? nextTarget - curDec : nextTarget + 24 - curDec;
      var diffSecs = Math.floor(diffHours * 3600);
      var cdHours = Math.floor(diffSecs / 3600);
      var cdMins = Math.floor((diffSecs % 3600) / 60);
      var cdS = diffSecs % 60;
      var cdStr = (cdHours > 0 ? cdHours + "h " : "") + cdMins + "m " + (cdS < 10 ? "0" + cdS : cdS) + "s";

      // Update DOM on all board instances
      boards.forEach(function (b) {
        var clockEl = b.querySelector(".live-clock-time");
        if (clockEl) clockEl.textContent = timeStr;

        var cdEl = b.querySelector(".next-iqamah-countdown");
        if (cdEl) cdEl.textContent = cdStr;

        var tagEl = b.querySelector(".next-iqamah-tag-label");
        if (tagEl) tagEl.textContent = nextLabel;

        var gregEl = b.querySelector(".gregorian-date-val");
        if (gregEl) gregEl.textContent = gregStr;

        var hijriEl = b.querySelector(".hijri-date-val");
        if (hijriEl) hijriEl.textContent = hijriStr;

        var cityLabelEl = b.querySelector(".selected-city-name");
        if (cityLabelEl) cityLabelEl.textContent = city.name;

        var methodLabelEl = b.querySelector(".prayer-method-name");
        if (methodLabelEl) methodLabelEl.textContent = city.methodTitle;

        // Times
        var fStart = b.querySelector(".p-fajr-start");
        if (fStart) fStart.textContent = formatTime(prayers.fajr);
        var fIqamah = b.querySelector(".p-fajr-iqamah");
        if (fIqamah) fIqamah.textContent = formatTime(prayers.fajrIqamah);

        var dStart = b.querySelector(".p-dhuhr-start");
        if (dStart) dStart.textContent = formatTime(prayers.dhuhr);
        var dIqamah = b.querySelector(".p-dhuhr-iqamah");
        if (dIqamah) dIqamah.textContent = formatTime(prayers.dhuhrIqamah);

        var aStart = b.querySelector(".p-asr-start");
        if (aStart) aStart.textContent = formatTime(prayers.asr);
        var aIqamah = b.querySelector(".p-asr-iqamah");
        if (aIqamah) aIqamah.textContent = formatTime(prayers.asrIqamah);

        var mStart = b.querySelector(".p-maghrib-start");
        if (mStart) mStart.textContent = formatTime(prayers.maghrib);
        var mIqamah = b.querySelector(".p-maghrib-iqamah");
        if (mIqamah) mIqamah.textContent = formatTime(prayers.maghribIqamah);

        var iStart = b.querySelector(".p-isha-start");
        if (iStart) iStart.textContent = formatTime(prayers.isha);
        var iIqamah = b.querySelector(".p-isha-iqamah");
        if (iIqamah) iIqamah.textContent = formatTime(prayers.ishaIqamah);

        var sunRiseEl = b.querySelector(".p-sunrise-val");
        if (sunRiseEl) sunRiseEl.textContent = formatTime(prayers.sunrise);
        var sunSetEl = b.querySelector(".p-sunset-val");
        if (sunSetEl) sunSetEl.textContent = formatTime(prayers.sunset);

        var j1El = b.querySelector(".p-jumuah1-val");
        if (j1El) j1El.textContent = prayers.jumuah1;
        var j2El = b.querySelector(".p-jumuah2-val");
        if (j2El) j2El.textContent = prayers.jumuah2;

        // Active prayer circle toggle
        b.querySelectorAll(".prayer-circle-card").forEach(function (card) {
          var pKey = card.getAttribute("data-prayer");
          card.classList.toggle("active", pKey === activePrayer);
        });
      });
    }

    // Run immediately and every 1 second
    updateDisplay();
    setInterval(updateDisplay, 1000);
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
    initPrayerTimes();
  });
})();
