const roomsContainer = document.querySelector("#my-rooms");
const meetingsList = document.querySelector("#my-meetings");
const noRoomsMsg = document.querySelector("#no-rooms-message");
const noMeetingsMsg = document.querySelector("#no-meetings-message");

const createForm = document.querySelector("#create-room-form");
const joinForm = document.querySelector("#join-room-form");

// Load current user, rooms, and confirmed meetings
fetch("/api/users/me", { credentials: "include" })
  .then((res) => res.json())
  .then((user) => {
    loadRooms(user.user_id);
    loadMeetings(user.user_id);
  })
  .catch((err) => {
    console.error("Error loading user info:", err);
  });

function loadRooms(userId) {
  fetch(`/api/rooms/user/${userId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((rooms) => {
      if (!rooms.length) {
        noRoomsMsg.style.display = "block";
        return;
      }

      noRoomsMsg.style.display = "none";
      rooms.forEach((room) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h3>${room.room_name}</h3>
          <p>Code: ${room.room_code}</p>
          <button class="submit-btn" onclick="window.location.href='/rooms/enterRooms/enterRooms.html?roomId=${room.room_id}'">
            <span class="material-icons">meeting_room</span> Enter
          </button>
        `;
        roomsContainer.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading rooms:", err));
}

function loadMeetings(userId) {
  fetch(`/api/users/${userId}/confirmed-meetings`, { credentials: "include" })
    .then((res) => res.json())
    .then((meetings) => {
      if (!meetings.length) {
        noMeetingsMsg.style.display = "block";
        return;
      }

      noMeetingsMsg.style.display = "none";
      meetings.forEach((m) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${m.room_name}</strong><br>
          ${m.day} @ ${m.time} — Location: ${m.location}
        `;
        meetingsList.appendChild(li);
      });
    })
    .catch((err) => console.error("Error loading meetings:", err));
}

// Create room form
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#create-room-name").value.trim();
  if (!name) return;

  fetch("/api/rooms/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName: name }),
  })
    .then((res) => res.json())
    .then((room) => {
      alert(`✅ Room "${room.room_name}" created!`);
      window.location.href = `/rooms/enterRooms/enterRooms.html?roomId=${room.room_id}`;
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to create room.");
    });
});

// Join room form
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.querySelector("#join-room-code").value.trim();
  if (!code) return;

  fetch("/api/rooms/join", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomCode: code }),
  })
    .then((res) => res.json())
    .then(() => location.reload())
    .catch((err) => alert("Failed to join room."));
});
