/* ==================================================
   main.js — consolidated frontend logic
   - sample data initializer
   - render plants grid + details
   - cart (by plant id + qty)
   - favorites (by plant id)
   - theme & i18n
   ================================================== */

// -------------------- Initialization --------------------
document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  applySavedLang();
  ensureSampleData();
  renderPlantsGrid();
  loadCart();
  loadFav();
  updateNavCounts();
  showLoginState();

  const filter = document.getElementById('filterCategory');
  if (filter) filter.addEventListener('change', renderPlantsGrid);
});

// -------------------- Sample data --------------------
function ensureSampleData() {
  if (localStorage.getItem('plants')) return;
  const sample = [
    { id: 1, name: 'Snake Plant', category: 'Indoor', price: 599, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format&fit=crop' },
    { id: 2, name: 'Monstera Deliciosa', category: 'Indoor', price: 1299, image: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&q=80&auto=format&fit=crop' },
    { id: 3, name: 'Aloe Vera', category: 'Indoor', price: 349, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80&auto=format&fit=crop' },
    { id: 4, name: 'Olive Tree', category: 'Outdoor', price: 2499, image: 'https://images.unsplash.com/photo-1524594154900-1a4d4a3c2d9b?w=800&q=80&auto=format&fit=crop' },
    { id: 5, name: 'Lavender', category: 'Outdoor', price: 449, image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80&auto=format&fit=crop' },
    { id: 6, name: 'ZZ Plant', category: 'Indoor', price: 799, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80&auto=format&fit=crop' }
  ];
  localStorage.setItem('plants', JSON.stringify(sample));
}

// -------------------- Plants rendering --------------------
function renderPlantsGrid() {
  const container = document.getElementById('plantGrid');
  if (!container) return;

  const plants = JSON.parse(localStorage.getItem('plants')) || [];
  const selected = (document.getElementById('filterCategory') || {}).value || 'All';
  const q = (document.getElementById('search') || {}).value || '';

  container.innerHTML = '';

  plants
    .filter(p => (selected === 'All' || p.category === selected) && p.name.toLowerCase().includes(q.toLowerCase()))
    .forEach(plant => {
      container.innerHTML += `
        <div class="plant-card plantCard card">
          <img src="${plant.image}" alt="${plant.name}">
          <div class="info">
            <h4>${plant.name}</h4>
            <p>Category: ${plant.category}</p>
            <p>Price: ₹${plant.price}</p>
            <div style="margin-top:8px;">
              <button onclick="viewPlant(${plant.id})">View</button>
              <button onclick="addToCart(${plant.id})">Add to cart</button>
              <button onclick="toggleFavorite(${plant.id})">❤</button>
            </div>
          </div>
        </div>
      `;
    });
}

function viewPlant(id){
  location.href = `plant_details.html?id=${id}`;
}

function getPlantById(id){
  const plants = JSON.parse(localStorage.getItem('plants')) || [];
  return plants.find(p => p.id === Number(id));
}

// -------------------- Cart (stores {id, qty}) --------------------
function addToCart(plantId){
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === plantId);
  if (existing) existing.qty++;
  else cart.push({ id: plantId, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateNavCounts();
  alert('Added to cart');
}

function loadCart(){
  const box = document.getElementById('cartItems');
  if (!box) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const plants = JSON.parse(localStorage.getItem('plants')) || [];

  if (cart.length === 0) {
    box.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let html = '<table><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>';
  let grand = 0;
  cart.forEach(item => {
    const p = plants.find(x => x.id === item.id) || {};
    const total = (p.price || 0) * item.qty;
    grand += total;
    html += `<tr>
      <td style="display:flex;gap:10px;align-items:center"><img src="${p.image || ''}" style="width:60px;height:40px;object-fit:cover;border-radius:6px"> <div>${p.name || ''}</div></td>
      <td>₹${p.price || 0}</td>
      <td><input type="number" value="${item.qty}" min="1" style="width:60px" onchange="setCartQty(${item.id}, this.value)"></td>
      <td>₹${total}</td>
      <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
    </tr>`;
  });
  html += `<tr><td colspan="3" style="text-align:right"><strong>Grand Total:</strong></td><td><strong>₹${grand}</strong></td><td></td></tr>`;
  html += '</table>';
  box.innerHTML = html;
}

function setCartQty(id, qty){
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(i=>i.id===id);
  if (!item) return;
  item.qty = Math.max(1, Number(qty));
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateNavCounts();
}

function removeFromCart(id){
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i=>i.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateNavCounts();
}

// -------------------- Favorites --------------------
function toggleFavorite(id){
  let fav = JSON.parse(localStorage.getItem('fav')) || [];
  if (fav.includes(id)) fav = fav.filter(x=>x!==id);
  else fav.push(id);
  localStorage.setItem('fav', JSON.stringify(fav));
  loadFav();
  updateNavCounts();
}

function loadFav(){
  const box = document.getElementById('favItems');
  if (!box) return;
  const fav = JSON.parse(localStorage.getItem('fav')) || [];
  const plants = JSON.parse(localStorage.getItem('plants')) || [];
  if (fav.length === 0) { box.innerHTML = '<p>No favorites yet.</p>'; return; }
  box.innerHTML = '';
  fav.forEach(id => {
    const p = plants.find(x => x.id === id);
    if (!p) return;
    box.innerHTML += `<div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
      <img src="${p.image}" style="width:80px;height:60px;object-fit:cover;border-radius:6px">
      <div>
        <strong>${p.name}</strong>
        <div>₹${p.price}</div>
        <div style="margin-top:6px"><button onclick="addToCart(${p.id})">Add to cart</button></div>
      </div>
    </div>`;
  });
}

// -------------------- Search (works with dynamically rendered cards) --------------------
function searchPlant(){
  const input = (document.getElementById('search') || {}).value || '';
  document.querySelectorAll('.plantCard').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(input.toLowerCase()) ? '' : 'none';
  });
}

// -------------------- Theme & i18n --------------------
function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
function applySavedTheme(){
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
}

function setLang(lang){
  document.querySelectorAll('[data-en]').forEach(el=> el.innerText = el.getAttribute('data-'+lang));
  localStorage.setItem('lang', lang);
}
function applySavedLang(){
  if (localStorage.getItem('lang')) setLang(localStorage.getItem('lang'));
}

// -------------------- Admin helpers (used by admin pages) --------------------
function updateStats(){
  const plants = JSON.parse(localStorage.getItem('plants')) || [];
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const elPlant = document.getElementById('plantCount');
  const elOrder = document.getElementById('orderCount');
  if (elPlant) elPlant.innerText = plants.length;
  if (elOrder) elOrder.innerText = orders.length;
}

// expose a few helpers globally (already done via function declarations)

function updateNavCounts() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const fav = JSON.parse(localStorage.getItem('fav')) || [];
  const cartCount = cart.reduce((s,i)=>s + (i.qty||0), 0);
  const elCart = document.getElementById('cartCount');
  const elFav = document.getElementById('favCount');
  if (elCart) elCart.innerText = cartCount;
  if (elFav) elFav.innerText = fav.length;
}

function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('currentUser')||'null'); } catch(e){ return null; }
}

function showLoginState(){
  const user = getCurrentUser();
  const navLogin = document.getElementById('navLogin');
  const navLogout = document.getElementById('navLogout');
  const navUser = document.getElementById('navUser');
  if(user){
    if(navLogin) navLogin.style.display = 'none';
    if(navLogout) navLogout.style.display = 'inline-block';
    if(navUser) navUser.innerText = user.name || user.email || 'User';
  } else {
    if(navLogin) navLogin.style.display = 'inline-block';
    if(navLogout) navLogout.style.display = 'none';
    if(navUser) navUser.innerText = '';
  }
  updateNavCounts();
}

function handleLogin(e){
  if(e && e.preventDefault) e.preventDefault();
  const email = (document.getElementById('loginEmail')||{}).value || '';
  const password = (document.getElementById('loginPassword')||{}).value || '';
  if(!email || !password){ alert('Please enter email and password'); return; }
  const user = { email, name: email.split('@')[0] };
  localStorage.setItem('currentUser', JSON.stringify(user));
  showLoginState();
  alert('Logged in as ' + user.name);
  location.href = 'index.html';
}

function logout(){
  localStorage.removeItem('currentUser');
  showLoginState();
  alert('Logged out');
  location.href = 'index.html';
}

function renderCheckout(){
  const container = document.getElementById('checkoutContainer');
  if(!container) return;
  const cart = JSON.parse(localStorage.getItem('cart'))||[];
  const plants = JSON.parse(localStorage.getItem('plants'))||[];
  const user = getCurrentUser();
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; return; }

  let total = 0;
  let itemsHtml = '<div class="order-items">';
  cart.forEach(i=>{
    const p = plants.find(x=>x.id===i.id) || {};
    const subtotal = (p.price||0) * i.qty;
    total += subtotal;
    itemsHtml += `<div class="order-item"><img src="${p.image}" style="width:64px;height:48px;object-fit:cover;border-radius:6px"><div><strong>${p.name}</strong><div>₹${p.price} × ${i.qty} = ₹${subtotal}</div></div></div>`;
  });
  itemsHtml += '</div>';

  container.innerHTML = `
    <div class="card checkout-form">
      <h3>Shipping & Payment</h3>
      ${itemsHtml}
      <div class="order-total"><strong>Grand Total: ₹${total}</strong></div>
      <form id="checkoutForm" onsubmit="placeOrder(event)">
        <label>Full name</label>
        <input id="shipName" required value="${user?user.name:''}">
        <label>Email</label>
        <input id="shipEmail" type="email" required value="${user?user.email:''}">
        <label>Address</label>
        <input id="shipAddress" required placeholder="Street, City, Pincode">
        <label>Phone</label>
        <input id="shipPhone" required>
        <label>Payment</label>
        <select id="shipPayment"><option>COD</option><option>Card</option></select>
        <button type="submit">Place Order</button>
      </form>
    </div>
  `;
}

function placeOrder(e){
  if(e && e.preventDefault) e.preventDefault();
  const cart = JSON.parse(localStorage.getItem('cart'))||[];
  if(cart.length===0){ alert('Cart empty'); return; }
  const name = (document.getElementById('shipName')||{}).value || '';
  const email = (document.getElementById('shipEmail')||{}).value || '';
  const address = (document.getElementById('shipAddress')||{}).value || '';
  const phone = (document.getElementById('shipPhone')||{}).value || '';
  if(!name || !email || !address || !phone){ alert('Please fill shipping details'); return; }

  const plants = JSON.parse(localStorage.getItem('plants'))||[];
  let total = 0;
  cart.forEach(i=> { const p = plants.find(x=>x.id===i.id) || {}; total += (p.price||0) * i.qty; });

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = { id: Date.now(), date: new Date().toISOString(), items: cart, total, customer: { name, email, address, phone }, status: 'placed' };
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('cart', JSON.stringify([]));
  updateNavCounts();
  alert('Order placed — thank you! Order id: ' + order.id);
  location.href = 'index.html';
}

function renderAnalysis(){
  const container = document.getElementById('analysisContainer');
  if(!container) return;
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const plants = JSON.parse(localStorage.getItem('plants')) || [];
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s,o)=>s+ (o.total||0), 0);
  const counts = {};
  orders.forEach(o => o.items.forEach(i => counts[i.id] = (counts[i.id]||0) + i.qty));
  const best = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).slice(0,5).map(id=> { const p = plants.find(x=>x.id===Number(id)) || { name: 'Unknown' }; return { name: p.name, qty: counts[id] }; });

  container.innerHTML = `
    <div class="card">
      <h3>Orders: ${totalOrders}</h3>
      <h3>Revenue: ₹${totalRevenue}</h3>
      <h4>Top products</h4>
      <ul>${best.map(b=>`<li>${b.name} — ${b.qty}</li>`).join('')}</ul>
      <button onclick="downloadReport()">Export JSON</button>
    </div>
  `;
}

function downloadReport(){
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const blob = new Blob([JSON.stringify(orders,null,2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'orders.json'; a.click(); URL.revokeObjectURL(url);
}
function getPlantById(id){
  let plants = JSON.parse(localStorage.getItem("plants")) || [];
  return plants.find(p => p.id === id);
}
document.addEventListener("DOMContentLoaded", () => {

  renderPlants();

  document.getElementById("priceFilter").addEventListener("input", renderPlants);
  document.getElementById("sizeFilter").addEventListener("change", renderPlants);
  document.getElementById("sunFilter").addEventListener("change", renderPlants);

  document.querySelectorAll("#categoryList li").forEach(li => {
    li.addEventListener("click", function () {
      document.querySelectorAll("#categoryList li").forEach(l => l.classList.remove("active"));
      this.classList.add("active");
      renderPlants();
    });
  });
});

function renderPlants() {

  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  const grid = document.getElementById("plantGrid");

  const selectedCategory = document.querySelector("#categoryList li.active").dataset.category;
  const maxPrice = document.getElementById("priceFilter").value;
  const size = document.getElementById("sizeFilter").value;
  const sun = document.getElementById("sunFilter").value;

  grid.innerHTML = "";

  plants
    .filter(p =>
      (selectedCategory === "all" || p.category === selectedCategory) &&
      p.price <= maxPrice &&
      (size === "all" || p.size === size) &&
      (sun === "all" || p.sunlight === sun)
    )
    .forEach(p => {

      grid.innerHTML += `
        <div class="plant-card">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <button onclick="viewPlant(${p.id})">View</button>
        </div>
      `;
    });
}
