// frontend/loginpage/login.js

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("student-username-email").value.trim();
  const password   = document.getElementById("password").value;

  try {
    // Hit the exact route you mounted: POST /users/login
    const res = await fetch("/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });

    if (res.ok) {
      // Redirect to your dashboard page (static folder fallback serves Dashboard/...).
      window.location.href = "/Dashboard/dashboard.html";
    } else {
      const err = await res.json();
      alert(err.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error logging in");
  }
});
