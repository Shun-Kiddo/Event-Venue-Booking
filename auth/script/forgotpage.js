let userEmail = "";
// Send OTP
async function sendOtp() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  if (!email) return alert("Please enter your email");

  try {
    const response = await fetch("http://localhost:3000/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("OTP sent to your email!");
      userEmail = email;

      // clear email after success
      emailInput.value = "";

      // switch to OTP step
      document.getElementById("emailStep").style.display = "none";
      document.getElementById("otpStep").style.display = "block";

      // clear OTP boxes
      document.querySelectorAll(".otp-box").forEach(input => input.value = "");
    } else {
      alert(result.error || "Failed to send OTP");
      emailInput.value = "";
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Try again later.");
    document.getElementById("email").value = "";
  }
}

// Verify OTP
async function verifyOtp() {
  const otpInputs = document.querySelectorAll(".otp-box");
  const otp = Array.from(otpInputs).map(input => input.value).join("");

  if (otp.length !== 6) {
    alert("Please enter a valid 6-digit OTP.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, otp })
    });

    const result = await response.json();

    if (response.ok && result.success) {
        alert("OTP Verified! Redirecting...");
        localStorage.setItem("resetEmail", userEmail);
        window.location.href = "/auth/html/resetpassword.html";
    } else {
      alert(result.error || "Invalid OTP. Try again.");
        otpInputs.forEach(input => input.value = "");
        otpInputs[0].focus();
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    alert("Server error. Try again later.");

    document.querySelectorAll(".otp-box").forEach(input => input.value = "");
  }
}

//Resend OTP
async function resendOtp() {
  await sendOtp();
}

//Auto move cursor in OTP input
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".otp-box");
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });
});