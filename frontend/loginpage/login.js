document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  // Error modal
  const loginErrorModal = document.getElementById("loginErrorModal");
  const loginErrorMessage = document.getElementById("loginErrorMessage");
  const loginErrorOk = document.getElementById("loginErrorOk");

  // Modal close logic
  if (loginErrorOk) {
    loginErrorOk.onclick = function () {
      loginErrorModal.style.display = "none";
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: usernameInput.value.trim(),
          password: passwordInput.value,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // ✅ Set flag BEFORE redirect
        sessionStorage.setItem("justLoggedIn", "true");
        window.location.href = "/Dashboard/dashboard.html";
      } else {
        // Show error modal
        loginErrorMessage.textContent =
          result.message || "Invalid username/email or password.";
        loginErrorModal.style.display = "flex";
      }
    } catch (err) {
      loginErrorMessage.textContent = "An error occurred: " + err.message;
      loginErrorModal.style.display = "flex";
    }

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  });
});
