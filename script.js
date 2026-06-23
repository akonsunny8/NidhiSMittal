const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const cursorMediaQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1025px)");
const cursorInteractiveSelector = [
  "a",
  "button",
  "[role='button']",
  "[data-card-link]",
  "[data-menu-toggle]",
  "[data-filter]",
  "[data-expand]",
  "[data-next]",
  "[data-prev]",
  "input",
  "textarea",
  "select",
  "label",
  "summary",
].join(",");

let customCursorCleanup = null;

function initCustomCursor() {
  if (customCursorCleanup || !cursorMediaQuery.matches) return;

  const ring = document.createElement("span");
  const dot = document.createElement("span");
  ring.className = "custom-cursor-ring";
  dot.className = "custom-cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);
  document.documentElement.classList.add("custom-cursor-enabled");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let animationFrame = 0;

  const setElementPosition = (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
  };

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    setElementPosition(ring, ringX, ringY);
    setElementPosition(dot, mouseX, mouseY);
    animationFrame = window.requestAnimationFrame(animateCursor);
  };

  const handlePointerMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.documentElement.classList.add("custom-cursor-visible");
  };

  const handlePointerLeave = () => {
    document.documentElement.classList.remove("custom-cursor-visible", "custom-cursor-hover");
  };

  const handlePointerOver = (event) => {
    if (event.target.closest(cursorInteractiveSelector)) {
      document.documentElement.classList.add("custom-cursor-hover");
    }
  };

  const handlePointerOut = (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest(cursorInteractiveSelector)) {
      document.documentElement.classList.remove("custom-cursor-hover");
    }
  };

  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("pointerover", handlePointerOver);
  document.addEventListener("pointerout", handlePointerOut);
  animationFrame = window.requestAnimationFrame(animateCursor);

  customCursorCleanup = () => {
    window.cancelAnimationFrame(animationFrame);
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerleave", handlePointerLeave);
    document.removeEventListener("pointerover", handlePointerOver);
    document.removeEventListener("pointerout", handlePointerOut);
    document.documentElement.classList.remove(
      "custom-cursor-enabled",
      "custom-cursor-visible",
      "custom-cursor-hover",
    );
    ring.remove();
    dot.remove();
    customCursorCleanup = null;
  };
}

function syncCustomCursor() {
  if (cursorMediaQuery.matches) {
    initCustomCursor();
  } else if (customCursorCleanup) {
    customCursorCleanup();
  }
}

syncCustomCursor();
if (cursorMediaQuery.addEventListener) {
  cursorMediaQuery.addEventListener("change", syncCustomCursor);
} else {
  cursorMediaQuery.addListener(syncCustomCursor);
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    nav.classList.add("open");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "site-navigation");
  nav.id ||= "site-navigation";

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (event.target.closest("[data-nav], [data-menu-toggle]")) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroDots = document.querySelectorAll("[data-hero-dot]");
let heroSlideIndex = 0;

function setHeroSlide(index) {
  if (!heroSlides.length) return;
  heroSlideIndex = index % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === heroSlideIndex);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === heroSlideIndex);
  });
}

if (heroSlides.length) {
  window.setInterval(() => {
    setHeroSlide(heroSlideIndex + 1);
  }, 3600);
}

const coverSlides = document.querySelectorAll("[data-cover-slide]");
let coverSlideIndex = 0;

function setCoverSlide(index) {
  if (!coverSlides.length) return;
  coverSlideIndex = index % coverSlides.length;
  coverSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === coverSlideIndex);
  });
}

if (coverSlides.length) {
  window.setInterval(() => {
    setCoverSlide(coverSlideIndex + 1);
  }, 4800);
}

document.querySelectorAll("[data-card-link]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    window.location.href = card.dataset.cardLink;
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = card.dataset.cardLink;
    }
  });
});

const revealItems = document.querySelectorAll(
  ".reveal, main > section:not(.hero), .narrative-card, .program-feature-grid article, .program-detail-list p, .impact-story-track article",
);

revealItems.forEach((item) => item.classList.add("smooth-reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible", "smooth-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -3% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible", "smooth-visible"));
}

const filters = document.querySelectorAll("[data-filter]");
const blogFilters = document.querySelector("[data-blog-filters]");
const blogSearch = document.querySelector("[data-blog-search]");
const blogEmpty = document.querySelector("[data-blog-empty]");
const blogPagination = document.querySelector("[data-blog-pagination]");
const blogPrev = document.querySelector("[data-blog-page-prev]");
const blogNext = document.querySelector("[data-blog-page-next]");
const blogPageStatus = document.querySelector("[data-blog-page-status]");
const blogCatalogTitle = document.querySelector("[data-blog-catalog-title]");
const blogCatalogSummary = document.querySelector("[data-blog-catalog-summary]");
const blogPageSize = 6;
const blogState = {
  category: "all",
  query: "",
  page: 1,
};

function blogCards() {
  return Array.from(document.querySelectorAll("[data-category]"));
}

function normalizeBlogCategory(category) {
  const normalized = String(category || "all")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "all";
}

function blogCategoryLabel(category) {
  if (category === "all") return "all categories";
  if (categoryLabels[category]) return categoryLabels[category];
  return category
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getBlogUrlState() {
  const params = new URLSearchParams(window.location.search);
  const hashCategory = window.location.hash.startsWith("#category=")
    ? window.location.hash.replace(/^#category=/, "")
    : "";
  const rawCategory = params.get("category") || params.get("filter") || hashCategory;
  return {
    category: normalizeBlogCategory(rawCategory),
    query: params.get("q") || "",
    page: Math.max(parseInt(params.get("page") || "1", 10) || 1, 1),
  };
}

function syncBlogUrl() {
  if (!document.querySelector("[data-blog-list]")) return;
  const params = new URLSearchParams(window.location.search);
  if (blogState.category === "all") {
    params.delete("category");
    params.delete("filter");
  } else {
    params.set("category", blogState.category);
    params.delete("filter");
  }
  if (blogState.query) {
    params.set("q", blogState.query);
  } else {
    params.delete("q");
  }
  if (blogState.page > 1) {
    params.set("page", String(blogState.page));
  } else {
    params.delete("page");
  }
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
}

function updateBlogCategoryCounts() {
  if (!filters.length) return;
  const counts = blogCards().reduce(
    (totals, article) => {
      totals.all += 1;
      totals[article.dataset.category] = (totals[article.dataset.category] || 0) + 1;
      return totals;
    },
    { all: 0 },
  );

  filters.forEach((filter) => {
    const badge = filter.querySelector("span");
    if (!badge) return;
    badge.textContent = counts[filter.dataset.filter] || 0;
  });
}

function setActiveBlogFilter(category) {
  filters.forEach((filter) => {
    const active = filter.dataset.filter === category;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
    if (active) {
      filter.setAttribute("aria-current", "true");
    } else {
      filter.removeAttribute("aria-current");
    }
  });
}

function articleMatchesSearch(article, query) {
  if (!query) return true;
  const searchableText = [
    article.querySelector("h2")?.textContent,
    article.querySelector(".article-meta span")?.textContent,
    article.querySelector("p")?.textContent,
    article.dataset.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return searchableText.includes(query.toLowerCase());
}

filters.forEach((filter) => {
  filter.setAttribute("aria-pressed", String(filter.classList.contains("active")));
});

blogFilters?.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (!filter || !blogFilters.contains(filter)) return;
  blogState.category = filter.dataset.filter;
  blogState.query = "";
  blogState.page = 1;
  if (blogSearch) blogSearch.value = "";
  applyBlogFilter(blogState.category, { updateUrl: true });
});

blogSearch?.addEventListener("input", () => {
  blogState.query = blogSearch.value.trim();
  blogState.page = 1;
  applyBlogFilter(blogState.category, { updateUrl: true });
});

blogPrev?.addEventListener("click", () => {
  blogState.page = Math.max(blogState.page - 1, 1);
  applyBlogFilter(blogState.category, { updateUrl: true });
});

blogNext?.addEventListener("click", () => {
  blogState.page += 1;
  applyBlogFilter(blogState.category, { updateUrl: true });
});

window.addEventListener("popstate", () => {
  initBlogFiltersFromUrl();
});

let activeBlogModalTrigger = null;

function ensureBlogModal() {
  let modal = document.querySelector("[data-blog-modal]");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "blog-reader-modal";
  modal.dataset.blogModal = "";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "blog-reader-title");
  modal.innerHTML = `
    <div class="blog-reader-backdrop" data-blog-modal-close></div>
    <article class="blog-reader-panel">
      <button class="blog-reader-close" type="button" aria-label="Close blog reader" data-blog-modal-close>&times;</button>
      <div class="blog-reader-media" data-blog-modal-media></div>
      <div class="blog-reader-content">
        <span data-blog-modal-category></span>
        <h2 id="blog-reader-title" data-blog-modal-title></h2>
        <div class="blog-reader-body" data-blog-modal-body></div>
      </div>
    </article>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-blog-modal-close]")) {
      closeBlogModal();
    }
  });

  return modal;
}

function closeBlogModal() {
  const modal = document.querySelector("[data-blog-modal]");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("blog-modal-open");
  activeBlogModalTrigger?.focus();
  activeBlogModalTrigger = null;
}

function openBlogModal(card, trigger) {
  if (!card) return;
  const modal = ensureBlogModal();
  const title = card.querySelector("h2")?.textContent.trim() || "Blog";
  const category = card.querySelector(".article-meta span")?.textContent.trim() || card.dataset.category || "Blog";
  const image = card.querySelector(".article-card-image img")?.cloneNode(true);
  const articleMore = card.querySelector(".article-more");
  const excerpt = card.querySelector(":scope > p")?.cloneNode(true);
  const mediaMount = modal.querySelector("[data-blog-modal-media]");
  const bodyMount = modal.querySelector("[data-blog-modal-body]");

  activeBlogModalTrigger = trigger || null;
  modal.querySelector("[data-blog-modal-title]").textContent = title;
  modal.querySelector("[data-blog-modal-category]").textContent = category;
  mediaMount.replaceChildren();
  bodyMount.replaceChildren();

  if (image) {
    image.removeAttribute("loading");
    mediaMount.append(image);
  }

  if (articleMore?.children.length) {
    bodyMount.replaceChildren(...Array.from(articleMore.children).map((child) => child.cloneNode(true)));
  } else if (excerpt) {
    bodyMount.append(excerpt);
  }

  modal.hidden = false;
  document.body.classList.add("blog-modal-open");
  modal.querySelector("[data-blog-modal-close]")?.focus();
}

function bindBlogExpandButtons(scope = document) {
  scope.querySelectorAll("[data-expand]").forEach((button) => {
    if (button.dataset.modalBound === "true") return;
    button.dataset.modalBound = "true";
    button.dataset.closedLabel = button.textContent;
    button.addEventListener("click", () => {
      openBlogModal(button.closest(".article-card"), button);
    });
  });
}

bindBlogExpandButtons();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBlogModal();
  }
});

document.querySelectorAll("[data-founder-more]").forEach((button) => {
  const content = document.getElementById(button.getAttribute("aria-controls"));
  if (!content) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    content.hidden = expanded;
    button.textContent = expanded ? "Show more" : "Show less";
  });
});

const recommendations = document.querySelectorAll(".recommendation");
const nextButton = document.querySelector("[data-next]");
const prevButton = document.querySelector("[data-prev]");
let activeRecommendation = 0;

function showRecommendation(index) {
  if (!recommendations.length) return;
  recommendations[activeRecommendation].classList.remove("active");
  activeRecommendation = (index + recommendations.length) % recommendations.length;
  recommendations[activeRecommendation].classList.add("active");
}

if (recommendations.length) {
  nextButton?.addEventListener("click", () => showRecommendation(activeRecommendation + 1));
  prevButton?.addEventListener("click", () => showRecommendation(activeRecommendation - 1));
  setInterval(() => showRecommendation(activeRecommendation + 1), 6000);
}

const contactForms = document.querySelectorAll("[data-contact-form]");
const newsletterForms = document.querySelectorAll(".footer-newsletter");

function showContactThanks(text = "Thanks for writing and I will get back to you.") {
  let popup = document.querySelector("[data-contact-thanks]");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "contact-thanks";
    popup.dataset.contactThanks = "";
    popup.setAttribute("role", "status");
    popup.setAttribute("aria-live", "polite");
    popup.innerHTML = `
      <div class="contact-thanks-card">
        <button type="button" aria-label="Close message" data-contact-thanks-close>&times;</button>
        <p data-contact-thanks-text></p>
      </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector("[data-contact-thanks-close]")?.addEventListener("click", () => {
      popup.classList.remove("show");
    });
  }

  const popupText = popup.querySelector("[data-contact-thanks-text]");
  if (popupText) {
    popupText.textContent = text;
  }
  popup.classList.add("show");
  window.clearTimeout(showContactThanks.timer);
  showContactThanks.timer = window.setTimeout(() => {
    popup.classList.remove("show");
  }, 5200);
}

contactForms.forEach((contactForm) => {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const service = data.get("service") || "General enquiry";
    const story = data.get("message") || "";
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const message = contactForm.querySelector("[data-contact-message]");
    const originalButtonText = submitButton?.textContent;
    const subject = encodeURIComponent(`Nidhi S Mittal enquiry: ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nStory:\n${story}`,
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Opening email...";
    }
    if (message) {
      message.textContent = "Your email draft is opening. Please press Send in your mail app.";
    }

    window.location.href = `mailto:reach@nidhimittal.com?subject=${subject}&body=${body}`;
    showContactThanks("Your email draft is ready. Please press Send in your mail app.");

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || "Send the note";
      }
      if (message) {
        message.textContent = "Email draft opened. Send it from your mail app to deliver the message.";
      }
    }, 1800);
  });
});

newsletterForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email") || "";
    const subject = encodeURIComponent(form.dataset.newsletterSubject || "Newsletter subscription");
    const bodyBase = form.dataset.newsletterBody || "Please add this email to the newsletter list";
    const body = encodeURIComponent(`${bodyBase}: ${email}`);
    window.location.href = `mailto:reach@nidhimittal.com?subject=${subject}&body=${body}`;
  });
});

const blogStoreKey = "sattori.blogPosts";
const adminSessionKey = "sattori.adminUnlocked";
const adminPassword = "Nidhi@123";
const categoryLabels = {
  marketing: "Marketing mastery",
  brand: "Personal brand building",
  journal: "Insignificant Side",
};

function readBlogPosts() {
  try {
    return JSON.parse(localStorage.getItem(blogStoreKey) || "[]");
  } catch {
    return [];
  }
}

function writeBlogPosts(posts) {
  localStorage.setItem(blogStoreKey, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("sattori:blogs-updated"));
}

function makePostId(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${slug || "post"}-${Date.now()}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function paragraphsFromText(value) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function createPublicPostCard(post) {
  const article = document.createElement("article");
  article.className = "article-card live-post";
  article.id = post.id;
  article.dataset.category = post.category;
  article.innerHTML = `
    <figure class="article-card-image">
      <img src="assets/brand-awakening-blocks.webp" alt="" />
    </figure>
    <div class="article-meta">
      <span>${categoryLabels[post.category] || "Brand insight"}</span>
    </div>
    <h2>${escapeHtml(post.title)}</h2>
    <p>${escapeHtml(post.excerpt)}</p>
    <button class="text-link" type="button" data-expand>Read More</button>
    <div class="article-more">${paragraphsFromText(post.body)}</div>
  `;
  return article;
}

function currentBlogFilter() {
  return blogState.category || document.querySelector(".filter.active")?.dataset.filter || "all";
}

function applyBlogFilter(category = currentBlogFilter(), options = {}) {
  if (!document.querySelector("[data-blog-list]")) return;

  blogState.category = normalizeBlogCategory(category);
  setActiveBlogFilter(blogState.category);
  updateBlogCategoryCounts();

  const query = blogState.query.trim();
  const matches = blogCards().filter((article) => {
    const categoryMatches = blogState.category === "all" || article.dataset.category === blogState.category;
    return categoryMatches && articleMatchesSearch(article, query);
  });

  const totalPages = Math.max(Math.ceil(matches.length / blogPageSize), 1);
  blogState.page = Math.min(Math.max(blogState.page, 1), totalPages);
  const startIndex = (blogState.page - 1) * blogPageSize;
  const visiblePageCards = new Set(matches.slice(startIndex, startIndex + blogPageSize));

  blogCards().forEach((article) => {
    article.classList.toggle("hidden", !visiblePageCards.has(article));
  });

  if (blogEmpty) {
    const categoryLabel = blogCategoryLabel(blogState.category);
    blogEmpty.textContent = query
      ? blogState.category === "all"
        ? `No blogs found for "${query}".`
        : `No blogs found in ${categoryLabel} for "${query}".`
      : blogState.category === "all"
        ? "No blogs found."
        : `No blogs found in ${categoryLabel}.`;
    blogEmpty.hidden = matches.length > 0;
  }

  if (blogCatalogTitle) {
    blogCatalogTitle.textContent = blogState.category === "all" ? "All blogs" : `${blogCategoryLabel(blogState.category)} blogs`;
  }

  if (blogCatalogSummary) {
    const resultLabel = matches.length === 1 ? "blog" : "blogs";
    const categoryLabel = blogState.category === "all" ? "all categories" : blogCategoryLabel(blogState.category);
    blogCatalogSummary.textContent = query
      ? `Showing ${matches.length} ${resultLabel} in ${categoryLabel} for "${query}".`
      : `Showing ${matches.length} ${resultLabel} in ${categoryLabel}.`;
  }

  if (blogPagination) {
    const shouldPaginate = matches.length > blogPageSize;
    blogPagination.hidden = !shouldPaginate;
    if (blogPageStatus) blogPageStatus.textContent = `Page ${blogState.page} of ${totalPages}`;
    if (blogPrev) blogPrev.disabled = blogState.page <= 1;
    if (blogNext) blogNext.disabled = blogState.page >= totalPages;
  }

  if (options.updateUrl) syncBlogUrl();
}

function initBlogFiltersFromUrl() {
  if (!document.querySelector("[data-blog-list]")) return;
  const urlState = getBlogUrlState();
  blogState.category = urlState.category;
  blogState.query = urlState.query;
  blogState.page = urlState.page;
  if (blogSearch) blogSearch.value = blogState.query;
  applyBlogFilter(blogState.category);
}

function renderPublicPosts() {
  const mount = document.querySelector("[data-live-posts]");
  if (!mount) {
    initBlogFiltersFromUrl();
    return;
  }

  const publishedPosts = readBlogPosts()
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  mount.replaceChildren(...publishedPosts.map(createPublicPostCard));
  bindBlogExpandButtons(mount);
  applyBlogFilter(blogState.category);
}

function renderAdminPosts() {
  const list = document.querySelector("[data-admin-posts]");
  if (!list) return;

  const posts = readBlogPosts().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (!posts.length) {
    list.innerHTML = `<p class="admin-empty">No posts yet. Write your first one and publish when it is ready.</p>`;
    return;
  }

  list.innerHTML = posts
    .map(
      (post) => `
        <article class="admin-post" data-admin-post-id="${post.id}">
          <div>
            <span>${post.status === "published" ? "Published" : "Draft"} / ${categoryLabels[post.category]}</span>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt)}</p>
          </div>
          <div class="admin-post-actions">
            <button class="text-link" type="button" data-edit-post="${post.id}">Edit</button>
            <button class="text-link" type="button" data-toggle-post="${post.id}">
              ${post.status === "published" ? "Unpublish" : "Publish"}
            </button>
            <button class="text-link danger-link" type="button" data-delete-post="${post.id}">Delete</button>
          </div>
        </article>
      `,
    )
    .join("");
}

const blogAdminForm = document.querySelector("[data-blog-admin-form]");
const adminLoginForm = document.querySelector("[data-admin-login-form]");
const adminLoginPanel = document.querySelector("[data-admin-login-panel]");
const adminContent = document.querySelector("[data-admin-content]");

function isAdminUnlocked() {
  return sessionStorage.getItem(adminSessionKey) === "true";
}

function setAdminUnlocked(unlocked) {
  if (!adminLoginPanel || !adminContent) return;
  adminLoginPanel.hidden = unlocked;
  adminContent.hidden = !unlocked;
  if (unlocked) {
    renderAdminPosts();
  }
}

if (adminLoginForm) {
  const loginMessage = document.querySelector("[data-login-message]");
  setAdminUnlocked(isAdminUnlocked());

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(adminLoginForm).get("password");
    if (password === adminPassword) {
      sessionStorage.setItem(adminSessionKey, "true");
      adminLoginForm.reset();
      if (loginMessage) {
        loginMessage.textContent = "";
      }
      setAdminUnlocked(true);
    } else if (loginMessage) {
      loginMessage.textContent = "Incorrect password. Please try again.";
    }
  });

  document.querySelector("[data-admin-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem(adminSessionKey);
    resetBlogForm();
    setAdminUnlocked(false);
  });
}

function resetBlogForm() {
  if (!blogAdminForm) return;
  blogAdminForm.reset();
  blogAdminForm.elements.id.value = "";
}

if (blogAdminForm) {
  const message = document.querySelector("[data-admin-message]");

  blogAdminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isAdminUnlocked()) return;
    const submitter = event.submitter;
    const data = new FormData(blogAdminForm);
    const id = data.get("id") || makePostId(data.get("title"));
    const posts = readBlogPosts();
    const existingIndex = posts.findIndex((post) => post.id === id);
    const existing = posts[existingIndex] || {};
    const post = {
      ...existing,
      id,
      title: data.get("title").trim(),
      category: data.get("category"),
      excerpt: data.get("excerpt").trim(),
      body: data.get("body").trim(),
      status: submitter?.value || "draft",
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }

    writeBlogPosts(posts);
    renderAdminPosts();
    resetBlogForm();
    if (message) {
      message.textContent = post.status === "published" ? "Published. The blog page has updated." : "Draft saved.";
    }
  });

  document.querySelector("[data-blog-reset]")?.addEventListener("click", resetBlogForm);

  document.addEventListener("click", (event) => {
    if (!isAdminUnlocked()) return;
    const editButton = event.target.closest("[data-edit-post]");
    const toggleButton = event.target.closest("[data-toggle-post]");
    const deleteButton = event.target.closest("[data-delete-post]");
    const posts = readBlogPosts();

    if (editButton) {
      const post = posts.find((item) => item.id === editButton.dataset.editPost);
      if (!post) return;
      blogAdminForm.elements.id.value = post.id;
      blogAdminForm.elements.title.value = post.title;
      blogAdminForm.elements.category.value = post.category;
      blogAdminForm.elements.excerpt.value = post.excerpt;
      blogAdminForm.elements.body.value = post.body;
      blogAdminForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (toggleButton) {
      const nextPosts = posts.map((post) =>
        post.id === toggleButton.dataset.togglePost
          ? {
              ...post,
              status: post.status === "published" ? "draft" : "published",
              updatedAt: new Date().toISOString(),
            }
          : post,
      );
      writeBlogPosts(nextPosts);
      renderAdminPosts();
    }

    if (deleteButton) {
      const nextPosts = posts.filter((post) => post.id !== deleteButton.dataset.deletePost);
      writeBlogPosts(nextPosts);
      renderAdminPosts();
    }
  });

  if (isAdminUnlocked()) {
    renderAdminPosts();
  }
}

initBlogFiltersFromUrl();
renderPublicPosts();

window.addEventListener("storage", (event) => {
  if (event.key === blogStoreKey) {
    renderPublicPosts();
    renderAdminPosts();
  }
});

window.addEventListener("sattori:blogs-updated", () => {
  renderPublicPosts();
  renderAdminPosts();
});
