document.addEventListener("DOMContentLoaded", function (){
    const form = document.getElementById("registerForm");
    const username = document.getElementById("student-username");
    const email = document.getElementById("student-email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const registerButton = document.getElementById("register-button");

    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    function validateEmail(email) {
        const emailRegister = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegister.test(email);
    }
})