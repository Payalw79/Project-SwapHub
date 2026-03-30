document.addEventListener("DOMContentLoaded", () => {
  seedDemoData();
  highlightNav("index.html");

  const grid = document.getElementById("items-grid");
  const countChip = document.getElementById("items-count");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("search-input");

  let currentFilter = "All";
  let currentSearch = "";

  function getCategoryEmoji(cat) {
    const map = {
      Electronics: "📱",
      Fashion: "👟",
      Books: "📚",
      Furniture: "🪑",
      Sports: "⚽",
      Gaming: "🎮",
      Toys: "🧸",
      Other: "📦",
    };
    return map[cat] || "📦";
  }

  function renderItems() {
    let items = getItems();

    if (currentFilter !== "All") {
      items = items.filter((i) => i.category === currentFilter);
    }

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.exchangeFor.toLowerCase().includes(q)
      );
    }

    countChip.textContent = items.length;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try a different filter or be the first to post!</p>
          <a href="post-item.html" class="btn btn-primary" style="display:inline-flex;width:auto;">
            + Post Your First Item
          </a>
        </div>`;
      return;
    }

    grid.innerHTML = items
      .map(
        (item, i) => `
      <div class="item-card" style="animation-delay:${i * 0.05}s" data-id="${item.id}">
        ${
          item.image
            ? `<img class="card-image" src="${item.image}" alt="${item.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="card-image-placeholder" style="display:none">${getCategoryEmoji(item.category)}</div>`
            : `<div class="card-image-placeholder">${getCategoryEmoji(item.category)}</div>`
        }
        <div class="card-body">
          <div class="card-meta">
            <span class="badge badge-cat">${item.category}</span>
            <span class="badge badge-cond ${item.condition === "Used" ? "used" : ""}">${item.condition}</span>
          </div>
          <div class="card-title">${item.title}</div>
          <div class="card-exchange">${item.exchangeFor}</div>
          <button class="btn btn-primary view-btn" data-id="${item.id}">View Details</button>
        </div>
      </div>`
      )
      .join("");

    grid.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        setSelectedItem(id);
        window.location.href = "item-details.html";
      });
    });

    grid.querySelectorAll(".item-card").forEach((card) => {
      card.addEventListener("click", () => {
        setSelectedItem(card.dataset.id);
        window.location.href = "item-details.html";
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.cat;
      renderItems();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderItems();
  });

  function updateStats() {
    const items = getItems();
    const reqs = getRequests();
    document.getElementById("stat-items").textContent = items.length;
    document.getElementById("stat-requests").textContent = reqs.length;
    const cats = new Set(items.map((i) => i.category)).size;
    document.getElementById("stat-cats").textContent = cats;
  }

  updateStats();
  renderItems();
});

function highlightNav(page) {
  document.querySelectorAll("nav a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}