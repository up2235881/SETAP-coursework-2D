// frontend/registerpage/register.js

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.origin;              // e.g. http://localhost:5000
  const form = document.getElementById("registerForm");
  const username       = document.getElementById("username");
  const email          = document.getElementById("email");
  const password       = document.getElementById("password");
  const confirmPass    = document.getElementById("confirmPassword");
  const registerButton = document.querySelector(".auth-button");

  // error spans
  const usernameError       = document.getElementById("usernameError");
  const emailError          = document.getElementById("emailError");
  const passwordError       = document.getElementById("passwordError");
  const confirmPasswordError= document.getElementById("confirmPasswordError");

  const validateEmail = (em) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(em);

  const validatePassword = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);

  function checkInputs() {
    let valid = true;

    // Username
    if (username.value.trim() && username.value.trim().length < 3) {
      usernameError.textContent = "Username must be at least 3 characters";
      valid = false;
    } else {
      usernameError.textContent = "";
    }

    // Email
    if (email.value.trim() && !validateEmail(email.value)) {
      emailError.textContent = "Please enter a valid email";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    // Password
    if (password.value.trim() && !validatePassword(password.value)) {
      passwordError.textContent =
        "Password must be at least 8 chars and include a number";
      valid = false;
    } else {
      passwordError.textContent = "";
    }

    // Confirm
    if (
      confirmPass.value.trim() &&
      password.value !== confirmPass.value
    ) {
      confirmPasswordError.textContent = "Passwords do not match";
      valid = false;
    } else {
      confirmPasswordError.textContent = "";
    }

    registerButton.disabled = !valid;
  }

  // Wire up live validation
  // [username, email, password, confirmPass].forEach((el) =>
  //   el.addEventListener("input", checkInputs)
  // );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // checkInputs();
    if (registerButton.disabled) return;

    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_username: username.value.trim(),
          user_email: email.value.includes("@") ? email.value.trim() : null,
          user_password: password.value
        })
      });

      const result = await res.json();
      alert(result.message || (res.ok ? "Registered!" : "Registration failed"));

      if (res.status === 201) {
        // go to login page
        window.location.href = "/loginpage/login.html";
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred: " + err.message);
    }
  });

  // Initial check
  // checkInputs();
});
