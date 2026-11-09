import { env, isProduction } from '../config/env';
import { AppError } from '../errors/AppError';
import { logger } from './logger';

export async function sendOtpEmail(params: {
  email: string;
  otp: string;
  type: string;
}) {
  const subject = 'Your Thrift Nairobi verification code';
  const purpose =
    params.type === 'sign-in'
      ? 'sign in to your account'
      : params.type === 'email-verification'
        ? 'verify your email address'
        : params.type === 'forget-password'
          ? 'reset your password'
          : 'complete your request';
  const text = [
    'THIFT NAIROBI',
    'A little something to get you going.',
    '',
    `Use this code to ${purpose}:`,
    params.otp,
    '',
    'This code expires in 5 minutes. For your security, never share it with anyone.',
    "If you didn't request this code, you can safely ignore this email.",
    '',
    'Thrift Nairobi · Nairobi, Kenya',
  ].join('\n');
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Your Thrift Nairobi verification code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f2eb;color:#344b40;font-family:Karla,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Your one-time code is ready. It expires in 5 minutes.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f2eb;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#fffefa;border:1px solid #e1ddd3;">
            <tr>
              <td style="padding:28px 36px;border-bottom:1px solid #e1ddd3;">
                <p style="margin:0;color:#344b40;font-family:'Cormorant Garamond',Georgia,serif;font-size:21px;font-weight:600;letter-spacing:3px;line-height:1.3;">THIFT NAIROBI</p>
                <p style="margin:7px 0 0;color:#79796f;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;">Curated secondhand style, thoughtfully rehomed.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:38px 36px 42px;">
                <p style="margin:0 0 12px;color:#a8684d;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Your secure code</p>
                <h1 style="margin:0 0 16px;color:#344b40;font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;font-weight:500;line-height:1.15;">A little something to get you going.</h1>
                <p style="margin:0 0 25px;color:#666c63;font-size:15px;line-height:1.65;">Use the code below to ${purpose}. It is valid for 5 minutes.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="padding:15px 24px;background-color:#f1eee7;border:1px solid #e1ddd3;color:#344b40;font-family:'Space Mono',Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:8px;line-height:1.2;">${params.otp}</td>
                  </tr>
                </table>
                <p style="margin:0;color:#79796f;font-size:13px;line-height:1.6;">For your security, never share this code with anyone. If you did not request it, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;background-color:#f8f6f1;border-top:1px solid #e1ddd3;">
                <p style="margin:0;color:#79796f;font-size:12px;line-height:1.6;">THIFT NAIROBI<br>Nairobi, Kenya</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#89877f;font-size:11px;line-height:1.5;">This is an automated security email. Please do not reply.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  if (!env.RESEND_API_KEY) {
    if (isProduction) {
      throw new AppError(503, 'Verification email delivery is unavailable');
    }

    logger.info(
      { event: 'otp.email.accepted', delivery: 'console', type: params.type },
      'Development OTP written to local console',
    );
    console.log(
      `[dev-email] to=${params.email} otp=${params.otp} type=${params.type}`,
    );
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: params.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    logger.error(
      { event: 'otp.email.failed', type: params.type, statusCode: res.status },
      'OTP email provider rejected the request',
    );
    throw new AppError(502, 'Verification email could not be sent');
  }

  logger.info(
    {
      event: 'otp.email.accepted',
      provider: 'resend',
      type: params.type,
      statusCode: res.status,
    },
    'OTP email accepted by Resend',
  );
}

export async function sendAuthLinkEmail(params: {
  email: string;
  subject: string;
  message: string;
  url: string;
}) {
  if (!env.RESEND_API_KEY) {
    throw new AppError(503, 'Security email delivery is unavailable');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: params.email,
      subject: params.subject,
      text: `${params.message}\n\n${params.url}\n\nIf you did not request this, you can ignore this email.`,
    }),
  });

  if (!response.ok) {
    logger.error(
      { event: 'auth.security_email.failed', statusCode: response.status },
      'Security email provider rejected the request',
    );
    throw new AppError(502, 'Security email could not be sent');
  }

  logger.info(
    { event: 'auth.security_email.accepted', statusCode: response.status },
    'Security email accepted by Resend',
  );
}

export async function sendStaffInviteEmail(params: {
  email: string;
  inviteUrl: string;
}) {
  const subject = 'You are invited to Thrift Nairobi staff';
  const text = [
    'You have been invited to join the Thrift Nairobi staff portal.',
    '',
    `Accept the invitation and set your password: ${params.inviteUrl}`,
    '',
    'This link expires in 24 hours and can only be used once.',
    'If you were not expecting this invitation, you can ignore this email.',
  ].join('\n');

  if (!env.RESEND_API_KEY) {
    throw new AppError(503, 'Staff invitations are unavailable');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: params.email,
      subject,
      text,
      html: `<p>You have been invited to join the Thrift Nairobi staff portal.</p><p><a href="${params.inviteUrl}">Accept invitation and set your password</a></p><p>This link expires in 24 hours and can only be used once.</p><p>If you were not expecting this invitation, ignore this email.</p>`,
    }),
  });

  if (!response.ok) {
    logger.error(
      { event: 'staff.invite.email.failed', statusCode: response.status },
      'Staff invitation email provider rejected the request',
    );
    throw new AppError(502, 'The invitation email could not be sent');
  }

  logger.info(
    {
      event: 'staff.invite.email.accepted',
      provider: 'resend',
      statusCode: response.status,
    },
    'Staff invitation email accepted by Resend',
  );
}
