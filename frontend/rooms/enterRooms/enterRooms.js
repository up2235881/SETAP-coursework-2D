document.querySelectorAll(".menu-item").forEach((button) => {
  button.addEventListener("click", () => {
    const link = button.dataset.link;
    if (link) {
      window.location.href = link;
    }
  });
});

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const confirmedDisplay = document.querySelector("#confirmed-meeting-info");

if (roomId) {
  fetch(`/api/meetings/confirmed?roomId=${roomId}`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.day && data.time && data.location) {
        confirmedDisplay.textContent = `📢 Confirmed Meeting: ${data.day} at ${data.time}, Location: ${data.location}`;
      }
    })
    .catch((err) => {
      console.warn("No confirmed meeting for this room.");
    });
}
