const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const notesList = document.querySelector("#noteslist");

if (!roomId) {
  notesList.innerHTML = '<p style="color:red;">Room ID missing.</p>';
  throw new Error("Missing roomId");
}

let currentUserId = null;

// Get current user first
fetch("/api/users/me", { credentials: "include" })
  .then((res) => res.json())
  .then((user) => {
    currentUserId = user.user_id;
    return fetch(`/api/notes/${roomId}`, { credentials: "include" });
  })
  .then((res) => res.json())
  .then((notes) => {
    renderNotes(notes);
  })
  .catch((err) => {
    console.error("Error:", err);
    notesList.innerHTML = '<p style="color:red;">Could not load notes.</p>';
  });

function renderNotes(notes) {
  notesList.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("note-item");

    const created = formatDate(note.created_at);
    const edited = note.edited_at
      ? `<br><em>Edited at ${formatDate(note.edited_at)} by ${
          note.edited_by
        }</em>`
      : "";

    const noteContent = document.createElement("div");
    noteContent.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <small>Created at ${created} by ${note.created_by}${edited}</small>
    `;

    const editBtn = document.createElement("button");
    editBtn.className = "add-btn edit-btn";
    editBtn.innerHTML = `<span class="material-icons">edit</span> Edit`;
    editBtn.onclick = () => enableInlineEdit(note, div);

    div.appendChild(noteContent);
    div.appendChild(editBtn);
    notesList.appendChild(div);
  });
}

function enableInlineEdit(note, container) {
  container.innerHTML = ""; // clear existing

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = note.title;
  titleInput.className = "edit-input";

  const contentInput = document.createElement("textarea");
  contentInput.value = note.content;
  contentInput.className = "edit-input";

  const saveBtn = document.createElement("button");
  saveBtn.className = "add-btn";
  saveBtn.innerHTML = `<span class="material-icons">save</span> Save`;
  saveBtn.onclick = () => {
    const updatedTitle = titleInput.value.trim();
    const updatedContent = contentInput.value.trim();

    if (!updatedTitle || !updatedContent) {
      alert("Fields cannot be empty.");
      return;
    }

    fetch(`/api/notes/${note.note_id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        title: updatedTitle,
        content: updatedContent,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // Refresh notes
        return fetch(`/api/notes/${roomId}`, { credentials: "include" });
      })
      .then((res) => res.json())
      .then((notes) => renderNotes(notes))
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Failed to update note.");
      });
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "add-btn";
  cancelBtn.innerHTML = `<span class="material-icons">close</span> Cancel`;
  cancelBtn.onclick = () => renderNotes([note]); // reset this note only

  container.appendChild(titleInput);
  container.appendChild(contentInput);
  container.appendChild(saveBtn);
  container.appendChild(cancelBtn);
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}
