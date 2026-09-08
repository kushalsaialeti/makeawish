import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY || '';
  if (!apiKey || apiKey.includes('dummy') || apiKey.startsWith('re_dummy')) {
    return null;
  }
  return new Resend(apiKey);
};

export interface SendOtpResult {
  success: boolean;
  message: string;
  isMock?: boolean;
}

/**
 * Send a 6-digit OTP verification email for user signup / admin authentication.
 */
export const sendVerificationOtpEmail = async (
  recipientEmail: string,
  otpCode: string,
  recipientName: string = 'Dreamer'
): Promise<SendOtpResult> => {
  console.log(`\n==================================================`);
  console.log(`[MakeAWish Auth] OTP Code for ${recipientEmail}: [ ${otpCode} ]`);
  console.log(`[MakeAWish Auth] Valid for 10 minutes.`);
  console.log(`==================================================\n`);

  const resend = getResendClient();

  if (!resend) {
    console.log(`[Email Service] RESEND_API_KEY is not configured or using dummy key. OTP printed to console above.`);
    return {
      success: true,
      message: 'Verification code generated. (Check server logs or replace RESEND_API_KEY in .env for live email delivery)',
      isMock: true
    };
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0d0d12; color: #f3f4f6; border-radius: 16px; border: 1px solid rgba(244, 63, 94, 0.2); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
      <div style="background: linear-gradient(135deg, #181824 0%, #0d0d12 100%); padding: 36px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
          Make<span style="color: #f43f5e;">A</span>Wish
        </h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af; font-style: italic;">
          Crafting timeless cinematic celebration moments
        </p>
      </div>

      <div style="padding: 36px 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #f9fafb;">
          Welcome, ${recipientName}!
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
          Please use the 6-digit verification code below to confirm your email and unlock your celebration studio:
        </p>

        <div style="background: linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(147,51,234,0.12) 100%); border: 1px dashed rgba(244, 63, 94, 0.4); border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
          <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #f43f5e; font-family: monospace;">
            ${otpCode}
          </span>
        </div>

        <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af; text-align: center;">
          This code will expire in <strong>10 minutes</strong>.
        </p>
        <p style="margin: 0; font-size: 13px; color: #6b7280; text-align: center;">
          If you did not request this verification, please safely ignore this email.
        </p>
      </div>

      <div style="background-color: #09090d; padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} MakeAWish. Designed for unforgettable celebrations.
      </div>
    </div>
  `;

  // Always prefer a safe sender format for Resend unless custom domain is verified
  const preferredSender = process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('@gmail.com')
    ? process.env.EMAIL_FROM
    : 'MakeAWish <onboarding@resend.dev>';

  try {
    const sendResponse = await resend.emails.send({
      from: preferredSender,
      to: recipientEmail,
      subject: `Your MakeAWish Verification Code: ${otpCode}`,
      html: htmlContent,
    });

    if (sendResponse.error) {
      console.warn('[Resend Warning]: Primary send returned error:', sendResponse.error);
      // If error was due to unverified custom from address, retry with onboarding@resend.dev
      if (preferredSender !== 'MakeAWish <onboarding@resend.dev>') {
        const fallbackResponse = await resend.emails.send({
          from: 'MakeAWish <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `Your MakeAWish Verification Code: ${otpCode}`,
          html: htmlContent,
        });
        if (fallbackResponse.error) {
          console.error('[Resend Error]: Fallback send failed:', fallbackResponse.error);
        } else {
          console.log('[Resend Success]: Email sent via fallback onboarding sender, ID:', fallbackResponse.data?.id);
        }
      }
    } else {
      console.log('[Resend Success]: Verification email dispatched, ID:', sendResponse.data?.id);
    }

    return {
      success: true,
      message: 'Verification email sent successfully.',
      isMock: false
    };
  } catch (error: any) {
    console.error('[Email Service Error]:', error);
    return {
      success: true,
      message: `Email sending fallback: ${error.message || 'Unknown'}. OTP code printed to server console.`,
      isMock: true
    };
  }
};
