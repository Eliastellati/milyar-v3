(() => {
  const header = document.querySelector(".site-header");
  const toggleBtn = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");

  // Footer year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const setMenuOpen = (open) => {
    if (!header || !toggleBtn) return;
    header.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");

    document.body.classList.toggle("menu-open", open); // ✅ aggiungi questa
  };

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = header?.classList.contains("is-open");
      setMenuOpen(!isOpen);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  if (mobileNav) {
    mobileNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setMenuOpen(false);
    });
  }

  // Smooth scroll offset (fixed header)
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const gap = 12;

    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - gap;
    window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href") || "";

    // Top link
    if (a.dataset.scroll === "top" || href === "#top" || href === "#") {
      e.preventDefault();
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

      // Remove hash from URL
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);
      return;
    }

    const id = href.slice(1);
    if (!id) return;

    // Custom scroll (prevents “jump” and keeps offset correct)
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);

    // Update URL hash without jumping
    window.history.pushState(null, "", href);
  });

  // If page loads with a hash, scroll with offset
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    if (!id) return;
    setTimeout(() => scrollToId(id), 30);
  });

  // Close menu on desktop breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setMenuOpen(false);
  });

  // Grain overlay (canvas noise) – replica del tuo GrainOverlay :contentReference[oaicite:8]{index=8}
  const canvas = document.getElementById("grainCanvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const size = 2048;
      canvas.width = size;
      canvas.height = size;

      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 50; // come nel componente
      }

      ctx.putImageData(imageData, 0, 0);

      // Stretch to viewport; rendering smooth
      canvas.style.imageRendering = "auto";
    }
  }
})();

document.addEventListener("click", (e) => {
  if (!header?.classList.contains("is-open")) return;
  const isInsideHeader = e.target.closest(".site-header");
  if (!isInsideHeader) setMenuOpen(false);
});

const navMobile = document.getElementById("mobileNav");

const setMenuOpen = (open) => {
  header.classList.toggle("is-open", open);
  toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");

  // ✅ aggiorna altezza menu per posizionare lo scrim sotto
  if (open && navMobile) {
    // aspetta un frame così layout/transition sono “settati”
    requestAnimationFrame(() => {
      const h = navMobile.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--mobile-menu-height", `${h}px`);
    });
  } else {
    document.documentElement.style.setProperty("--mobile-menu-height", "0px");
  }
};

document.addEventListener("click", (e) => {
  if (!header.classList.contains("is-open")) return;
  const inside = e.target.closest(".site-header") || e.target.closest("#mobileNav");
  if (!inside) setMenuOpen(false);
});
