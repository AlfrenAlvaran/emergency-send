import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to receive data from SIM800L
app.post("/alert", async (req, res) => {
  try {
    const { bpm, lat, lon } = req.body;
    if (!bpm || !lat || !lon)
      return res.status(400).send("Missing data (bpm, lat, lon)");

    const message = `🚨 Emergency Alert!
BPM: ${bpm}
Location: https://maps.google.com/?q=${lat},${lon}`;

    // Setup Gmail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: "🚨 Emergency Alert from Bracelet",
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", message);

    res.status(200).send("Alert email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
