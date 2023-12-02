import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import "dotenv/config";

export const sendMail = async (options) => {
  try {
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename); //   get the path to the mail template file

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, html } = options;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
