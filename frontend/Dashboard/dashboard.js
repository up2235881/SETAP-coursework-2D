document.addEventListener("DOMContentLoaded", () => {
  const meetingsList = document.getElementById("my-meetings");
  const availability = JSON.parse(localStorage.getItem("availability") || "[]");

  if (availability.length === 0) {
    meetingsList.innerHTML = "<li>No meetings created yet.</li>";
    return;
  }

  // Group and count time slots
  const countMap = {};
  availability.forEach((entry) => {
    const key = `${entry.day} @ ${entry.time}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  // Sort to find most common time
  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  const [bestTime, bestCount] = sorted[0];

  // Show the proposed time
  const proposed = document.createElement("li");
  proposed.innerHTML = `<strong>📅 Proposed Meeting Time:</strong> ${bestTime} (${bestCount} people)`;
  meetingsList.appendChild(proposed);

  // Show everyone’s availability
  availability.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} — ${entry.day} at ${entry.time}`;
    meetingsList.appendChild(li);
  });
});
