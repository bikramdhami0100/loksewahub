export function buildSubscriptionConfirmationHtml(email: string, frequency: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Subscription Confirmed!</h1>
      </div>
      <div style="padding: 32px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Hello,</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          You've successfully subscribed to <strong>${frequency}</strong> notifications at <strong>${email}</strong>.
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          You'll receive the latest government notices, exam updates, and current affairs directly in your inbox.
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          You can unsubscribe at any time by clicking the unsubscribe link in any email you receive.
        </p>
        <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 24px;">
          Best regards,<br/><strong>LoksewaHub Team</strong>
        </p>
      </div>
    </div>
  `;
}
