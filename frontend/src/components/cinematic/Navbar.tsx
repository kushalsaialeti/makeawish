export const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent font-sans">
      {/* Logo - Top Left */}
      <div className="flex items-center">
        <h1 className="font-display italic text-2xl md:text-3xl text-white tracking-tight drop-shadow-md">
          Zine.<span className="text-pink-400 not-italic font-sans text-xs uppercase tracking-[0.24em] ml-1">Archive</span>
        </h1>
      </div>
      
      {/* Navigation Contents - Top Right */}
      <div className="flex items-center space-x-6 md:space-x-10">
        <div className="hidden md:flex items-center space-x-8 text-xs font-body font-bold tracking-[0.18em] text-white/70 uppercase">
          <a href="#" className="hover:text-white transition-colors">Archive</a>
          <a href="#" className="text-white border-b-2 border-pink-400 pb-1">Gallery</a>
          <a href="#" className="hover:text-white transition-colors">Submit</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-pink-300 transition-colors drop-shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
