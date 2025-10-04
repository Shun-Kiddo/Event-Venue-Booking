const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

try {
    const res = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
});

const data = await res.json();
alert(data.message);

if (res.ok) {
    window.location.href = "/auth/html/loginpage.html";
}
} catch (err) {
    alert("Error connecting to server");
    }
});