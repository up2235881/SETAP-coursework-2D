const entriesContainer = document.querySelector("#entries");
const suggestedTime = document.querySelector("#suggested-time");
const suggestedLocations = document.querySelector("#suggested-locations");

// Simulated entry data — replace with real backend fetch if needed
const entries = [
  { name: "Alice", day: "Monday", time: "09:00 AM", location: "Library" },
  { name: "Bob", day: "Tuesday", time: "09:00 AM", location: "Zoom" },
  { name: "Charlie", day: "Monday", time: "09:00 AM", location: "Café" },
];

function displayEntries() {
  entriesContainer.innerHTML = "";

  entries.forEach((entry, index) => {
    const div = document.createElement("div");
    div.classList.add("entry");
    div.innerHTML = `
      <p><strong>${index + 1}. ${entry.name}</strong> - ${entry.day}, ${
      entry.time
    } @ ${entry.location}</p>
    `;
    entriesContainer.appendChild(div);
  });

  displayLocations();
  if (entries.length >= 3) displaySuggestedTime();
  else
    suggestedTime.textContent =
      "Waiting for at least 3 responses to suggest a time.";
}

function displayLocations() {
  const locationSet = new Set(entries.map((e) => e.location));
  suggestedLocations.innerHTML = `<strong>Suggested Locations:</strong> ${Array.from(
    locationSet
  ).join(", ")}`;
}

function displaySuggestedTime() {
  const timeMap = {};
  entries.forEach((e) => {
    const key = `${e.day}-${e.time}`;
    timeMap[key] = (timeMap[key] || 0) + 1;
  });

  const [bestSlot, count] = Object.entries(timeMap).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const [day, time] = bestSlot.split("-");
  suggestedTime.textContent = `✅ Best Time: ${day} at ${time} (${count} votes)`;
}

// Initialize
displayEntries();
