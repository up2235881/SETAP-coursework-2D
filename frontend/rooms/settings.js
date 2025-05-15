const roomId = new URLSearchParams(window.location.search).get("roomId");

// Apply saved theme on load
if (localStorage.getItem("roomTheme") === "dark") {
  document.body.classList.add("dark-mode");
}

// Theme toggle button
const themeBtn = document.querySelector("#theme-toggle");
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "roomTheme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

// Set and copy room link
const linkInput = document.querySelector("#room-link");
const copyBtn = document.querySelector("#copy-link-btn");

if (roomId && linkInput) {
  const link = `${window.location.origin}/rooms/joinRoom.html?code=${roomId}`;
  linkInput.value = link;
}

copyBtn?.addEventListener("click", () => {
  navigator.clipboard.writeText(linkInput.value).then(() => {
    alert("✅ Room link copied to clipboard!");
  });
});
