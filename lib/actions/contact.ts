"use server";

import nodemailer from "nodemailer";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // 1. Setup Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await Promise.all([
      // ─── CHANNEL 1: SLACK ───
      fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚀 *New YOUHUNT Inquiry*\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`,
        }),
      }),

      // ─── CHANNEL 2: EMAIL (via SMTP) ───
      transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`, // Gmail requires 'from' to be your authenticated email
        to: process.env.CONTACT_EMAIL_TO,
        replyTo: email, // This allows you to reply directly to the hunter
        subject: `New Expedition Inquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #22c55e;">New Message Received</h2>
            <p><strong>Hunter Name:</strong> ${name}</p>
            <p><strong>Hunter Email:</strong> ${email}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
          </div>
        `,
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Notification Error:", error);
    return { success: false, error: "Failed to send notification." };
  }
}