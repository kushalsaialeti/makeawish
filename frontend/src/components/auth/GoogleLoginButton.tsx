import React, { useState } from 'react';

interface GoogleLoginButtonProps {
  rememberMe?: boolean;
  className?: string;
  buttonText?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  className = '',
  buttonText = 'Continue with Google (Coming Soon)',
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  const handleGoogleClick = () => {
    setNotice('Google OAuth sign-in & sign-up are coming in a future update. Please authenticate using Email + OTP + 4-Digit Security PIN.');
    setTimeout(() => {
      setNotice(null);
    }, 6000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={handleGoogleClick}
        className={`w-full py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-medium text-white/70 group active:scale-[0.99] cursor-pointer ${className}`}
      >
        <svg className="w-5 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
          />
        </svg>
        <span>{buttonText}</span>
      </button>

      {notice && (
        <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-body animate-fadeIn">
          {notice}
        </div>
      )}
    </div>
  );
};
