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

// ⏎ Load existing availability
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

// 📨 Submit availability
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const day = daySelect.value;
  const time = timeSelect.value;
  const location = locationInput.value.trim();

  if (!name || !day || !time || !location) {
    return alert("Please fill out all fields");
  }

  fetch("/api/availability/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, name, day, time, location }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Availability submitted successfully!");
      showSchedulerButton();
    })
    .catch((err) => {
      console.error("Submission error:", err);
      alert("Failed to submit availability.");
    });
});

// 👀 Show button to view the scheduler after submission
function showSchedulerButton() {
  const btn = document.createElement("button");
  btn.textContent = "View in Meeting Scheduler";
  btn.classList.add("submit-btn");
  btn.style.marginTop = "20px";
  btn.onclick = () => {
    window.location.href = `/rooms/meetingscheduler/scheduler.html?roomId=${roomId}`;
  };
  form.appendChild(btn);
}
