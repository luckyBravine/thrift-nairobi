import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export async function sendOtpEmail(params: {
  email: string;
  otp: string;
  type: string;
}) {
  const subject = `Your THIFT code: ${params.otp}`;
  const text = `Your one-time code is ${params.otp}. It expires in 5 minutes.\n\nType: ${params.type}`;

  if (!env.RESEND_API_KEY) {
    console.log(`[dev-email] to=${params.email} otp=${params.otp} type=${params.type}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: params.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new AppError(400, `Resend failed: ${res.status} ${body}`);
  }
}