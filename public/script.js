// ===== Impian Asia — interaktivitas ringan =====
(function () {
  "use strict";

  // Tahun footer otomatis
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle menu mobile
  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var icon = toggle.querySelector(".material-symbols-outlined");
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(open));
      if (icon) icon.textContent = open ? "close" : "menu";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "menu";
      });
    });
  }

  // Header: subtle border emphasis saat scroll
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("shadow-card");
      } else {
        header.classList.remove("shadow-card");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Form kontak (demo — tanpa backend)
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nama = (data.get("nama") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      if (!nama || !email) {
        if (note) { note.textContent = "Mohon lengkapi nama dan email Anda."; note.style.color = "#F87171"; }
        return;
      }
      if (note) {
        note.textContent = "Terima kasih, " + nama + "! Pesan Anda telah kami terima. Tim kami akan segera menghubungi Anda.";
        note.style.color = "#10B981";
      }
      form.reset();
    });
  }

  // Reveal saat scroll (progressive enhancement)
  var revealTargets = document.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }
})();
