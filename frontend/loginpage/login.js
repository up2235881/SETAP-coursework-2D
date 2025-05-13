document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentEmailUsername = document.getElementById("student-username-email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: studentEmailUsername.includes("@") ? studentEmailUsername : null,
    username: studentEmailUsername,
    password: password,
  };

  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      window.location.href = "/frontend/Dashboard/dashboard.html";
    } else {
      const result = await response.json();
      alert(result.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Error logging in");
  }
});
