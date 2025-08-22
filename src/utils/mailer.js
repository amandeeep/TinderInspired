
const dotenv = require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT normal password)
  },
});
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "MISSING");


async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"TechConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", to);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

module.exports = sendMail;
