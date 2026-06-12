const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener("load", () => {
  qs("#loader")?.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => qs("#loader")?.classList.add("hidden"), 650);
});

if (window.lucide) {
  lucide.createIcons();
} else {
  qsa("[data-lucide]").forEach((icon) => icon.classList.add("icon-fallback"));
}

if (window.AOS) {
  AOS.init({
    duration: 900,
    once: true,
    easing: "ease-out-cubic",
    offset: 90
  });
} else {
  qsa("[data-aos]").forEach((el) => {
    el.removeAttribute("data-aos");
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

if (window.particlesJS) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 72, density: { enable: true, value_area: 900 } },
      color: { value: ["#68e8ff", "#8b5cf6", "#18d7a7", "#ffffff"] },
      shape: { type: "circle" },
      opacity: { value: 0.42, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 145,
        color: "#68e8ff",
        opacity: 0.18,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 165, line_linked: { opacity: 0.3 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

const glow = qs(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const toggle = qs(".nav-toggle");
const nav = qs(".nav-links");
toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

qsa(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-title", {
    y: 70,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.45
  });

  gsap.from(".hero-subtitle, .hero-actions, .hero-metrics", {
    y: 40,
    opacity: 0,
    stagger: 0.18,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.9
  });

  gsap.to(".hero-media", {
    scale: 1.15,
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      scrub: true,
      start: "top top",
      end: "bottom top"
    }
  });
}

const interactiveCards = window.gsap
  ? gsap.utils.toArray(".tilt-card, .neo-card, .university-card")
  : qsa(".tilt-card, .neo-card, .university-card");

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

qsa(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });
  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

let countersStarted = false;
const animateCounters = () => {
  if (countersStarted) return;
  countersStarted = true;
  qsa("[data-counter]").forEach((el) => {
    const end = Number(el.dataset.counter);
    if (window.gsap) {
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: end,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: () => {
          el.textContent = Math.round(Number(el.textContent)).toLocaleString("es-MX");
          if (end === 100) el.textContent += "%";
        }
      });
    } else {
      let current = 0;
      const step = Math.max(1, Math.round(end / 60));
      const timer = setInterval(() => {
        current = Math.min(end, current + step);
        el.textContent = current.toLocaleString("es-MX") + (end === 100 ? "%" : "");
        if (current >= end) clearInterval(timer);
      }, 24);
    }
  });
};

if (window.ScrollTrigger) {
  ScrollTrigger.create({ trigger: ".stats-grid", start: "top 80%", onEnter: animateCounters });
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) animateCounters();
  }, { threshold: 0.35 });
  observer.observe(qs(".stats-grid"));
} else {
  animateCounters();
}

if (window.Swiper) {
  new Swiper(".gallery-swiper", {
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 18,
    autoplay: { delay: 2600, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    breakpoints: {
      760: { slidesPerView: 2 },
      1120: { slidesPerView: 2.6 }
    }
  });
} else {
  qs(".gallery-swiper")?.classList.add("swiper-fallback");
}

const lightbox = qs("#lightbox");
const lightboxImg = qs("#lightbox img");
qsa(".swiper-slide img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

qs("#closeLightbox")?.addEventListener("click", () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
});

qs("#quizButton")?.addEventListener("click", () => {
  const score = qsa(".quiz-options input:checked").reduce((sum, item) => sum + Number(item.value), 0);
  const result = qs("#quizResult");
  if (score >= 80) {
    result.textContent = `Afinidad ${score}%: tienes un perfil muy fuerte para Trabajo Social. Tu sensibilidad puede convertirse en liderazgo social.`;
  } else if (score >= 50) {
    result.textContent = `Afinidad ${score}%: hay una base interesante. Explora voluntariado, entrevistas y visitas a instituciones como el DIF.`;
  } else {
    result.textContent = `Afinidad ${score}%: aún puedes explorar. Trabajo Social exige escucha, compromiso y gusto por resolver problemas humanos.`;
  }
  if (window.gsap) {
    gsap.fromTo(result, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 });
  }
});

qsa(".quiz-options input").forEach((input) => {
  input.addEventListener("change", () => {
    input.closest("label").classList.toggle("selected", input.checked);
  });
});
