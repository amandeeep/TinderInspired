require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT normal password)
  },
});

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
