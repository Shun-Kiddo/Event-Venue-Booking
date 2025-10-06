const express = require("express");
require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors"); 
const nodemailer = require("nodemailer");

// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://127.0.0.1:5502",  
  methods: ["GET","POST"],
  credentials: true
})); 

const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Gmail Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   
    pass: process.env.GMAIL_PASS  
  }
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO customer (c_fullname, c_email, c_password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        throw err;
      }
      res.status(201).json({ message: "Signup successful" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing up" });
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM customer WHERE c_email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.c_password);
 
    if (match) {
      res.json({
        message: "Login successful",
        user: { id: user.c_id, name: user.c_fullname, email: user.c_email }
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  });
});

//FORGOT PASSWORD - generate and send OTP
app.post('/forgot', (req, res) => {
  console.log("Request body:", req.body);

  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  //generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  //save to DB
  const sql = "UPDATE customer SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE c_email = ?";
  db.query(sql, [otp, email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: "Email not found" });

    //send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).json({ success: false, error: "Failed to send email" });
      }
      res.json({ success: true, message: "OTP sent successfully" });
    });
  });
});


// VERIFY OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: "Email and OTP required" });
  }

  const sql = `
    SELECT * 
    FROM customer 
    WHERE c_email = ? 
      AND otp = ? 
      AND otp_expiry > NOW()
  `;

  db.query(sql, [email, otp], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified. You can reset your password now." });
  });
});

// RESET PASSWORD
app.post("/reset-password", (req, res) => {
  console.log("RESET BODY:", req.body);
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ success: false, error: "Email and new password required" });

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const sql = `
    UPDATE customer 
    SET c_password = ?, otp = NULL, otp_expiry = NULL 
    WHERE c_email = ?
  `;
  db.query(sql, [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: "Email not found" });

    res.json({ success: true, message: "Password reset successful" });
  });
});



// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

