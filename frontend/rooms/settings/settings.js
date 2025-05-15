// Apply saved theme on load
if (localStorage.getItem("roomTheme") === "dark") {
  document.body.classList.add("dark-theme");
} else {
  document.body.classList.remove("dark-theme");
}

// Theme toggle button
const themeBtn = document.querySelector("#theme-toggle");
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "roomTheme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});

// Logout modal logic
const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

logoutBtn.onclick = () => (logoutModal.style.display = "flex");
cancelLogout.onclick = () => (logoutModal.style.display = "none");
confirmLogout.onclick = () => {
  // Add your logout logic here (redirect, clear session, etc.)
  alert("Logged out! (Replace with your real logic)");
  logoutModal.style.display = "none";
};
