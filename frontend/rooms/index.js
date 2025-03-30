console.log("javascript is working!");
document.addEventListener("DOMContentLoaded", function () {
  const createRoomBtn = document.getElementById("createRoomBtn");
  const roomNameInput = document.getElementById("roomname");

  if (createRoomBtn && roomNameInput) {
    const roomNameError = document.getElementById("roomNameError");

    function validateRoomName() {
      const room = roomNameInput.value.trim();
      if (roomNameInput.value.trim() !== "" && room.length < 3) {
        roomNameError.textContent =
          "Oops! Room name must be atlest 3 characters";
        createRoomBtn.disabled = true;
      } else {
        roomNameError.textContent = "";
        createRoomBtn.disabled = false;
      }
    }
    roomNameInput.addEventListener("input", validateRoomName);
    createRoomBtn.addEventListener("click", function (event) {
      if (roomNameInput.value.trim().length < 3) {
        event.preventDefault();
      } else {
        alert("Room created successfully! You will be redirected shortly");
      }
    });
    validateRoomName();
  }
});
