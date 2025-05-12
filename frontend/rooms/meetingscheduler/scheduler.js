function groupByTime(entries) {
    const count = {};
    entries.forEach(entry => {
        const key = `${entry.day} @ ${entry.time}`;
        count[key] = (count[key] || 0) + 1;
    });
    return count;
}

const entriesContainer = document.getElementById("entries");
const suggestedTimeDiv = document.getElementById("suggested-time");

const availability = JSON.parse(localStorage.getItem("availability") || "[]");

if (availability.length === 0) {
    entriesContainer.innerHTML = "<p>No availability data yet.</p>";
    suggestedTimeDiv.innerText = "";
} else {
    // Display entries
    availability.forEach(entry => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerText = `${entry.name} — ${entry.day} at ${entry.time}`;
        entriesContainer.appendChild(div);
    });

    // Find most common slot
    const grouped = groupByTime(availability);
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const [bestTime, bestCount] = sorted[0];

    suggestedTimeDiv.innerHTML = `📅 Most common time: <span class="highlight">${bestTime}</span> (${bestCount} people)`;
}
