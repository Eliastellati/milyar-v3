(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggleBtn = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");
  const canvas = document.getElementById("grainCanvas");

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Grain overlay (static texture)
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      const size = 1024;
      canvas.width = size;
      canvas.height = size;

      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 34;
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }

  if (!header || !toggleBtn || !mobileNav) return;

  const setMenuOpen = (open) => {
    header.classList.toggle("is-open", open);
    root.classList.toggle("nav-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");

    // Prevent background scroll on mobile
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggleBtn.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-open"));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // Close when clicking outside header/menu
  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (!e.target.closest(".site-header")) setMenuOpen(false);
  });

  // Close when clicking a menu link
  mobileNav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    setMenuOpen(false);
  });

  // Smooth scroll with header offset
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const isTop = a.dataset.scroll === "top" || href === "#top";
    const targetId = isTop ? "top" : href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    setMenuOpen(false);

    const headerH = header.offsetHeight || 0;
    const gap = 14;
    const y = isTop
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - headerH - gap;

    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
})();