import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { ScrapbookHero } from './components/cinematic/ScrapbookHero';
import { ZineArchive } from './components/cinematic/ZineArchive';
import { CoverflowGallery } from './components/cinematic/CoverflowGallery';
import { ZineSplitShowcase } from './components/cinematic/ZineSplitShowcase';
import { AdminDashboard } from './pages/AdminDashboard';
import { SplashSequence } from './components/cinematic/SplashSequence';
import { useCmsStore } from './store/cmsStore';
import { Memories } from './pages/Memories';

function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const { fetchCmsContent } = useCmsStore();

  useEffect(() => {
    // Initial fetch
    fetchCmsContent();
    
    // Poll for updates every 3 seconds so admin changes appear immediately
    // without needing to refresh the page.
    const interval = setInterval(() => {
      fetchCmsContent();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [fetchCmsContent]);

  if (showSplash) {
    return <SplashSequence onComplete={() => setShowSplash(false)} />;
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#151111] text-[#e6d0d2] font-mono selection:bg-[#7a1022] selection:text-[#f3d3d3]">
        <div className="relative">
          <ScrapbookHero />
          <ZineSplitShowcase />
          <ZineArchive />
          <CoverflowGallery />
          <Memories />
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
