import { AppError } from "../utils/appError";

const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER) {
    throw AppError("EMAIL_USER is required for nodemailer configuration", 500);
  }
  if (!process.env.EMAIL_PASS) {
    throw AppError("EMAIL_PASS is required for nodemailer configuration", 500);
  }
};

validateEmailConfig();

export const emailConfig = {
  email: process.env.EMAIL_USER!, // ! assertion karena sudah divalidasi
  password: process.env.EMAIL_PASS!,
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports

  // SendGrid (Optional)
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",

  // Mailgun (Optional)
  mailgunApiKey: process.env.MAILGUN_API_KEY || "",
  mailgunDomain: process.env.MAILGUN_DOMAIN || "",

  // Default sender
  defaultFromEmail: process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_USER!,
  defaultFromName: process.env.DEFAULT_FROM_NAME || "Your App",
};