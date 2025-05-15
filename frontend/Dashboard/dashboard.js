const roomsContainer = document.querySelector("#my-rooms");
const meetingsList = document.querySelector("#my-meetings");
const noRoomsMsg = document.querySelector("#no-rooms-message");
const noMeetingsMsg = document.querySelector("#no-meetings-message");

const createForm = document.querySelector("#create-room-form");
const joinForm = document.querySelector("#join-room-form");

// Welcome modal elements
const welcomeModal = document.getElementById("welcomeModal");
const welcomeModalTitle = document.getElementById("welcomeModalTitle");
const welcomeModalBody = document.getElementById("welcomeModalBody");
const welcomeModalOk = document.getElementById("welcomeModalOk");

// Room created modal elements
const roomNameInput = document.querySelector("#create-room-name");
const roomNameError = document.getElementById("roomNameError");
const roomCreatedModal = document.getElementById("roomCreatedModal");
const roomCreatedModalTitle = document.getElementById("roomCreatedModalTitle");
const roomCreatedModalBody = document.getElementById("roomCreatedModalBody");
const roomCreatedModalOk = document.getElementById("roomCreatedModalOk");

// Validate room name: at least 4 letters, no numbers or special chars
function isRoomNameValid(name) {
  return /^[A-Za-z]{4,}$/.test(name);
}

// Hide error on typing
roomNameInput.addEventListener("input", () => {
  roomNameError.style.display = "none";
});

// Load current user, rooms, and confirmed meetings
fetch("/api/users/me", { credentials: "include" })
  .then((res) => res.json())
  .then((user) => {
    const username = user.user_username || user.username || "";
    const userId = user.user_id || user.id;

    if (!userId || !username) {
      welcomeModalTitle.textContent = "Session expired. Please log in again.";
      welcomeModalBody.textContent = "";
      welcomeModal.style.display = "flex";
      if (welcomeModalOk) {
        welcomeModalOk.onclick = () => {
          welcomeModal.style.display = "none";
          window.location.href = "/loginpage/login.html";
        };
      }
      return;
    }

    const welcomeKey = "slotify-welcomed-" + userId;
    const firstVisit = !localStorage.getItem(welcomeKey);
    if (firstVisit) {
      welcomeModalTitle.textContent = `Welcome to Slotify, ${username}!`;
      welcomeModalBody.textContent = `We hope you enjoy.`;
      localStorage.setItem(welcomeKey, "1");
    } else {
      welcomeModalTitle.textContent = `Welcome back to Slotify, ${username}!`;
      welcomeModalBody.textContent = "";
    }
    welcomeModal.style.display = "flex";
    if (welcomeModalOk) {
      welcomeModalOk.onclick = () => (welcomeModal.style.display = "none");
    }

    window.SLOTIFY_USER_ID = userId;
    loadRooms(userId);
    loadMeetings(userId);
  })
  .catch((err) => {
    console.error("Error loading user info:", err);
    welcomeModalTitle.textContent = "Session expired. Please log in again.";
    welcomeModalBody.textContent = "";
    welcomeModal.style.display = "flex";
    welcomeModalOk.onclick = () => {
      welcomeModal.style.display = "none";
      window.location.href = "/loginpage/login.html";
    };
  });

function loadRooms(userId) {
  fetch(`/api/rooms/user/${userId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((rooms) => {
      roomsContainer.innerHTML = "";
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
          <p>Code: ${room.invite_code || ""}</p>
          <button class="submit-btn" onclick="window.location.href='/rooms/enterRooms/enterRooms.html?roomId=${
            room.room_id
          }'">
            <span class="material-icons">meeting_room</span> Enter
          </button>
        `;
        roomsContainer.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error loading rooms:", err);
    });
}

function loadMeetings(userId) {
  fetch(`/api/users/${userId}/confirmed-meetings`, { credentials: "include" })
    .then((res) => res.json())
    .then((meetings) => {
      meetingsList.innerHTML = "";
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
    .catch((err) => {
      console.error("Error loading meetings:", err);
    });
}

// CREATE ROOM HANDLING
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = roomNameInput.value.trim();

  if (!isRoomNameValid(name)) {
    roomNameError.textContent =
      "Room name must be at least 4 letters, with no numbers or special characters.";
    roomNameError.style.display = "block";
    return;
  }
  roomNameError.style.display = "none";

  fetch("/api/rooms/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName: name }),
  })
    .then((res) => res.json())
    .then((room) => {
      roomCreatedModalTitle.textContent = "Room created successfully!";
      roomCreatedModalBody.textContent = `Room "${room.room_name}" has been created.`;
      roomCreatedModal.style.display = "flex";
      if (roomCreatedModalOk) {
        roomCreatedModalOk.onclick = () => {
          roomCreatedModal.style.display = "none";
          loadRooms(window.SLOTIFY_USER_ID);
          roomNameInput.value = "";
        };
      }
    })
    .catch((err) => {
      console.error(err);
      roomNameError.textContent = "Failed to create room. Please try again.";
      roomNameError.style.display = "block";
    });
});

// JOIN ROOM HANDLING (Improved)
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.querySelector("#join-room-code").value.trim();
  if (!code) return;

  fetch("/api/rooms/join", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteCode: code }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.message || "Failed to join room.");
        });
      }
      return res.json();
    })
    .then((data) => {
      roomCreatedModalTitle.textContent = "Room Joined!";
      roomCreatedModalBody.textContent = `You've successfully joined a room with code "${code}".`;
      roomCreatedModal.style.display = "flex";
      if (roomCreatedModalOk) {
        roomCreatedModalOk.onclick = () => {
          roomCreatedModal.style.display = "none";
          loadRooms(window.SLOTIFY_USER_ID);
          document.querySelector("#join-room-code").value = "";
        };
      }
    })
    .catch((err) => {
      alert(err.message);
    });
});
