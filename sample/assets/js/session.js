/* ================= SESSION PROTECTION ================= */

if(localStorage.getItem("adminLoggedIn") !== "true"){
  window.location.href = "/admin/admin_login.html";
}

/* Auto logout after 5 minutes */
let timeout;

function resetTimer(){
  clearTimeout(timeout);
  timeout = setTimeout(logout, 5 * 60 * 1000);
}

function logout(){
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminUser");
  alert("Session expired. Please login again.");
  window.location.href = "/admin/admin_login.html";
}

document.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
