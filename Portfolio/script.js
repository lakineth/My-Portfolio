/* ─────────────────────────────────────────
   LAKINDU NETHMIN – Portfolio Script
───────────────────────────────────────── */

/* ── Typed.js hero role ── */
const typed = new Typed("#typed-role", {
  strings: [
    "Software Developer.",
    "UI/UX Designer.",
    "Project Manager.",
    "Fast Learner."
  ],
  typeSpeed: 55,
  backSpeed: 40,
  backDelay: 1800,
  loop: true
});

/* ── Cursor glow ── */
const glow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top  = e.clientY + "px";
});

/* ── Animated dot-grid canvas ── */
(function initCanvas() {
  const canvas = document.getElementById("dotCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, dots = [];
  const DOT_SPACING = 38;
  const MAX_DIST = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    for (let x = 0; x < W; x += DOT_SPACING) {
      for (let y = 0; y < H; y += DOT_SPACING) {
        dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
      }
    }
  }

  let mx = -9999, my = -9999;
  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const dx = d.x - mx, dy = d.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MAX_DIST) {
        const force = (1 - dist / MAX_DIST) * 5;
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;
      }
      d.vx += (d.ox - d.x) * 0.06;
      d.vy += (d.oy - d.y) * 0.06;
      d.vx *= 0.82;
      d.vy *= 0.82;
      d.x += d.vx;
      d.y += d.vy;

      const proximity = Math.max(0, 1 - dist / MAX_DIST);
      const alpha = 0.12 + proximity * 0.5;
      const radius = 1.3 + proximity * 2;
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,212,${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ── Navbar active + scroll shrink ── */
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id], div[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  // shrink on scroll
  if (window.scrollY > 40) {
    navbar.style.background = "rgba(6,10,20,0.9)";
  } else {
    navbar.style.background = "rgba(6,10,20,0.65)";
  }

  // active link tracking
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

/* ── Mobile drawer ── */
const hamburger      = document.getElementById("hamburger");
const mobileDrawer   = document.getElementById("mobileDrawer");
const drawerOverlay  = document.getElementById("drawerOverlay");
const drawerClose    = document.getElementById("drawerClose");

function openDrawer()  { mobileDrawer.classList.add("open"); drawerOverlay.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeDrawer() { mobileDrawer.classList.remove("open"); drawerOverlay.classList.remove("open"); document.body.style.overflow = ""; }

hamburger.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
document.querySelectorAll(".drawer-link").forEach(l => l.addEventListener("click", closeDrawer));

/* ── Scroll-reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── Skill bars animate on reveal ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".skill-fill").forEach(bar => {
        bar.style.width = bar.dataset.width + "%";
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillPanel = document.getElementById("tab-skills");
if (skillPanel) skillObserver.observe(skillPanel);

/* ── Tab switching ── */
const tabBtns   = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove("active"));
    tabPanels.forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const panel = document.getElementById("tab-" + target);
    if (panel) {
      panel.classList.add("active");
      // re-animate skill bars if switching to skills
      if (target === "skills") {
        panel.querySelectorAll(".skill-fill").forEach(bar => {
          bar.style.width = "0";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { bar.style.width = bar.dataset.width + "%"; });
          });
        });
      }
    }
  });
});

/* ── Contact form (client-side validation) ── */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "#ff6b6b";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.style.color = "#ff6b6b";
      return;
    }

    const submitBtn = form.querySelector(".submit-btn");
    const btnText   = submitBtn.querySelector(".btn-text");
    btnText.textContent = "Sending…";
    submitBtn.disabled  = true;

    // Simulate send (replace with EmailJS or backend call)
    await new Promise(r => setTimeout(r, 1500));

    formStatus.textContent = "✓ Message sent! I'll get back to you soon.";
    formStatus.style.color = "var(--teal)";
    form.reset();
    btnText.textContent  = "Send Message";
    submitBtn.disabled   = false;

    setTimeout(() => { formStatus.textContent = ""; }, 6000);
  });
}
