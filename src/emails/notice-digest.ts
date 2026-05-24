export function buildNoticeDigestHtml(
  name: string,
  notices: Array<{ title: string; url: string; date: string }>
): string {
  const noticeItems = notices
    .map((n) => `
      <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
        <a href="${n.url}" style="font-size: 14px; color: #2563eb; text-decoration: none; font-weight: 500;">
          ${n.title}
        </a>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">${n.date}</div>
      </div>
    `).join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Daily Notice Digest</h1>
        <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 14px;">Today's government notices</p>
      </div>
      <div style="padding: 32px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
        <p style="font-size: 14px; color: #6b7280;">Here are the latest government notices published today:</p>
        <div style="margin: 24px 0;">
          ${noticeItems || '<p style="color: #9ca3af; font-size: 14px;">No new notices today.</p>'}
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://loksewahub.com"}/notices"
           style="display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          View All Notices
        </a>
        <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;">
          You're receiving this because you subscribed to daily notice digests.
        </p>
      </div>
    </div>
  `;
}
