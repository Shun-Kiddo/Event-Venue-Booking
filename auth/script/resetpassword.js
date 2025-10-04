async function resetPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
    }

    const email = localStorage.getItem("resetEmail"); // store userEmail in localStorage after OTP verified

    const response = await fetch("http://localhost:3000/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
    });

    const result = await response.json();
    console.log(result);
    if (result.success) {
    alert("Password reset successful! You can log in now.");
    window.location.href = "/auth/html/loginpage.html";
    } else {
    alert("Failed to reset password.");
    window.location.href = "/auth/html/loginpage.html";
    }
}


// Toggle for New Password
const toggleNewPassword = document.getElementById("toggleNewPassword");
const newPasswordInput = document.getElementById("newPassword");

if (toggleNewPassword && newPasswordInput) {
  toggleNewPassword.addEventListener("click", () => {
    const type = newPasswordInput.type === "password" ? "text" : "password";
    newPasswordInput.type = type;
    toggleNewPassword.classList.toggle("fa-eye");
    toggleNewPassword.classList.toggle("fa-eye-slash");
  });
}

// Toggle for Confirm Password
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

if (toggleConfirmPassword && confirmPasswordInput) {
  toggleConfirmPassword.addEventListener("click", () => {
    const type = confirmPasswordInput.type === "password" ? "text" : "password";
    confirmPasswordInput.type = type;
    toggleConfirmPassword.classList.toggle("fa-eye");
    toggleConfirmPassword.classList.toggle("fa-eye-slash");
  });
}