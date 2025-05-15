const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

if (!roomId) {
  alert("Room ID is missing. Cannot create note.");
  throw new Error("Missing roomId");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Please fill in both title and note content.");
    return;
  }

  fetch("/api/notes/add", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, title, content }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("✅ Note saved successfully!");
      window.location.href = `/rooms/meetingnotes/meetingnotes.html?roomId=${roomId}`;
    })
    .catch((err) => {
      console.error("Error saving note:", err);
      alert("❌ Failed to save note. Try again.");
    });
});
