import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { ScrapbookHero } from './components/cinematic/ScrapbookHero';
import { ZineArchive } from './components/cinematic/ZineArchive';
import { CoverflowGallery } from './components/cinematic/CoverflowGallery';
import { ZineSplitShowcase } from './components/cinematic/ZineSplitShowcase';
import { AdminDashboard } from './pages/AdminDashboard';
import { SplashSequence } from './components/cinematic/SplashSequence';
import { useCmsStore } from './store/cmsStore';
import { useAuthStore } from './store/authStore';
import { Memories } from './pages/Memories';
import { GiftSequence } from './components/cinematic/GiftSequence';
import { Navigation } from './components/Navigation';
import { useKeepAlive } from './hooks/useKeepAlive';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Eyebrow, Handwritten } from './components/ui/Typography';

function WishView({ phase = 'unlock' }: { phase?: 'unlock' | 'prepare' | 'gift' | 'experience' }) {
  const { slug } = useParams<{ slug: string }>();
  const { fetchWishBySlug, subscribeToWish, scrapbookHero, isLoading, error, isUnlocked } = useCmsStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (slug && slug !== 'undefined') {
      fetchWishBySlug(slug);
      const unsubscribe = subscribeToWish(slug);
      return () => unsubscribe();
    }
  }, [slug, fetchWishBySlug, subscribeToWish]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-3">
      <Eyebrow accent>PREPARING EXPERIENCE</Eyebrow>
      <div className="font-display italic text-3xl md:text-4xl text-[#f5f1e8] animate-pulse">
        Loading Magic...
      </div>
    </div>
  );

  if (error || !scrapbookHero) return (
    <NotFound 
      title="Wish Not Found" 
      message="We couldn't find this magical birthday wish. It may have expired or the link might be misspelled." 
    />
  );

  // If they are on /:slug with no phase, redirect to correct starting point
  if (location.pathname === `/${slug}`) {
    if (isUnlocked) {
      return <Navigate to={`/${slug}/experience`} replace />;
    } else {
      return <Navigate to={`/${slug}/unlock`} replace />;
    }
  }

  if (phase === 'unlock') {
    return <SplashSequence onComplete={() => navigate(`/${slug}/prepare`)} />;
  }

  if (phase === 'prepare') {
    return <SplashSequence onComplete={() => navigate(`/${slug}/gift`)} skipToPrompt />;
  }

  if (phase === 'gift') {
    return <GiftSequence onComplete={() => navigate(`/${slug}/experience`)} />;
  }

  return <Home slug={slug || ''} />;
}

function Home({ slug }: { slug: string }) {
  const navigate = useNavigate();
  
  return (
    <SmoothScroll>
      <Navigation />
      <main className="min-h-screen bg-[#151111] text-[#e6d0d2] font-sans selection:bg-[#7a1022] selection:text-[#f3d3d3]">
        <div className="relative">
          <ScrapbookHero />
          <ZineSplitShowcase />
          <ZineArchive />
          <CoverflowGallery />

          {/* Revisit Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 text-center bg-gradient-to-b from-transparent via-[#1a1515] to-[#151111] relative">
            <div className="max-w-4xl mx-auto flex flex-col items-center mb-10 sm:mb-14">
              <Eyebrow accent className="mb-3">A MOMENT TO REMEMBER</Eyebrow>
              <h2 className="font-display italic text-display-md text-[#f5f1e8]">
                Revisit the Magic
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
              <motion.button
                whileHover={{ scale: 1.04, rotate: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/${slug}/gift`)}
                className="group relative w-56 sm:w-64 aspect-[4/5] bg-white p-3 pb-12 shadow-2xl rotate-[-2deg] transition-all rounded-sm"
              >
                <div className="w-full h-full bg-gray-200 overflow-hidden relative rounded-sm">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors z-10">
                      <span className="text-white font-body font-black tracking-[0.2em] text-xs uppercase bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                        WATCH AGAIN
                      </span>
                   </div>
                   <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400" className="w-full h-full object-cover" alt="Video" />
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center">
                  <Handwritten color="#5c381c" className="text-sm">The Surprise Video</Handwritten>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, rotate: 2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/${slug}/gift`)}
                className="group relative w-56 sm:w-64 aspect-[4/5] bg-[#faf6ee] p-4 pb-12 shadow-2xl rotate-[2deg] transition-all rounded-sm border border-[#e2dac8]"
              >
                <div className="w-full h-full border border-amber-900/10 flex items-center justify-center p-4 relative rounded-sm paper-texture">
                   <p className="text-[#3d2b1a]/50 font-handwriting text-base leading-relaxed text-center overflow-hidden h-full">
                      "I only want you to be happy, and I am wishing you all the happiness in the world on this special day. You mean everything to me..."
                   </p>
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-[#2d1e11] font-body font-black tracking-[0.2em] text-xs uppercase bg-[#faf6ee]/90 px-4 py-2 rounded-lg shadow-md border border-[#d4c8a8]">
                        READ LETTER
                      </span>
                   </div>
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center">
                  <Handwritten color="#5c381c" className="text-sm">A Love Note</Handwritten>
                </div>
              </motion.button>
            </div>
          </section>
        </div>
        
        <footer className="bg-[#151111] w-full py-10 sm:py-14 px-4 sm:px-6 md:px-16 border-t border-white/10 text-center flex flex-col items-center gap-3">
          <Eyebrow>MAKE A WISH STORYBOOK</Eyebrow>
          <p className="font-display italic text-xl md:text-2xl text-[#f5f1e8]/90 max-w-xl leading-relaxed">
            Wishing you the happiest of birthdays and a year filled with wonderful memories. ✨
          </p>
        </footer>
      </main>
    </SmoothScroll>
  );
}

import { AdminAuth } from './pages/AdminAuth';
import { AdminConsole } from './pages/AdminConsole';

function AdminRoute() {
  const { isAdmin } = useAuthStore();
  const savedAdminToken = sessionStorage.getItem('makeawish_admin_token');

  if (isAdmin || savedAdminToken) {
    return <AdminConsole />;
  }

  return <AdminAuth />;
}

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-3">
        <Eyebrow accent>STARTING CELEBRATION STUDIO</Eyebrow>
        <div className="font-display italic text-3xl md:text-4xl text-[#f5f1e8] animate-pulse">
          Loading Magic...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/wishes" replace />;
  }

  return <Login />;
}

function App() {
  useKeepAlive();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <BrowserRouter>
        <Routes>
          {/* Main Launch Route: Login page / Auto-redirect to /wishes if authenticated */}
          <Route path="/" element={<RootRoute />} />

          {/* Authentication Routes for Normal Users */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Secret Super Admin Route (Passcode 1622 + Admin OTP Verification) */}
          <Route path="/admin-1622/*" element={<AdminRoute />} />
          <Route path="/admin-1622" element={<AdminRoute />} />
          <Route path="/admin" element={<Navigate to="/admin-1622" replace />} />
          <Route path="/admin/*" element={<Navigate to="/admin-1622" replace />} />

          {/* Protected Creator Studio Routes for Normal Users */}
          <Route path="/wishes/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          
          {/* Public Recipient Experience Phases - Publicly viewable without login */}
          <Route path="/:slug/unlock" element={<WishView phase="unlock" />} />
          <Route path="/:slug/prepare" element={<WishView phase="prepare" />} />
          <Route path="/:slug/gift" element={<WishView phase="gift" />} />
          <Route path="/:slug/experience" element={<WishView phase="experience" />} />
          <Route path="/:slug/memories" element={<SmoothScroll><Memories /></SmoothScroll>} />
          <Route path="/:slug" element={<WishView />} />

          {/* Compatibility routes */}
          <Route path="/wish/:slug" element={<Navigate to="/:slug" replace />} />
          <Route path="/wish/:slug/memories" element={<Navigate to="/:slug/memories" replace />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

