// Mobile menu
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("ul a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// Split headline into words for the rise-in animation
document.querySelectorAll(".split").forEach((el) => {
  let i = 0;
  const wrap = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.textContent = part;
          inner.style.animationDelay = `${0.15 + i++ * 0.07}s`;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        wrap(child);
      }
    });
  };
  wrap(el);
});

// Reveal sections as they scroll into view
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal, .process").forEach((el) => io.observe(el));

// Gentle parallax on hero phones (desktop only)
const visual = document.querySelector(".hero-visual");
if (visual && window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    visual.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Nav shadow on scroll
window.addEventListener("scroll", () => {
  if (nav) nav.style.boxShadow = window.scrollY > 20
    ? "0 12px 40px rgba(61,50,217,.14)" : "";
});

// Footer year
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
