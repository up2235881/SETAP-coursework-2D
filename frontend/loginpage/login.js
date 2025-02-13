document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const studentEmail = document.getElementById('student-email').value;
    const password = document.getElementById('password').value;

    if (studentId && password) {
        alert('Login successful!'); 
    } else {
        alert('Please fill in all fields.');
    }
});
