import nodemailer from "nodemailer"

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});


export const sendEmail = async (email, subject, description) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,           // use passed email(s)
      subject: subject,    // use passed subject
      text: description,   // plain text
      html: `<p>${description}</p>`, // HTML version
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Error while sending mail", err);
    throw err;
  }
};