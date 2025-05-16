const entriesContainer = document.querySelector("#entries");
const suggestedTime = document.querySelector("#suggested-time");
const suggestedLocations = document.querySelector("#suggested-locations");
const editBtn = document.getElementById("editAvailabilityBtn");
const confirmBtn = document.getElementById("confirmMeetingBtn");
const confirmedBanner = document.getElementById("confirmed-meeting");

const confirmModal = document.getElementById("confirmModal");
const confirmPromptText = document.getElementById("confirmPromptText");
const confirmLocationInput = document.getElementById("confirmLocationInput");
const confirmOkBtn = document.getElementById("confirmOkBtn");
const confirmCancelBtn = document.getElementById("confirmCancelBtn");

const confirmedModal = document.getElementById("confirmedModal");
const confirmedCloseBtn = document.getElementById("confirmedCloseBtn");

const roomId = new URLSearchParams(window.location.search).get("roomId");
if (!roomId) {
  entriesContainer.innerHTML = "<p style='color:red;'>Room ID missing.</p>";
  throw new Error("Missing roomId");
}

let currentUserId = null;
let roomCreatorId = null;
let mostCommonTime = "";
let mostCommonPlace = "";

// ✅ Get current user & room details
Promise.all([
  fetch("/api/users/me", { credentials: "include" }).then((res) => res.json()),
  fetch(`/api/rooms/${roomId}`, { credentials: "include" }).then((res) =>
    res.json()
  ),
]).then(([user, room]) => {
  currentUserId = user.user_id;
  roomCreatorId = room.user_id;
  fetchAvailabilities();
});

// ✅ Load availability entries
function fetchAvailabilities() {
  fetch(`/api/availability/${roomId}`, {
    credentials: "include",
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((entries) => {
      renderEntries(entries);
      suggestMeeting(entries);
      showConfirmIfEligible(entries);
    })
    .catch((err) => {
      console.error("Error fetching entries:", err);
    });
  fetch(`/api/meeting/${roomId}/confirmed`, {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("No confirmed meeting");
      return res.json();
    })

    .catch((err) => {
      console.error("No confirmed meeting:", err);
    });
}

// ✅ Render each entry with user names
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

// ✅ Count and suggest meeting time/location
function suggestMeeting(entries) {
  const countMap = {};
  const locationMap = {};
  const locations = new Set();

  entries.forEach(({ day, start_time, location }) => {
    const key = `${day} ${start_time}`;
    countMap[key] = (countMap[key] || 0) + 1;
    locationMap[location] = (locationMap[location] || 0) + 1;
    locations.add(location);
  });

  const sortedTimes = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  const sortedPlaces = Object.entries(locationMap).sort((a, b) => b[1] - a[1]);

  if (sortedTimes.length > 0) {
    mostCommonTime = sortedTimes[0][0];
    suggestedTime.textContent = `📌 Suggested: ${mostCommonTime} (${sortedTimes[0][1]} votes)`;
  }

  if (sortedPlaces.length > 0) {
    mostCommonPlace = sortedPlaces[0][0];
    suggestedLocations.textContent = `📍 Suggested Locations: ${[
      ...locations,
    ].join(", ")}`;
  }
}

// ✅ Show confirm button for creator if 2+ entries
function showConfirmIfEligible(entries) {
  if (entries.length >= 2 && currentUserId === roomCreatorId) {
    confirmBtn.style.display = "inline-flex";
    confirmBtn.onclick = () => {
      confirmPromptText.textContent = `Have meeting at ${mostCommonTime}?`;
      confirmLocationInput.placeholder = mostCommonPlace;
      confirmLocationInput.value = "";
      confirmModal.style.display = "flex";
    };
  }
}

// ✅ Handle confirm meeting modal logic
confirmCancelBtn.onclick = () => {
  confirmModal.style.display = "none";
};

confirmOkBtn.onclick = () => {
  const location = confirmLocationInput.value || mostCommonPlace;
  const [day, start_time] = mostCommonTime.split(" ");

  fetch("/meeting/confirm", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_id: roomId,
      day: day,
      start_time: start_time,
      location: location,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to confirm meeting.");
      return res.json();
    })
    .then((confirmedMeeting) => {
      confirmModal.style.display = "none";
      confirmedModal.style.display = "flex";

      confirmedBanner.style.display = "flex";
      document.getElementById(
        "confirmedText"
      ).textContent = `✅ Meeting at ${confirmedMeeting.day} ${confirmedMeeting.start_time} @ ${confirmedMeeting.location}`;
    })
    .catch((err) => {
      console.error("Confirm failed:", err);
      alert("Something went wrong confirming the meeting.");
    });
};

confirmedCloseBtn.onclick = () => {
  confirmedModal.style.display = "none";
};
document.getElementById("exit-btn").onclick = () => {
  window.location.href = `/rooms/enterRooms/enterRooms.html?roomId=${roomId}`;
};
