const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
togglePassword.addEventListener('click', () => {
    
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

try {
const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, password })
});
const data = await res.json();
alert(data.message);

if (res.ok) {
    window.location.href = "/content/html/landing.html";
    document.querySelector("form").reset();
}else{
    document.querySelector("form").reset();
}
} catch (err) {
    alert("Error connecting to server");
    
}

});

    