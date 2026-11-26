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

// Custom cursor: dot + trailing ring (desktop mouse only)
if (window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  ring.innerHTML = "<span>View</span>";
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    document.body.classList.add("has-cursor");
  });
  document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
  window.addEventListener("mousedown", () => ring.classList.add("down"));
  window.addEventListener("mouseup", () => ring.classList.remove("down"));

  (function follow() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll(".card").forEach((el) => {
    el.addEventListener("mouseenter", () => { ring.classList.add("view"); dot.classList.add("hide"); });
    el.addEventListener("mouseleave", () => { ring.classList.remove("view"); dot.classList.remove("hide"); });
  });
  document.querySelectorAll("a:not(.card), button, .pills span, .service").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}
