document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.origin;
  const form = document.getElementById("registerForm");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPass = document.getElementById("confirmPassword");
  const registerButton = document.querySelector(".auth-button");

  // error spans
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  // modals
  const registerSuccessModal = document.getElementById("registerSuccessModal");
  const registerSuccessOk = document.getElementById("registerSuccessOk");
  const registerErrorModal = document.getElementById("registerErrorModal");
  const registerErrorOk = document.getElementById("registerErrorOk");
  const registerErrorMessage = document.getElementById("registerErrorMessage");

  const validateEmail = (em) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(em);

  // Must be at least 8 chars, contain letter, number, and special char
  const validatePassword = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);

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
        "Password must be at least 8 chars, include a letter, a number, and a special character";
      valid = false;
    } else {
      passwordError.textContent = "";
    }

    // Confirm Password
    if (confirmPass.value.trim() && password.value !== confirmPass.value) {
      confirmPasswordError.textContent = "Passwords do not match";
      valid = false;
    } else {
      confirmPasswordError.textContent = "";
    }

    registerButton.disabled = !valid;
  }

  // Live validation
  [username, email, password, confirmPass].forEach((el) =>
    el.addEventListener("input", checkInputs)
  );

  // Initial check on load
  checkInputs();

  // Modal close logic
  if (registerSuccessOk) {
    registerSuccessOk.onclick = function () {
      window.location.href = "/index.html"; // <-- update to your landing page if needed
    };
  }
  if (registerErrorOk) {
    registerErrorOk.onclick = function () {
      registerErrorModal.style.display = "none";
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (registerButton.disabled) return;

    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_username: username.value.trim(),
          user_email: email.value.includes("@") ? email.value.trim() : null,
          user_password: password.value,
        }),
      });

      const result = await res.json();

      if (res.status === 201) {
        // Show success modal
        registerSuccessModal.style.display = "flex";
        return;
      }

      // For error cases, show modal
      registerErrorMessage.textContent =
        result.message || "Registration failed";
      registerErrorModal.style.display = "flex";
    } catch (err) {
      console.error(err);
      registerErrorMessage.textContent = "An error occurred: " + err.message;
      registerErrorModal.style.display = "flex";
    }
  });
});
