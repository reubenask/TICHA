import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  token: string;
}) {
  if (!resend || !env.EMAIL_FROM || !env.APP_PUBLIC_URL) return { sent: false };

  const resetUrl = `${env.APP_PUBLIC_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(input.token)}`;

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: "Reset your Ticha password",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#16211e">
        <h1 style="font-family:Georgia,serif;color:#174f3f">Reset your Ticha password</h1>
        <p>Hello ${input.name},</p>
        <p>Use the secure link below to create a new password. This link expires in 30 minutes.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#0f6f5a;color:white;padding:12px 18px;border-radius:12px;text-decoration:none">Reset password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Hello ${input.name}, reset your Ticha password here: ${resetUrl}`
  });

  return { sent: true };
}
