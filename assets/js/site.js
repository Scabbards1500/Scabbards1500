(function () {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("image-modal-img");

  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    window.setTimeout(function () {
      if (!modal.classList.contains("open")) {
        modalImg.removeAttribute("src");
        modalImg.alt = "";
      }
    }, 300);
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (img) {
    img.addEventListener("click", function () {
      openModal(img.getAttribute("src"), img.getAttribute("alt"));
    });
  });

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  var chips = document.querySelectorAll("[data-keyword]");
  var cards = document.querySelectorAll(".post-card[data-keywords]");
  var countEl = document.getElementById("filter-count");
  var selected = new Set();

  function applyFilter() {
    var visible = 0;
    cards.forEach(function (card) {
      var keywords = (card.getAttribute("data-keywords") || "")
        .split("|")
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);
      var show =
        selected.size === 0 ||
        keywords.some(function (keyword) {
          return selected.has(keyword);
        });
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    if (countEl) {
      countEl.hidden = selected.size === 0;
      countEl.textContent = visible + " results";
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var keyword = chip.getAttribute("data-keyword");
      if (keyword === "__clean") {
        selected.clear();
        chips.forEach(function (item) {
          item.classList.remove("active");
        });
      } else if (selected.has(keyword)) {
        selected.delete(keyword);
        chip.classList.remove("active");
      } else {
        selected.add(keyword);
        chip.classList.add("active");
      }
      var clean = document.querySelector('[data-keyword="__clean"]');
      if (clean) clean.hidden = selected.size === 0;
      applyFilter();
    });
  });
})();
