document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const studentEmailUsername = document.getElementById('student-username-email').value;
    const password = document.getElementById('password').value;

    const response = await fetch ('http://127.0.0.1:5000/login',{
        method: 'POST',
        headers: {'Content-type' : 'application/json' ,
                  'Accept' : 'application/json'
                },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            email: studentEmailUsername.includes(('@')) ? studentEmailUsername : null,
            username: studentEmailUsername.includes('@') ? null : studentEmailUsername,
            password : password
        })
    });

    const result = await response.json();

    if (response.status === 200) {
        alert(`Login successful! Welcome ${result.studentEmailUsername}`);
        window.location.href = 'dashboard.html';
    } else {
        alert(result.error);
    }
    
});
