document.addEventListener("DOMContentLoaded", () => {
  highlightNav("my-requests.html");
  renderRequests();
  updateStats();
});

function renderRequests() {
  const list = document.getElementById("requests-list");
  const countChip = document.getElementById("requests-count");
  const filterBtns = document.querySelectorAll(".req-filter-btn");

  let currentFilter = "All";

  function getFiltered() {
    const reqs = getRequests();
    if (currentFilter === "All") return reqs;
    return reqs.filter((r) => r.status === currentFilter);
  }

  function render() {
    const reqs = getFiltered();
    countChip.textContent = reqs.length;

    if (reqs.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No swap requests yet</h3>
          <p>Browse items and send your first swap request!</p>
          <a href="index.html" class="btn btn-primary" style="display:inline-flex;width:auto;">
            Browse Items
          </a>
        </div>`;
      return;
    }

    list.innerHTML = reqs
      .map((req, i) => {
        const date = new Date(req.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });
        const statusClass = {
          Pending: "status-pending",
          Accepted: "status-accepted",
          Rejected: "status-rejected",
        }[req.status] || "status-pending";

        return `
          <div class="request-card" style="animation-delay:${i * 0.04}s" data-id="${req.id}">
            <div class="req-info">
              <div class="request-item-name">📦 ${req.itemTitle || "Unknown Item"}</div>
              <div class="request-your-item">⇄ You offered: <strong>${req.userItem}</strong></div>
              <div class="request-message">"${req.message}"</div>
              <div class="request-date">Sent on ${date}</div>
              <div class="req-actions" style="margin-top:0.75rem;display:flex;gap:8px;flex-wrap:wrap;">
                ${req.status === "Pending" ? `
                  <button class="btn btn-secondary status-btn" data-id="${req.id}" data-status="Accepted" style="font-size:0.8rem;padding:6px 12px;">✓ Mark Accepted</button>
                  <button class="btn btn-danger status-btn" data-id="${req.id}" data-status="Rejected" style="font-size:0.8rem;padding:6px 12px;">✕ Mark Rejected</button>
                ` : ""}
                <button class="btn delete-req-btn" data-id="${req.id}" style="font-size:0.8rem;padding:6px 12px;background:transparent;border:1px solid var(--border);color:var(--text-muted);">🗑 Delete</button>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
              <span class="status-badge ${statusClass}">${req.status}</span>
              <button class="btn btn-secondary" onclick="viewItem('${req.itemId}')" style="font-size:0.8rem;padding:6px 12px;white-space:nowrap;">View Item →</button>
            </div>
          </div>`;
      })
      .join("");

    list.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        updateRequestStatus(btn.dataset.id, btn.dataset.status);
        render();
        updateStats();
        showToast(`Request marked as ${btn.dataset.status}`);
      });
    });

    list.querySelectorAll(".delete-req-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("Delete this request?")) return;
        deleteRequest(btn.dataset.id);
        render();
        updateStats();
        showToast("Request deleted.");
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.status;
      render();
    });
  });

  render();
}

function updateStats() {
  const reqs = getRequests();
  const pending = reqs.filter((r) => r.status === "Pending").length;
  const accepted = reqs.filter((r) => r.status === "Accepted").length;
  const rejected = reqs.filter((r) => r.status === "Rejected").length;

  const el = (id) => document.getElementById(id);
  if (el("stat-total")) el("stat-total").textContent = reqs.length;
  if (el("stat-pending")) el("stat-pending").textContent = pending;
  if (el("stat-accepted")) el("stat-accepted").textContent = accepted;
  if (el("stat-rejected")) el("stat-rejected").textContent = rejected;
}

function viewItem(itemId) {
  setSelectedItem(itemId);
  window.location.href = "item-details.html";
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