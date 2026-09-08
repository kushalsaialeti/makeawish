import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Database,
  Edit3,
  Trash2,
  Copy,
  Plus,
  LogOut,
  RefreshCw,
  FolderLock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Eyebrow } from '../components/ui/Typography';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AdminConsole: React.FC = () => {
  const [wishes, setWishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newWish, setNewWish] = useState({ slug: '', name: '', occasion: 'birthday' });
  const [wishToDelete, setWishToDelete] = useState<any | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [claimingWishId, setClaimingWishId] = useState<string | null>(null);

  const { user, signOut, getToken, exitAdminMode, claimWish } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminWishes();
  }, []);

  const fetchAdminWishes = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch(`${API_URL}/cms/admin/all-wishes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Fallback to standard cms endpoint with admin token
        const fallbackRes = await fetch(`${API_URL}/cms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fallbackData = await fallbackRes.json();
        setWishes(Array.isArray(fallbackData) ? fallbackData : []);
        return;
      }

      const data = await response.json();
      setWishes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Admin Console Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.slug || !newWish.name) return;

    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch(`${API_URL}/cms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: newWish.slug,
          recipient_name: newWish.name,
          occasion: newWish.occasion,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create wish');

      setIsCreating(false);
      setNewWish({ slug: '', name: '', occasion: 'birthday' });
      fetchAdminWishes();
      navigate(`/wishes/edit/${data.id}`);
    } catch (err: any) {
      alert(`Error creating wish: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (wishId: string) => {
    setClaimingWishId(wishId);
    const res = await claimWish(wishId);
    setClaimingWishId(null);
    if (res.success) {
      fetchAdminWishes();
      alert('Wish successfully linked to your admin identity! 💝');
    } else {
      alert(`Error linking wish: ${res.error}`);
    }
  };

  const handleDelete = async () => {
    if (!wishToDelete) return;
    if (confirmNameInput.trim().toLowerCase() !== wishToDelete.recipient_name.trim().toLowerCase()) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/cms/${wishToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete wish');
      }

      setWishes((prev) => prev.filter((w) => w.id !== wishToDelete.id));
      setWishToDelete(null);
      setConfirmNameInput('');
    } catch (err: any) {
      setDeleteError(err.message || 'Deletion error');
    } finally {
      setIsDeleting(false);
    }
  };

  const liveCount = wishes.filter((w) => w.is_published).length;
  const draftCount = wishes.length - liveCount;

  return (
    <div className="min-h-screen bg-[#0d090a] text-[#f3d3d3] p-4 sm:p-8 md:p-14 font-sans selection:bg-[#7a1022]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top High-Tech Admin Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] border border-red-400/40">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-black uppercase tracking-[0.25em] text-red-400">
                  SUPER ADMIN CONSOLE • PASSCODE 1622
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                  ROOT ACCESS
                </span>
              </div>
              <p className="text-xs font-mono text-white/50 mt-0.5">
                Logged in as: <strong className="text-white">{user?.email || 'master.admin@makeawish.app'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/wishes')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-body font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Client Studio View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={async () => {
                exitAdminMode();
                await signOut();
                navigate('/admin-1622');
              }}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/30 text-xs font-body font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* System Analytics & Status Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#181112] border border-red-500/20 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-red-400">Total Creations</span>
              <Database className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display italic text-white font-bold">{wishes.length}</p>
              <p className="text-[11px] text-white/40 mt-1">All works across database</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#181112] border border-green-500/20 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-green-400">Live Experiences</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display italic text-white font-bold">{liveCount}</p>
              <p className="text-[11px] text-white/40 mt-1">Publicly accessible links</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#181112] border border-amber-500/20 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">Draft Works</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display italic text-white font-bold">{draftCount}</p>
              <p className="text-[11px] text-white/40 mt-1">Under customization</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#181112] border border-purple-500/20 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400">Security Gate</span>
              <FolderLock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display italic text-white font-bold">72h JWT</p>
              <p className="text-[11px] text-white/40 mt-1">Passcode 1622 Encrypted</p>
            </div>
          </div>
        </div>

        {/* Master Showcase Header & Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <div>
            <Eyebrow accent className="text-red-400 mb-1">PORTFOLIO & CREATIONS SHOWCASE</Eyebrow>
            <h2 className="font-display italic text-3xl sm:text-4xl text-white">
              All Previous Works & Stories
            </h2>
            <p className="font-body text-xs sm:text-sm text-white/50 mt-1">
              Showcase your past celebration creations to clients or manage any story in the database.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchAdminWishes}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Refresh Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsCreating(true)}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Wish Story</span>
            </button>
          </div>
        </div>

        {/* Create Story Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreateWish}
              className="bg-[#181112] border border-red-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display italic text-2xl text-white">Create New Celebration Experience</h3>
                <p className="text-xs text-white/40 mt-1">Provide recipient name, occasion, and custom URL slug.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-red-300 mb-1.5">
                    Celebration Occasion
                  </label>
                  <select
                    value={newWish.occasion}
                    onChange={(e) => setNewWish({ ...newWish, occasion: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="birthday">🎂 Birthday</option>
                    <option value="anniversary">💍 Anniversary</option>
                    <option value="valentine">💖 Valentine's Day</option>
                    <option value="graduation">🎓 Graduation</option>
                    <option value="milestone">🏆 Milestone</option>
                    <option value="custom">✨ Custom Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-red-300 mb-1.5">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={newWish.name}
                    onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                    placeholder="e.g. Subba Lakshmi"
                    required
                    className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-red-300 mb-1.5">
                    Custom URL Slug
                  </label>
                  <input
                    type="text"
                    value={newWish.slug}
                    onChange={(e) => setNewWish({ ...newWish, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                    placeholder="e.g. luckyyyy-thallii"
                    required
                    className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white outline-none font-mono placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !newWish.slug || !newWish.name}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-body font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  Generate Experience ✨
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-body font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Master Showcase Grid of All Previous Works */}
        {isLoading ? (
          <div className="text-center py-24 font-display italic text-2xl text-red-400/50 animate-pulse flex items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading showcase works from database...</span>
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-20 bg-[#181112] rounded-3xl border border-red-500/20 p-10 flex flex-col items-center gap-4">
            <span className="text-4xl">🎁</span>
            <h3 className="font-display italic text-2xl text-white">No Previous Works Found</h3>
            <p className="text-xs text-white/50 max-w-md">
              Create your first celebration story above to begin your master showcase archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl overflow-hidden bg-[#181112] border border-red-500/25 hover:border-red-500/60 p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl shadow-inner">
                      {wish.occasion === 'anniversary'
                        ? '💍'
                        : wish.occasion === 'valentine'
                        ? '💖'
                        : wish.occasion === 'graduation'
                        ? '🎓'
                        : wish.occasion === 'milestone'
                        ? '🏆'
                        : wish.occasion === 'custom'
                        ? '✨'
                        : '🎂'}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 border border-white/10 text-red-300">
                        {wish.occasion || 'birthday'}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                          wish.is_published
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {wish.is_published ? '● LIVE' : '○ DRAFT'}
                      </span>
                    </div>
                  </div>

                  {/* Story Title & Slug */}
                  <h3 className="font-display italic text-2xl text-white mb-1 group-hover:text-red-300 transition-colors">
                    {wish.recipient_name}
                  </h3>
                  <p className="text-white/40 text-xs font-mono mb-6 tracking-wide flex items-center gap-1.5">
                    <span>Slug:</span>
                    <span className="text-red-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      /{wish.slug}
                    </span>
                  </p>
                </div>

                {/* Card Actions */}
                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/wishes/edit/${wish.id}`)}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-xs font-body font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Story</span>
                    </button>

                    <a
                      href={`/${wish.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 py-2.5 rounded-xl text-xs font-body font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Showcase ↗</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/${wish.slug}`;
                      navigator.clipboard.writeText(url);
                      alert(`Showcase Link Copied: ${url}`);
                    }}
                    className="w-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/10 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-red-400" />
                    <span>Copy Live Showcase URL</span>
                  </button>

                  {/* Link to Admin Account if unassigned */}
                  {!wish.user_id && (
                    <button
                      onClick={() => handleClaim(wish.id)}
                      disabled={claimingWishId === wish.id}
                      className="w-full bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🔗</span>
                      <span>{claimingWishId === wish.id ? 'Linking...' : 'Link to Admin Identity'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setWishToDelete(wish);
                      setConfirmNameInput('');
                      setDeleteError(null);
                    }}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Story</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {wishToDelete && (
          <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#181112] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left"
            >
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-display italic text-2xl text-white">Confirm Admin Deletion</h3>
              </div>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Type the recipient name <strong className="text-white">{wishToDelete.recipient_name}</strong> to permanently remove this wish from the database:
              </p>
              <input
                type="text"
                value={confirmNameInput}
                onChange={(e) => setConfirmNameInput(e.target.value)}
                placeholder={wishToDelete.recipient_name}
                className="w-full bg-black/60 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-white font-mono mb-4 outline-none"
              />
              {deleteError && <p className="text-xs text-red-400 mb-4">{deleteError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || confirmNameInput.trim().toLowerCase() !== wishToDelete.recipient_name.trim().toLowerCase()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white py-3 rounded-xl text-xs font-mono uppercase font-bold"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
                <button
                  onClick={() => setWishToDelete(null)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-mono uppercase"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
