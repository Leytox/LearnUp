import { createTransport } from "nodemailer";

// Create a transporter object using the default SMTP transport
let transporter = createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.OUTLOOK_EMAIL, // Your Outlook email address
    pass: process.env.OUTLOOK_PASSWORD, // Your Outlook password or app-specific password
  },
});

export default transporter;
