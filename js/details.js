document.addEventListener("DOMContentLoaded", () => {
  highlightNav("item-details.html");

  const id = getSelectedItem();
  if (!id) {
    window.location.href = "index.html";
    return;
  }

  const item = getItemById(id);
  if (!item) {
    window.location.href = "index.html";
    return;
  }

  renderDetails(item);
  setupSwapModal(item);
  setupDeleteBtn(item);
});

function getCategoryEmoji(cat) {
  const map = { Electronics:"📱", Fashion:"👟", Books:"📚", Furniture:"🪑", Sports:"⚽", Gaming:"🎮", Toys:"🧸", Other:"📦" };
  return map[cat] || "📦";
}

function renderDetails(item) {
  const imgWrap = document.getElementById("item-image-wrap");
  if (item.image) {
    imgWrap.innerHTML = `<img src="${item.image}" alt="${item.title}" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'details-image-placeholder\\'>${getCategoryEmoji(item.category)}</div>';" />`;
  } else {
    imgWrap.innerHTML = `<div class="details-image-placeholder">${getCategoryEmoji(item.category)}</div>`;
  }

  document.getElementById("item-category-badge").textContent = item.category;
  const condBadge = document.getElementById("item-condition-badge");
  condBadge.textContent = item.condition;
  if (item.condition === "Used") condBadge.classList.add("used");

  document.getElementById("item-title").textContent = item.title;
  document.getElementById("item-description").textContent = item.description;
  document.getElementById("item-exchange").textContent = item.exchangeFor;

  const date = new Date(item.createdAt);
  document.getElementById("item-date").textContent = date.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function setupSwapModal(item) {
  const overlay = document.getElementById("swap-overlay");
  const openBtn = document.getElementById("request-swap-btn");
  const closeBtn = document.getElementById("modal-close");
  const form = document.getElementById("swap-form");

  document.getElementById("modal-item-name").textContent = item.title;

  openBtn?.addEventListener("click", () => {
    overlay.classList.add("open");
    document.getElementById("your-item").focus();
  });

  closeBtn?.addEventListener("click", () => overlay.classList.remove("open"));
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const userItem = document.getElementById("your-item").value.trim();
    const message = document.getElementById("swap-message").value.trim();

    if (!userItem) return showToast("Please enter your item name.", true);
    if (!message) return showToast("Please enter a message.", true);

    const existing = getRequests().find(
      (r) => r.itemId === item.id && r.userItem.toLowerCase() === userItem.toLowerCase()
    );
    if (existing) return showToast("You already requested a swap for this item.", true);

    addRequest({
      itemId: item.id,
      itemTitle: item.title,
      itemCategory: item.category,
      userItem,
      message,
    });

    overlay.classList.remove("open");
    form.reset();
    showToast("✓ Swap request sent!");

    setTimeout(() => {
      window.location.href = "my-requests.html";
    }, 1200);
  });
}

function setupDeleteBtn(item) {
  document.getElementById("delete-item-btn")?.addEventListener("click", () => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    const reqs = getRequests().filter((r) => r.itemId !== item.id);
    saveRequests(reqs);
    deleteItem(item.id);
    window.location.href = "index.html";
  });
}

function highlightNav(page) {
  document.querySelectorAll("nav a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}

function showToast(msg, isError = false) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = "toast" + (isError ? " error" : "");
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => toast.classList.remove("show"), 3000);
}