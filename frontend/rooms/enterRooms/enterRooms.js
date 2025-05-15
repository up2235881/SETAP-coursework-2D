const roomId = new URLSearchParams(window.location.search).get('roomId');

// Dynamic routing to room pages with ?roomId
document.querySelectorAll('.menu-item').forEach(button => {
  button.addEventListener('click', () => {
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
    .then(res => res.json())
    .then(data => {
      if (data && data.day && data.time && data.location) {
        confirmedDisplay.textContent = `📢 Confirmed Meeting: ${data.day} at ${data.time}, Location: ${data.location}`;
      }
    })
    .catch(() => {
      console.warn("No confirmed meeting for this room.");
    });
}
