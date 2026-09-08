import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Eyebrow } from '../ui/Typography';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151111] text-[#e6d0d2] flex flex-col items-center justify-center gap-4 p-6 select-none font-sans">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-600/20 border border-pink-500/30 flex items-center justify-center text-2xl animate-spin">
          ✨
        </div>
        <Eyebrow accent>AUTHENTICATING SESSION</Eyebrow>
        <p className="font-display italic text-2xl text-white animate-pulse">
          Opening Your Celebration Studio...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
