import nodemailer from "nodemailer";
import { buildWelcomeEmailHtml, buildNoticeDigestHtml, buildContactConfirmationHtml, buildSubscriptionConfirmationHtml } from "@/emails";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    await transporter.sendMail({
      from: from || `"LoksewaHub" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to LoksewaHub!",
    html: buildWelcomeEmailHtml(name),
  });
}

export async function sendNoticeDigest(
  email: string,
  name: string,
  notices: Array<{ title: string; url: string; date: string }>
) {
  return sendEmail({
    to: email,
    subject: "Your Daily Notice Digest from LoksewaHub",
    html: buildNoticeDigestHtml(name, notices),
  });
}

export async function sendContactConfirmation(email: string, name: string, subject: string) {
  return sendEmail({
    to: email,
    subject: "Thank You for Contacting LoksewaHub",
    html: buildContactConfirmationHtml(name, subject),
  });
}

export async function sendSubscriptionConfirmation(email: string, frequency: string) {
  return sendEmail({
    to: email,
    subject: "Subscription Confirmed - LoksewaHub",
    html: buildSubscriptionConfirmationHtml(email, frequency),
  });
}
