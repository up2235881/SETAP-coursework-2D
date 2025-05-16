const form = document.querySelector("#availability-form");
const nameInput = document.querySelector("#name");
const daySelect = document.querySelector("#day");
const timeSelect = document.querySelector("#time");
const locationInput = document.querySelector("#location");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  alert("Room ID is missing. Please access this page via a room link.");
  form.style.display = "none";
  throw new Error("Missing roomId");
}

// Load existing availability if any
fetch(`/api/availability/${roomId}/me`, { credentials: "include" })
  .then((res) => res.json())
  .then((data) => {
    if (data) {
      nameInput.value = data.name || "";
      daySelect.value = data.day;
      timeSelect.value = data.time;
      locationInput.value = data.location;
    }
  })
  .catch((err) => {
    console.error("Failed to load availability:", err);
  });

// Submit availability
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const day = daySelect.value;
  const time = timeSelect.value;
  const location = locationInput.value;

  fetch(`/api/availability/${roomId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ day, time, location }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("✅ Availability submitted!");
      window.location.href = `/rooms/enterRooms/enterRooms.html?roomId=${roomId}`;
    })
    .catch((err) => {
      console.error("Error submitting:", err);
      alert("❌ Submission failed.");
    });
});
