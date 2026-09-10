import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Brand Logo Click: always scroll to hero section / starting of landing page
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isLandingPage) {
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      // Allow route change to commit then scroll to hero
      setTimeout(() => {
        const heroElement = document.getElementById('hero');
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    }
  };

  // Jump to section handler (works from both Landing Page and other pages)
  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isLandingPage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const handlePrimaryCta = () => {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate('/wishes');
    } else {
      navigate('/signup');
    }
  };

  // Styling logic: on landing page, transparent until scrolled; on other pages, always solid frosted glass
  const isGlassHeader = !isLandingPage || scrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isGlassHeader 
          ? 'bg-[#151111]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)]' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo - Clicking takes user straight to Hero Section */}
        <a 
          href="/#hero"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group cursor-pointer select-none"
          title="Make A Wish - Return to Top"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display italic text-2xl md:text-3xl text-[#f5f1e8] tracking-tight-display group-hover:text-pink-300 transition-colors">
              Make A Wish
            </span>
            <span className="font-body text-metadata tracking-widest-cinematic text-white/40 -mt-1">
              Celebration Studio
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="/#how-it-works" 
            onClick={(e) => handleSectionClick(e, 'how-it-works')}
            className="font-body text-eyebrow tracking-wider-eyebrow text-white/65 hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </a>
          <a 
            href="/#features" 
            onClick={(e) => handleSectionClick(e, 'features')}
            className="font-body text-eyebrow tracking-wider-eyebrow text-white/65 hover:text-white transition-colors cursor-pointer"
          >
            Features
          </a>
          <a 
            href="/#interactive-demo" 
            onClick={(e) => handleSectionClick(e, 'interactive-demo')}
            className="font-body text-eyebrow tracking-wider-eyebrow text-white/65 hover:text-white transition-colors cursor-pointer"
          >
            Live Demo
          </a>
          <a 
            href="/#occasions" 
            onClick={(e) => handleSectionClick(e, 'occasions')}
            className="font-body text-eyebrow tracking-wider-eyebrow text-white/65 hover:text-white transition-colors cursor-pointer"
          >
            Occasions
          </a>
          <a 
            href="/#creator-studio" 
            onClick={(e) => handleSectionClick(e, 'creator-studio')}
            className="font-body text-eyebrow tracking-wider-eyebrow text-white/65 hover:text-white transition-colors cursor-pointer"
          >
            Studio
          </a>
        </nav>

        {/* Desktop CTAs & Auth Controls */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="font-body font-bold text-xs text-white leading-tight">
                  {user?.name || user?.email?.split('@')[0] || 'Storyteller'}
                </p>
                <p className="font-body text-[10px] text-pink-400 uppercase tracking-widest">Creator Studio</p>
              </div>

              {location.pathname !== '/wishes' && !location.pathname.startsWith('/wishes') && (
                <button
                  onClick={() => navigate('/wishes')}
                  className="bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-xl font-body font-bold text-xs uppercase tracking-wider-eyebrow border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-pink-400" />
                  <span>My Wishes</span>
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="text-white/40 hover:text-white/80 font-body text-metadata tracking-wider transition-colors px-2 py-1 cursor-pointer flex items-center gap-1.5"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-white/70 hover:text-white font-body text-eyebrow tracking-wider-eyebrow px-3 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrimaryCta}
                className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-5 py-2.5 rounded-xl font-body font-black text-xs uppercase tracking-wider-eyebrow shadow-[0_4px_20px_rgba(244,63,94,0.35)] hover:shadow-[0_6px_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Create Your Wish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-[#1a1414] border-b border-white/10 px-6 py-6 space-y-4"
          >
            <div className="flex flex-col space-y-3 pb-4 border-b border-white/10">
              <a 
                href="/#hero" 
                onClick={handleLogoClick}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/80 hover:text-white py-1 flex items-center justify-between"
              >
                <span>Home (Hero)</span>
                <span className="text-pink-400 text-xs">↑</span>
              </a>
              <a 
                href="/#how-it-works" 
                onClick={(e) => handleSectionClick(e, 'how-it-works')}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/70 hover:text-white py-1"
              >
                How It Works
              </a>
              <a 
                href="/#features" 
                onClick={(e) => handleSectionClick(e, 'features')}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/70 hover:text-white py-1"
              >
                Features
              </a>
              <a 
                href="/#interactive-demo" 
                onClick={(e) => handleSectionClick(e, 'interactive-demo')}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/70 hover:text-white py-1"
              >
                Live Demo
              </a>
              <a 
                href="/#occasions" 
                onClick={(e) => handleSectionClick(e, 'occasions')}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/70 hover:text-white py-1"
              >
                Occasions
              </a>
              <a 
                href="/#creator-studio" 
                onClick={(e) => handleSectionClick(e, 'creator-studio')}
                className="font-body text-eyebrow tracking-wider-eyebrow text-white/70 hover:text-white py-1"
              >
                Creator Studio
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/wishes');
                    }}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3.5 rounded-xl font-body font-black text-xs uppercase tracking-wider-eyebrow shadow-lg flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Studio Dashboard</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-white/5 border border-white/10 text-white/80 py-3 rounded-xl font-body font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-white/50" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePrimaryCta}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3.5 rounded-xl font-body font-black text-xs uppercase tracking-wider-eyebrow shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Create Your Wish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white/80 py-3 rounded-xl font-body font-bold text-xs uppercase tracking-wider"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
