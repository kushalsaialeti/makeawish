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
  isSandboxRestricted?: boolean;
  restrictedOwnerEmail?: string;
  otpCode?: string;
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
      isMock: true,
      otpCode,
    };
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0d0d12; color: #f3f4f6; border-radius: 16px; border: 1px solid rgba(244, 63, 94, 0.2); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
      <div style="background: linear-gradient(135deg, #181824 0%, #0d0d12 100%); padding: 36px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
          Make<span style="color: #f43f5e;">A</span>Wish
        </h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af; font-style: italic;">
          Crafting timeless celebration moments
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

  // Prefer configured sender or default onboarding@resend.dev
  const rawSender = (process.env.EMAIL_FROM || '').trim().replace(/^["']|["']$/g, '');
  const preferredSender = rawSender && !rawSender.includes('@gmail.com')
    ? rawSender
    : 'MakeAWish <onboarding@resend.dev>';

  try {
    const sendResponse = await resend.emails.send({
      from: preferredSender,
      to: recipientEmail,
      subject: `Your MakeAWish Verification Code: ${otpCode}`,
      html: htmlContent,
    });

    if (sendResponse.error) {
      console.warn('[Resend API Response]:', sendResponse.error);

      const errorMessage = sendResponse.error.message || '';
      const isSandboxRestriction = Boolean(
        sendResponse.error.statusCode === 403 ||
        errorMessage.includes('only send testing emails') ||
        errorMessage.includes('resend.com/domains')
      );

      if (isSandboxRestriction) {
        console.warn(`\n[Resend Sandbox Notice]: Cannot deliver live email to "${recipientEmail}" because onboarding@resend.dev only allows sending to account owner (kushalsaialeti98@gmail.com).`);
        console.warn(`[Resend Sandbox Notice]: To deliver to all email addresses, add & verify your custom domain at resend.com/domains.`);
        console.log(`[MakeAWish Auth] Verification OTP for ${recipientEmail}: [ ${otpCode} ]\n`);

        return {
          success: true,
          isSandboxRestricted: true,
          restrictedOwnerEmail: 'kushalsaialeti98@gmail.com',
          otpCode,
          message: `Resend sandbox note: onboarding@resend.dev only sends real emails to kushalsaialeti98@gmail.com. Verification code: ${otpCode}`,
        };
      }

      // Retry once if error was due to custom domain misconfig
      if (preferredSender !== 'MakeAWish <onboarding@resend.dev>') {
        const fallbackResponse = await resend.emails.send({
          from: 'MakeAWish <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `Your MakeAWish Verification Code: ${otpCode}`,
          html: htmlContent,
        });

        if (fallbackResponse.error) {
          console.error('[Resend Error]: Fallback send failed:', fallbackResponse.error);
          return {
            success: true,
            isSandboxRestricted: true,
            otpCode,
            message: `Verification code generated: ${otpCode}`,
          };
        } else {
          console.log('[Resend Success]: Email sent via fallback sender, ID:', fallbackResponse.data?.id);
        }
      }
    } else {
      console.log('[Resend Success]: Verification email dispatched directly to recipient inbox, ID:', sendResponse.data?.id);
    }

    return {
      success: true,
      message: 'A 6-digit verification code has been dispatched to your email.',
      isMock: false,
    };
  } catch (error: any) {
    console.error('[Email Service Exception]:', error);
    return {
      success: true,
      isSandboxRestricted: true,
      otpCode,
      message: `Verification code generated: ${otpCode}. (Check server console for details)`,
      isMock: true
    };
  }
};
