document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.querySelector(".register-button");
  const username = document.getElementById("student-username");
  const email = document.getElementById("student-email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  // assigning error messages
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  function validateEmail(email) {
    const emailRegister = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegister.test(email);
  }

  function validatePassword(password) {
    const passwordRegister = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegister.test(password);
  }

  function checkInputs() {
    let isValid = true;

    // validation of username
    if (username.value.trim() !== "" && username.value.trim().length < 3) {
      usernameError.textContent =
        "OOPS!, Your username must be atleast 3 characters";
      isValid = false;
    } else {
      usernameError.textContent = "";
    }

    // validation of email
    if (email.value.trim() !== "" && !validateEmail(email.value)) {
      emailError.textContent = "OOPS!, Please enter valid email address";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    if (password.value.trim() !== "" && !validatePassword(password.value)) {
      passwordError.textContent =
        "OOPS!, Your password must be atleast 8 characters with a letter and number inclusive";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }

    // checking if password is a match
    if (
      confirmPassword.value.trim() !== "" &&
      password.value !== confirmPassword.value
    ) {
      confirmPasswordError.textContent = "OOPS!, Your passwords do not match";
      isValid = false;
    } else {
      confirmPasswordError.textContent = "";
    }

    // disabling the regiter button if the inputs are not correct
    registerButton.disabled = !isValid;
  }

  // adding event listeners
  username.addEventListener("input", checkInputs);
  email.addEventListener("input", checkInputs);
  password.addEventListener("input", checkInputs);
  confirmPassword.addEventListener("input", checkInputs);

  // will not allow submission when form is invalid
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value.includes("@") ? email.value : null,
            password: password.value,
            password2: confirmPassword.value,
          }),
        });

        const result = await response.json();
        alert(result.message);
        if (response.status === 201) {
          window.location.href = "/loginpage/login.html";
        }
      } catch (error) {
        alert("An error occured: " + error.message);
      }
    });
  checkInputs();
});
