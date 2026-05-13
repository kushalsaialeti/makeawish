import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../store/cmsStore';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AdminDashboard = () => { 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/validate-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        setIsAuthenticated(data.valid);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        alert('Incorrect PIN');
      }
    } catch (err) {
      alert('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isAuthenticated === null) return <div className="min-h-screen bg-[#1c1917] flex items-center justify-center text-white italic">Verifying Session...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center p-6">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePinSubmit}
          className="bg-[#2d2a28] p-10 rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-md text-center"
        >
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Admin Access</h2>
          <p className="text-white/40 text-xs mb-10 uppercase tracking-widest">Enter secure passcode</p>
          
          <div className="relative mb-10">
            {/* Hidden Input to capture keystrokes */}
            <input 
              type="text" 
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                setPin(val);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              autoFocus
            />
            
            {/* Visual PIN Boxes */}
            <div className="flex justify-between gap-3 px-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className={`flex-1 aspect-[2/3] rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all duration-300 ${
                    pin.length > i 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white border-transparent shadow-[0_0_20px_rgba(219,39,119,0.5)] scale-110' 
                      : pin.length === i 
                        ? 'border-pink-500/50 bg-pink-500/5 animate-pulse' 
                        : 'border-white/5 bg-black/40 text-white/10'
                  }`}
                >
                  {pin.length > i ? '•' : ''}
                </div>
              ))}
            </div>
          </div>

          <button 
            disabled={isLoggingIn || pin.length < 8}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-30 disabled:grayscale"
          >
            {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<WishList />} />
      <Route path="/edit/:id" element={<WishEditorWrapper />} />
      <Route path="/edit/:id/:tab" element={<WishEditorWrapper />} />
    </Routes>
  );
};

const WishList = () => {
  const [wishes, setWishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newWish, setNewWish] = useState({ slug: '', name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/cms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return;
      }
      const data = await response.json();
      setWishes(data);
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
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/cms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slug: newWish.slug, recipient_name: newWish.name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create wish');
      if (data.id) {
        navigate(`/admin/edit/${data.id}`);
      } else {
        throw new Error('No ID returned from server');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Birthday Factory</h1>
            <p className="text-white/40 font-serif italic text-sm md:text-base">Manage and create magical birthday experiences.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-lg active:scale-95"
          >
            + Create New Wish
          </button>
        </div>

        {isCreating && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            onSubmit={handleCreate}
            className="bg-[#2d2a28] p-6 md:p-8 rounded-3xl mb-12 border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Recipient Name</label>
                <input 
                  type="text" 
                  value={newWish.name}
                  onChange={e => setNewWish({...newWish, name: e.target.value})}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Unique URL Slug</label>
                <input 
                  type="text" 
                  value={newWish.slug}
                  onChange={e => setNewWish({...newWish, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                  placeholder="e.g. sarah-2024"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="bg-pink-600 px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex-1 shadow-lg active:scale-95 transition-all">Generate Template</button>
              <button type="button" onClick={() => setIsCreating(false)} className="bg-white/10 px-8 py-4 rounded-xl font-bold uppercase tracking-widest md:flex-initial transition-all">Cancel</button>
            </div>
          </motion.form>
        )}

        {isLoading ? (
          <div className="text-center py-20 opacity-40 italic">Loading your masterpieces...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishes.map((wish) => (
              <motion.div 
                key={wish.id}
                whileHover={{ y: -5 }}
                className="bg-[#2d2a28] rounded-3xl p-6 border border-white/5 shadow-xl group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">🎁</div>
                  <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${wish.is_published ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {wish.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{wish.recipient_name}</h3>
                <p className="text-white/30 text-xs font-mono mb-6">/wish/{wish.slug}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/admin/edit/${wish.id}`)}
                      className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-colors"
                    >
                      Edit Content
                    </button>
                    <a 
                      href={`/wish/${wish.slug}`}
                      target="_blank"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 py-3 rounded-xl text-sm font-bold text-center transition-colors"
                    >
                      Preview
                    </a>
                  </div>
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/${wish.slug}`;
                      navigator.clipboard.writeText(url);
                      alert('Special Link Copied! 💝 Share it with your special someone.');
                    }}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Share Special Link 🔗
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WishEditorWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchWishById, currentWishId, isLoading, error } = useCmsStore();

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchWishById(id);
    }
  }, [id, fetchWishById]);

  if (isLoading) return <div className="min-h-screen bg-[#1c1917] flex items-center justify-center text-white italic">Loading Editor...</div>;
  if (error) return <div className="min-h-screen bg-[#1c1917] flex items-center justify-center text-red-400">Error: {error}</div>;
  if (!id || id === 'undefined') {
    return <div className="min-h-screen bg-[#1c1917] flex flex-col items-center justify-center text-white">
      <p className="mb-4 opacity-40 italic">Invalid Wish ID</p>
      <button onClick={() => navigate('/admin')} className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-widest">Back to List</button>
    </div>;
  }

  if (!currentWishId) return null;

  return <WishEditor />;
};

const WishEditor = () => {
  const { scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive, giftSequence, memories, updateSection, currentWishSlug, isPublished } = useCmsStore();
  const navigate = useNavigate();
  const { id, tab } = useParams<{ id: string, tab: string }>();
  
  const activeTab = (tab as any) || 'splash';
  const setActiveTab = (newTab: string) => navigate(`/admin/edit/${id}/${newTab}`);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Local state for forms
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
    await updateSection(section, form);
  };

  const handleFileUpload = async (e: any, fieldName: string, setter: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('admin_token');
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
      const message = error.message || 'Upload failed';
      alert('Upload failed: ' + message);
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
      const token = localStorage.getItem('admin_token');
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

  return (
    <div className="min-h-screen bg-[#1c1917] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#2d2a28] border-b border-white/10 p-4 md:p-6 flex justify-between items-center sticky top-0 z-[1000]">
        <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
          <button onClick={() => navigate('/admin')} className="text-white/40 hover:text-white shrink-0">←</button>
          <h1 className="text-sm md:text-xl font-bold uppercase tracking-widest truncate">
            <span className="hidden md:inline">Editing: </span>
            <span className="text-pink-500">/{currentWishSlug}</span>
          </h1>
        </div>
        
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSection('is_published' as any, !isPublished)}
                className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  isPublished 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isPublished ? '● Published' : '○ Draft'}
              </button>
              <div className="hidden lg:flex items-center gap-4">
             <button 
               onClick={() => {
                 const url = `${window.location.origin}/${currentWishSlug}`;
                 navigator.clipboard.writeText(url);
                 alert('Special Link Copied! 💝');
               }}
               className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
             >
               Share Link 🔗
             </button>
             <a href={`/${currentWishSlug}`} target="_blank" className="bg-white/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">Preview</a>
             <button 
               onClick={() => {
                 localStorage.removeItem('admin_token');
                 window.location.reload();
               }}
               className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors"
             >
               Logout
             </button>
           </div>

           {/* Mobile Menu Toggle (3 Dots) */}
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="w-10 h-10 flex flex-col items-center justify-center gap-1 hover:bg-white/5 rounded-full transition-colors lg:hidden"
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

        {/* Tabs Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 w-64 bg-[#211f1d] border-r border-white/5 p-4 flex flex-col gap-2 z-[950] transition-transform duration-300 transform
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden flex justify-between items-center mb-6 px-2">
            <span className="font-bold text-xs uppercase tracking-widest text-white/40">Navigation</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-white/40 text-xl">&times;</button>
          </div>

          {[
            { id: 'memories', label: 'Memories Column', icon: '📺' },
            { id: 'splash', label: 'Splash Screen', icon: '🔒' },
            { id: 'hero', label: 'Scrapbook Hero', icon: '📖' },
            { id: 'split', label: 'Split Showcase', icon: '🖼️' },
            { id: 'archive', label: 'Memories Archive', icon: '📂' },
            { id: 'coverflow', label: 'Photo Slider', icon: '🎠' },
            { id: 'gift', label: 'Gift Sequence', icon: '🎁' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
            >
              <span className="w-6 text-center">{tab.icon}</span>
              {tab.label}
            </button>
          ))}

          {/* Mobile-only secondary actions */}
          <div className="mt-auto lg:hidden pt-6 border-t border-white/5 space-y-3">
             <button 
               onClick={() => {
                 const url = `${window.location.origin}/${currentWishSlug}`;
                 navigator.clipboard.writeText(url);
                 alert('Link Copied! 💝');
               }}
               className="w-full bg-pink-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
             >
               Copy Share Link
             </button>
             <a href={`/${currentWishSlug}`} target="_blank" className="block w-full bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">Preview Site</a>
             <button 
               onClick={() => {
                 localStorage.removeItem('admin_token');
                 window.location.reload();
               }}
               className="w-full bg-red-500/10 text-red-400 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
             >
               Logout
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-black/20">
          <AnimatePresence mode="wait">
            {activeTab === 'splash' && splashForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">Splash Screen Settings <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Lock Screen Heading</label>
                       <input 
                         type="text" 
                         value={splashForm.lockHeading} 
                         onChange={e => setSplashForm({...splashForm, lockHeading: e.target.value})}
                         className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3"
                         placeholder="Enter the passcode"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Lock Screen Subtext (Small Hint)</label>
                       <input 
                         type="text" 
                         value={splashForm.lockSubtext} 
                         onChange={e => setSplashForm({...splashForm, lockSubtext: e.target.value})}
                         className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3"
                         placeholder="Your special day"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Post-Countdown Heading</label>
                       <input 
                         type="text" 
                         value={splashForm.birthdayHeading} 
                         onChange={e => setSplashForm({...splashForm, birthdayHeading: e.target.value})}
                         className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3"
                         placeholder="e.g. HAPPY BIRTHDAY BEAUTIFUL!"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Target Date (YYYY-MM-DDTHH:mm:ss)</label>
                       <input type="text" value={splashForm.targetDate} onChange={e => setSplashForm({...splashForm, targetDate: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-white/40">PIN Month</label>
                         <input type="text" value={splashForm.correctMonth} onChange={e => setSplashForm({...splashForm, correctMonth: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-center" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-white/40">PIN Day</label>
                         <input type="text" value={splashForm.correctDay} onChange={e => setSplashForm({...splashForm, correctDay: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-center" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-white/40">PIN Year</label>
                         <input type="text" value={splashForm.correctYear} onChange={e => setSplashForm({...splashForm, correctYear: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-center" />
                      </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Splash/Countdown Image</label>
                       <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 group">
                          {splashForm.splashImage && splashForm.splashImage !== '' ? (
                            <img src={splashForm.splashImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">No Image</div>
                          )}
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                             {uploadingField === 'splashImage' ? '...' : 'UPLOAD SPLASH IMAGE'}
                             <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, 'splashImage', setSplashForm)} />
                          </label>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Global Page Background Image</label>
                       <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 group">
                          {splashForm.bgImage && splashForm.bgImage !== '' ? (
                            <img src={splashForm.bgImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">Default Birthday BG</div>
                          )}
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                             {uploadingField === 'bgImage' ? '...' : 'SET BACKGROUND'}
                             <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, 'bgImage', setSplashForm)} />
                          </label>
                       </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Rope Polaroids (Floating Background)</label>
                          <button 
                            onClick={() => setSplashForm({ ...splashForm, ropePolaroids: [...(splashForm.ropePolaroids || []), ''] })}
                            className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg uppercase tracking-widest font-bold"
                          >
                            + Add Polaroid
                          </button>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                          {(splashForm.ropePolaroids || []).map((img, idx) => (
                             <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                <button 
                                   onClick={() => {
                                     const newImages = (splashForm.ropePolaroids || []).filter((_, i) => i !== idx);
                                     setSplashForm({ ...splashForm, ropePolaroids: newImages });
                                   }}
                                   className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 w-5 h-5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-[8px]"
                                 >
                                   ×
                                 </button>
                                {img && img !== '' ? (
                                  <img src={img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-[8px] text-white/20 uppercase tracking-widest">No Image</div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                   {uploadingField === `ropePolaroids-${idx}` ? '...' : '+'}
                                   <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, idx, '', setSplashForm, 'ropePolaroids')} />
                                </label>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </section>
                <button onClick={() => handleSave('splashScreen', splashForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}
            {activeTab === 'hero' && heroForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">Hero Page Settings <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Hero Top Text</label>
                      <textarea value={heroForm.topText} onChange={e => setHeroForm({...heroForm, topText: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Main Heading 1 (Happy)</label>
                          <input type="text" value={heroForm.middleHeading1} onChange={e => setHeroForm({...heroForm, middleHeading1: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Main Heading 2 (Birthday)</label>
                          <input type="text" value={heroForm.middleHeading2} onChange={e => setHeroForm({...heroForm, middleHeading2: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                       </div>
                    </div>
                    {/* Image Uploads for Hero */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['topImage', 'bgMiddleImage', 'middleImageLeft', 'middleImageRight', 'bottomImage'].map((field) => (
                        <div key={field} className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">{field}</label>
                          <div className="relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5">
                             {(heroForm as any)[field] && (heroForm as any)[field] !== '' ? (
                               <img src={(heroForm as any)[field]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                             ) : (
                               <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">No Image</div>
                             )}
                             <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                                {uploadingField === field ? '...' : 'CHANGE'}
                                <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, field, setHeroForm)} />
                             </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                <button onClick={() => handleSave('scrapbookHero', heroForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'split' && splitForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-4">Split Showcase Settings <div className="h-px w-32 bg-white/10" /></h2>
                    <button 
                      onClick={() => setSplitForm({ ...splitForm, items: [...splitForm.items, { image: '', backText: '', desc: '' }] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {splitForm.items.map((item, index) => (
                      <div key={index} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5 relative group">
                        <button 
                          onClick={() => {
                            const newItems = splitForm.items.filter((_, i) => i !== index);
                            setSplitForm({ ...splitForm, items: newItems });
                          }}
                          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                        >
                          ×
                        </button>
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Card {index + 1}</label>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 mb-4 group/img">
                          {item.image && item.image !== '' ? (
                            <img src={item.image} className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">No Image</div>
                          )}
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                             {uploadingField === `items-${index}` ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, index, 'image', setSplitForm, 'items')} />
                          </label>
                        </div>
                        <input type="text" placeholder="Back Text (Emotional)" value={item.backText} onChange={e => {
                          const newItems = [...splitForm.items];
                          newItems[index] = { ...newItems[index], backText: e.target.value };
                          setSplitForm({ ...splitForm, items: newItems });
                        }} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        <input type="text" placeholder="Footer Description" value={item.desc} onChange={e => {
                          const newItems = [...splitForm.items];
                          newItems[index] = { ...newItems[index], desc: e.target.value };
                          setSplitForm({ ...splitForm, items: newItems });
                        }} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                      </div>
                    ))}
                  </div>
                </section>
                <button onClick={() => handleSave('zineSplitShowcase', splitForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'archive' && archiveForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">Archive Section Settings <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Section Heading</label>
                      <input type="text" value={archiveForm.sectionHeading} onChange={e => setArchiveForm({...archiveForm, sectionHeading: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Sticky Note Text</label>
                      <textarea value={archiveForm.stickyNoteText} onChange={e => setArchiveForm({...archiveForm, stickyNoteText: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 min-h-[100px]" />
                    </div>
                    
                    {/* Image Fields */}
                    {['leftImage', 'rightImage'].map((field) => (
                      <div key={field} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">{field.replace('Image', ' Picture')}</label>
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 mb-4 group">
                           {(archiveForm as any)[field] && (archiveForm as any)[field] !== '' ? (
                             <img src={(archiveForm as any)[field]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                           ) : (
                             <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">No Image</div>
                           )}
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                              {uploadingField === field ? '...' : 'CHANGE'}
                              <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, field, setArchiveForm)} />
                           </label>
                        </div>
                        <input type="text" placeholder="Title/Name" value={(archiveForm as any)[field + 'Name']} onChange={e => setArchiveForm({...archiveForm, [field + 'Name']: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                      </div>
                    ))}
                  </div>
                </section>
                <button onClick={() => handleSave('zineArchive', archiveForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'coverflow' && coverflowForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-4">Photo Slider (Coverflow) <div className="h-px w-32 bg-white/10" /></h2>
                    <button 
                      onClick={() => setCoverflowForm({ ...coverflowForm, images: [...coverflowForm.images, ''] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      + Add Slide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {coverflowForm.images.map((img, index) => (
                      <div key={index} className="space-y-2 relative group">
                        <button 
                          onClick={() => {
                            const newImages = coverflowForm.images.filter((_, i) => i !== index);
                            setCoverflowForm({ ...coverflowForm, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-[10px]"
                        >
                          ×
                        </button>
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Slide {index + 1}</label>
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 border border-white/5 group/img">
                           {img && img !== '' ? (
                             <img src={img} className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" />
                           ) : (
                             <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest">No Image</div>
                           )}
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold text-center p-2">
                              {uploadingField === `images-${index}` ? '...' : 'UPLOAD'}
                              <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, index, '', setCoverflowForm, 'images')} />
                           </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <button onClick={() => handleSave('coverflowGallery', coverflowForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'gift' && giftForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">The Surprise Sequence <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Letter Title</label>
                       <input type="text" value={giftForm.letterTitle} onChange={e => setGiftForm({...giftForm, letterTitle: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">CTA Button Text</label>
                       <input type="text" value={giftForm.ctaText} onChange={e => setGiftForm({...giftForm, ctaText: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Letter Body</label>
                       <textarea value={giftForm.letterBody} onChange={e => setGiftForm({...giftForm, letterBody: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 min-h-[150px]" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Gift Type</label>
                       <select value={giftForm.giftType} onChange={e => setGiftForm({...giftForm, giftType: e.target.value as any})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3">
                          <option value="video">Video</option>
                          <option value="photo">Photo</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">Gift Video (Direct Upload or URL)</label>
                       <div className="flex gap-2">
                          <input type="text" value={giftForm.giftUrl} onChange={e => setGiftForm({...giftForm, giftUrl: e.target.value})} placeholder="Video URL..." className="flex-1 bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                          <label className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl cursor-pointer font-bold text-xs flex items-center transition-all border border-white/5">
                             {uploadingField === 'giftUrl' ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'giftUrl', setGiftForm)} />
                          </label>
                       </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Interaction Details</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] uppercase tracking-widest text-white/40">Ready? Prompt Sticker</label>
                             <div className="relative aspect-square w-32 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                <img src={giftForm.questions[0]?.sticker} className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                   {uploadingField === 'questions-0' ? '...' : 'SET'}
                                   <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, 0, 'sticker', setGiftForm, 'questions')} />
                                </label>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {['happyStickers', 'sadStickers'].map(field => (
                                <div key={field} className="space-y-4">
                                   <div className="flex justify-between items-center">
                                      <label className="text-[10px] uppercase tracking-widest text-white/40">{field === 'happyStickers' ? 'Happy Stickers (Random)' : 'Sad Stickers (Random)'}</label>
                                      <button 
                                         onClick={() => setGiftForm({ ...giftForm, [field]: [...(giftForm as any)[field], ''] })}
                                         className="text-[8px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md uppercase tracking-widest font-bold border border-white/5"
                                      >
                                         + Add
                                      </button>
                                   </div>
                                   <div className="flex flex-wrap gap-2">
                                      {(giftForm as any)[field]?.map((sticker: string, idx: number) => (
                                         <div key={idx} className="relative aspect-square w-16 rounded-lg overflow-hidden bg-black/40 border border-white/5 group">
                                            <button 
                                               onClick={() => {
                                                 const newStickers = (giftForm as any)[field].filter((_: any, i: number) => i !== idx);
                                                 setGiftForm({ ...giftForm, [field]: newStickers });
                                               }}
                                               className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10 text-[8px]"
                                            >
                                               ×
                                            </button>
                                            <img src={sticker} className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-[8px] font-bold">
                                               {uploadingField === `${field}-${idx}` ? '...' : '+'}
                                               <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, idx, '', setGiftForm, field)} />
                                            </label>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             {['questionBgImageLeft', 'questionBgImageRight'].map(field => (
                                <div key={field} className="space-y-2">
                                   <label className="text-[10px] uppercase tracking-widest text-white/40">{field.includes('Left') ? 'Quiz BG Polaroid (Left)' : 'Quiz BG Polaroid (Right)'}</label>
                                   <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                      <img src={(giftForm as any)[field]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold text-center p-2">
                                         {uploadingField === field ? '...' : 'SET POLAROID'}
                                         <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, field, setGiftForm)} />
                                      </label>
                                   </div>
                                </div>
                             ))}
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] uppercase tracking-widest text-white/40">Post-Video Alert Sticker</label>
                             <div className="relative aspect-square w-32 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                <img src={giftForm.giftAlertSticker} className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                   {uploadingField === 'giftAlertSticker' ? '...' : 'SET'}
                                   <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleFileUpload(e, 'giftAlertSticker', setGiftForm)} />
                                </label>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </section>
                <button onClick={() => handleSave('giftSequence', giftForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'memories' && memoriesForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">TV & Polaroids <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">TV Content Type</label>
                       <select value={memoriesForm.tvType} onChange={e => setMemoriesForm({...memoriesForm, tvType: e.target.value as any})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3">
                          <option value="video">Single Video</option>
                          <option value="slideshow">Slideshow</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest text-white/40">TV Video (Direct Upload or URL)</label>
                       <div className="flex gap-2">
                          <input type="text" value={memoriesForm.tvVideoUrl} onChange={e => setMemoriesForm({...memoriesForm, tvVideoUrl: e.target.value})} placeholder="Video URL..." className="flex-1 bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3" />
                          <label className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl cursor-pointer font-bold text-xs flex items-center transition-all border border-white/5">
                             {uploadingField === 'tvVideoUrl' ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'tvVideoUrl', setMemoriesForm)} />
                          </label>
                       </div>
                    </div>

                    {memoriesForm.tvType === 'slideshow' && (
                       <div className="md:col-span-2 space-y-4">
                          <div className="flex justify-between items-center">
                             <label className="text-[10px] uppercase tracking-widest text-white/40">Slideshow Images</label>
                             <button 
                               onClick={() => setMemoriesForm({ ...memoriesForm, tvSlideshowImages: [...memoriesForm.tvSlideshowImages, ''] })}
                               className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg uppercase tracking-widest font-bold"
                             >
                               + Add Image
                             </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                             {memoriesForm.tvSlideshowImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                   <button 
                                      onClick={() => {
                                        const newImages = memoriesForm.tvSlideshowImages.filter((_, i) => i !== idx);
                                        setMemoriesForm({ ...memoriesForm, tvSlideshowImages: newImages });
                                      }}
                                      className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 w-5 h-5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 text-[8px]"
                                    >
                                      ×
                                    </button>
                                   <img src={img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                   <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                      {uploadingField === `tvSlideshowImages-${idx}` ? '...' : '+'}
                                      <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, idx, '', setMemoriesForm, 'tvSlideshowImages')} />
                                   </label>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Polaroid Archive</h3>
                    <button 
                      onClick={() => setMemoriesForm({ ...memoriesForm, polaroids: [...memoriesForm.polaroids, { url: '', text: '' }] })}
                      className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      + Add Polaroid
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {memoriesForm.polaroids.map((p, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-6 items-center relative group">
                        <button 
                          onClick={() => {
                            const newPolaroids = memoriesForm.polaroids.filter((_, idx) => idx !== i);
                            setMemoriesForm({ ...memoriesForm, polaroids: newPolaroids });
                          }}
                          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                        >
                          ×
                        </button>
                        <div className="w-24 aspect-[4/5] bg-white p-1 shadow-xl relative shrink-0">
                           <img src={p.url} className="w-full h-full object-cover" />
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-[10px] font-bold">
                              {uploadingField === `polaroids-${i}` ? '...' : 'SET'}
                              <input type="file" className="hidden" accept="image/*,.heic,.heif" onChange={e => handleArrayFileUpload(e, i, 'url', setMemoriesForm, 'polaroids')} />
                           </label>
                        </div>
                        <div className="flex-1 space-y-4">
                           <textarea value={p.text} onChange={e => {
                             const newPolaroids = [...memoriesForm.polaroids];
                             newPolaroids[i] = { ...newPolaroids[i], text: e.target.value };
                             setMemoriesForm({ ...memoriesForm, polaroids: newPolaroids });
                           }} placeholder="Memory description..." className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs h-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <button onClick={() => handleSave('memories', memoriesForm)} className="bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Save Changes</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
