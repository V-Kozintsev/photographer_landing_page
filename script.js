const header = document.querySelector("[data-header]");
const brand = document.querySelector(".brand");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const gallery = document.querySelector("[data-gallery]");
const dots = document.querySelector("[data-dots]");
const reviewContent = document.querySelector("[data-review-content]");
const reviewPhoto = document.querySelector("[data-review-photo]");
const lightboxModal = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const galleryItems = [...document.querySelectorAll("[data-lightbox]")];

const reviews = [
  {
    text: "Анна удивительно чувствует людей и ловит настоящие эмоции. Фотографии получились живыми и тёплыми, а история нашего дня осталась именно такой, как мы её помним.",
    name: "Мария и Алексей",
    type: "Свадебная съёмка",
    avatar: "review-avatar-couple",
    avatarPosition: "0% center",
  },
  {
    text: "Я переживала, что буду скованной в кадре, но съёмка прошла легко. Получились портреты, в которых я узнаю себя и при этом вижу себя по-новому.",
    name: "Екатерина",
    type: "Портретная съёмка",
    avatar: "review-avatar-portrait",
    avatarPosition: "50% center",
  },
  {
    text: "Для бренда было важно получить спокойный, дорогой визуал без лишней постановочности. Анна быстро поняла задачу и собрала цельную серию.",
    name: "Lumi Home",
    type: "Бренд-контент",
    avatar: "review-avatar-brand",
    avatarPosition: "100% center",
  },
];

let reviewIndex = 0;
let lightboxIndex = 0;
let galleryIndex = 0;
let lightboxSwipeStartX = 0;
let lightboxSwipeStartY = 0;

function lockPageScroll() {
  document.body.style.overflow = "hidden";
}

function unlockPageScroll() {
  if (!document.body.classList.contains("nav-open") && !lightboxModal.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
}

function setNavOpen(isOpen) {
  nav.classList.toggle("is-open", isOpen);
  navToggle.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    lockPageScroll();
  } else {
    unlockPageScroll();
  }
}

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
});

navToggle.addEventListener("click", () => {
  setNavOpen(!nav.classList.contains("is-open"));
});

brand.addEventListener("click", () => {
  if (nav.classList.contains("is-open")) {
    setNavOpen(false);
  }
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    setNavOpen(false);
  }
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const isExpanded = item.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-item").forEach((entry) => entry.setAttribute("aria-expanded", "false"));
    item.setAttribute("aria-expanded", String(!isExpanded));
  });
});

function scrollGalleryTo(index, behavior = "smooth") {
  const items = [...gallery.children];
  galleryIndex = Math.max(0, Math.min(index, items.length - 1));
  gallery.scrollTo({ left: items[galleryIndex].offsetLeft, behavior });
}

function scrollGallery(direction) {
  syncDots();
  scrollGalleryTo(galleryIndex + direction);
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
      scrollGalleryTo(index);
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

  galleryIndex = active.index;
  [...dots.children].forEach((dot, index) => dot.classList.toggle("is-active", index === active.index));
}

function renderReview() {
  const review = reviews[reviewIndex];
  reviewPhoto.className = `review-photo review-avatar ${review.avatar}`;
  reviewPhoto.style.backgroundPosition = review.avatarPosition;
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

renderReview();
buildDots();
syncDots();
gallery.addEventListener("scroll", () => window.requestAnimationFrame(syncDots), { passive: true });
window.addEventListener("resize", syncDots);

function showLightboxImage(index) {
  lightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lightboxIndex];
  const previewImage = item.querySelector("img");
  lightboxImage.src = previewImage?.currentSrc || item.dataset.lightbox;
  lightboxImage.alt = previewImage?.alt || "Фотография из портфолио";
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    showLightboxImage(index);
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    lockPageScroll();
  });
});

function closeLightbox() {
  lightboxModal.classList.remove("is-open");
  lightboxModal.setAttribute("aria-hidden", "true");
  unlockPageScroll();
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showLightboxImage(lightboxIndex - 1));
lightboxNext.addEventListener("click", () => showLightboxImage(lightboxIndex + 1));
lightboxModal.addEventListener("click", (event) => {
  if (event.target === lightboxModal) {
    closeLightbox();
  }
});

lightboxModal.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  lightboxSwipeStartX = touch.clientX;
  lightboxSwipeStartY = touch.clientY;
}, { passive: true });

lightboxModal.addEventListener("touchend", (event) => {
  if (!lightboxModal.classList.contains("is-open")) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - lightboxSwipeStartX;
  const deltaY = touch.clientY - lightboxSwipeStartY;
  const isHorizontalSwipe = Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4;

  if (!isHorizontalSwipe) {
    return;
  }

  showLightboxImage(deltaX < 0 ? lightboxIndex + 1 : lightboxIndex - 1);
}, { passive: true });

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightboxModal.classList.contains("is-open")) {
    closeLightbox();
  }
  if (event.key === "ArrowLeft" && lightboxModal.classList.contains("is-open")) {
    showLightboxImage(lightboxIndex - 1);
  }
  if (event.key === "ArrowRight" && lightboxModal.classList.contains("is-open")) {
    showLightboxImage(lightboxIndex + 1);
  }
});
