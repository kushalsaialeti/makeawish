import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../store/cmsStore';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AdminDashboard = () => { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '12162005') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center p-6">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePinSubmit}
          className="bg-[#2d2a28] p-10 rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-md text-center"
        >
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Admin Access</h2>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ENTER PIN"
            className="w-full bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-white text-center text-2xl tracking-[1em] mb-6 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest">
            Unlock Dashboard
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<WishList />} />
      <Route path="/edit/:id" element={<WishEditorWrapper />} />
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
      const response = await fetch(`${API_URL}/api/cms`);
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
      const response = await fetch(`${API_URL}/api/cms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Birthday Factory</h1>
            <p className="text-white/40 font-serif italic">Manage and create magical birthday experiences.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all"
          >
            + Create New Wish
          </button>
        </div>

        {isCreating && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            onSubmit={handleCreate}
            className="bg-[#2d2a28] p-8 rounded-3xl mb-12 border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Recipient Name</label>
                <input 
                  type="text" 
                  value={newWish.name}
                  onChange={e => setNewWish({...newWish, name: e.target.value})}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3"
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
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-pink-600 px-8 py-3 rounded-xl font-bold uppercase tracking-widest">Generate Template</button>
              <button type="button" onClick={() => setIsCreating(false)} className="bg-white/10 px-8 py-3 rounded-xl font-bold uppercase tracking-widest">Cancel</button>
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
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/admin/edit/${wish.id}`)}
                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-colors"
                  >
                    Edit
                  </button>
                  <a 
                    href={`/wish/${wish.slug}`}
                    target="_blank"
                    className="flex-1 bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 py-3 rounded-xl text-sm font-bold text-center transition-colors"
                  >
                    View
                  </a>
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
  const { scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive, giftSequence, memories, updateSection, currentWishSlug } = useCmsStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'splash' | 'hero' | 'split' | 'archive' | 'coverflow' | 'gift' | 'memories'>('splash');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileUpload = async (e: any, fieldName: string, setter: any, currentForm: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_URL}/api/cms/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setter({ ...currentForm, [fieldName]: data.url });
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#2d2a28] border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-[1000]">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin')} className="text-white/40 hover:text-white">← Back</button>
          <h1 className="text-xl font-bold uppercase tracking-widest">Editing: <span className="text-pink-500">/wish/{currentWishSlug}</span></h1>
        </div>
        <div className="flex items-center gap-4">
           {showSuccess && <span className="text-green-400 text-sm font-bold animate-pulse">Changes Saved!</span>}
           <a href={`/wish/${currentWishSlug}`} target="_blank" className="bg-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">Preview</a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Tabs Sidebar */}
        <div className="w-64 bg-[#211f1d] border-r border-white/5 p-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'splash', label: 'Splash Screen', icon: '🔒' },
            { id: 'hero', label: 'Scrapbook Hero', icon: '📖' },
            { id: 'split', label: 'Split Showcase', icon: '🖼️' },
            { id: 'archive', label: 'Memories Archive', icon: '📂' },
            { id: 'coverflow', label: 'Photo Slider', icon: '🎠' },
            { id: 'gift', label: 'Gift Sequence', icon: '🎁' },
            { id: 'memories', label: 'TV Memories', icon: '📺' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-black/20">
          <AnimatePresence mode="wait">
            {activeTab === 'splash' && splashForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-4">Splash Screen Settings <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          <img src={splashForm.splashImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                             {uploadingField === 'splashImage' ? '...' : 'UPLOAD SPLASH IMAGE'}
                             <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'splashImage', setSplashForm, splashForm)} />
                          </label>
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
                             <img src={(heroForm as any)[field]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                             <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                                {uploadingField === field ? '...' : 'CHANGE'}
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, field, setHeroForm, heroForm)} />
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
                  <h2 className="text-2xl font-bold flex items-center gap-4">Split Showcase Settings <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Card {num}</label>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 mb-4 group">
                          <img src={(splitForm as any)[`image${num}`]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                             {uploadingField === `image${num}` ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" onChange={e => handleFileUpload(e, `image${num}`, setSplitForm, splitForm)} />
                          </label>
                        </div>
                        <input type="text" placeholder="Back Text (Emotional)" value={(splitForm as any)[`backText${num}`]} onChange={e => setSplitForm({...splitForm, [`backText${num}`]: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        <input type="text" placeholder="Footer Description" value={(splitForm as any)[`desc${num}`]} onChange={e => setSplitForm({...splitForm, [`desc${num}`]: e.target.value})} className="w-full bg-[#2d2a28] border border-white/10 rounded-xl px-4 py-3 text-sm" />
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
                           <img src={(archiveForm as any)[field]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-xs font-bold">
                              {uploadingField === field ? '...' : 'CHANGE'}
                              <input type="file" className="hidden" onChange={e => handleFileUpload(e, field, setArchiveForm, archiveForm)} />
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
                  <h2 className="text-2xl font-bold flex items-center gap-4">Photo Slider (Coverflow) <div className="h-px flex-1 bg-white/10" /></h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Slide {num}</label>
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                           <img src={(coverflowForm as any)[`image${num}`]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                              {uploadingField === `image${num}` ? '...' : 'UPLOAD'}
                              <input type="file" className="hidden" onChange={e => handleFileUpload(e, `image${num}`, setCoverflowForm, coverflowForm)} />
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
                             {uploadingField === 'giftVideo' ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'giftUrl', setGiftForm, giftForm)} />
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
                                   {uploadingField === 'promptSticker' ? '...' : 'SET'}
                                   <input type="file" className="hidden" onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      setUploadingField('promptSticker');
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      const res = await fetch(`${API_URL}/api/cms/upload`, { method: 'POST', body: formData });
                                      const data = await res.json();
                                      const newQuestions = [...giftForm.questions];
                                      newQuestions[0] = { ...newQuestions[0], sticker: data.url };
                                      setGiftForm({ ...giftForm, questions: newQuestions });
                                      setUploadingField(null);
                                   }} />
                                </label>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             {['happyStickers', 'sadStickers'].map(field => (
                                <div key={field} className="space-y-2">
                                   <label className="text-[10px] uppercase tracking-widest text-white/40">{field === 'happyStickers' ? 'Happy Sticker' : 'Sad Sticker'}</label>
                                   <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                      <img src={(giftForm as any)[field]?.[0]} className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                         {uploadingField === field ? '...' : 'SET'}
                                         <input type="file" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setUploadingField(field);
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            const res = await fetch(`${API_URL}/api/cms/upload`, { method: 'POST', body: formData });
                                            const data = await res.json();
                                            setGiftForm({ ...giftForm, [field]: [data.url] });
                                            setUploadingField(null);
                                         }} />
                                      </label>
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
                                         <input type="file" className="hidden" onChange={e => handleFileUpload(e, field, setGiftForm, giftForm)} />
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
                                   <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'giftAlertSticker', setGiftForm, giftForm)} />
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
                             {uploadingField === 'tvVideo' ? '...' : 'UPLOAD'}
                             <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'tvVideoUrl', setMemoriesForm, memoriesForm)} />
                          </label>
                       </div>
                    </div>

                    {memoriesForm.tvType === 'slideshow' && (
                       <div className="md:col-span-2 space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Slideshow Images (Max 5)</label>
                          <div className="grid grid-cols-5 gap-4">
                             {[0, 1, 2, 3, 4].map(idx => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                                   <img src={memoriesForm.tvSlideshowImages[idx]} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                   <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-[10px] font-bold">
                                      {uploadingField === `slideshow-${idx}` ? '...' : '+'}
                                      <input type="file" className="hidden" onChange={async (e) => {
                                         const file = e.target.files?.[0];
                                         if (!file) return;
                                         setUploadingField(`slideshow-${idx}`);
                                         const formData = new FormData();
                                         formData.append('file', file);
                                         const res = await fetch(`${API_URL}/api/cms/upload`, { method: 'POST', body: formData });
                                         const data = await res.json();
                                         const newImages = [...memoriesForm.tvSlideshowImages];
                                         newImages[idx] = data.url;
                                         setMemoriesForm({ ...memoriesForm, tvSlideshowImages: newImages });
                                         setUploadingField(null);
                                      }} />
                                   </label>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-6">Polaroid Archive (Max 7)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {memoriesForm.polaroids.map((p, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-6 items-center">
                        <div className="w-24 aspect-[4/5] bg-white p-1 shadow-xl relative shrink-0">
                           <img src={p.url} className="w-full h-full object-cover" />
                           <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-[10px] font-bold">
                              {uploadingField === `p-${i}` ? '...' : 'SET'}
                              <input type="file" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 setUploadingField(`p-${i}`);
                                 const formData = new FormData();
                                 formData.append('file', file);
                                 const res = await fetch(`${API_URL}/api/cms/upload`, { method: 'POST', body: formData });
                                 const data = await res.json();
                                 const newPolaroids = [...memoriesForm.polaroids];
                                 newPolaroids[i] = { ...newPolaroids[i], url: data.url };
                                 setMemoriesForm({ ...memoriesForm, polaroids: newPolaroids });
                                 setUploadingField(null);
                              }} />
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
