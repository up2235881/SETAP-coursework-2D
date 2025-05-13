const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const notesList = document.querySelector("#noteslist");

if (!roomId) {
  notesList.innerHTML =
    '<p style="color:red;">Room ID missing. Please use a valid link.</p>';
  throw new Error("Missing roomId");
}

// Fetch meeting notes for the room
fetch(`/api/notes/${roomId}`, { credentials: "include" })
  .then((res) => res.json())
  .then((notes) => {
    if (!notes.length) {
      notesList.innerHTML = "<p>No notes submitted yet for this room.</p>";
      return;
    }

    renderNotes(notes);
  })
  .catch((err) => {
    console.error("Error loading notes:", err);
    notesList.innerHTML = '<p style="color:red;">Failed to load notes.</p>';
  });

function renderNotes(notes) {
  notesList.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("note-item");
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
    `;
    notesList.appendChild(div);
  });
}
