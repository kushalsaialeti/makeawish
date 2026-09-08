import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../store/cmsStore';
import { useAuthStore } from '../store/authStore';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Eyebrow } from '../components/ui/Typography';
import { AdminPasscodeModal } from '../components/auth/AdminPasscodeModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const OCCASIONS = [
  { id: 'all', label: 'All Occasions', icon: '✨', bg: 'from-pink-500/20 to-rose-500/20', text: 'text-pink-300' },
  { id: 'birthday', label: 'Birthday', icon: '🎂', bg: 'from-pink-500/20 to-rose-500/20', text: 'text-pink-300' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍', bg: 'from-rose-500/20 to-red-600/20', text: 'text-rose-300' },
  { id: 'valentine', label: "Valentine's", icon: '💖', bg: 'from-red-500/20 to-pink-600/20', text: 'text-red-300' },
  { id: 'graduation', label: 'Graduation', icon: '🎓', bg: 'from-amber-500/20 to-yellow-600/20', text: 'text-amber-300' },
  { id: 'milestone', label: 'Milestone', icon: '🎉', bg: 'from-purple-500/20 to-indigo-600/20', text: 'text-purple-300' },
  { id: 'custom', label: 'Custom Wish', icon: '💌', bg: 'from-emerald-500/20 to-teal-600/20', text: 'text-emerald-300' },
];

export const OCCASION_SHOWCASE = [
  {
    id: 'birthday',
    title: 'Birthday Celebration',
    badge: '🎂 Birthday',
    tagline: 'Cherish the moments that make them smile',
    description: 'Personalized splash countdown, nostalgic vintage polaroid stacks, and interactive surprise video reveals.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-pink-600/30 via-rose-600/20 to-amber-600/20',
    accentColor: 'text-pink-400',
  },
  {
    id: 'anniversary',
    title: 'Anniversary Romance',
    badge: '💍 Anniversary',
    tagline: 'Celebrate timeless love & devotion',
    description: 'Romantic memory corridors, handwritten digital letters, and interactive relationship timeline stories.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-rose-600/30 via-red-600/20 to-pink-600/20',
    accentColor: 'text-rose-400',
  },
  {
    id: 'valentine',
    title: "Valentine's Day",
    badge: '💖 Valentine',
    tagline: 'Words straight from your heart',
    description: 'Heartwarming animated particle fields, secret love vault unlocks, and tender audio-visual dedications.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-red-600/30 via-pink-600/20 to-purple-600/20',
    accentColor: 'text-red-400',
  },
  {
    id: 'graduation',
    title: 'Graduation Triumph',
    badge: '🎓 Graduation',
    tagline: 'Honor dedication & future dreams',
    description: 'Inspiring journey archives, congratulatory notes, and celebratory milestone scrapbook galleries.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-amber-600/30 via-yellow-600/20 to-orange-600/20',
    accentColor: 'text-amber-400',
  },
  {
    id: 'milestone',
    title: 'Milestone & Achievement',
    badge: '🏆 Milestone',
    tagline: 'Commemorate extraordinary chapters',
    description: 'Cinematic victory highlights, personal tribute letters, and customized celebratory rewards.',
    image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-purple-600/30 via-indigo-600/20 to-blue-600/20',
    accentColor: 'text-purple-400',
  },
  {
    id: 'custom',
    title: 'Custom Celebration',
    badge: '✨ Custom',
    tagline: 'Craft personalized magic for any day',
    description: 'Full creative freedom to curate songs, photos, riddles, and memories for any special occasion.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-600/20',
    accentColor: 'text-emerald-400',
  },
];

// --- REUSABLE CMS FORM CONTROLS ---

interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, hint, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center">
      <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/50">
        {label}
      </label>
      {hint && (
        <span className="text-[10px] font-body text-white/30 tracking-wider">
          {hint}
        </span>
      )}
    </div>
    {children}
  </div>
);

const SectionHeading: React.FC<{ title: string; chapter?: string; action?: React.ReactNode }> = ({ title, chapter, action }) => (
  <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-8">
    <div>
      {chapter && <Eyebrow accent className="mb-1">{chapter}</Eyebrow>}
      <h2 className="font-display italic text-2xl md:text-3xl text-[#f5f1e8] tracking-tight">{title}</h2>
    </div>
    {action}
  </div>
);

const SaveBtn: React.FC<{ onClick: () => void; isSaving?: boolean }> = ({ onClick, isSaving = false }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={isSaving}
    className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-10 py-4 rounded-2xl font-body font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
  >
    {isSaving ? 'Saving Changes...' : 'Save Changes ✨'}
  </motion.button>
);

// --- MAIN ADMIN / WISHES ROUTER ---

export const AdminDashboard = () => { 
  return (
    <Routes>
      <Route path="/" element={<WishList />} />
      <Route path="/edit/:id" element={<WishEditorWrapper />} />
      <Route path="/edit/:id/:tab" element={<WishEditorWrapper />} />
    </Routes>
  );
};

// --- WISH LIST & CREATOR ---

const WishList = () => {
  const [wishes, setWishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newWish, setNewWish] = useState({ slug: '', name: '', occasion: 'birthday' });
  const [wishToDelete, setWishToDelete] = useState<any | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [claimingWishId, setClaimingWishId] = useState<string | null>(null);

  const { user, signOut, getToken, isAdmin, exitAdminMode, claimWish } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/wishes')
    ? '/wishes'
    : location.pathname.startsWith('/dashboard')
      ? '/dashboard'
      : '/admin';

  useEffect(() => {
    // If user navigates directly to /admin and is not admin verified, open passcode modal
    if (location.pathname.startsWith('/admin') && !isAdmin) {
      setShowPasscodeModal(true);
    }
    fetchWishes();
  }, [location.pathname, isAdmin]);

  const handleClaim = async (wishId: string) => {
    setClaimingWishId(wishId);
    const res = await claimWish(wishId);
    setClaimingWishId(null);
    if (res.success) {
      fetchWishes();
      alert('Wish successfully linked to your account! 💝');
    } else {
      alert(`Error claiming wish: ${res.error}`);
    }
  };

  const fetchWishes = async () => {
    try {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/cms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      const data = await response.json();
      setWishes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch wishes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.slug || !newWish.name) return;
    
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/cms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          slug: newWish.slug,
          recipient_name: newWish.name,
          occasion: newWish.occasion
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create wish');
      if (data.id) {
        navigate(`${basePath}/edit/${data.id}`);
      } else {
        throw new Error('No ID returned from server');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!wishToDelete) return;
    if (confirmNameInput.trim().toLowerCase() !== wishToDelete.recipient_name.trim().toLowerCase()) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/cms/${wishToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete wish from database');
      }

      setWishes(prev => prev.filter(w => w.id !== wishToDelete.id));
      setWishToDelete(null);
      setConfirmNameInput('');
    } catch (error: any) {
      console.error('Delete Wish Error:', error);
      setDeleteError(error.message || 'Error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredWishes = wishes;

  const getOccasionInfo = (occId?: string) => {
    return OCCASIONS.find(o => o.id === (occId || 'birthday')) || OCCASIONS[1];
  };

  return (
    <div className="min-h-screen bg-[#151111] text-[#e6d0d2] p-4 sm:p-8 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Top User Bar */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-2xl border border-pink-500/30 object-cover shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center shadow-lg uppercase">
                {user?.name ? user.name[0] : user?.email ? user.email[0] : 'U'}
              </div>
            )}
            <div>
              <p className="text-xs font-body font-bold text-white leading-snug">
                {user?.name || user?.email?.split('@')[0] || 'Celebration Storyteller'}
              </p>
              <p className="text-[11px] font-body text-white/40 tracking-wider">
                {isAdmin ? 'Super Admin Mode Active' : user?.email || 'Authenticated Creator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold font-body uppercase tracking-wider flex items-center gap-1.5">
                <span>🛡️ Super Admin</span>
              </span>
            )}

            <button
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all border border-white/10 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Super Admin Showcase Banner */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-red-950/60 via-purple-950/40 to-pink-950/40 border border-red-500/40 rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body font-black uppercase tracking-[0.2em] text-red-400">
                    SUPER ADMIN CONSOLE
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                    SHOWCASE MODE (ALL WISHES)
                  </span>
                </div>
                <p className="text-xs text-white/60 font-body mt-0.5">
                  Displaying all previous and current wishes from the database to showcase your celebration work.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  exitAdminMode();
                  navigate('/wishes');
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Exit Admin Mode
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-12">
          <div>
            <Eyebrow accent className="mb-2">CELEBRATION VAULT • CREATOR STUDIO</Eyebrow>
            <h1 className="font-display italic text-display-md text-[#f5f1e8] leading-tight">
              Occasion Stories Studio
            </h1>
            <p className="font-body text-white/50 text-sm md:text-base mt-1">
              Design, customize, and share bespoke memories for birthdays, anniversaries, and milestones.
            </p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full md:w-auto bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-8 py-4 rounded-2xl font-body font-black text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 transition-all active:scale-95 cursor-pointer"
          >
            + Create New Story
          </button>
        </div>

        {/* Create Modal / Form */}
        <AnimatePresence>
          {isCreating && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreate}
              className="bg-[#1e1919] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl mb-10 sm:mb-14 border border-white/15 overflow-hidden shadow-2xl space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display italic text-2xl text-white">Create a New Wish Experience</h3>
                <p className="font-body text-xs text-white/40 mt-1">Select the celebration occasion, recipient name, and custom URL slug.</p>
              </div>

              {/* Occasion Selector */}
              <div>
                <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/50 mb-3">
                  Select Celebration Occasion
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {OCCASIONS.filter(o => o.id !== 'all').map(occ => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setNewWish({ ...newWish, occasion: occ.id })}
                      className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                        newWish.occasion === occ.id
                          ? 'bg-gradient-to-b from-pink-500/20 to-rose-600/10 border-pink-500 text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl mb-0.5">{occ.icon}</span>
                      <span className="text-xs font-body font-bold">{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Recipient / Person Name" hint="How they will be addressed">
                  <input 
                    type="text" 
                    value={newWish.name}
                    onChange={e => setNewWish({...newWish, name: e.target.value})}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
                    required
                  />
                </FormField>
                <FormField label="Unique URL Slug" hint="URL identifier">
                  <input 
                    type="text" 
                    value={newWish.slug}
                    onChange={e => setNewWish({...newWish, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                    placeholder="e.g. sarah-2026"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
                    required
                  />
                </FormField>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button type="submit" className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3.5 rounded-xl font-body font-black text-xs uppercase tracking-[0.18em] shadow-lg hover:opacity-90 transition-all cursor-pointer">
                  Generate Template ✨
                </button>
                <button type="button" onClick={() => setIsCreating(false)} className="bg-white/5 hover:bg-white/10 text-white/70 px-6 py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Wishes List */}
        {isLoading ? (
          <div className="text-center py-24 font-display italic text-2xl text-white/40 animate-pulse">
            Loading your occasion stories...
          </div>
        ) : filteredWishes.length === 0 ? (
          /* Heartwarming Empty State with Celebration Mockups & CTA */
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#231b1b] to-[#1a1414] border border-white/15 p-8 sm:p-12 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/20 via-rose-600/15 to-amber-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-pink-500/20 to-rose-600/10 border border-pink-500/30 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_30px_rgba(244,63,94,0.25)] mb-6">
                  ✨
                </div>

                <Eyebrow accent className="mb-2">BEGIN A JOURNEY OF UNFORGETTABLE MOMENTS</Eyebrow>
                <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl text-[#f5f1e8] mb-4 leading-tight">
                  Craft Your First Special Wish
                </h2>
                <p className="font-body text-sm sm:text-base text-white/60 leading-relaxed mb-8">
                  Every cherished celebration deserves more than a standard message. Create a breathtaking, cinematic digital storytelling experience packed with music, photos, memories, and secret surprises.
                </p>

                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-body font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <span>✨ Create a Wish for an Occasion</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Visual Occasions Inspiration Grid */}
            <div>
              <div className="text-center mb-6">
                <Eyebrow className="text-white/40">EXPLORE CELEBRATION OCCASIONS</Eyebrow>
                <h3 className="font-display italic text-2xl sm:text-3xl text-white mt-1">
                  Choose a Story for Any Special Day
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {OCCASION_SHOWCASE.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-3xl overflow-hidden bg-[#1e1919] border border-white/10 hover:border-pink-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Mockup Image Header */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1919] via-[#1e1919]/40 to-transparent" />
                      
                      {/* Badge */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-body font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
                        {item.badge}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 pt-2 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-display italic text-2xl text-white mb-1 group-hover:text-pink-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className={`text-xs font-semibold ${item.accentColor} mb-3 font-body`}>
                          "{item.tagline}"
                        </p>
                        <p className="text-xs text-white/50 font-body leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      {/* Quick Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setNewWish({ ...newWish, occasion: item.id });
                          setIsCreating(true);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-pink-600/20 text-white/80 hover:text-white border border-white/10 hover:border-pink-500/40 font-body font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
                      >
                        <span>Start {item.badge} Story</span>
                        <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWishes.map((wish) => {
              const occInfo = getOccasionInfo(wish.occasion);
              return (
                <motion.div 
                  key={wish.id}
                  whileHover={{ y: -4 }}
                  className="bg-[#1e1919] rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                        {occInfo.icon}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 border border-white/10 ${occInfo.text}`}>
                          {occInfo.label}
                        </span>
                        <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                          wish.is_published 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {wish.is_published ? '● LIVE' : '○ DRAFT'}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display italic text-2xl text-white mb-1">
                      {wish.recipient_name}
                    </h3>
                    <p className="text-white/40 text-xs font-body mb-6 tracking-wide">
                      /{wish.slug}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => navigate(`${basePath}/edit/${wish.id}`)}
                        className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-body font-bold uppercase tracking-wider text-white transition-all text-center cursor-pointer"
                      >
                        Edit Story
                      </button>
                      <a 
                        href={`/${wish.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 py-3 rounded-xl text-xs font-body font-bold uppercase tracking-wider text-center transition-all"
                      >
                        Preview ↗
                      </a>
                    </div>

                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/${wish.slug}`;
                        navigator.clipboard.writeText(url);
                        alert('Special Link Copied! 💝 Share it with your special someone.');
                      }}
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white py-3 rounded-xl text-xs font-body font-black uppercase tracking-[0.16em] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Share Special Link 🔗
                    </button>

                    {/* Claim Wish Option (for previous unassigned legacy wishes) */}
                    {(!wish.user_id || (isAdmin && user && wish.user_id !== user.id)) && (
                      <button
                        onClick={() => handleClaim(wish.id)}
                        disabled={claimingWishId === wish.id}
                        className="w-full bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 py-2.5 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>🔗</span>
                        <span>{claimingWishId === wish.id ? 'Linking...' : 'Link to My Account'}</span>
                      </button>
                    )}

                    {/* Danger: Delete Wish Button */}
                    <button
                      onClick={() => {
                        setWishToDelete(wish);
                        setConfirmNameInput('');
                        setDeleteError(null);
                      }}
                      className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 py-2.5 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>🗑️</span>
                      <span>Delete Wish Story</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* GitHub-Style Delete Confirmation Modal with Warning */}
      <AnimatePresence>
        {wishToDelete && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#1c1313] border border-red-500/35 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_25px_80px_rgba(239,68,68,0.25)] text-left relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xl text-red-400">
                    ⚠️
                  </div>
                  <div>
                    <span className="text-[10px] font-body font-black uppercase tracking-[0.2em] text-red-400 block">
                      DANGER ZONE • IRREVERSIBLE ACTION
                    </span>
                    <h3 className="font-display italic text-2xl text-white">
                      Delete Wish Story
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isDeleting) {
                      setWishToDelete(null);
                      setConfirmNameInput('');
                      setDeleteError(null);
                    }
                  }}
                  className="text-white/40 hover:text-white text-2xl transition-colors disabled:opacity-40 cursor-pointer"
                  disabled={isDeleting}
                >
                  &times;
                </button>
              </div>

              {/* Warning Content */}
              <div className="space-y-4 mb-6">
                <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 text-xs font-body text-red-200/90 leading-relaxed space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-red-300">
                    <span>🚨</span>
                    <span>Warning: Unexpected bad things will happen if you don't read this!</span>
                  </p>
                  <p>
                    This action <strong className="text-white font-extrabold underline underline-offset-2">CANNOT</strong> be undone or reversed. This will permanently delete the wish story for <strong className="text-white font-bold">{wishToDelete.recipient_name}</strong> (<code className="text-pink-300 bg-black/40 px-1.5 py-0.5 rounded font-mono">/{wishToDelete.slug}</code>), erasing every single trace including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80 pl-1">
                    <li>Personalized dedication letter & love note content</li>
                    <li>Uploaded photo gallery images & coverflow slides</li>
                    <li>Interactive quiz questions, stickers & lockscreen passcode</li>
                    <li>Memory archive polaroids & custom TV video reel</li>
                  </ul>
                  <p className="text-red-300 font-semibold pt-1">
                    ⚠️ The public link will immediately cease to function and you will permanently lose all access to this wish.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-white/70 mb-2">
                    To confirm deletion, please type <span className="text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded select-all">{wishToDelete.recipient_name}</span> below:
                  </label>
                  <input
                    type="text"
                    value={confirmNameInput}
                    onChange={(e) => setConfirmNameInput(e.target.value)}
                    placeholder={wishToDelete.recipient_name}
                    disabled={isDeleting}
                    className="w-full bg-black/60 border border-red-500/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                    autoFocus
                  />
                </div>

                {deleteError && (
                  <p className="text-xs font-body text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-500/40">
                    {deleteError}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={confirmNameInput.trim().toLowerCase() !== wishToDelete.recipient_name.trim().toLowerCase() || isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-950/40 disabled:text-red-300/30 disabled:border-red-900/30 border border-red-500/50 text-white font-body font-black text-xs uppercase tracking-[0.14em] py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Deleting Permanently...</span>
                    </>
                  ) : (
                    <span>I understand consequences, delete wish</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWishToDelete(null);
                    setConfirmNameInput('');
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-body font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl border border-white/10 transition-all cursor-pointer disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master Admin Passcode Modal (Passcode 1622) */}
      <AdminPasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={() => {
          setShowPasscodeModal(false);
          fetchWishes();
        }}
      />
    </div>
  );
};

// --- EDITOR WRAPPER ---

const WishEditorWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/wishes')
    ? '/wishes'
    : location.pathname.startsWith('/dashboard')
      ? '/dashboard'
      : '/admin';
  const { fetchWishById, currentWishId, isLoading, error } = useCmsStore();

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchWishById(id);
    }
  }, [id, fetchWishById]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-3">
      <Eyebrow accent>STUDIO WORKSPACE</Eyebrow>
      <div className="font-display italic text-3xl text-white animate-pulse">Loading Wish Editor...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-4 text-center p-6">
      <p className="font-body text-red-400">Error: {error}</p>
      <button onClick={() => navigate(basePath)} className="bg-white/10 px-6 py-3 rounded-xl font-body text-xs font-bold uppercase tracking-widest text-white cursor-pointer">
        Back to List
      </button>
    </div>
  );

  if (!id || id === 'undefined' || !currentWishId) {
    return (
      <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-4 text-center p-6">
        <p className="font-display italic text-2xl text-white/40">Wish Not Found</p>
        <button onClick={() => navigate(basePath)} className="bg-white text-black px-8 py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-widest cursor-pointer">
          Back to List
        </button>
      </div>
    );
  }

  return <WishEditor basePath={basePath} />;
};

// --- FULL CMS EDITOR ---

const WishEditor = ({ basePath = '/admin' }: { basePath?: string }) => {
  const { scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive, giftSequence, memories, updateSection, currentWishSlug, isPublished } = useCmsStore();
  const navigate = useNavigate();
  const { id, tab } = useParams<{ id: string, tab: string }>();
  
  const activeTab = (tab as any) || 'splash';
  const setActiveTab = (newTab: string) => navigate(`${basePath}/edit/${id}/${newTab}`);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local form state
  const [heroForm, setHeroForm] = useState(scrapbookHero);
  const [splashForm, setSplashForm] = useState(splashScreen);
  const [splitForm, setSplitForm] = useState(zineSplitShowcase);
  const [coverflowForm, setCoverflowForm] = useState(coverflowGallery);
  const [archiveForm, setArchiveForm] = useState(zineArchive);
  const [giftForm, setGiftForm] = useState(giftSequence);
  const [memoriesForm, setMemoriesForm] = useState(memories);

  useEffect(() => {
    setHeroForm(scrapbookHero);
    setSplashForm(splashScreen);
    setSplitForm(zineSplitShowcase);
    setCoverflowForm(coverflowGallery);
    setArchiveForm(zineArchive);
    setGiftForm(giftSequence);
    setMemoriesForm(memories);
  }, [scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive, giftSequence, memories]);

  const handleSave = async (section: any, form: any) => {
    setIsSaving(true);
    try {
      await updateSection(section, form);
      alert('Changes saved successfully! ✨');
    } catch (err: any) {
      alert('Save error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: any, fieldName: string, setter: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = useAuthStore.getState().getToken() || localStorage.getItem('admin_token') || '';
      const res = await fetch(`${API_URL}/api/cms/upload`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setter((prev: any) => ({ ...prev, [fieldName]: data.url }));
    } catch (error: any) {
      console.error('[CMS] Media Upload Error:', error);
      alert('Upload failed: ' + (error.message || 'Error'));
    } finally {
      setUploadingField(null);
    }
  };

  const handleArrayFileUpload = async (e: any, index: number, fieldName: string, setter: any, arrayKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(`${arrayKey}-${index}`);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = useAuthStore.getState().getToken() || localStorage.getItem('admin_token') || '';
      const res = await fetch(`${API_URL}/api/cms/upload`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      setter((prev: any) => {
        if (!prev || !prev[arrayKey]) return prev;
        const newItems = [...prev[arrayKey]];
        if (typeof newItems[index] === 'string') {
          newItems[index] = data.url;
        } else {
          newItems[index] = { ...newItems[index], [fieldName]: data.url };
        }
        return { ...prev, [arrayKey]: newItems };
      });
    } catch (error: any) {
      console.error('[CMS] Media Upload Error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploadingField(null);
    }
  };

  const tabs = [
    { id: 'splash', label: '1. Unlock & Splash', desc: 'Countdown & Lock' },
    { id: 'hero', label: '2. Hero Chapter', desc: 'Main Identity & Top' },
    { id: 'split', label: '3. Living Art Zine', desc: 'Flip Cards & Notes' },
    { id: 'archive', label: '4. Archival Vault', desc: 'Large Image & Form' },
    { id: 'coverflow', label: '5. Photo Slider', desc: 'Infinite Reel' },
    { id: 'gift', label: '6. Gift & Quiz', desc: 'Unboxing & Letter' },
    { id: 'memories', label: '7. Memories Wall', desc: 'TV & Polaroids' },
  ];

  return (
    <div className="min-h-screen bg-[#151111] text-[#e6d0d2] flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="bg-[#1e1919] border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-[1000]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(basePath)} 
            className="text-white/50 hover:text-white font-body text-xs uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div className="h-4 w-px bg-white/15" />
          <h1 className="font-body text-sm font-semibold truncate text-white/80">
            <span className="hidden sm:inline">Editing: </span>
            <span className="text-pink-400 font-mono font-bold">/{currentWishSlug}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSection('is_published' as any, !isPublished)}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-body font-black uppercase tracking-widest transition-all ${
              isPublished 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isPublished ? '● Published' : '○ Draft'}
          </button>
          
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => {
                const url = `${window.location.origin}/${currentWishSlug}`;
                navigator.clipboard.writeText(url);
                alert('Special Link Copied! 💝');
              }}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-5 py-2 rounded-xl text-xs font-body font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
            >
              Share Link 🔗
            </button>
            <a 
              href={`/${currentWishSlug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-widest transition-colors"
            >
              Preview ↗
            </a>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 rounded-xl transition-colors lg:hidden"
          >
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[900] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 w-72 bg-[#1b1717] border-r border-white/10 p-4 flex flex-col gap-1.5 z-[950] transition-transform duration-300
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden flex justify-between items-center mb-4 px-2 pt-2">
            <span className="font-body font-bold text-xs uppercase tracking-widest text-white/50">Story Chapters</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-white/60 text-xl">&times;</button>
          </div>

          <div className="mb-3 px-3">
            <Eyebrow>STORY SECTIONS</Eyebrow>
          </div>

          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex flex-col ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-pink-600/20 to-rose-600/10 border border-pink-500/40 text-white'
                  : 'hover:bg-white/5 text-white/60 hover:text-white border border-transparent'
              }`}
            >
              <span className="font-body font-bold text-xs uppercase tracking-wider">{t.label}</span>
              <span className="font-body text-[10px] text-white/40 mt-0.5">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Main Content Form Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 bg-black/30">
          <AnimatePresence mode="wait">
            
            {/* 1. SPLASH / LOCKSCREEN TAB */}
            {activeTab === 'splash' && splashForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading chapter="CHAPTER 01" title="Countdown & Unlock Experience" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField label="Lock Screen Heading" hint="Main title before unlocked">
                    <input 
                      type="text" 
                      value={splashForm.lockHeading} 
                      onChange={e => setSplashForm({...splashForm, lockHeading: e.target.value})}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 transition-all outline-none"
                      placeholder="Enter the passcode"
                    />
                  </FormField>

                  <FormField label="Lock Screen Subtext" hint="Small hint below heading">
                    <input 
                      type="text" 
                      value={splashForm.lockSubtext} 
                      onChange={e => setSplashForm({...splashForm, lockSubtext: e.target.value})}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 transition-all outline-none"
                      placeholder="Your special day"
                    />
                  </FormField>

                  <FormField label="Post-Countdown Birthday Heading" hint="Shown upon timer completion">
                    <input 
                      type="text" 
                      value={splashForm.birthdayHeading} 
                      onChange={e => setSplashForm({...splashForm, birthdayHeading: e.target.value})}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 transition-all outline-none"
                      placeholder="e.g. HAPPY BIRTHDAY BEAUTIFUL!"
                    />
                  </FormField>

                  <FormField label="Target Date" hint="ISO Format: YYYY-MM-DDTHH:mm:ss">
                    <input 
                      type="text" 
                      value={splashForm.targetDate} 
                      onChange={e => setSplashForm({...splashForm, targetDate: e.target.value})} 
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white focus:border-pink-500 transition-all outline-none" 
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <div className="mb-2">
                      <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/50">Passcode Digits (MM / DD / YYYY)</label>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField label="Month (MM)">
                        <input type="text" value={splashForm.correctMonth} onChange={e => setSplashForm({...splashForm, correctMonth: e.target.value})} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-center font-mono text-sm text-white" />
                      </FormField>
                      <FormField label="Day (DD)">
                        <input type="text" value={splashForm.correctDay} onChange={e => setSplashForm({...splashForm, correctDay: e.target.value})} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-center font-mono text-sm text-white" />
                      </FormField>
                      <FormField label="Year (YYYY)">
                        <input type="text" value={splashForm.correctYear} onChange={e => setSplashForm({...splashForm, correctYear: e.target.value})} className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-center font-mono text-sm text-white" />
                      </FormField>
                    </div>
                  </div>

                  <FormField label="Splash Center Polaroid Image">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/15 group">
                      {splashForm.splashImage ? (
                        <img src={splashForm.splashImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-white/30 font-body">No Image</div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-body font-bold tracking-wider">
                        {uploadingField === 'splashImage' ? 'Uploading...' : 'CHANGE PHOTO'}
                        <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, 'splashImage', setSplashForm)} />
                      </label>
                    </div>
                  </FormField>

                  <FormField label="Global Ambient Background Image">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/15 group">
                      {splashForm.bgImage ? (
                        <img src={splashForm.bgImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-white/30 font-body">Default Background</div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-body font-bold tracking-wider">
                        {uploadingField === 'bgImage' ? 'Uploading...' : 'SET BACKGROUND'}
                        <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, 'bgImage', setSplashForm)} />
                      </label>
                    </div>
                  </FormField>
                </div>

                <SaveBtn onClick={() => handleSave('splashScreen', splashForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 2. HERO CHAPTER TAB */}
            {activeTab === 'hero' && heroForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading chapter="CHAPTER 02" title="Hero Display & Scrapbook Identity" />

                <div className="space-y-6">
                  <FormField label="Hero Top Paragraph Text" hint="Opening dedication message">
                    <textarea 
                      value={heroForm.topText} 
                      onChange={e => setHeroForm({...heroForm, topText: e.target.value})} 
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white min-h-[100px] outline-none focus:border-pink-500" 
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Hero Heading Line 1" hint="Display font line 1">
                      <input 
                        type="text" 
                        value={heroForm.middleHeading1} 
                        onChange={e => setHeroForm({...heroForm, middleHeading1: e.target.value})} 
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                      />
                    </FormField>
                    <FormField label="Hero Heading Line 2" hint="Display font line 2">
                      <input 
                        type="text" 
                        value={heroForm.middleHeading2} 
                        onChange={e => setHeroForm({...heroForm, middleHeading2: e.target.value})} 
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                      />
                    </FormField>
                  </div>

                  <FormField label="Middle Section Subtitle / Metadata" hint="Bottom line of collage">
                    <input 
                      type="text" 
                      value={heroForm.middleBottomText} 
                      onChange={e => setHeroForm({...heroForm, middleBottomText: e.target.value})} 
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                    />
                  </FormField>

                  {/* Image Grid */}
                  <div>
                    <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/50 mb-3">Scrapbook Hero Photographs</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { key: 'topImage', label: 'Top Banner' },
                        { key: 'bgMiddleImage', label: 'Middle Backdrop' },
                        { key: 'middleImageLeft', label: 'Stamp Left' },
                        { key: 'middleImageRight', label: 'Stamp Right' },
                        { key: 'bottomImage', label: 'Bottom Banner' },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <span className="text-[10px] font-body uppercase tracking-wider text-white/40">{label}</span>
                          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/15 group">
                            {(heroForm as any)[key] ? (
                              <img src={(heroForm as any)[key]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/30 font-body">No Photo</div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-[10px] font-body font-bold tracking-wider">
                              {uploadingField === key ? '...' : 'UPLOAD'}
                              <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, key, setHeroForm)} />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SaveBtn onClick={() => handleSave('scrapbookHero', heroForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 3. SPLIT ZINE TAB */}
            {activeTab === 'split' && splitForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading 
                  chapter="CHAPTER 03" 
                  title="Living Art Zine (Flip Cards)" 
                  action={
                    <button 
                      onClick={() => setSplitForm({ ...splitForm, items: [...splitForm.items, { image: '', backText: '', desc: '' }] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all"
                    >
                      + Add Card
                    </button>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {splitForm.items.map((item, index) => (
                    <div key={index} className="space-y-4 bg-[#1e1919] p-6 rounded-3xl border border-white/10 relative group">
                      <button 
                        onClick={() => {
                          const newItems = splitForm.items.filter((_, i) => i !== index);
                          setSplitForm({ ...splitForm, items: newItems });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-xs"
                      >
                        ×
                      </button>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-body font-bold uppercase tracking-widest text-pink-400">Card 0{index + 1}</span>
                      </div>
                      
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 group/img">
                        {item.image ? (
                          <img src={item.image} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-white/30 font-body">No Photo</div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 text-xs font-body font-bold">
                          {uploadingField === `items-${index}` ? '...' : 'SET PHOTO'}
                          <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, index, 'image', setSplitForm, 'items')} />
                        </label>
                      </div>

                      <FormField label="Back Note (Handwritten Caveat)">
                        <input 
                          type="text" 
                          placeholder="Write something intimate..."
                          value={item.backText} 
                          onChange={e => {
                            const newItems = [...splitForm.items];
                            newItems[index] = { ...newItems[index], backText: e.target.value };
                            setSplitForm({ ...splitForm, items: newItems });
                          }} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>

                      <FormField label="Footer Caption">
                        <input 
                          type="text" 
                          placeholder="Date or short context..."
                          value={item.desc} 
                          onChange={e => {
                            const newItems = [...splitForm.items];
                            newItems[index] = { ...newItems[index], desc: e.target.value };
                            setSplitForm({ ...splitForm, items: newItems });
                          }} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>
                    </div>
                  ))}
                </div>

                <SaveBtn onClick={() => handleSave('zineSplitShowcase', splitForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 4. ARCHIVE SECTION TAB */}
            {activeTab === 'archive' && archiveForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading chapter="CHAPTER 04" title="Archival Vault & Notes" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField label="Section Title">
                    <input 
                      type="text" 
                      value={archiveForm.sectionHeading} 
                      onChange={e => setArchiveForm({...archiveForm, sectionHeading: e.target.value})} 
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                    />
                  </FormField>

                  <FormField label="Sticky Note Text (Caveat Handwritten)">
                    <textarea 
                      value={archiveForm.stickyNoteText} 
                      onChange={e => setArchiveForm({...archiveForm, stickyNoteText: e.target.value})} 
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white min-h-[90px] outline-none focus:border-pink-500" 
                    />
                  </FormField>
                  
                  {/* Left & Right Images */}
                  {[
                    { field: 'leftImage', label: 'Primary Left Photo' },
                    { field: 'rightImage', label: 'Secondary Right Photo' }
                  ].map(({ field, label }) => (
                    <div key={field} className="space-y-4 bg-[#1e1919] p-6 rounded-3xl border border-white/10">
                      <FormField label={label}>
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 mb-4 group">
                          {(archiveForm as any)[field] ? (
                            <img src={(archiveForm as any)[field]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-white/30 font-body">No Photo</div>
                          )}
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-xs font-body font-bold">
                            {uploadingField === field ? '...' : 'UPLOAD'}
                            <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, field, setArchiveForm)} />
                          </label>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Label or Date..." 
                          value={(archiveForm as any)[field + 'Name']} 
                          onChange={e => setArchiveForm({...archiveForm, [field + 'Name']: e.target.value})} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>
                    </div>
                  ))}
                </div>

                <SaveBtn onClick={() => handleSave('zineArchive', archiveForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 5. COVERFLOW / PHOTO SLIDER TAB */}
            {activeTab === 'coverflow' && coverflowForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading 
                  chapter="CHAPTER 05" 
                  title="Infinite Photo Panorama" 
                  action={
                    <button 
                      onClick={() => setCoverflowForm({ ...coverflowForm, images: [...coverflowForm.images, ''] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all"
                    >
                      + Add Slide
                    </button>
                  }
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {coverflowForm.images.map((img, index) => (
                    <div key={index} className="space-y-2 relative group bg-[#1e1919] p-4 rounded-3xl border border-white/10">
                      <button 
                        onClick={() => {
                          const newImages = coverflowForm.images.filter((_, i) => i !== index);
                          setCoverflowForm({ ...coverflowForm, images: newImages });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-xs"
                      >
                        ×
                      </button>
                      <span className="text-[10px] font-body font-bold uppercase tracking-wider text-pink-400">Slide 0{index + 1}</span>
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 border border-white/10 group/img">
                        {img ? (
                          <img src={img} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/30 font-body">No Photo</div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 text-xs font-body font-bold text-center p-2">
                          {uploadingField === `images-${index}` ? '...' : 'UPLOAD'}
                          <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, index, '', setCoverflowForm, 'images')} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <SaveBtn onClick={() => handleSave('coverflowGallery', coverflowForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 6. GIFT & QUIZ TAB */}
            {activeTab === 'gift' && giftForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading chapter="CHAPTER 06" title="Gift Unboxing & Love Letter" />

                <div className="space-y-8">
                  {/* Letter Section */}
                  <div className="bg-[#1e1919] p-8 rounded-3xl border border-white/10 space-y-6">
                    <Eyebrow accent>THE WRITTEN LOVE LETTER</Eyebrow>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Letter Title">
                        <input 
                          type="text" 
                          value={giftForm.letterTitle} 
                          onChange={e => setGiftForm({...giftForm, letterTitle: e.target.value})} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>
                      <FormField label="CTA Button Text">
                        <input 
                          type="text" 
                          value={giftForm.ctaText} 
                          onChange={e => setGiftForm({...giftForm, ctaText: e.target.value})} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>
                    </div>

                    <FormField label="Letter Body Content (Rendered in Caveat Handwriting)">
                      <textarea 
                        value={giftForm.letterBody} 
                        onChange={e => setGiftForm({...giftForm, letterBody: e.target.value})} 
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white min-h-[160px] outline-none focus:border-pink-500" 
                      />
                    </FormField>

                    <FormField label="Letter Footer / Signature">
                      <input 
                        type="text" 
                        value={giftForm.letterFooter} 
                        onChange={e => setGiftForm({...giftForm, letterFooter: e.target.value})} 
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                      />
                    </FormField>
                  </div>

                  {/* Gift Media Section */}
                  <div className="bg-[#1e1919] p-8 rounded-3xl border border-white/10 space-y-6">
                    <Eyebrow accent>SURPRISE MEDIA</Eyebrow>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Gift Type">
                        <select 
                          value={giftForm.giftType} 
                          onChange={e => setGiftForm({...giftForm, giftType: e.target.value as any})} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500"
                        >
                          <option value="video">Video Sequence</option>
                          <option value="photo">Surprise Photo</option>
                        </select>
                      </FormField>
                      <FormField label="Gift URL / Media Link">
                        <input 
                          type="text" 
                          value={giftForm.giftUrl} 
                          onChange={e => setGiftForm({...giftForm, giftUrl: e.target.value})} 
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500" 
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                <SaveBtn onClick={() => handleSave('giftSequence', giftForm)} isSaving={isSaving} />
              </motion.div>
            )}

            {/* 7. MEMORIES WALL TAB */}
            {activeTab === 'memories' && memoriesForm && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto space-y-10">
                <SectionHeading 
                  chapter="CHAPTER 07" 
                  title="Polaroid Memories Wall & TV" 
                  action={
                    <button 
                      onClick={() => setMemoriesForm({ ...memoriesForm, polaroids: [...memoriesForm.polaroids, { url: '', text: '' }] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all"
                    >
                      + Add Polaroid
                    </button>
                  }
                />

                <div className="space-y-8">
                  {/* TV Config */}
                  <div className="bg-[#1e1919] p-8 rounded-3xl border border-white/10 space-y-6">
                    <Eyebrow accent>CINEMATIC MONITOR</Eyebrow>
                    <FormField label="TV Content Type">
                      <select 
                        value={memoriesForm.tvType} 
                        onChange={e => setMemoriesForm({...memoriesForm, tvType: e.target.value as any})} 
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 font-body text-sm text-white outline-none focus:border-pink-500"
                      >
                        <option value="video">Video Sequence</option>
                        <option value="slideshow">Photo Slideshow</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Polaroids List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {memoriesForm.polaroids.map((p, i) => (
                      <div key={i} className="bg-[#1e1919] p-6 rounded-3xl border border-white/10 flex gap-6 items-center relative group">
                        <button 
                          onClick={() => {
                            const newPolaroids = memoriesForm.polaroids.filter((_, idx) => idx !== i);
                            setMemoriesForm({ ...memoriesForm, polaroids: newPolaroids });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-xs"
                        >
                          ×
                        </button>
                        <div className="w-24 aspect-[4/5] bg-white p-1 shadow-xl rounded-sm relative shrink-0 overflow-hidden">
                          {p.url ? (
                            <img src={p.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 font-body">No Photo</div>
                          )}
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/60 opacity-0 hover:opacity-100 transition-opacity text-[10px] font-body font-bold text-white">
                            {uploadingField === `polaroids-${i}` ? '...' : 'SET'}
                            <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, i, 'url', setMemoriesForm, 'polaroids')} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-2">
                          <span className="text-[10px] font-body font-bold uppercase tracking-wider text-pink-400">Polaroid Note 0{i + 1}</span>
                          <textarea 
                            value={p.text} 
                            onChange={e => {
                              const newPolaroids = [...memoriesForm.polaroids];
                              newPolaroids[i] = { ...newPolaroids[i], text: e.target.value };
                              setMemoriesForm({ ...memoriesForm, polaroids: newPolaroids });
                            }} 
                            placeholder="Handwritten memory message..." 
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs font-body text-white h-20 outline-none focus:border-pink-500" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <SaveBtn onClick={() => handleSave('memories', memoriesForm)} isSaving={isSaving} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
