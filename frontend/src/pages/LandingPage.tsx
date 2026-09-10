import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Share2, 
  Gift, 
  FileText, 
  Tv, 
  Layers, 
  Smile, 
  KeyRound, 
  CalendarDays, 
  Film 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { 
  Eyebrow, 
  Display, 
  Body, 
  Quote, 
  Handwritten, 
  DisplayBackground 
} from '../components/ui/Typography';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Primary Action Button Handler
  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate('/wishes');
    } else {
      navigate('/login');
    }
  };

  const handleSignInAction = () => {
    if (isAuthenticated) {
      navigate('/wishes');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#151111] text-[#f5f1e8] font-sans selection:bg-[#7a1022] selection:text-[#f3d3d3] overflow-x-hidden relative">
      {/* Dynamic Background Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection id="hero" onPrimaryClick={handlePrimaryAction} />
        <WhyMakeAWishSection />
        <FivePhaseSection />
        <EditorialFeatureShowcase />
        <InteractivePlayground />
        <CreatorStudioShowcase onPrimaryClick={handlePrimaryAction} />
        <SevenChapterEditorSection />
        <PersonalizationSection />
        <OccasionSection onPrimaryClick={handlePrimaryAction} />
        <NoFrictionSection />
        <SecuritySection />
        <LinkReliabilitySection />
        <EmotionalProgressionSection />
        <BenefitsSection />
        <FinalCTASection onPrimaryClick={handlePrimaryAction} />
      </main>

      {/* Footer */}
      <Footer onPrimaryClick={handlePrimaryAction} onSignInClick={handleSignInAction} />
    </div>
  );
};

// ==========================================
// 2. HERO SECTION & ANIMATED SIMULATOR
// ==========================================
const HeroSection: React.FC<{ id?: string, onPrimaryClick: () => void }> = ({ id, onPrimaryClick }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const stages = [
    {
      id: 'anticipate',
      tag: 'STAGE 01',
      title: 'The Silent Teaser',
      subtitle: 'A dark mystery screen sets the scene',
      icon: Lock,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-[#110d0d] to-[#181212]">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/25 flex items-center justify-center mb-4 text-pink-400">
            <Lock className="w-5 h-5" />
          </div>
          <Eyebrow accent className="mb-2">A Secret Keepsake Awaits</Eyebrow>
          <Display size="md" italic className="text-2xl sm:text-3xl text-white">
            "Something special was curated just for you."
          </Display>
          <Body size="sm" variant="emotional" className="text-white/40 mt-3 mx-auto">
            The moment begins before anything is revealed.
          </Body>
        </div>
      )
    },
    {
      id: 'countdown',
      tag: 'STAGE 02',
      title: 'The Live Countdown',
      subtitle: 'Anticipation builds as every second ticks',
      icon: CalendarDays,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-[#151010] to-[#1f1515]">
          <Eyebrow className="mb-3">UNTIL YOUR MOMENT ARRIVES</Eyebrow>
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            <div>
              <div className="font-display italic text-3xl sm:text-4xl text-white">03</div>
              <div className="font-body text-metadata text-pink-400">Days</div>
            </div>
            <span className="font-display text-xl text-pink-400/50">:</span>
            <div>
              <div className="font-display italic text-3xl sm:text-4xl text-white">14</div>
              <div className="font-body text-metadata text-pink-400">Hours</div>
            </div>
            <span className="font-display text-xl text-pink-400/50">:</span>
            <div>
              <div className="font-display italic text-3xl sm:text-4xl text-white">27</div>
              <div className="font-body text-metadata text-pink-400">Mins</div>
            </div>
          </div>
          <Body size="sm" className="text-white/40 mt-4">
            Zero count triggers an automatic celebration blast.
          </Body>
        </div>
      )
    },
    {
      id: 'passcode',
      tag: 'STAGE 03',
      title: 'Secret Date Passcode',
      subtitle: 'Protected by personal milestones only they know',
      icon: KeyRound,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6 bg-[#161212]">
          <div className="text-center mb-3">
            <Eyebrow accent className="mb-1">SECRET ACCESS KEY</Eyebrow>
            <Display size="md" italic as="h5" className="text-lg sm:text-xl text-white">
              Enter our special date (MM • DD • YYYY)
            </Display>
          </div>
          <div className="grid grid-cols-3 gap-1.5 w-48 sm:w-56 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'ENTER'].map((key, i) => (
              <div 
                key={i} 
                className="h-8 sm:h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white/80 shadow-sm"
              >
                {key}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 font-body text-metadata text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passcode verified: Access Granted</span>
          </div>
        </div>
      )
    },
    {
      id: 'quiz',
      tag: 'STAGE 04',
      title: 'The Inside Joke Quiz',
      subtitle: 'Gamified questions that spark laughter',
      icon: Smile,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-[#181113] to-[#241519]">
          <Eyebrow accent className="mb-1">QUESTION 01 • OUR STORY</Eyebrow>
          <Display size="md" italic as="h4" className="text-xl sm:text-2xl text-white mb-4">
            "Who actually fell asleep during our favorite movie?"
          </Display>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <div className="p-2.5 bg-gradient-to-r from-pink-600/80 to-rose-600/80 rounded-xl font-body text-xs font-bold text-white shadow-md flex items-center justify-between px-4">
              <span>You did! (Obviously) 🙈</span>
              <span className="text-xs">✓</span>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl font-body text-xs text-white/60">
              I did (I was tired!)
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reveal',
      tag: 'STAGE 05',
      title: 'Surprise Video Unboxing',
      subtitle: 'Cinema-grade video reveal with film grain',
      icon: Film,
      content: (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black p-4 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80" 
            alt="Surprise Video" 
            className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125"
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.8)] mb-3 animate-pulse">
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
            <span className="font-body font-black text-eyebrow tracking-widest-cinematic text-white">
              The Surprise Video Message
            </span>
            <Handwritten color="#ffd1dc" className="text-sm mt-1">
              "Click to play dedicated memory"
            </Handwritten>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[10px] text-white/50">
            <span>02:45 / 02:45</span>
            <span>HD • STEREO AUDIO</span>
          </div>
        </div>
      )
    },
    {
      id: 'letter',
      tag: 'STAGE 06',
      title: 'Vintage Parchment Letter',
      subtitle: 'Handwritten calligraphy that will be kept forever',
      icon: FileText,
      content: (
        <div className="w-full h-full bg-[#faf5ea] p-5 sm:p-6 text-left relative flex flex-col justify-between overflow-hidden shadow-inner paper-texture">
          <div className="border-b border-[#8a6b4f]/20 pb-2 flex justify-between items-center">
            <span className="font-display italic text-xl sm:text-2xl text-[#2d1e11]">A Special Dedication</span>
            <span className="font-body text-metadata text-[#8a6b4f] tracking-wider">Chapter 04</span>
          </div>
          <Handwritten color="#2d1e11" className="text-base sm:text-lg leading-relaxed my-2">
            "I wanted to build something that wouldn't just vanish into a chat stream. You have brought so much light, laughter and warmth into my world. Here is to all our chapters ahead..."
          </Handwritten>
          <div className="pt-2 border-t border-[#8a6b4f]/20 text-right">
            <Handwritten color="#2d1e11" className="text-base font-bold">
              With all my heart & soul ❤️
            </Handwritten>
          </div>
        </div>
      )
    },
    {
      id: 'memories',
      tag: 'STAGE 07',
      title: 'Retro TV & Memory Wall',
      subtitle: 'Interactive 3D flip polaroids & CRT slideshows',
      icon: Tv,
      content: (
        <div className="w-full h-full bg-[#120e0e] p-4 flex flex-col items-center justify-center text-center relative">
          <div className="w-full max-w-xs aspect-[16/10] bg-zinc-900 border-2 border-zinc-700 rounded-xl p-2 relative shadow-2xl flex items-center justify-center">
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
            <img 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80" 
              alt="Memory Reel" 
              className="w-full h-full object-cover rounded filter sepia-[0.2] contrast-125"
            />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[8px] text-pink-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span>LIVE CRT REEL</span>
            </div>
          </div>
          <Handwritten color="#fef08a" className="text-xs mt-2">
            "Tap polaroids to flip and read memories"
          </Handwritten>
        </div>
      )
    }
  ];

  // Auto-cycle stages every 4.5 seconds if enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, stages.length]);

  return (
    <section id={id || "hero"} className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 md:px-12 overflow-hidden border-b border-white/10">
      {/* Background Watermark Headline */}
      <DisplayBackground text="EXPERIENCE" className="top-[12%] opacity-35" />

      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] bg-gradient-to-b from-pink-600/15 via-rose-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Emotional Pitch & Staggered Hero Display Typography */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Eyebrow accent className="mb-4 text-xs">
                ✦ A DIGITAL CELEBRATION, REIMAGINED ✦
              </Eyebrow>

              {/* Two-line signature staggered display heading aligned with ScrapbookHero */}
              <div className="mb-6">
                <h1 className="font-display italic text-display-hero text-[#f5f1e8] drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] tracking-[-0.045em] leading-hero">
                  Some Wishes Are Meant
                </h1>
                <h2 className="font-display italic text-display-hero text-pink-200/95 -mt-2 sm:-mt-4 md:-mt-6 drop-shadow-[0_15px_35px_rgba(122,16,34,0.6)] tracking-[-0.045em] leading-hero">
                  To Be Experienced.
                </h2>
              </div>

              <Body size="lg" variant="editorial" className="mb-8 max-w-xl mx-auto lg:mx-0">
                Don't just send a wish. Create an experience they'll remember. Turn your memories, messages, photos and videos into a celebration they'll never forget.
              </Body>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onPrimaryClick}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl font-body font-black text-xs sm:text-sm uppercase tracking-wider-eyebrow shadow-[0_10px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.6)] transition-all cursor-pointer flex items-center justify-center gap-3 group"
                >
                  <span>Create Your Own Wish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-7 py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-wider-eyebrow border border-white/15 transition-all text-center"
                >
                  Explore The Experience ↓
                </a>
              </div>

              {/* Zero-Friction Feature Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 font-body text-eyebrow tracking-wider text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>No Recipient Signup</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 font-body text-eyebrow tracking-wider text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>No App Download</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 font-body text-eyebrow tracking-wider text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>One Shareable Link</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: The Simulated Recipient Journey Experience */}
          <div className="lg:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl sm:rounded-[2.5rem] bg-[#1a1515] p-3 sm:p-5 border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Simulator Chrome Bar */}
              <div className="flex items-center justify-between pb-3 px-3 border-b border-white/10 mb-3 font-mono text-[11px] text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-white/60 font-bold">makeawish.app/special-one</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-metadata text-pink-400 font-bold">
                    Recipient Flow Preview
                  </span>
                </div>
              </div>

              {/* Stage Viewport */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-black/90 border border-white/10 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stages[activeStage].id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45 }}
                    className="w-full h-full"
                  >
                    {stages[activeStage].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stage Selector Ribbon */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-metadata tracking-widest text-white/40">
                    Interactive Journey Stages ({activeStage + 1}/{stages.length})
                  </span>
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="font-body text-metadata text-pink-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoPlaying ? 'Pause Auto' : 'Auto Play'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {stages.map((st, idx) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setActiveStage(idx);
                        setIsAutoPlaying(false);
                      }}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activeStage === idx 
                          ? 'bg-pink-600/25 border border-pink-500/50 text-white' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/5 text-white/40'
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold">0{idx + 1}</span>
                      <span className="font-body text-[8px] uppercase tracking-wider truncate max-w-full hidden sm:inline">
                        {st.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. WHY MAKE A WISH — THE PARADIGM SHIFT
// ==========================================
const WhyMakeAWishSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#1a1414] to-[#151111] border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Eyebrow accent className="mb-3">THE PARADIGM SHIFT</Eyebrow>
          <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
            BECAUSE “HAPPY BIRTHDAY” ISN'T ALWAYS ENOUGH.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Every year, meaningful moments get lost in standard messenger bubbles, generic greeting cards, or social media tags that disappear in 24 hours. Make A Wish turns a celebration into an enduring memory.
          </Body>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
          
          {/* Card 1: Traditional */}
          <div className="rounded-3xl bg-[#120e0e] border border-white/10 p-6 sm:p-10 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="font-body text-eyebrow font-black tracking-widest-cinematic text-white/40">
                  TRADITIONAL DIGITAL WISH
                </span>
                <span className="font-body text-metadata text-red-400 bg-red-950/40 px-2.5 py-1 rounded-full border border-red-500/20">
                  Flat & Generic
                </span>
              </div>

              {/* Chat Bubble Mockup */}
              <div className="bg-[#1e1919] p-4 rounded-2xl border border-white/5 mb-6 max-w-sm">
                <p className="font-body text-metadata text-white/40 mb-1">Today at 9:02 AM</p>
                <div className="bg-white/10 p-3 rounded-xl font-body text-sm text-white/80">
                  "Happy birthday! Hope you have a great day! 🎂🎉"
                </div>
              </div>

              <ul className="space-y-3 font-body text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 text-base">✕</span>
                  <span>Sent in seconds, forgotten in minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 text-base">✕</span>
                  <span>No anticipation, no mystery, no narrative build</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 text-base">✕</span>
                  <span>Cannot hold videos, quizzes, letters, or photo walls</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 text-base">✕</span>
                  <span>Buried under hundreds of identical chat notifications</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8 text-center font-body text-metadata text-white/30 tracking-widest">
              Outcome: Lost in the notification tray
            </div>
          </div>

          {/* Card 2: Make A Wish */}
          <div className="rounded-3xl bg-gradient-to-b from-[#221618] to-[#1a1314] border border-pink-500/40 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_60px_rgba(244,63,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-pink-500/20 mb-6">
                <span className="font-body text-eyebrow font-black tracking-widest-cinematic text-pink-400">
                  THE MAKE A WISH EXPERIENCE
                </span>
                <span className="font-body text-metadata text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                  Cinematic Keepsake
                </span>
              </div>

              {/* Journey Stepper Mockup */}
              <div className="bg-black/50 p-4 rounded-2xl border border-white/15 mb-6">
                <div className="flex items-center justify-between font-mono text-[11px] text-pink-300">
                  <span>COUNTDOWN</span>
                  <span>→</span>
                  <span>UNLOCK</span>
                  <span>→</span>
                  <span>QUIZ</span>
                  <span>→</span>
                  <span>REVEAL</span>
                  <span>→</span>
                  <span>ARCHIVE</span>
                </div>
              </div>

              <ul className="space-y-3 font-body text-xs text-white/90">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base font-bold">✓</span>
                  <span>Builds days of anticipation with live milestone timers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base font-bold">✓</span>
                  <span>Interactive gamified riddles, stickers, and inside jokes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base font-bold">✓</span>
                  <span>Full-screen unboxing video message + vintage letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base font-bold">✓</span>
                  <span>Retro TV slideshows and permanent 3D polaroid vault</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8 text-center font-body text-eyebrow text-pink-300 font-bold tracking-widest-cinematic">
              Outcome: A keepsake they revisit for years
            </div>
          </div>

        </div>

        {/* Big Impact Quote Banner */}
        <div className="text-center py-10 px-6 rounded-3xl bg-[#1e1717] border border-white/10 shadow-2xl">
          <Quote author="Make A Wish Creed">
            One message lasts a moment. An experience becomes a memory.
          </Quote>
          <Handwritten color="#ff85a1" className="text-xl sm:text-2xl mt-2">
            craft something that shows how much you truly care
          </Handwritten>
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 4. FIVE-PHASE RECIPIENT EXPERIENCE
// ==========================================
const FivePhaseSection: React.FC = () => {
  const phases = [
    {
      number: '01',
      title: 'ANTICIPATE',
      tagline: 'Make them wonder.',
      description: 'The celebration starts before the big day arrives. A locked milestone countdown tracks every day, hour, and minute, creating unmatched excitement.',
      features: ['Live ticking countdown clock', 'Secret locked mystery backdrop', 'Hanging rope polaroid teasers', 'Custom target release date & time'],
      quote: '“The surprise begins before the celebration does.”',
      accent: 'from-pink-600/20 to-rose-600/20',
      border: 'border-pink-500/30',
      icon: ClockIcon
    },
    {
      number: '02',
      title: 'UNLOCK',
      tagline: 'Make them discover.',
      description: 'Recipients enter a secret date passcode on a vintage keypad. Zero countdown or correct entry triggers an instant multi-directional confetti blast.',
      features: ['Personalized date passcode', 'Haptic error shake feedback', 'Automatic fireworks explosion', 'Instant congratulatory celebration banner'],
      quote: '“A celebration worth remembering deserves an entrance worth remembering.”',
      accent: 'from-amber-600/20 to-orange-600/20',
      border: 'border-amber-500/30',
      icon: KeyRound
    },
    {
      number: '03',
      title: 'PLAY',
      tagline: 'Make them participate.',
      description: 'Engage them with customized trivia, shared memories, or inside jokes. Answer choices trigger dynamic happy/sad animated stickers and playful retry prompts.',
      features: ['Custom trivia question steps', 'Happy & sad animated sticker pools', 'Playful second-chance retry prompt', 'Interactive multiple choice interactions'],
      quote: '“Don’t just show them your memories. Let them become part of the story.”',
      accent: 'from-purple-600/20 to-indigo-600/20',
      border: 'border-purple-500/30',
      icon: Smile
    },
    {
      number: '04',
      title: 'REVEAL',
      tagline: 'Give the surprise its moment.',
      description: 'A cinema-grade unboxing reveals a dedicated video message or framed photo, followed by an unfolding vintage letter on textured parchment paper.',
      features: ['Full-width surprise video player', 'Delayed unboxing photo alerts', 'Textured parchment digital letter', 'Cursive sign-off & dedication header'],
      quote: '“The things you want to say deserve more than a quick text.”',
      accent: 'from-rose-600/20 to-red-600/20',
      border: 'border-rose-500/30',
      icon: Gift
    },
    {
      number: '05',
      title: 'REMEMBER',
      tagline: 'Give memories somewhere to live.',
      description: 'A permanent interactive storybook with 3D flip cards, infinite coverflow photo marquees, retro CRT television reels, and a hanging Polaroid memory wall.',
      features: ['Living Art Zine 3D flip cards', 'Infinite bi-directional photo marquee', 'Retro CRT TV monitor slideshow', 'Interactive Polaroid memory gallery'],
      quote: '“The celebration ends. The memories don’t.”',
      accent: 'from-emerald-600/20 to-teal-600/20',
      border: 'border-emerald-500/30',
      icon: Layers
    }
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <Eyebrow accent className="mb-3">THE RECIPIENT JOURNEY</Eyebrow>
          <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
            FROM A SIMPLE LINK TO AN UNFORGETTABLE JOURNEY.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Every celebration unfolds in five curated cinematic phases designed to turn curiosity into genuine emotion.
          </Body>
        </div>

        <div className="space-y-8">
          {phases.map((phase) => {
            const PhaseIcon = phase.icon;
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`rounded-3xl bg-[#1b1515] border ${phase.border} p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Phase ID & Header */}
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                        <PhaseIcon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-pink-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        PHASE {phase.number}
                      </span>
                      <span className="font-body text-eyebrow text-white/40 tracking-wider">
                        {phase.tagline}
                      </span>
                    </div>

                    <Display size="md" italic as="h3" className="text-white mb-2">
                      {phase.title}
                    </Display>
                    
                    <p className="font-display italic text-quote text-pink-200/95 mb-6">
                      {phase.quote}
                    </p>

                    <Body size="sm" variant="full">
                      {phase.description}
                    </Body>
                  </div>

                  {/* Phase Features List */}
                  <div className="lg:col-span-8 bg-black/40 rounded-2xl p-6 border border-white/10">
                    <div className="font-body text-eyebrow font-bold tracking-wider-eyebrow text-white/40 mb-4">
                      Included Cinematic Capabilities:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {phase.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 font-body text-xs text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 5. DETAILED CINEMATIC FEATURE SHOWCASE
// ==========================================
const EditorialFeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#171212] to-[#151111] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <Eyebrow accent className="mb-3">FEATURE ARCHIVE</Eyebrow>
          <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
            CRAFTED FOR UNFORGETTABLE EMOTION.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Every feature is intentionally designed to balance timeless analog nostalgia with cutting-edge web craftsmanship.
          </Body>
        </div>

        {/* Feature List: Alternate Editorial Layouts */}
        <div className="space-y-24 sm:space-y-32">
          
          {/* 1. Countdown & Fireworks */}
          <FeatureRow 
            badge="01 • SUSPENSE"
            title="BUILD THE ANTICIPATION."
            tagline="A ticking clock that transforms waiting into an event."
            description="Give your celebration a proper prologue. Configure a custom target date and time down to the exact second. When the timer hits zero, the celebration automatically launches fireworks across the entire recipient viewport."
            benefit="Builds palpable excitement days in advance rather than dumping a message all at once."
            isReversed={false}
            interactiveDemo={<CountdownDemo />}
          />

          {/* 2. Secret Date Unlock */}
          <FeatureRow 
            badge="02 • PASSCODE VAULT"
            title="SOME SURPRISES ARE WORTH UNLOCKING."
            tagline="Protect intimate memories behind a milestone date."
            description="Instead of leaving private memories open on the web, place the entrance behind an interactive vintage dial pad. The recipient enters their birthday or anniversary date to unlock their digital vault."
            benefit="Turns access into a rewarding intimate ritual between you and the recipient."
            isReversed={true}
            interactiveDemo={<KeypadDemo />}
          />

          {/* 3. Interactive Quiz & Reactions */}
          <FeatureRow 
            badge="03 • STORY TRIVIA"
            title="HOW WELL DO THEY KNOW YOUR STORY?"
            tagline="Turn inside jokes and shared history into playful interaction."
            description="Craft custom trivia questions about your relationship, shared adventures, or fun memories. Correct answers trigger happy celebration stickers; incorrect choices trigger playful sad reaction animations and humorous retries."
            benefit="Transforms passive reading into active, playful participation and laughter."
            isReversed={false}
            interactiveDemo={<QuizDemo />}
          />

          {/* 4. Surprise Video & Photo Reveal */}
          <FeatureRow 
            badge="04 • UNBOXING REVEAL"
            title="PRESS PLAY ON THE SURPRISE."
            tagline="Give your video message the cinematic stage it deserves."
            description="Recipients unbox an embedded HD video reel or high-resolution framed photograph with subtle film grain and responsive player controls. When the video concludes, it naturally prompts them to read their dedication letter."
            benefit="Guarantees your personal spoken words get their undivided attention."
            isReversed={true}
            interactiveDemo={<VideoDemo />}
          />

          {/* 5. Vintage Letter */}
          <FeatureRow 
            badge="05 • TIMELESS PROSE"
            title="SOME FEELINGS DESERVE A LETTER."
            tagline="A digital letter rendered on textured vintage parchment."
            description="Nothing replaces the sincerity of a handwritten letter. Our digital letter unfolds on warm, aged parchment with realistic drop shadows, cursive script titles, comfortable serif typography, and your personal sign-off."
            benefit="Creates a physical-feeling love note or dedication they will screenshot and cherish forever."
            isReversed={false}
            interactiveDemo={<LetterDemo />}
          />

          {/* 6. Living Art Zine 3D Flip Cards */}
          <FeatureRow 
            badge="06 • 3D FLIP ARCHIVE"
            title="TURN MEMORIES INTO SOMETHING THEY CAN EXPLORE."
            tagline="Photographs on the front. Secret handwritten memories on the back."
            description="A responsive grid of gallery cards that flip 180° on touch or hover, revealing heartfelt handwritten memories, dates, and inside jokes written on the reverse side with realistic paper textures."
            benefit="Encourages tactile exploration and double the emotional storytelling per image."
            isReversed={true}
            interactiveDemo={<FlipCardDemo />}
          />

          {/* 7. Retro CRT Television */}
          <FeatureRow 
            badge="07 • ANALOG NOSTALGIA"
            title="A LITTLE NOSTALGIA. A LOT OF MEMORIES."
            tagline="A vintage cathode-ray television monitor with authentic scanlines."
            description="A bespoke retro TV interface featuring animated scanlines, realistic chassis borders, flickering power LEDs, and a toggle between automated photo slideshows and looping video reels."
            benefit="Evokes pure 90s/vintage nostalgia that makes the experience utterly unique."
            isReversed={false}
            interactiveDemo={<RetroTvDemo />}
          />

          {/* 8. Hanging Polaroid Memory Wall */}
          <FeatureRow 
            badge="08 • MEMORY EXHIBIT"
            title="EVERY PICTURE HAS A STORY."
            tagline="Hanging polaroid gallery with realistic tape strips and soft shadows."
            description="A virtual exhibition wall with fairy lights and tilted polaroid cards held by translucent tape. Tapping any polaroid flips it over to read the handwritten memory behind that specific snapshot."
            benefit="Recreates the warmth of a physical bedroom memory board in an interactive browser format."
            isReversed={true}
            interactiveDemo={<PolaroidWallDemo />}
          />

        </div>

      </div>
    </section>
  );
};

// Generic Feature Row Component
const FeatureRow: React.FC<{
  badge: string;
  title: string;
  tagline: string;
  description: string;
  benefit: string;
  isReversed: boolean;
  interactiveDemo: React.ReactNode;
}> = ({ badge, title, tagline, description, benefit, isReversed, interactiveDemo }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
      
      {/* Editorial Copy */}
      <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <Eyebrow accent className="mb-2 text-[11px]">{badge}</Eyebrow>
        <Display size="lg" italic as="h3" className="leading-heading tracking-tight mb-3">
          {title}
        </Display>
        <Handwritten color="#ff85a1" className="text-xl block mb-4">
          "{tagline}"
        </Handwritten>
        <Body size="sm" variant="full" className="mb-6">
          {description}
        </Body>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 font-body text-xs text-white/80">
          <span className="font-bold text-pink-400 block mb-1 text-eyebrow tracking-wider">
            Why Creators Love This:
          </span>
          {benefit}
        </div>
      </div>

      {/* Interactive Demonstration Panel */}
      <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="rounded-3xl bg-[#1e1717] border border-white/15 p-4 sm:p-6 shadow-2xl overflow-hidden relative">
          {interactiveDemo}
        </div>
      </div>

    </div>
  );
};

// Mini Demos for Feature Rows
const CountdownDemo = () => {
  const [testTime, setTestTime] = useState(10);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    if (testTime <= 0) {
      if (!exploded) {
        setExploded(true);
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      }
      return;
    }
    const timer = setTimeout(() => setTestTime(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [testTime, exploded]);

  const handleReset = () => {
    setTestTime(10);
    setExploded(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-black/60 rounded-2xl border border-white/10">
      <Eyebrow accent className="mb-3">
        INTERACTIVE COUNTDOWN SIMULATOR
      </Eyebrow>
      {exploded ? (
        <div className="space-y-3">
          <Display size="md" italic as="h4" className="text-pink-300 animate-bounce">
            🎉 Happy Birthday! Celebration Unlocked! 🎉
          </Display>
          <button
            onClick={handleReset}
            className="font-body font-bold text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
          >
            Restart Countdown (10s)
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3 text-white">
            <div className="bg-white/5 border border-white/15 p-3 rounded-xl min-w-[60px]">
              <span className="font-display italic text-3xl text-white">00</span>
              <span className="block font-body text-metadata text-white/40">Days</span>
            </div>
            <div className="bg-white/5 border border-white/15 p-3 rounded-xl min-w-[60px]">
              <span className="font-display italic text-3xl text-white">00</span>
              <span className="block font-body text-metadata text-white/40">Hours</span>
            </div>
            <div className="bg-white/5 border border-white/15 p-3 rounded-xl min-w-[60px]">
              <span className="font-display italic text-3xl text-white">00</span>
              <span className="block font-body text-metadata text-white/40">Mins</span>
            </div>
            <div className="bg-pink-600/20 border border-pink-500/40 p-3 rounded-xl min-w-[60px]">
              <span className="font-display italic text-3xl text-pink-400 font-bold">
                {testTime < 10 ? `0${testTime}` : testTime}
              </span>
              <span className="block font-body text-metadata text-pink-300 font-bold">Secs</span>
            </div>
          </div>
          <Body size="sm" className="text-white/40">
            Simulating final seconds until midnight reveal...
          </Body>
        </div>
      )}
    </div>
  );
};

const KeypadDemo = () => {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleKey = (digit: string) => {
    if (status === 'success') return;
    if (digit === 'DEL') {
      setPin(prev => prev.slice(0, -1));
      setStatus('idle');
    } else if (digit === 'ENTER') {
      if (pin === '1225' || pin === '12162005' || pin.length >= 4) {
        setStatus('success');
        confetti({ particleCount: 50, spread: 70 });
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 1200);
      }
    } else if (pin.length < 8) {
      setPin(prev => prev + digit);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/60 rounded-2xl border border-white/10 text-center">
      <Eyebrow className="mb-2">
        TEST DATE PASSCODE: TYPE 1225 & PRESS ENTER
      </Eyebrow>
      
      <div className="h-10 w-44 bg-white/5 border border-white/15 rounded-xl flex items-center justify-center mb-3 font-mono text-base tracking-widest text-white">
        {pin ? pin.split('').map(() => '•').join(' ') : <span className="text-white/20 text-xs">Enter PIN</span>}
      </div>

      {status === 'success' && (
        <span className="font-body text-xs text-emerald-400 font-bold mb-2">
          ✓ Passcode Verified! Vault Opened!
        </span>
      )}
      {status === 'error' && (
        <span className="font-body text-xs text-red-400 font-bold mb-2 animate-shake">
          ✕ Incorrect PIN. Hint: 1225
        </span>
      )}

      <div className="grid grid-cols-3 gap-1.5 w-44">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'ENTER'].map((val, idx) => (
          <button
            key={idx}
            onClick={() => handleKey(val.toString())}
            className="h-8 rounded-lg bg-white/5 hover:bg-white/15 font-mono text-xs font-bold text-white transition-colors cursor-pointer active:scale-95"
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

const QuizDemo = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/60 rounded-2xl border border-white/10 text-center">
      <Eyebrow accent className="mb-2">QUESTION 01</Eyebrow>
      <Display size="md" italic as="h4" className="text-xl text-white mb-4">
        "Where did we have our most memorable midnight dinner?"
      </Display>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
        {[
          { text: 'The Rooftop Diner 🍕', isCorrect: true },
          { text: 'A random airport lounge ✈️', isCorrect: false },
          { text: 'The beach food truck 🌮', isCorrect: false },
          { text: 'Home cooking disaster! 🍳', isCorrect: true },
        ].map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`p-3 rounded-xl font-body text-xs transition-all text-left flex items-center justify-between cursor-pointer ${
              selected === idx
                ? opt.isCorrect
                  ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-rose-600/30 border border-rose-500 text-rose-300 font-bold'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/80'
            }`}
          >
            <span>{opt.text}</span>
            {selected === idx && (
              <span>{opt.isCorrect ? '💖' : '🙈'}</span>
            )}
          </button>
        ))}
      </div>
      <Body size="sm" className="text-white/40 mt-3">
        {selected !== null ? 'Instant feedback sticker triggered for recipient!' : 'Click an answer to see recipient reaction'}
      </Body>
    </div>
  );
};

const VideoDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center group">
      <img 
        src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80" 
        alt="Video poster" 
        className="w-full h-full object-cover opacity-60 filter contrast-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="relative z-10 w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.6)] group-hover:scale-110 transition-transform cursor-pointer"
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
      </button>

      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center font-body text-[10px] text-white/60">
        <span className="font-semibold text-white">THE SURPRISE MESSAGE.MP4</span>
        <span>{isPlaying ? 'PLAYING NOW' : 'TAP TO PLAY'}</span>
      </div>
    </div>
  );
};

const LetterDemo = () => {
  return (
    <div className="bg-[#faf5ea] p-6 sm:p-8 rounded-2xl border border-[#d4c8a8] shadow-2xl text-left relative overflow-hidden paper-texture">
      <div className="border-b border-[#8a6b4f]/20 pb-3 mb-4 flex justify-between items-center">
        <Display size="md" italic as="h4" className="text-2xl text-[#2d1e11]">
          To the one who matters most,
        </Display>
        <Eyebrow className="!text-[#8a6b4f]">
          DEDICATION
        </Eyebrow>
      </div>

      <Handwritten color="#2c1f14" className="text-lg sm:text-xl leading-relaxed mb-4 block">
        "Some thoughts shouldn't get lost in everyday text messages. I made this so you would always have a place to come back to whenever you need a reminder of how deeply you are appreciated."
      </Handwritten>

      <div className="text-right pt-3 border-t border-[#8a6b4f]/20">
        <Handwritten color="#2d1e11" className="text-xl font-bold">
          Forever by your side ✨
        </Handwritten>
      </div>
    </div>
  );
};

const FlipCardDemo = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/60 rounded-2xl border border-white/10">
      <div 
        onClick={() => setFlipped(!flipped)}
        className="relative w-56 sm:w-64 aspect-[3/4] cursor-pointer perspective-[1000px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 bg-[#1e1919] border border-white/20 p-3 rounded-2xl shadow-xl flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-3/4 rounded-xl overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80" 
                alt="Front"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex justify-between items-center font-body text-metadata text-white/60 pt-2">
              <span>Photo 01</span>
              <span className="text-pink-300 font-bold">Click to Flip ↺</span>
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-[#faf6ee] border border-[#d4c8a8] p-5 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center paper-texture"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <Eyebrow className="!text-[#8a6b4f] mb-2">
              SECRET MEMORY NOTE
            </Eyebrow>
            <Handwritten color="#2d1e11" className="text-lg leading-relaxed">
              "That sunset where we promised to always support each other's dreams."
            </Handwritten>
            <span className="font-mono text-[10px] text-[#8a6b4f] mt-3">
              JUNE 18 • FOREVER
            </span>
          </div>
        </motion.div>
      </div>
      <Body size="sm" className="text-white/40 mt-3">
        Tap the card to test the 3D flip interaction
      </Body>
    </div>
  );
};

const RetroTvDemo = () => {
  const [mode, setMode] = useState<'reel' | 'slideshow'>('reel');

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/60 rounded-2xl border border-white/10">
      <div className="w-full max-w-sm aspect-[16/10] bg-[#1a1a1a] rounded-2xl border-4 border-[#2d2828] p-3 relative shadow-2xl overflow-hidden">
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-25 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
        
        <div className="w-full h-full rounded-lg overflow-hidden relative bg-black">
          <img 
            src={mode === 'reel' 
              ? "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80" 
              : "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80"
            } 
            alt="CRT Display"
            className="w-full h-full object-cover filter contrast-125 sepia-[0.15]" 
          />
          <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded text-[8px] font-mono text-pink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            <span>{mode === 'reel' ? 'VIDEO REEL' : 'AUTO SLIDESHOW'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button 
          onClick={() => setMode('reel')}
          className={`px-3 py-1.5 rounded-lg font-body font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            mode === 'reel' ? 'bg-pink-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          Video Reel Mode
        </button>
        <button 
          onClick={() => setMode('slideshow')}
          className={`px-3 py-1.5 rounded-lg font-body font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            mode === 'slideshow' ? 'bg-pink-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          Photo Slideshow Mode
        </button>
      </div>
    </div>
  );
};

const PolaroidWallDemo = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const samplePolaroids = [
    { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400', note: 'First roadtrip together 🚗' },
    { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400', note: 'Under the starry night ✨' },
    { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', note: 'Laughed till we cried 😂' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/60 rounded-2xl border border-white/10">
      <div className="flex flex-wrap items-center justify-center gap-4 py-2">
        {samplePolaroids.map((pol, idx) => (
          <div 
            key={idx}
            onClick={() => setFlippedIndex(flippedIndex === idx ? null : idx)}
            className="w-28 sm:w-36 aspect-[4/5] cursor-pointer perspective-[800px]"
          >
            <motion.div
              animate={{ rotateY: flippedIndex === idx ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Polaroid */}
              <div 
                className="absolute inset-0 bg-white p-1.5 pb-6 shadow-xl rounded-sm border border-gray-200"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-full bg-gray-100 overflow-hidden">
                  <img src={pol.image} alt="Polaroid" className="w-full h-full object-cover" />
                </div>
                <div className="text-center pt-1">
                  <Handwritten color="#5c381c" className="text-xs">tap to read ↺</Handwritten>
                </div>
              </div>

              {/* Back Polaroid Note */}
              <div 
                className="absolute inset-0 bg-[#faf6ee] p-2 text-center flex items-center justify-center border border-[#d4c8a8] rounded-sm shadow-xl paper-texture"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <Handwritten color="#2d1e11" className="text-sm">
                  "{pol.note}"
                </Handwritten>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <Body size="sm" className="text-white/40 mt-3">
        Interactive 3D hanging polaroids with handwritten memories
      </Body>
    </div>
  );
};

// ==========================================
// 6. INTERACTIVE PLAYGROUND (TRY IT YOURSELF)
// ==========================================
const InteractivePlayground: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [passcode, setPasscode] = useState('');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const handleNextStep = () => {
    if (step === 1) {
      confetti({ particleCount: 50, spread: 70 });
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  return (
    <section id="interactive-demo" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#120d0d] border-b border-white/10 relative">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Eyebrow accent className="mb-2">LIVE PRODUCT SIMULATOR</Eyebrow>
          <Display size="lg" italic as="h2" className="text-[#f5f1e8] mb-4">
            EXPERIENCE IT YOURSELF.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Step into your recipient's shoes. Test the exact flow they will encounter when they open your celebration link:
          </Body>
        </div>

        {/* Wizard Container */}
        <div className="rounded-3xl bg-[#1c1515] border border-white/15 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8 overflow-x-auto">
            {['1. Countdown & Unlock', '2. Sticker Quiz', '3. Video Unboxing', '4. Digital Letter', '5. Memory Story'].map((name, i) => (
              <div 
                key={i} 
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 font-body text-eyebrow tracking-wider cursor-pointer whitespace-nowrap px-2 ${
                  step === i + 1 ? 'text-pink-400 font-bold' : step > i + 1 ? 'text-emerald-400' : 'text-white/30'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  step === i + 1 ? 'bg-pink-600 text-white' : step > i + 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10'
                }`}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{name}</span>
              </div>
            ))}
          </div>

          {/* Wizard Step Body */}
          <div className="min-h-[260px] flex flex-col items-center justify-center text-center">
            
            {step === 1 && (
              <div className="space-y-4 max-w-md">
                <Eyebrow accent className="block mb-2">
                  STEP 01 • PASSCODE UNLOCK
                </Eyebrow>
                <Display size="md" italic as="h3" className="text-white">
                  Enter special passcode (Try: 1225)
                </Display>
                <input 
                  type="text" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..." 
                  className="w-48 bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-center font-mono text-sm text-white focus:border-pink-500 outline-none"
                />
                <div>
                  <button
                    onClick={handleNextStep}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-body font-black text-xs uppercase tracking-wider-eyebrow px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Unlock Celebration →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 max-w-md">
                <Eyebrow accent className="block mb-2">
                  STEP 02 • INTERACTIVE QUIZ
                </Eyebrow>
                <Display size="md" italic as="h3" className="text-white">
                  "Ready for this special surprise?"
                </Display>
                {quizAnswer && (
                  <p className="font-body text-xs text-pink-300">Selected: {quizAnswer}</p>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setQuizAnswer('Yes, absolutely! 💖'); handleNextStep(); }}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-body font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer"
                  >
                    Yes, absolutely! 💖
                  </button>
                  <button
                    onClick={() => { setQuizAnswer("Let's open it! 🎁"); handleNextStep(); }}
                    className="bg-white/10 hover:bg-white/20 text-white font-body font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer"
                  >
                    Let's open it! 🎁
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 max-w-md">
                <Eyebrow accent className="block mb-2">
                  STEP 03 • SURPRISE VIDEO REVEAL
                </Eyebrow>
                <Display size="md" italic as="h3" className="text-white">
                  "Playing personal dedication message..."
                </Display>
                <div className="w-full aspect-video bg-black/80 rounded-2xl border border-white/20 flex items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white animate-pulse">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  className="bg-white text-black hover:bg-gray-200 font-body font-black text-xs uppercase tracking-wider px-8 py-3 rounded-xl cursor-pointer"
                >
                  Read Personal Letter →
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 max-w-md text-left bg-[#faf5ea] p-6 rounded-2xl border border-[#d4c8a8] paper-texture">
                <Display size="md" italic as="h4" className="text-2xl text-[#2d1e11]">
                  A Letter Just For You
                </Display>
                <Handwritten color="#2c1f14" className="text-lg block">
                  "You make everyday life feel so much more meaningful. Wishing you the happiest birthday and an amazing year ahead..."
                </Handwritten>
                <div className="text-right">
                  <button
                    onClick={handleNextStep}
                    className="bg-[#2d1e11] hover:bg-black text-white font-body font-black text-[11px] uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Explore Memory Storybook →
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 max-w-md text-center">
                <Eyebrow accent className="block mb-2">
                  COMPLETE CELEBRATION UNLOCKED
                </Eyebrow>
                <Display size="lg" italic as="h3" className="text-white">
                  That is the magic of Make A Wish.
                </Display>
                <Body size="sm" variant="emotional" className="mx-auto">
                  Ready to craft an unforgettable journey for someone special in your life?
                </Body>
                <button
                  onClick={() => setStep(1)}
                  className="font-body text-xs text-white/40 hover:text-white underline block mx-auto cursor-pointer"
                >
                  ↺ Replay Simulator Flow
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

// ==========================================
// 7. CREATOR STUDIO DASHBOARD SHOWCASE
// ==========================================
const CreatorStudioShowcase: React.FC<{ onPrimaryClick: () => void }> = ({ onPrimaryClick }) => {
  return (
    <section id="creator-studio" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <Eyebrow accent className="mb-3">CREATOR STUDIO WORKSPACE</Eyebrow>
            <Display size="lg" italic as="h2" className="leading-heading tracking-tight mb-6">
              YOU CREATE THE MOMENT. WE MAKE IT COME ALIVE.
            </Display>
            <Body size="md" variant="editorial" className="mb-8">
              No technical expertise needed. Our headless creator studio gives you a dedicated command center where you can draft multiple stories, preview live renders, toggle draft states, and copy shareable links in one tap.
            </Body>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-body font-bold text-sm text-white">Draft vs. Live Controls</h4>
                  <Body size="sm" className="text-white/50">Keep your story hidden in draft mode until the perfect reveal day.</Body>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-body font-bold text-sm text-white">One-Click Link Copying</h4>
                  <Body size="sm" className="text-white/50">Easily copy your unique URL to send via WhatsApp, iMessage, or email.</Body>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-body font-bold text-sm text-white">GitHub-Style Danger Zone Protection</h4>
                  <Body size="sm" className="text-white/50">Never accidentally delete stories—requires typing the recipient name to verify.</Body>
                </div>
              </div>
            </div>

            <button
              onClick={onPrimaryClick}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-body font-black text-xs uppercase tracking-wider-eyebrow shadow-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Launch Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dashboard Preview Graphic */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#1c1616] border border-white/15 p-5 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <Eyebrow accent className="mb-1">Studio Dashboard</Eyebrow>
                  <Display size="md" italic as="h4" className="text-2xl text-white">
                    Your Celebration Stories
                  </Display>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-white/70">
                  3 ACTIVE STORIES
                </div>
              </div>

              {/* Sample Wish Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#140f0f] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full uppercase">
                        Birthday
                      </span>
                      <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase font-bold">
                        ● Live
                      </span>
                    </div>
                    <Display size="md" italic as="h5" className="text-lg text-white">Lucky's 21st Birthday</Display>
                    <p className="font-mono text-xs text-white/40">/luckyyyy-thallii</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-body font-bold text-[11px] bg-white/10 text-white px-3 py-1.5 rounded-xl uppercase">
                      Edit
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#140f0f] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full uppercase">
                        Anniversary
                      </span>
                      <span className="font-mono text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase font-bold">
                        ○ Draft
                      </span>
                    </div>
                    <Display size="md" italic as="h5" className="text-lg text-white">Four Years Together</Display>
                    <p className="font-mono text-xs text-white/40">/our-forever-story</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-body font-bold text-[11px] bg-white/10 text-white px-3 py-1.5 rounded-xl uppercase">
                      Edit
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

// ==========================================
// 8. SEVEN-CHAPTER VISUAL CMS EDITOR
// ==========================================
const SevenChapterEditorSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const chapters = [
    {
      num: '01',
      title: 'Unlock & Splash',
      desc: 'Countdown target date, recipient greeting, secret passcode date, splash polaroid & ambient wallpaper.',
      controls: ['Target Date Picker (YYYY-MM-DD)', 'Passcode Month/Day/Year keys', 'Splash Polaroid Photo Upload', 'Rope Polaroids background array']
    },
    {
      num: '02',
      title: 'Hero Identity',
      desc: 'Top hero photograph, chapter sentiment text, display headline 1 & 2, collage stamps & closing photo.',
      controls: ['Opening banner image & text', 'Middle collage backdrop wallpaper', 'Primary display headline titles', 'Left & right stamp polaroids with labels']
    },
    {
      num: '03',
      title: 'Living Art Zine',
      desc: 'Dynamic 3D flip cards with front photographs, back handwritten memory notes, and descriptive footnotes.',
      controls: ['Add/delete custom card items', 'Card front image upload', 'Card back handwritten cursive note', 'Footer caption text']
    },
    {
      num: '04',
      title: 'Archival Vault',
      desc: 'Editorial archive page with featured snapshot, status tags, handwritten sticky notes, and tribute guestbook.',
      controls: ['Large focus image & title tag', 'Handwritten yellow sticky note text', 'Secondary detail photograph', 'Tribute guestbook form heading & button copy']
    },
    {
      num: '05',
      title: 'Photo Coverflow',
      desc: 'Bi-directional infinite photo marquee ribbons moving left and right with hover pausing and frame counters.',
      controls: ['Upload multiple moment photos', 'Dynamic marquee speed tuning', 'Frame numbering & handwritten stamps', 'Continuous ribbon looping']
    },
    {
      num: '06',
      title: 'Gift & Quiz',
      desc: 'Interactive quiz questions, happy/sad stickers, surprise video/photo reveal player, and digital vintage letter.',
      controls: ['Trivia questions & answer options', 'Sticker GIF reaction URLs', 'Video vs Photo reveal mode switch', 'Parchment letter title, body & sign-off']
    },
    {
      num: '07',
      title: 'Memories Wall',
      desc: 'Retro CRT TV monitor (video reel vs photo slideshow mode) and interactive hanging polaroid memory wall.',
      controls: ['TV Mode: Video clips or slideshow', 'Add/delete polaroid card items', 'Polaroid image & handwritten reverse', 'Real-time live reel scanlines']
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#181212] to-[#151111] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Eyebrow accent className="mb-3">HEADLESS VISUAL CMS</Eyebrow>
          <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
            YOUR STORY. YOUR RULES.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            A seven-chapter visual editor that lets you personalize every headline, photo, question, and letter without writing a single line of code.
          </Body>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 justify-start lg:justify-center">
          {chapters.map((ch, idx) => (
            <button
              key={ch.num}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-3 rounded-2xl font-body font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === idx
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10'
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{ch.num}</span>
              <span>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Detail Showcase Panel */}
        <div className="rounded-3xl bg-[#1c1515] border border-white/15 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-pink-400 font-bold uppercase mb-1 block">
                CHAPTER {chapters[activeTab].num}
              </span>
              <Display size="lg" italic as="h3" className="text-white mb-3">
                {chapters[activeTab].title}
              </Display>
              <Body size="sm" variant="full" className="mb-6">
                {chapters[activeTab].desc}
              </Body>
              <div className="font-body text-metadata tracking-wider text-white/40 mb-3 font-bold">
                Configurable Properties:
              </div>
              <ul className="space-y-2">
                {chapters[activeTab].controls.map((ctrl, i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>{ctrl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 bg-black/60 rounded-2xl p-6 border border-white/10 flex flex-col justify-center min-h-[260px] text-center">
              <span className="font-mono text-[10px] text-white/40 uppercase mb-2">
                Live CMS Preview Output
              </span>
              <Display size="md" italic as="h4" className="text-pink-300 mb-2">
                "{chapters[activeTab].title} Chapter Ready"
              </Display>
              <Body size="sm" variant="emotional" className="mx-auto text-white/50">
                Real-time automatic normalization instantly organizes flat and array assets into our high-speed Supabase database.
              </Body>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 9. PERSONALIZATION SECTION
// ==========================================
const PersonalizationSection: React.FC = () => {
  const tags = [
    'Recipient Name', 'Custom URL Slug', 'Milestone Date', 'Secret Passcode', 
    'Inside Jokes', 'Personal Trivia', 'Happy Reaction GIFs', 'Sad Reaction Stickers',
    'Personal Video Reel', 'Vintage Parchment Letter', 'Photo Slideshows', 'Polaroid Memories',
    'Custom Headlines', 'Handwritten Notes', 'Sticky Notes', 'Tribute Guestbook'
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <Eyebrow accent className="mb-3">INFINITE ADAPTABILITY</Eyebrow>
        <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
          MAKE IT UNMISTAKABLY THEIRS.
        </Display>
        <Body size="md" variant="editorial" className="mx-auto mb-12">
          Every story is different. Your celebration should be too. Mix and match elements to match your unique relationship:
        </Body>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#1e1717] hover:bg-pink-900/30 border border-white/10 hover:border-pink-500/40 text-white/80 hover:text-white px-4 py-2 rounded-2xl font-body text-eyebrow tracking-wider font-semibold transition-all cursor-default shadow-md"
            >
              ✦ {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 10. OCCASIONS SECTION
// ==========================================
const OccasionSection: React.FC<{ onPrimaryClick: () => void }> = ({ onPrimaryClick }) => {
  const occasions = [
    {
      id: 'birthday',
      title: 'Birthday Celebration',
      badge: 'Birthday',
      tagline: 'Make their birthday more than another notification.',
      description: 'Personalized splash countdown, vintage polaroid stacks, and interactive surprise video reveals.',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      color: '#f472b6'
    },
    {
      id: 'anniversary',
      title: 'Anniversary Romance',
      badge: 'Anniversary',
      tagline: 'Turn your story together into something they can experience.',
      description: 'Romantic memory corridors, handwritten digital letters, and relationship timeline stories.',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      color: '#fb7185'
    },
    {
      id: 'valentine',
      title: "Valentine's Day",
      badge: "Valentine's",
      tagline: 'Hide a little love behind every reveal.',
      description: 'Heartwarming animated particle fields, secret love vault unlocks, and tender dedications.',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      color: '#f87171'
    },
    {
      id: 'graduation',
      title: 'Graduation Triumph',
      badge: 'Graduation',
      tagline: 'Celebrate the journey behind the achievement.',
      description: 'Inspiring journey archives, congratulatory notes, and celebratory milestone scrapbook galleries.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
      color: '#fbbf24'
    },
    {
      id: 'milestone',
      title: 'Milestone & Achievement',
      badge: 'Milestone',
      tagline: 'Give important moments the celebration they deserve.',
      description: 'Cinematic victory highlights, personal tribute letters, and customized celebratory rewards.',
      image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600&auto=format&fit=crop&q=80',
      color: '#c084fc'
    },
    {
      id: 'custom',
      title: 'Custom Celebration',
      badge: 'Custom',
      tagline: 'If it’s worth celebrating, it’s worth creating.',
      description: 'Full creative freedom to curate songs, photos, riddles, and memories for any special occasion.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      color: '#34d399'
    }
  ];

  return (
    <section id="occasions" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#1a1414] to-[#151111] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Eyebrow accent className="mb-3">CURATED TEMPLATES</Eyebrow>
          <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
            MADE FOR EVERY MOMENT WORTH CELEBRATING.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Select a specialized occasion framework to instantly pre-populate tailored copy, color schemes, questions, and letter structures.
          </Body>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasions.map((occ) => (
            <div
              key={occ.id}
              className="rounded-3xl bg-[#1d1616] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-pink-500/40 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-black/60">
                <img 
                  src={occ.image} 
                  alt={occ.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d1616] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full font-body text-metadata tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold">
                  {occ.badge}
                </span>
              </div>

              <div className="p-6 pt-2 flex flex-col flex-1 justify-between">
                <div>
                  <Display size="md" italic as="h4" className="text-2xl text-white mb-1 group-hover:text-pink-300 transition-colors">
                    {occ.title}
                  </Display>
                  <Handwritten color={occ.color} className="text-base block mb-3 font-semibold">
                    "{occ.tagline}"
                  </Handwritten>
                  <Body size="sm" variant="full" className="text-white/50 mb-6">
                    {occ.description}
                  </Body>
                </div>

                <button
                  onClick={onPrimaryClick}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-pink-600/20 text-white/80 hover:text-white border border-white/10 hover:border-pink-500/40 font-body font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start {occ.badge} Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 11. NO FRICTION SECTION
// ==========================================
const NoFrictionSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        
        <Eyebrow accent className="mb-3">EFFORTLESS DELIVERY</Eyebrow>
        <Display size="xl" italic as="h2" className="leading-display tracking-tight-display mb-6">
          YOU CREATE IT. THEY JUST OPEN IT.
        </Display>
        <Body size="md" variant="editorial" className="mx-auto mb-16">
          The biggest hurdle with digital gifts is forcing your recipient to jump through hoops. We completely eliminated all friction.
        </Body>

        {/* Split Flow Visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-14">
          
          <div className="p-8 rounded-3xl bg-[#1e1717] border border-white/10">
            <Eyebrow accent className="mb-4 text-xs">
              FOR YOU (THE CREATOR)
            </Eyebrow>
            <div className="space-y-4 font-body text-sm text-white/80">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold">1</span>
                <span>Choose an occasion & recipient name</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold">2</span>
                <span>Upload photos, write letter & customize quiz</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold">3</span>
                <span>Copy your custom URL (e.g. /puppy)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold">4</span>
                <span>Send link via SMS, WhatsApp, or letter</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#1e1717] border border-emerald-500/30">
            <span className="font-body text-eyebrow text-emerald-400 font-bold block mb-4">
              FOR THEM (THE RECIPIENT)
            </span>
            <div className="space-y-4 font-body text-sm text-white/80">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">✓</span>
                <span>NO account registration or signup</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">✓</span>
                <span>NO login or password required</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">✓</span>
                <span>NO mobile app download required</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">✓</span>
                <span>Works immediately in any phone or desktop browser</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

// ==========================================
// 12. SECURITY & PRIVACY SECTION
// ==========================================
const SecuritySection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#171212] to-[#151111] border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Eyebrow accent className="mb-2">ENTERPRISE MEMORY SAFE</Eyebrow>
          <Display size="lg" italic as="h2" className="leading-heading tracking-tight mb-4">
            YOUR MEMORIES ARE PERSONAL.
          </Display>
          <Body size="md" variant="editorial" className="mx-auto">
            Your celebration may contain private photographs, heartfelt love letters, and personal videos. Creator accounts are fortified with multi-layered verification.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1717] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink-400 mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <Eyebrow accent className="block mb-1">
              FACTOR 01
            </Eyebrow>
            <Display size="md" italic as="h4" className="text-xl text-white mb-2">Master Password</Display>
            <Body size="sm" className="text-white/50">
              Standard secure credentials guarding your primary storyteller account.
            </Body>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1717] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <Eyebrow accent className="block mb-1">
              FACTOR 02
            </Eyebrow>
            <Display size="md" italic as="h4" className="text-xl text-white mb-2">6-Digit Email OTP</Display>
            <Body size="sm" className="text-white/50">
              Real-time one-time verification codes dispatched to your private inbox.
            </Body>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1717] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <Eyebrow accent className="block mb-1">
              FACTOR 03
            </Eyebrow>
            <Display size="md" italic as="h4" className="text-xl text-white mb-2">4-Digit Security PIN</Display>
            <Body size="sm" className="text-white/50">
              An extra secret numeric PIN required before opening the wish studio.
            </Body>
          </div>

        </div>

      </div>
    </section>
  );
};

// ==========================================
// 13. LINK RELIABILITY SECTION
// ==========================================
const LinkReliabilitySection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        
        <Eyebrow accent className="mb-2">INTELLIGENT ROUTING</Eyebrow>
        <Display size="md" italic as="h2" className="text-[#f5f1e8] mb-4">
          SHARE IT WITHOUT WORRYING ABOUT ONE TINY TYPO.
        </Display>
        
        <Body size="md" variant="editorial" className="mx-auto mb-8">
          Personalized celebration URLs are engineered with intelligent fuzzy link resilience. If your loved one accidentally mistypes uppercase letters or repeated characters (e.g. typing <code className="text-pink-300 bg-white/5 px-2 py-0.5 rounded font-mono">/lucky-thalli</code> instead of <code className="text-pink-300 bg-white/5 px-2 py-0.5 rounded font-mono">/luckyyyy-thallii</code>), our engine intelligently resolves the name and opens their celebration seamlessly.
        </Body>

        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 font-mono text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Zero 404 Disappointment Guarantee</span>
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 14. EMOTIONAL PROGRESSION SECTION
// ==========================================
const EmotionalProgressionSection: React.FC = () => {
  const thoughts = [
    "WAIT...",
    "WHAT IS THIS?",
    "I HAVE TO UNLOCK IT?",
    "WAIT, THIS QUESTION IS ABOUT US!",
    "YOU MADE THIS FOR ME?",
    "YOU WROTE A WHOLE LETTER?",
    "THESE ARE OUR MOMENTS..."
  ];

  return (
    <section className="py-24 sm:py-36 px-4 sm:px-6 md:px-12 bg-[#110d0d] border-b border-white/10 relative overflow-hidden">
      <DisplayBackground text="EMOTION" className="top-[15%] opacity-35" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Eyebrow accent className="mb-4">THE REACTION YOU ARE CREATING</Eyebrow>
        <Display size="xl" italic as="h2" className="leading-none mb-12">
          THE EMOTIONAL UNFOLDING
        </Display>

        <div className="space-y-4 sm:space-y-6 mb-12">
          {thoughts.map((thought, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="text-white/40 hover:text-white transition-colors"
            >
              <span className="font-display italic text-display-md">
                "{thought}"
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-r from-pink-950/40 via-rose-950/40 to-pink-950/40 border border-pink-500/40 shadow-2xl"
        >
          <Display size="xl" italic as="h3" className="text-pink-200">
            "I'll keep this forever."
          </Display>
        </motion.div>

      </div>
    </section>
  );
};

// ==========================================
// 15. BENEFITS SUMMARY SECTION
// ==========================================
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'CREATE SOMETHING PERSONAL',
      desc: 'Not another cookie-cutter digital greeting. A bespoke digital artifact crafted with your own hands.'
    },
    {
      title: 'BUILD REAL ANTICIPATION',
      desc: 'Make the suspense unfold across multiple days and unlock phases before the grand surprise.'
    },
    {
      title: 'MAKE THEM PARTICIPATE',
      desc: 'Turn inside jokes and memorable moments into a playful quiz they actively engage with.'
    },
    {
      title: 'SAY EVERYTHING YOU MEAN',
      desc: 'Give your emotions space with cinema-grade video reveals and vintage handwritten letters.'
    },
    {
      title: 'PRESERVE THE MOMENT',
      desc: 'A living memory vault with retro TVs and 3D polaroids that never gets lost in a chat archive.'
    },
    {
      title: 'SHARE IT IN ONE CLICK',
      desc: 'Works through a single personalized URL without forcing your recipient to sign up or download apps.'
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#151111] border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Eyebrow accent className="mb-2">WHY CHOOSE MAKE A WISH</Eyebrow>
          <Display size="lg" italic as="h2" className="text-[#f5f1e8]">
            WHAT YOU GET WITH MAKE A WISH
          </Display>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#1d1616] border border-white/10 hover:border-pink-500/30 transition-all">
              <Eyebrow accent className="block mb-2 text-[10px]">
                0{i + 1} • ADVANTAGE
              </Eyebrow>
              <Display size="md" italic as="h4" className="text-xl text-white mb-2">{b.title}</Display>
              <Body size="sm" className="text-white/50">{b.desc}</Body>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 16. FINAL EMOTIONAL CALL TO ACTION
// ==========================================
const FinalCTASection: React.FC<{ onPrimaryClick: () => void }> = ({ onPrimaryClick }) => {
  return (
    <section className="py-32 sm:py-40 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#151111] via-[#1a1113] to-[#120e0e] relative text-center overflow-hidden">
      {/* Floating Sparkles & Soft Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Eyebrow accent className="mb-4">START YOUR STORY</Eyebrow>

        <Display size="hero" italic as="h2" className="leading-hero tracking-[-0.045em] mb-6">
          Make Their Next Moment <span className="text-pink-200/95 font-serif">Unforgettable.</span>
        </Display>

        <Body size="lg" variant="editorial" className="mx-auto mb-10">
          You bring the memories. We'll turn them into an experience they'll cherish forever.
        </Body>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrimaryClick}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-10 sm:px-12 py-4.5 rounded-2xl font-body font-black text-xs sm:text-sm uppercase tracking-wider-eyebrow shadow-[0_15px_45px_rgba(244,63,94,0.5)] transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <span>Create Your Own Wish</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-8 py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-wider-eyebrow border border-white/15 transition-all text-center"
          >
            Explore The Experience
          </a>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 17. FOOTER COMPONENT
// ==========================================
const Footer: React.FC<{ onPrimaryClick: () => void; onSignInClick: () => void }> = ({ onPrimaryClick, onSignInClick }) => {
  return (
    <footer className="bg-[#0f0b0b] border-t border-white/10 py-16 px-4 sm:px-6 md:px-12 text-white/40 font-body text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-white/10">
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-pink-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display italic text-2xl text-white">Make A Wish</span>
          </div>
          <p className="font-body text-xs text-white/50 max-w-sm">
            Turning personal wishes into interactive, cinematic digital experiences.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 sm:gap-8 uppercase tracking-widest font-body text-metadata">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#interactive-demo" className="hover:text-white transition-colors">Live Demo</a>
          <a href="#occasions" className="hover:text-white transition-colors">Occasions</a>
          <a href="#creator-studio" className="hover:text-white transition-colors">Studio</a>
          <button onClick={onSignInClick} className="hover:text-white transition-colors uppercase cursor-pointer">Sign In</button>
          <button onClick={onPrimaryClick} className="text-pink-400 hover:text-pink-300 font-bold uppercase cursor-pointer">Create Wish →</button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-white/30 font-body text-metadata">
          © {new Date().getFullYear()} Make A Wish. All rights reserved. Built with love for moments that matter.
        </p>
        <Handwritten color="#ff85a1" className="text-sm">
          "Some wishes are meant to be experienced."
        </Handwritten>
      </div>
    </footer>
  );
};

// Simple Clock Icon fallback for phase 1
const ClockIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default LandingPage;
