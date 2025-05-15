const roomId = new URLSearchParams(window.location.search).get("roomId");
// Update room header with room name
const header = document.getElementById("room-header");

if (roomId && header) {
  fetch(`/api/rooms/${roomId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data.room_name) {
        header.innerHTML = `
          <span class="material-icons">meeting_room</span>
          ${data.room_name} Dashboard
        `;
      }
    })
    .catch(() => {
      console.warn("Failed to load room name");
    });
}

// Dynamic routing to room pages with ?roomId
document.querySelectorAll(".menu-item").forEach((button) => {
  button.addEventListener("click", () => {
    const baseLink = button.dataset.link;
    if (baseLink && roomId) {
      window.location.href = `${baseLink}?roomId=${roomId}`;
    }
  });
});

// Show confirmed meeting info for this room
const confirmedDisplay = document.querySelector("#confirmed-meeting-info");

if (roomId && confirmedDisplay) {
  fetch(`/api/meetings/confirmed?roomId=${roomId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.day && data.time && data.location) {
        confirmedDisplay.textContent = `📢 Confirmed Meeting: ${data.day} at ${data.time}, Location: ${data.location}`;
      }
    })
    .catch(() => {
      console.warn("No confirmed meeting for this room.");
    });
}

// --- Add Participants Modal Logic ---
const addBtn = document.getElementById("addParticipantsBtn");
const modal = document.getElementById("addParticipantsModal");
const confirmBtn = document.getElementById("confirmAddFriend");
const cancelBtn = document.getElementById("cancelAddFriend");
const input = document.getElementById("friend-username");

addBtn.onclick = () => {
  modal.style.display = "flex";
  input.value = "";
  input.focus();
};
cancelBtn.onclick = () => (modal.style.display = "none");
confirmBtn.onclick = () => {
  // You can add your database logic here later
  alert("Friend added: " + input.value);
  modal.style.display = "none";
};
// Optional: close modal on Escape key
window.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex" && e.key === "Escape")
    modal.style.display = "none";
});
