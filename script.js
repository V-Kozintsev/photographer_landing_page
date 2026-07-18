const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const gallery = document.querySelector("[data-gallery]");
const dots = document.querySelector("[data-dots]");
const reviewContent = document.querySelector("[data-review-content]");
const lightboxModal = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const reviews = [
  {
    text: "Анна удивительно чувствует людей и ловит настоящие эмоции. Фотографии получились живыми и тёплыми, а история нашего дня осталась именно такой, как мы её помним.",
    name: "Мария и Алексей",
    type: "Свадебная съёмка",
  },
  {
    text: "Я переживала, что буду скованной в кадре, но съёмка прошла легко. Получились портреты, в которых я узнаю себя и при этом вижу себя по-новому.",
    name: "Екатерина",
    type: "Портретная съёмка",
  },
  {
    text: "Для бренда было важно получить спокойный, дорогой визуал без лишней постановочности. Анна быстро поняла задачу и собрала цельную серию.",
    name: "Lumi Home",
    type: "Бренд-контент",
  },
];

let reviewIndex = 0;

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const isExpanded = item.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-item").forEach((entry) => entry.setAttribute("aria-expanded", "false"));
    item.setAttribute("aria-expanded", String(!isExpanded));
  });
});

function scrollGallery(direction) {
  const amount = gallery.clientWidth * direction;
  gallery.scrollBy({ left: amount, behavior: "smooth" });
}

document.querySelector("[data-slider-prev]").addEventListener("click", () => scrollGallery(-1));
document.querySelector("[data-slider-next]").addEventListener("click", () => scrollGallery(1));

function buildDots() {
  const count = gallery.children.length;
  dots.innerHTML = "";
  for (let index = 0; index < count; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Показать фото ${index + 1}`);
    button.addEventListener("click", () => {
      gallery.children[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    });
    dots.append(button);
  }
}

function syncDots() {
  const items = [...gallery.children];
  const active = items.reduce((nearest, item, index) => {
    const distance = Math.abs(item.getBoundingClientRect().left - gallery.getBoundingClientRect().left);
    return distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY });

  [...dots.children].forEach((dot, index) => dot.classList.toggle("is-active", index === active.index));
}

function renderReview() {
  const review = reviews[reviewIndex];
  reviewContent.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], {
    duration: 220,
    easing: "ease-out",
  });
  reviewContent.innerHTML = `
    <p>${review.text}</p>
    <strong>${review.name}</strong>
    <span>${review.type}</span>
  `;
}

document.querySelector("[data-review-prev]").addEventListener("click", () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  renderReview();
});

document.querySelector("[data-review-next]").addEventListener("click", () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  renderReview();
});

buildDots();
syncDots();
gallery.addEventListener("scroll", () => window.requestAnimationFrame(syncDots), { passive: true });
window.addEventListener("resize", syncDots);

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.querySelector("img")?.alt || "Фотография из портфолио";
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightboxModal.classList.remove("is-open");
  lightboxModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxModal.addEventListener("click", (event) => {
  if (event.target === lightboxModal) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightboxModal.classList.contains("is-open")) {
    closeLightbox();
  }
});
