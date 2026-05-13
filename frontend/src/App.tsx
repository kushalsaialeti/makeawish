import { useState, useEffect } from 'react';
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
import { Memories } from './pages/Memories';
import { GiftSequence } from './components/cinematic/GiftSequence';
import { Navigation } from './components/Navigation';
import { useKeepAlive } from './hooks/useKeepAlive';

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
    <div className="min-h-screen bg-[#1c1917] flex items-center justify-center">
      <div className="text-white font-serif italic text-2xl animate-pulse">Loading Magic...</div>
    </div>
  );

  if (error || !scrapbookHero) return (
    <div className="min-h-screen bg-[#1c1917] flex items-center justify-center">
      <div className="text-white/40 font-serif italic text-xl">Wish not found or expired.</div>
    </div>
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

  return <Home slug={slug} />;
}

function Home({ slug }: { slug: string }) {
  const navigate = useNavigate();
  
  return (
    <SmoothScroll>
      <Navigation />
      <main className="min-h-screen bg-[#151111] text-[#e6d0d2] font-mono selection:bg-[#7a1022] selection:text-[#f3d3d3]">
        <div className="relative">
          <ScrapbookHero />
          <ZineSplitShowcase />
          <ZineArchive />
          <CoverflowGallery />

          {/* Revisit Section */}
          <section className="py-20 px-6 md:px-16 text-center bg-gradient-to-b from-transparent to-[#1a1616]">
            <h2 className="text-3xl font-black mb-12 uppercase tracking-[0.4em] text-white/40">Revisit the Magic</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                onClick={() => navigate(`/${slug}/gift`)}
                className="group relative w-64 aspect-[4/5] bg-white p-4 pb-12 shadow-2xl rotate-[-2deg] transition-transform"
              >
                <div className="w-full h-full bg-gray-200 overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                      <span className="text-white font-black tracking-widest text-lg">WATCH AGAIN</span>
                   </div>
                   <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400" className="w-full h-full object-cover" alt="Video" />
                </div>
                <div className="absolute bottom-4 left-0 w-full font-serif italic text-gray-400">The Surprise</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 2 }}
                onClick={() => navigate(`/${slug}/gift`)}
                className="group relative w-64 aspect-[4/5] bg-[#fdfaf3] p-4 pb-12 shadow-2xl rotate-[2deg] transition-transform"
              >
                <div className="w-full h-full border border-amber-100 flex items-center justify-center p-4">
                   <div className="absolute inset-0 flex items-center justify-center bg-amber-900/10 group-hover:bg-transparent transition-colors z-10" />
                   <p className="text-amber-900/40 font-serif italic text-sm leading-relaxed text-center overflow-hidden h-full">
                      "I only want you to be happy, and I am wishing you all the happiness in the world on this special day. You mean everything to me..."
                   </p>
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-amber-900 font-black tracking-widest text-lg bg-white/80 px-4 py-2">READ LETTER</span>
                   </div>
                </div>
                <div className="absolute bottom-4 left-0 w-full font-serif italic text-amber-900/40">A Love Note</div>
              </motion.button>
            </div>
          </section>
        </div>
        
        <footer className="bg-[#151111] w-full py-6 px-6 md:px-16 border-t border-white/10 text-center">
          <p className="text-[#e6d0d2] font-serif italic text-lg opacity-80">
            Wishing you the happiest of birthdays and a year filled with wonderful memories! ✨
          </p>
        </footer>
      </main>
    </SmoothScroll>
  );
}

function App() {
  useKeepAlive();
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* User Wish Experience Phases - Ordered by flow */}
          <Route path="/:slug/unlock" element={<WishView phase="unlock" />} />
          <Route path="/:slug/prepare" element={<WishView phase="prepare" />} />
          <Route path="/:slug/gift" element={<WishView phase="gift" />} />
          <Route path="/:slug/experience" element={<WishView phase="experience" />} />
          <Route path="/:slug/memories" element={<SmoothScroll><Memories /></SmoothScroll>} />
          <Route path="/:slug" element={<WishView />} />
          {/* Compatibility routes */}
          <Route path="/wish/:slug" element={<Navigate to="/:slug" replace />} />
          <Route path="/wish/:slug/memories" element={<Navigate to="/:slug/memories" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
