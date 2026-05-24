export function buildContactConfirmationHtml(name: string, subject: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us</h1>
      </div>
      <div style="padding: 32px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          We've received your message regarding <strong>"${subject}"</strong>. Our team will review it and get back to you within 24-48 hours.
        </p>
        <p style="font-size: 14px; color: #6b7280;">If you have urgent inquiries, please visit our FAQ page.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://loksewahub.com"}/faq"
           style="display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Visit FAQ
        </a>
        <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 24px;">
          Best regards,<br/><strong>LoksewaHub Team</strong>
        </p>
      </div>
    </div>
  `;
}
