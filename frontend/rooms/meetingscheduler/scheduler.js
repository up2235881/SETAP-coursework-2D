const entriesContainer = document.querySelector("#entries");
const suggestedTime = document.querySelector("#suggested-time");
const suggestedLocations = document.querySelector("#suggested-locations");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  entriesContainer.innerHTML = "<p style='color:red;'>Room ID missing.</p>";
  throw new Error("Missing roomId");
}

// Fetch availability entries
fetch(`/api/availability/${roomId}`, { credentials: "include" })
  .then((res) => res.json())
  .then((entries) => {
    renderEntries(entries);
    suggestMeeting(entries);
  })
  .catch((err) => {
    console.error("Error fetching entries:", err);
  });

function renderEntries(entries) {
  entriesContainer.innerHTML = "";
  if (entries.length === 0) {
    entriesContainer.innerHTML = "<p>No availabilities submitted yet.</p>";
  } else {
    entries.forEach((entry) => {
      const div = document.createElement("div");
      div.classList.add("entry-item");
      div.textContent = `🕒 ${entry.day}, ${entry.time} @ ${entry.location}`;
      entriesContainer.appendChild(div);
    });
  }
}

function suggestMeeting(entries) {
  if (!entries || entries.length === 0) return;
  // Find the most common day and time
  const countMap = {};
  entries.forEach(({ day, time }) => {
    const key = `${day} ${time}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  const [bestSlot, count] = sorted[0];
  suggestedTime.textContent = `📌 Suggested: ${bestSlot} (chosen by ${count} user${
    count > 1 ? "s" : ""
  })`;

  // Show location options
  const uniqueLocations = [...new Set(entries.map((e) => e.location))];
  suggestedLocations.textContent = `📍 Suggested Locations: ${uniqueLocations.join(
    ", "
  )}`;
}
