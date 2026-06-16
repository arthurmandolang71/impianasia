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
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("hidden") === false;
      menu.classList.toggle("flex", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
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
        if (note) { note.textContent = "Mohon lengkapi nama dan email Anda."; note.style.color = "#ffb4ab"; }
        return;
      }
      if (note) {
        note.textContent = "Terima kasih, " + nama + "! Pesan Anda telah kami terima. Tim kami akan segera menghubungi Anda.";
        note.style.color = "#4edea3";
      }
      form.reset();
    });
  }

  // Micro-interaction: posisi mouse pada glass card
  document.querySelectorAll(".glass-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", (e.clientX - rect.left) + "px");
      card.style.setProperty("--mouse-y", (e.clientY - rect.top) + "px");
    });
  });

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

  document.querySelectorAll(".glass-card, #about img, #portfolio p").forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
})();
