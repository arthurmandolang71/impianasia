// ===== Impian Asia — interaktivitas ringan =====
(function () {
  "use strict";

  // Tahun footer otomatis
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
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
        if (note) { note.textContent = "Mohon lengkapi nama dan email Anda."; note.style.color = "#f59e9e"; }
        return;
      }
      if (note) {
        note.textContent = "Terima kasih, " + nama + "! Pesan Anda telah kami terima. Tim kami akan menghubungi Anda.";
        note.style.color = "";
      }
      form.reset();
    });
  }

  // Reveal saat scroll
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".card, .feature, .steps li, .about-card").forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
})();
