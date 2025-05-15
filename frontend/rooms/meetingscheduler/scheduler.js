const entriesContainer = document.querySelector("#entries");
const suggestedTime = document.querySelector("#suggested-time");
const suggestedLocations = document.querySelector("#suggested-locations");

let entries = [];
let roomUsers = [];
let currentUserId = null;
let roomCreatorId = null;

const confirmedDisplay = document.createElement("div");
confirmedDisplay.classList.add("highlight");
confirmedDisplay.style.marginBottom = "20px";
document.querySelector(".dashboard").prepend(confirmedDisplay);

// Fetch confirmed meeting (if any)
fetch(`/api/meetings/confirmed?roomId=${roomId}`, { credentials: "include" })
  .then((res) => res.json())
  .then((data) => {
    if (data && data.day && data.time && data.location) {
      confirmedDisplay.textContent = `📢 Confirmed Meeting: ${data.day} at ${data.time}, Location: ${data.location}`;
    }
  })
  .catch((err) => {
    console.warn("No confirmed meeting yet.");
  });

// Get roomId from URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  alert("Room ID missing in URL. Please access this page via a room link.");
  throw new Error("Missing roomId");
}

// Fetch all availability entries for the room
// Step 1: Get current user ID (assumes session is active)
fetch("/api/users/me", { credentials: "include" })
  .then((res) => res.json())
  .then((user) => {
    currentUserId = user.user_id;

    // Step 2: Fetch creator
    return fetch(`/api/rooms/${roomId}/creator`);
  })
  .then((res) => res.json())
  .then((data) => {
    roomCreatorId = data.creator_id;

    // Step 3: Fetch room members
    return fetch(`/api/rooms/${roomId}/users`);
  })
  .then((res) => res.json())
  .then((users) => {
    roomUsers = users.map((u) => u.user_id);

    // Step 4: Fetch availability entries
    return fetch(`/api/availability/${roomId}`, { credentials: "include" });
  })
  .then((res) => res.json())
  .then((data) => {
    entries = data;

    displayEntries(entries);
    displayLocations(entries);

    if (entries.length >= 3) {
      displayBestTime(entries);
    }

    // ✅ If all users have submitted and current user is creator
    const submittedUserIds = new Set(entries.map((e) => e.user_id));
    const allSubmitted = roomUsers.every((uid) => submittedUserIds.has(uid));

    if (currentUserId === roomCreatorId && allSubmitted) {
      showConfirmButton(entries);
    }
  })
  .catch((err) => {
    console.error("Scheduler setup error:", err);
    entriesContainer.innerHTML = "<p>Failed to load scheduler data.</p>";
  });

function displayEntries(entries) {
  entriesContainer.innerHTML = "";
  entries.forEach((entry, index) => {
    const name = entry.name?.trim() || `User #${entry.user_id}`;
    const div = document.createElement("div");
    div.classList.add("entry");
    div.innerHTML = `
        <p><strong>${index + 1}. ${name}</strong> – ${entry.day}, ${
      entry.time
    } @ ${entry.location}</p>
      `;
    entriesContainer.appendChild(div);
  });
}

function displayLocations(entries) {
  const locations = [...new Set(entries.map((e) => e.location))];
  suggestedLocations.innerHTML = `<strong>Suggested Locations:</strong> ${locations.join(
    ", "
  )}`;
}

function displayBestTime(entries) {
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

function showConfirmButton(entries) {
  const confirmContainer = document.createElement("div");
  confirmContainer.style.marginTop = "30px";

  const label = document.createElement("label");
  label.textContent = "Select Final Location:";
  label.style.display = "block";
  label.style.marginBottom = "10px";

  const select = document.createElement("select");
  select.style.padding = "10px";
  select.style.fontSize = "16px";

  const locations = [...new Set(entries.map((e) => e.location))];
  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    select.appendChild(option);
  });

  const button = document.createElement("button");
  button.textContent = "Confirm Meeting";
  button.classList.add("submit-btn");
  button.style.marginTop = "15px";

  button.onclick = () => {
    const selectedLocation = select.value;
    const timeMap = {};
    entries.forEach((e) => {
      const key = `${e.day}-${e.time}`;
      timeMap[key] = (timeMap[key] || 0) + 1;
    });
    const [bestSlot] = Object.entries(timeMap).sort((a, b) => b[1] - a[1])[0];
    const [day, time] = bestSlot.split("-");

    fetch("/api/meetings/confirm", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, day, time, location: selectedLocation }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(
          `✅ Meeting confirmed: ${day} at ${time}, Location: ${selectedLocation}`
        );
        setTimeout(() => {
          window.location.href = `/rooms/enterRooms/enterRooms.html?roomId=${roomId}`;
        }, 3000);
      })
      .catch((err) => {
        console.error("Error confirming meeting:", err);
        alert("Failed to confirm meeting.");
      });
  };

  confirmContainer.appendChild(label);
  confirmContainer.appendChild(select);
  confirmContainer.appendChild(button);
  document.querySelector(".dashboard").appendChild(confirmContainer);
}
