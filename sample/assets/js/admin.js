// ===== THEME LOAD =====
document.addEventListener("DOMContentLoaded", function () {

    // Load Theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    // Update Stats
    updateStats();
});


// ===== TOGGLE THEME =====
function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}


// ===== UPDATE DASHBOARD STATS =====
function updateStats() {

    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    document.getElementById("plantCount").innerText = plants.length;
    document.getElementById("orderCount").innerText = orders.length;
}


//+==== ADD PLANT (ADMIN) =====// ===== IMAGE PREVIEW =====
document.addEventListener("DOMContentLoaded", function () {

    const imageInput = document.getElementById("imageUpload");
    const preview = document.getElementById("preview");

    if (imageInput) {
        imageInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    preview.src = reader.result;
                    preview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const form = document.getElementById("plantForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("plantName").value;
            const category = document.getElementById("category").value;
            const price = document.getElementById("price").value;
            const image = preview.src;

            let plants = JSON.parse(localStorage.getItem("plants")) || [];

            const newPlant = {
                id: Date.now(),
                name: name,
                category: category,
                price: price,
                image: image
            };

            plants.push(newPlant);
            localStorage.setItem("plants", JSON.stringify(plants));

            alert("Plant Added Successfully 🌿");

            form.reset();
            preview.style.display = "none";
        });
    }
});

//===== DELETE PLANT (ADMIN) =====
// ===== LOAD PLANTS IN MANAGE PAGE =====
document.addEventListener("DOMContentLoaded", function () {

    const plantList = document.getElementById("plantList");
    const filter = document.getElementById("filterCategory");

    if (plantList) {
        displayPlants();

        filter.addEventListener("change", displayPlants);
    }

    function displayPlants() {

        let plants = JSON.parse(localStorage.getItem("plants")) || [];
        let selected = filter.value;

        plantList.innerHTML = "";

        plants
        .filter(p => selected === "All" || p.category === selected)
        .forEach(plant => {

            plantList.innerHTML += `
                <div class="plant-card">
                    <img src="${plant.image}">
                    <div class="info">
                        <h4>${plant.name}</h4>
                        <p>Category: ${plant.category}</p>
                        <p>Price: ₹${plant.price}</p>
                        <button class="edit-btn" onclick="editPlant(${plant.id})">Edit</button>
                        <button class="delete-btn" onclick="deletePlant(${plant.id})">Delete</button>
                    </div>
                </div>
            `;
        });
    }
});

// ===== DELETE =====
function deletePlant(id) {

    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants = plants.filter(p => p.id !== id);

    localStorage.setItem("plants", JSON.stringify(plants));
    location.reload();
}


// ===== EDIT =====
function editPlant(id) {

    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    let plant = plants.find(p => p.id === id);

    let newName = prompt("Edit Plant Name:", plant.name);
    let newPrice = prompt("Edit Price:", plant.price);

    if (newName && newPrice) {
        plant.name = newName;
        plant.price = newPrice;

        localStorage.setItem("plants", JSON.stringify(plants));
        location.reload();
    }
}
//plant deatils
/* ================= DARK MODE AUTO SAVE ================= */
function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark"));
}

window.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem("theme")==="true"){
    document.body.classList.add("dark");
  }
  applyLanguage();
});

/* ================= LANGUAGE SYSTEM ================= */
function toggleLanguage(){
  const current = localStorage.getItem("lang") || "en";
  const newLang = current === "en" ? "hi" : "en";
  localStorage.setItem("lang", newLang);
  applyLanguage();
}

function applyLanguage(){
  const lang = localStorage.getItem("lang") || "en";
  document.querySelectorAll("[data-en]").forEach(el=>{
    el.textContent = el.getAttribute("data-"+lang);
  });
}

/* ================= FAVORITE HEART ================= */
function toggleFavorite(id){
  let fav = JSON.parse(localStorage.getItem("fav"))||[];
  const index = fav.indexOf(id);

  if(index>-1){
    fav.splice(index,1);
  }else{
    fav.push(id);
  }

  localStorage.setItem("fav",JSON.stringify(fav));

  event.target.classList.toggle("active");
}

/* ================= QUANTITY SELECTOR ================= */
let quantity = 1;

function increaseQty(){
  quantity++;
  document.getElementById("qty").innerText = quantity;
}

function decreaseQty(){
  if(quantity>1){
    quantity--;
    document.getElementById("qty").innerText = quantity;
  }
}

/* ================= ADD TO CART WITH QTY ================= */
function addToCart(id){
  let cart = JSON.parse(localStorage.getItem("cart"))||[];
  cart.push({id, qty:quantity});
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("Added to cart");
}
function addPlant() {

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const category = document.getElementById("pcategory").value;
  const size = document.getElementById("psize").value;
  const sunlight = document.getElementById("psun").value;
  const tag = document.getElementById("ptag").value;
  const file = document.getElementById("pimg").files[0];

  const reader = new FileReader();

  reader.onload = function () {

    let plants = JSON.parse(localStorage.getItem("plants")) || [];

    const newPlant = {
      id: Date.now(),
      name,
      price: parseInt(price),
      category,
      size,
      sunlight,
      tag,   // ⭐ special tag
      image: reader.result
    };

    plants.push(newPlant);
    localStorage.setItem("plants", JSON.stringify(plants));

    alert("Plant Added Successfully!");
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
