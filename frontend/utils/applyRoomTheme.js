export function applyRoomTheme(roomId) {
  if (!roomId) return;
  fetch(`/api/rooms/${roomId}`, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (data.theme === "dark") {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    })
    .catch(err => console.warn("Could not load theme:", err));
}
