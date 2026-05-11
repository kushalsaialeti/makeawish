import React from 'react';

export const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
      {/* Logo - Top Left */}
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-black text-white tracking-[0.2em] uppercase drop-shadow-md">
          ZINE.MUSEUM
        </h1>
      </div>
      
      {/* Navigation Contents - Top Right */}
      <div className="flex items-center space-x-6 md:space-x-10">
        <div className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.15em] text-white/80 uppercase">
          <a href="#" className="hover:text-white transition-colors">Archive</a>
          <a href="#" className="text-white border-b border-white pb-1">Gallery</a>
          <a href="#" className="hover:text-white transition-colors">Submit</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-[#f3d4d6] transition-colors drop-shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="text-white hover:text-[#f3d4d6] transition-colors drop-shadow-md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
