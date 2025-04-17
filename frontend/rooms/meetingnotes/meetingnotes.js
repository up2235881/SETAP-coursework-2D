document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("noteslist");
    const form = document.getElementById("notesform");
  
    if (notesList) {
      const storedNotes = JSON.parse(localStorage.getItem("meetingNotes")) || [];
      const MAX_NOTES = 3;
  
      for (let i = 0; i < MAX_NOTES; i++) {
        const note = storedNotes[i];
        const box = document.createElement("div");
        box.className = "note-box";
  
        if (note) {
          box.innerHTML = `
            <div onclick="window.location.href='addnote.html?index=${i}'" style="text-align: left;">
              <strong>${note.purpose}</strong><br/>
              <small>Created on ${note.date} at ${note.time}</small>
            </div>
            <button onclick="deleteNote(${i})">🗑️</button>
          `;
        } else {
          box.innerHTML = `
            <div onclick="window.location.href='addnote.html'" style="text-align: left;">
              <strong>Meeting Note ${i + 1}</strong><br/>
              <small>Click to add details</small>
            </div>
            <button disabled>🗑️</button>
          `;
        }
  
        notesList.appendChild(box);
      }
    }
  
    if (form) {
      const params = new URLSearchParams(window.location.search);
      const index = params.get("index");
      const existing = JSON.parse(localStorage.getItem("meetingNotes")) || [];
  
      // If editing, load note into form
      if (index !== null && existing[index]) {
        const note = existing[index];
        document.getElementById("date").value = note.date;
        document.getElementById("time").value = note.time;
        document.getElementById("purpose").value = note.purpose;
        document.getElementById("summary").value = note.summary;
      }
  
      // Save handler
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const purpose = document.getElementById("purpose").value;
        const summary = document.getElementById("summary").value;
  
        const newNote = { date, time, purpose, summary };
  
        if (index !== null && existing[index]) {
          existing[index] = newNote; // Edit existing
        } else if (existing.length < 3) {
          existing.push(newNote); // Add new
        } else {
          alert("Maximum of 3 notes reached!");
          return;
        }
  
        localStorage.setItem("meetingNotes", JSON.stringify(existing));
        alert("Notes saved successfully");
        window.location.href = "meetingnotes.html";
      });
    }
  });
  
  // Delete a note
  function deleteNote(index) {
    const storedNotes = JSON.parse(localStorage.getItem("meetingNotes")) || [];
    storedNotes.splice(index, 1);
    localStorage.setItem("meetingNotes", JSON.stringify(storedNotes));
    location.reload();
  }
  