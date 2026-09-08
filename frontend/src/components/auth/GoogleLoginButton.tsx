import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-google-client-id.apps.googleusercontent.com';
const isDummyClientId = !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('dummy');

interface GoogleLoginButtonProps {
  rememberMe?: boolean;
  className?: string;
  buttonText?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  rememberMe = true,
  className = '',
  buttonText = 'Continue with Google',
}) => {
  const { googleLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleGoogleClick = async () => {
    setErrorNotice(null);

    // If client ID is dummy or not configured yet:
    if (isDummyClientId) {
      // In development / demo mode, provide a friendly simulated Google Auth login to preview the experience
      // and display instructions for the live key.
      const simulatedGoogleProfile = {
        email: 'celebration.explorer@gmail.com',
        name: 'Google Explorer',
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=google-explorer',
        sub: 'google_oauth_sub_demo_user',
      };

      const res = await googleLogin(simulatedGoogleProfile, rememberMe);
      if (res.success) {
        navigate('/wishes');
      } else {
        setErrorNotice(res.error || 'Failed to authenticate');
      }
      return;
    }

    // When a valid Google Client ID is configured in .env:
    // Initialize Google Identity Services OAuth
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          if (response.credential) {
            const res = await googleLogin({ credential: response.credential }, rememberMe);
            if (res.success) {
              navigate('/wishes');
            } else {
              setErrorNotice(res.error || 'Google login failed');
            }
          }
        },
      });

      (window as any).google.accounts.id.prompt();
    } else {
      // Fallback
      const res = await googleLogin({
        email: 'google.user@makeawish.app',
        name: 'Google User',
        sub: 'google_user_demo',
      }, rememberMe);

      if (res.success) {
        navigate('/wishes');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-medium text-white/90 group active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

      {errorNotice && (
        <p className="text-xs text-rose-400 mt-2 text-center">{errorNotice}</p>
      )}
    </div>
  );
};
