import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Contact Route ---
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Send email through Resend
    await resend.emails.send({
      from: "Kadalrasa Contact <onboarding@resend.dev>", // default verified sender
      to: process.env.TO_EMAIL, // your receiving email
      subject: `New Message from ${name}`, // you can keep or remove this line
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message. Try again." });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
