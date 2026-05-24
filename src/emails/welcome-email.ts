export function buildWelcomeEmailHtml(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to LoksewaHub!</h1>
        <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 14px;">Nepal's Government Exam Preparation Platform</p>
      </div>
      <div style="padding: 32px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          Thank you for joining LoksewaHub! We're excited to help you prepare for your government exams.
        </p>
        <div style="margin: 24px 0;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f3f4f6; border-radius: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">📋</span>
            <span style="font-size: 14px; color: #374151;">Browse all government notices in one place</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f3f4f6; border-radius: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">📚</span>
            <span style="font-size: 14px; color: #374151;">Access study notes and syllabus</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f3f4f6; border-radius: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">🤖</span>
            <span style="font-size: 14px; color: #374151;">Use AI tutor for personalized learning</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f3f4f6; border-radius: 8px;">
            <span style="font-size: 20px;">📝</span>
            <span style="font-size: 14px; color: #374151;">Take mock tests and track your progress</span>
          </div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://loksewahub.com"}/notes"
           style="display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Start Learning Now
        </a>
        <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 24px;">
          Best regards,<br/><strong>LoksewaHub Team</strong>
        </p>
      </div>
    </div>
  `;
}
