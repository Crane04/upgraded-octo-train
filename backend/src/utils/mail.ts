import nodemailer from "nodemailer";
require("dotenv").config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // or App Password if you have 2-Step Verification enabled
  },
});
// Function to send an email
const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const mailOptions = {
      from: "mayowayusuf3004@gmail.com",
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
