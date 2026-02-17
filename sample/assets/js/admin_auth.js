
/* ================= MULTIPLE ADMINS ================= */

const ADMINS = [
  {
    username: "admin",
    password: btoa("12345")  // hashed
  },
  {
    username: "harshit",
    password: btoa("pushpak@2024")
  }
];

/* ================= LOGIN ================= */

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = btoa(document.getElementById("password").value);
  const error = document.getElementById("errorMsg");

  const validUser = ADMINS.find(admin =>
    admin.username === user && admin.password === pass
  );

  if(validUser){
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminUser", user);
    window.location.href = "/dashboard.html";
  }else{
    error.textContent = "Invalid username or password";
  }
});

/* ================= FORGOT PASSWORD ================= */

document.getElementById("forgotBtn").addEventListener("click", function(){
  alert("Contact Super Admin to reset password.");
});

/* ================= DARK MODE ================= */

function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark"));
}

if(localStorage.getItem("theme")==="true"){
  document.body.classList.add("dark");
}
