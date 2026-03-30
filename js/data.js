const DB = {
  ITEMS: "swaphub_items",
  REQUESTS: "swaphub_requests",
  SELECTED: "swaphub_selected",
};

function getItems() {
  return JSON.parse(localStorage.getItem(DB.ITEMS)) || [];
}

function saveItems(items) {
  localStorage.setItem(DB.ITEMS, JSON.stringify(items));
}

function addItem(item) {
  const items = getItems();
  item.id = Date.now().toString();
  item.createdAt = new Date().toISOString();
  items.unshift(item);
  saveItems(items);
  return item;
}

function getItemById(id) {
  return getItems().find((i) => i.id === id) || null;
}

function deleteItem(id) {
  const items = getItems().filter((i) => i.id !== id);
  saveItems(items);
}

function getRequests() {
  return JSON.parse(localStorage.getItem(DB.REQUESTS)) || [];
}

function saveRequests(reqs) {
  localStorage.setItem(DB.REQUESTS, JSON.stringify(reqs));
}

function addRequest(req) {
  const reqs = getRequests();
  req.id = Date.now().toString();
  req.createdAt = new Date().toISOString();
  req.status = "Pending";
  reqs.unshift(req);
  saveRequests(reqs);
  return req;
}

function updateRequestStatus(id, status) {
  const reqs = getRequests().map((r) => (r.id === id ? { ...r, status } : r));
  saveRequests(reqs);
}

function deleteRequest(id) {
  const reqs = getRequests().filter((r) => r.id !== id);
  saveRequests(reqs);
}

function setSelectedItem(id) {
  localStorage.setItem(DB.SELECTED, id);
}

function getSelectedItem() {
  return localStorage.getItem(DB.SELECTED);
}

function seedDemoData() {
  if (getItems().length > 0) return;
  const demo = [
    {
      id: "demo1",
      title: "Sony WH-1000XM4 Headphones",
      description: "Excellent noise-cancelling headphones. Used for 6 months, perfect condition. Comes with original case and cables.",
      category: "Electronics",
      condition: "Used",
      exchangeFor: "Mechanical Keyboard or Gaming Mouse",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "demo2",
      title: "Canon EOS M50 Camera",
      description: "Mirrorless camera, great for photography and vlogging. Includes 15-45mm kit lens. Minor scratch on body, sensor is perfect.",
      category: "Electronics",
      condition: "Used",
      exchangeFor: "Drone or GoPro or Cash equivalent",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "demo3",
      title: "Nike Air Max 270 (Size 10)",
      description: "Worn twice. Too big for me. Great cushioning, iconic look. Original box included.",
      category: "Fashion",
      condition: "New",
      exchangeFor: "Adidas Ultraboost or Asics Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "demo4",
      title: "The Psychology of Money",
      description: "Hardcover, like new. Morgan Housel's masterpiece on wealth and mindset. Read once, kept it dust-jacket clean.",
      category: "Books",
      condition: "New",
      exchangeFor: "Atomic Habits or any non-fiction bestseller",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "demo5",
      title: "Ikea Standing Desk",
      description: "Manual height-adjustable desk, 160cm × 80cm. Scratches on top surface. Very sturdy, great for WFH setups.",
      category: "Furniture",
      condition: "Used",
      exchangeFor: "Office Chair or Monitor Stand",
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
   {
      id: "demo6",
      title: "Yoga Mat (Gaiam Premium)",
      description: "6mm thick, non-slip, extra wide. Used 3 times. Comes with carrying strap.",
      category: "Sports",
      condition: "New",
      exchangeFor: "Resistance Bands set or Jump Rope",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "demo7",
      title: "Mechanical Keyboard (Keychron K2)",
      description: "Compact TKL layout, brown switches. Great for typing and coding. Minor key cap wear, fully functional.",
      category: "Electronics",
      condition: "Used",
      exchangeFor: "Wireless Mouse or USB Hub",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: "demo8",
      title: "Levi's 511 Slim Jeans (32x32)",
      description: "Classic slim fit, dark indigo wash. Worn a handful of times. No fading, no damage. Great condition.",
      category: "Fashion",
      condition: "Used",
      exchangeFor: "Chinos or Cargo Pants same size",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
  ];
  saveItems(demo);
}