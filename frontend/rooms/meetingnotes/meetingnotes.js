document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("noteslist");
    const form = document.getElementById("notesform");
  
    if (notesList) {
      const storedNotes = JSON.parse(localStorage.getItem("meetingNotes")) || [];
      const MAX_DUMMIES = 3;
  
      // Show dummy placeholders only if fewer than 3 notes exist
      const dummiesToShow = Math.max(0, MAX_DUMMIES - storedNotes.length);
  
      for (let i = 0; i < dummiesToShow; i++) {
        const box = document.createElement("div");
        box.className = "note-box";
        box.innerHTML = `
          <div onclick="window.location.href='addnote.html'" style="text-align: left;">
            <strong>Meeting Note ${i + 1}</strong><br/>
            <small>Click to add details</small>
          </div>
          <button disabled>🗑️</button>
        `;
        notesList.appendChild(box);
      }
  
      // Show all real notes
      storedNotes.forEach((note, index) => {
        const box = document.createElement("div");
        box.className = "note-box";
        box.innerHTML = `
          <div onclick="window.location.href='addnote.html?index=${index}'" style="text-align: left;">
            <strong>${note.purpose}</strong><br/>
            <small>${note.date} at ${note.time}</small>
          </div>
          <button onclick="deleteNote(${index})">🗑️</button>
        `;
        notesList.appendChild(box);
      });
    }
  
    // Handle add/edit form
    if (form) {
      const params = new URLSearchParams(window.location.search);
      const index = params.get("index");
      const existing = JSON.parse(localStorage.getItem("meetingNotes")) || [];
  
      if (index !== null && existing[index]) {
        const note = existing[index];
        document.getElementById("date").value = note.date;
        document.getElementById("time").value = note.time;
        document.getElementById("purpose").value = note.purpose;
        document.getElementById("summary").value = note.summary;
      }
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const purpose = document.getElementById("purpose").value;
        const summary = document.getElementById("summary").value;
  
        const newNote = { date, time, purpose, summary };
  
        if (index !== null && existing[index]) {
          existing[index] = newNote;
        } else {
          existing.push(newNote);
        }
  
        localStorage.setItem("meetingNotes", JSON.stringify(existing));
        alert("Notes saved successfully");
        window.location.href = "meetingnotes.html";
      });
    }
  });
  
  // Delete function
  function deleteNote(index) {
    const storedNotes = JSON.parse(localStorage.getItem("meetingNotes")) || [];
    storedNotes.splice(index, 1);
    localStorage.setItem("meetingNotes", JSON.stringify(storedNotes));
    location.reload();
  }
  