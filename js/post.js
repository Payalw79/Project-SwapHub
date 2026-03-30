document.addEventListener("DOMContentLoaded", () => {
  highlightNav("post-item.html");

  const form = document.getElementById("post-form");
  const imageInput = document.getElementById("item-image");
  const preview = document.getElementById("image-preview");
  const previewImg = document.getElementById("preview-img");
  let base64Image = "";

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file.", true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB.", true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      base64Image = ev.target.result;
      previewImg.src = base64Image;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("item-title").value.trim();
    const description = document.getElementById("item-desc").value.trim();
    const category = document.getElementById("item-category").value;
    const condition = document.getElementById("item-condition").value;
    const exchangeFor = document.getElementById("item-exchange").value.trim();

    if (!title) return showToast("Item title is required.", true);
    if (title.length < 3) return showToast("Title must be at least 3 characters.", true);
    if (!description) return showToast("Description is required.", true);
    if (!category) return showToast("Please select a category.", true);
    if (!condition) return showToast("Please select a condition.", true);
    if (!exchangeFor) return showToast("Please specify what you want in exchange.", true);

    const newItem = { title, description, category, condition, exchangeFor, image: base64Image };
    addItem(newItem);

    showToast("✓ Item posted successfully!");
    form.reset();
    base64Image = "";
    preview.style.display = "none";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  });

  document.getElementById("cancel-btn")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

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