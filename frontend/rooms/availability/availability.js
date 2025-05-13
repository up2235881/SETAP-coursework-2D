const form = document.querySelector("#availability-form");
const nameInput = document.querySelector("#name");
const daySelect = document.querySelector("#day");
const timeSelect = document.querySelector("#time");
const locationInput = document.querySelector("#location");

// 🔍 Get roomId from URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  alert("Room ID is missing. Please access this page via a room link.");
  form.style.display = "none";
  throw new Error("Missing roomId");
}

// 🧠 Load existing availability for user in this room
fetch(`/api/availability/${roomId}/me`, { credentials: "include" })
  .then((res) => res.json())
  .then((data) => {
    if (data) {
      // Optional: name might be tracked elsewhere; here we focus on availability
      daySelect.value = data.day;
      timeSelect.value = data.time;
      locationInput.value = data.location;
    }
  })
  .catch((err) => {
    console.error("Failed to load availability:", err);
  });

// 📨 Submit availability
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const day = daySelect.value;
  const time = timeSelect.value;
  const location = locationInput.value.trim();

  if (!day || !time || !location) {
    return alert("Please fill out all fields");
  }

  fetch("/api/availability/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, day, time, location }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Availability submitted successfully!");
    })
    .catch((err) => {
      console.error("Submission error:", err);
      alert("Failed to submit availability.");
    });
});
