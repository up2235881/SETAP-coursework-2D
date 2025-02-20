document.addEventListener("DOMContentLoaded", function (){
    const form = document.getElementById("registerForm");
    const username = document.getElementById("student-username");
    const email = document.getElementById("student-email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const registerButton = document.getElementById("register-button");

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
        const emailRegister = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegister.test(password);

    }

    function confirmInput() {
        let isValid = true;

        // validation of username
        if (username.value.trim().length < 3) {
            usernameError.textContent = "OOPS!, Your username must be atleast 3 characters"
            isValid = false;
        }
        else {
            usernameError.textContent = "";
        }

        // validation of email
        if (!validateEmail(email.value)) {
            usernameError.textContent = "OOPS!, Please enter valid email address"
            isValid = false;
        }
        else {
            usernameError.textContent = "";
        } 

        if (!validatePassword(password.value)) {
            passwordErrorError.textContent = "OOPS!, Your password must be atleast 8 characters with a letter and number inclusive"
            isValid = false;
        }
        else {
            usernameError.textContent = "";
        } 

        // checking if password is a match
        if (password.value !== confirmPassword.value) {
            passwordErrorError.textContent = "OOPS!, Your passwords do not match"
            isValid = false;
        }
        else {
            usernameError.textContent = "";
        } 

        // disabling the regiter button if the inputs are not correct
        registerButton.disabled = !isValid
    }
})