// ===============================
// 🚀 SMOOTH SCROLL NAVIGATION
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

// ===============================
// 🎯 ACTIVE NAV LINK HIGHLIGHT
// ===============================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===============================
// ✨ SCROLL ANIMATIONS
// ===============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll(".intro, .about, .tips-cards > div").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

// ===============================
// 🎯 CTA BUTTON HANDLING
// ===============================
const getStartedBtn = document.querySelector(".get-started-button");

if (getStartedBtn) {
  getStartedBtn.addEventListener("click", () => {
    // You said: form opens first
    window.location.href = "sign-up.html";
  });
}

// ===============================
// 🔐 SIGN-UP LINK CONTROL
// ===============================
const signupLinks = document.querySelectorAll('a[href="sign-up.html"]');

signupLinks.forEach(link => {
  link.addEventListener("click", () => {
    localStorage.setItem("entryPoint", "landing");
  });
});