const entriesContainer = document.querySelector("#entries");
const suggestedTime = document.querySelector("#suggested-time");
const suggestedLocations = document.querySelector("#suggested-locations");
const editBtn = document.getElementById("editAvailabilityBtn");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  entriesContainer.innerHTML = "<p style='color:red;'>Room ID missing.</p>";
  throw new Error("Missing roomId");
}

let currentUserId = null;

// Fetch current user
fetch("/api/users/me", { credentials: "include" })
  .then((res) => res.json())
  .then((user) => {
    currentUserId = user.user_id;
    fetchAvailabilities();
  });

function fetchAvailabilities() {
  fetch(`/api/availability/${roomId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((entries) => {
      renderEntries(entries);
      suggestMeeting(entries);
    })
    .catch((err) => {
      console.error("Error fetching entries:", err);
    });
}

function renderEntries(entries) {
  entriesContainer.innerHTML = "";

  if (entries.length === 0) {
    entriesContainer.innerHTML = "<p>No availabilities submitted yet.</p>";
    return;
  }

  const userEntry = entries.find((entry) => entry.user_id === currentUserId);

  if (userEntry) {
    editBtn.style.display = "inline-flex";
    editBtn.onclick = () => {
      window.location.href = `/rooms/availability/availability.html?roomId=${roomId}&edit=true`;
    };
  }

  entries.forEach((entry) => {
    const div = document.createElement("div");
    div.classList.add("entry");
    const timeRange = `${entry.start_time} - ${entry.end_time}`;
    div.textContent = `👤 ${entry.user_username} — 🕒 ${entry.day}, ${timeRange} @ ${entry.location}`;
    entriesContainer.appendChild(div);
  });
}

function suggestMeeting(entries) {
  const countMap = {};
  const locations = new Set();

  entries.forEach(({ day, start_time, location }) => {
    const key = `${day} ${start_time}`;
    countMap[key] = (countMap[key] || 0) + 1;
    locations.add(location);
  });

  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) {
    const [bestSlot, count] = sorted[0];
    suggestedTime.textContent = `📌 Suggested: ${bestSlot} (${count} vote${
      count > 1 ? "s" : ""
    })`;
  }

  suggestedLocations.textContent = `📍 Suggested Locations: ${[
    ...locations,
  ].join(", ")}`;
}

document.getElementById("exit-btn").onclick = () => {
  window.location.href = `/rooms/enterRooms/enterRooms.html?roomId=${roomId}`;
};
