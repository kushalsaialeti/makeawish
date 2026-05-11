import React, { useState, useEffect } from 'react';
import { useCmsStore } from '../store/cmsStore';
import type { ScrapbookHeroContent, SplashScreenContent, ZineSplitShowcaseContent, CoverflowGalleryContent, ZineArchiveContent } from '../store/cmsStore';

export const AdminDashboard = () => {
  const { scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive, updateScrapbookHero, updateSplashScreen, updateZineSplitShowcase, updateCoverflowGallery, updateZineArchive, isLoading, fetchCmsContent } = useCmsStore();
  
  const [activeTab, setActiveTab] = useState<'splash' | 'hero' | 'split' | 'archive' | 'coverflow'>('splash');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Local state for forms
  const [heroForm, setHeroForm] = useState<ScrapbookHeroContent | null>(null);
  const [splashForm, setSplashForm] = useState<SplashScreenContent | null>(null);
  const [splitForm, setSplitForm] = useState<ZineSplitShowcaseContent | null>(null);
  const [coverflowForm, setCoverflowForm] = useState<CoverflowGalleryContent | null>(null);
  const [archiveForm, setArchiveForm] = useState<ZineArchiveContent | null>(null);

  useEffect(() => {
    fetchCmsContent();
  }, [fetchCmsContent]);

  useEffect(() => {
    if (scrapbookHero) setHeroForm(scrapbookHero);
    if (splashScreen) setSplashForm(splashScreen);
    if (zineSplitShowcase) setSplitForm(zineSplitShowcase);
    if (coverflowGallery) setCoverflowForm(coverflowGallery);
    if (zineArchive) setArchiveForm(zineArchive);
  }, [scrapbookHero, splashScreen, zineSplitShowcase, coverflowGallery, zineArchive]);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (heroForm) setHeroForm({ ...heroForm, [e.target.name]: e.target.value });
  };

  const handleSplashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (splashForm) setSplashForm({ ...splashForm, [e.target.name]: e.target.value });
  };

  const handleSplitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (splitForm) setSplitForm({ ...splitForm, [e.target.name]: e.target.value });
  };

  const handleCoverflowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (coverflowForm) setCoverflowForm({ ...coverflowForm, [e.target.name]: e.target.value });
  };

  const handleArchiveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (archiveForm) setArchiveForm({ ...archiveForm, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, formType: 'hero' | 'split' | 'coverflow') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/cms/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      if (formType === 'hero' && heroForm) setHeroForm({ ...heroForm, [fieldName]: data.url });
      if (formType === 'split' && splitForm) setSplitForm({ ...splitForm, [fieldName]: data.url });
      if (formType === 'coverflow' && coverflowForm) setCoverflowForm({ ...coverflowForm, [fieldName]: data.url });
      if (formType === 'archive' && archiveForm) setArchiveForm({ ...archiveForm, [fieldName]: data.url });
    } catch (error) {
      console.error(error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'hero' && heroForm) {
      await updateScrapbookHero(heroForm);
    } else if (activeTab === 'splash' && splashForm) {
      await updateSplashScreen(splashForm);
    } else if (activeTab === 'split' && splitForm) {
      await updateZineSplitShowcase(splitForm);
    } else if (activeTab === 'coverflow' && coverflowForm) {
      await updateCoverflowGallery(coverflowForm);
    } else if (activeTab === 'archive' && archiveForm) {
      await updateZineArchive(archiveForm);
    }
    alert('Changes saved successfully!');
  };

  if (!heroForm || !splashForm || !splitForm || !coverflowForm || !archiveForm) return <div className="p-8 text-white">Loading CMS...</div>;

  return (
    <div className="min-h-screen bg-[#151111] text-[#e6d0d2] p-8 font-mono">
      <h1 className="text-3xl font-black mb-8 border-b border-white/20 pb-4">CMS Dashboard</h1>
      
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
        <button 
          onClick={() => setActiveTab('splash')}
          className={`px-6 py-2 border whitespace-nowrap ${activeTab === 'splash' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50'}`}
        >
          Splash Screen (Timer & Lock)
        </button>
        <button 
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-2 border whitespace-nowrap ${activeTab === 'hero' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50'}`}
        >
          Scrapbook Hero
        </button>
        <button 
          onClick={() => setActiveTab('split')}
          className={`px-6 py-2 border whitespace-nowrap ${activeTab === 'split' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50'}`}
        >
          Living Art (Split Showcase)
        </button>
        <button 
          onClick={() => setActiveTab('archive')}
          className={`px-6 py-2 border whitespace-nowrap ${activeTab === 'archive' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50'}`}
        >
          Archive Section
        </button>
        <button 
          onClick={() => setActiveTab('coverflow')}
          className={`px-6 py-2 border whitespace-nowrap ${activeTab === 'coverflow' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50'}`}
        >
          Moments (Coverflow)
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 bg-[#1a1616] p-8 border border-white/10 rounded-xl shadow-2xl">
        
        {/* Splash Screen Tab */}
        {activeTab === 'splash' && (
          <>
            <h2 className="text-xl font-bold text-white bg-[#7a1022] p-3 rounded-t">Splash Screen Settings</h2>
            
            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Countdown Timer</h3>
              <div>
                <label className="block text-xs mb-1">Target Date & Time (ISO format, e.g. 2026-12-31T00:00:00)</label>
                <input 
                  type="text" name="targetDate" value={splashForm.targetDate} onChange={handleSplashChange} 
                  className="w-full bg-black/50 border border-white/20 p-2 text-white rounded"
                />
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">DOB Lock PIN</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs mb-1">Correct Month (MM)</label>
                  <input type="text" name="correctMonth" value={splashForm.correctMonth} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Correct Day (DD)</label>
                  <input type="text" name="correctDay" value={splashForm.correctDay} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Correct Year (YYYY)</label>
                  <input type="text" name="correctYear" value={splashForm.correctYear} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Surprise Prompt</h3>
              <div>
                <label className="block text-xs mb-1">Prompt Heading</label>
                <input type="text" name="promptHeading" value={splashForm.promptHeading} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">"Open Now" Button Text</label>
                  <input type="text" name="btnNowText" value={splashForm.btnNowText} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">"Later" Button Text</label>
                  <input type="text" name="btnLaterText" value={splashForm.btnLaterText} onChange={handleSplashChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <>
            <h2 className="text-xl font-bold text-white bg-[#7a1022] p-3 rounded-t">Scrapbook Hero Section</h2>
            
            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Top Section</h3>
              <div>
                <label className="block text-xs mb-1">Top Message Text</label>
                <textarea 
                  name="topText" value={heroForm.topText} onChange={handleHeroChange} 
                  className="w-full bg-black/50 border border-white/20 p-2 text-white rounded min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Top Wide Image</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="text" name="topImage" value={heroForm.topImage} onChange={handleHeroChange} 
                    className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded"
                  />
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'topImage', 'hero')} className="hidden" id="upload-topImage" />
                  <label htmlFor="upload-topImage" className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                    {uploadingField === 'topImage' ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {heroForm.topImage && <img src={heroForm.topImage} className="h-20 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Middle Section (Collage)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Heading 1</label>
                  <input type="text" name="middleHeading1" value={heroForm.middleHeading1} onChange={handleHeroChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Heading 2</label>
                  <input type="text" name="middleHeading2" value={heroForm.middleHeading2} onChange={handleHeroChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Bottom Text</label>
                <input type="text" name="middleBottomText" value={heroForm.middleBottomText} onChange={handleHeroChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
              </div>
              
              {['bgMiddleImage', 'middleImageLeft', 'middleImageRight'].map((fieldName) => (
                <div key={fieldName}>
                  <label className="block text-xs mb-1 mt-4">{fieldName.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" name={fieldName} value={heroForm[fieldName as keyof ScrapbookHeroContent]} onChange={handleHeroChange} 
                      className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded"
                    />
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, fieldName, 'hero')} className="hidden" id={`upload-${fieldName}`} />
                    <label htmlFor={`upload-${fieldName}`} className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                      {uploadingField === fieldName ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                  {heroForm[fieldName as keyof ScrapbookHeroContent] && <img src={heroForm[fieldName as keyof ScrapbookHeroContent]} className="h-16 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
                </div>
              ))}
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Bottom Section</h3>
              <div>
                <label className="block text-xs mb-1">Bottom Wide Image</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="text" name="bottomImage" value={heroForm.bottomImage} onChange={handleHeroChange} 
                    className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded"
                  />
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'bottomImage', 'hero')} className="hidden" id="upload-bottomImage" />
                  <label htmlFor="upload-bottomImage" className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                    {uploadingField === 'bottomImage' ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {heroForm.bottomImage && <img src={heroForm.bottomImage} className="h-20 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
              </div>
            </div>
          </>
        )}

        {/* Split Showcase Tab */}
        {activeTab === 'split' && (
          <>
            <h2 className="text-xl font-bold text-white bg-[#7a1022] p-3 rounded-t">Living Art Section (4 Flippable Cards)</h2>
            <div className="space-y-8 border border-white/10 p-4 rounded bg-[#100c0c]">
              {[1, 2, 3, 4].map((i) => {
                const imgField = `image${i}` as keyof ZineSplitShowcaseContent;
                const textField = `backText${i}` as keyof ZineSplitShowcaseContent;
                const descField = `desc${i}` as keyof ZineSplitShowcaseContent;
                return (
                  <div key={i} className="p-4 border border-white/20 rounded bg-black/30">
                    <h3 className="font-bold text-[#f3d4d6] mb-4 border-b border-white/10 pb-2">Card {i}</h3>
                    
                    <div className="mb-4">
                      <label className="block text-xs mb-1">Front Image</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="text" name={imgField} value={splitForm[imgField]} onChange={handleSplitChange} 
                          className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded"
                        />
                        <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, imgField, 'split')} className="hidden" id={`upload-split-${imgField}`} />
                        <label htmlFor={`upload-split-${imgField}`} className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                          {uploadingField === imgField ? 'Uploading...' : 'Upload'}
                        </label>
                      </div>
                      {splitForm[imgField] && <img src={splitForm[imgField]} className="h-16 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs mb-1">Back Text (Handwritten style)</label>
                      <input 
                        type="text" name={textField} value={splitForm[textField]} onChange={handleSplitChange} 
                        className="w-full bg-black/50 border border-white/20 p-2 text-white rounded font-mono"
                        placeholder="e.g. I CAN ALWAYS MAKE YOU SMILE"
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1">Short Description (Below card)</label>
                      <input 
                        type="text" name={descField} value={splitForm[descField]} onChange={handleSplitChange} 
                        className="w-full bg-black/50 border border-white/20 p-2 text-white rounded"
                        placeholder="A moment of pure joy..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Coverflow Gallery Tab */}
        {activeTab === 'coverflow' && (
          <>
            <h2 className="text-xl font-bold text-white bg-[#7a1022] p-3 rounded-t">Moments Coverflow (5 Images)</h2>
            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              {['image1', 'image2', 'image3', 'image4', 'image5'].map((fieldName, i) => (
                <div key={fieldName}>
                  <label className="block text-xs mb-1 mt-4">Gallery Image {i + 1}</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" name={fieldName} value={coverflowForm[fieldName as keyof CoverflowGalleryContent]} onChange={handleCoverflowChange} 
                      className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded"
                    />
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, fieldName, 'coverflow')} className="hidden" id={`upload-cover-${fieldName}`} />
                    <label htmlFor={`upload-cover-${fieldName}`} className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                      {uploadingField === fieldName ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                  {coverflowForm[fieldName as keyof CoverflowGalleryContent] && <img src={coverflowForm[fieldName as keyof CoverflowGalleryContent]} className="h-16 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <>
            <h2 className="text-xl font-bold text-white bg-[#7a1022] p-3 rounded-t">Archive Section Settings</h2>
            
            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Header</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Section Heading</label>
                  <input type="text" name="sectionHeading" value={archiveForm.sectionHeading} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">View All Text</label>
                  <input type="text" name="viewAllText" value={archiveForm.viewAllText} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Left Large Image</h3>
              <div>
                <label className="block text-xs mb-1">Left Image</label>
                <div className="flex gap-4 items-center">
                  <input type="text" name="leftImage" value={archiveForm.leftImage} onChange={handleArchiveChange} className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded" />
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e as any, 'leftImage', 'archive' as any)} className="hidden" id="upload-archive-leftImage" />
                  <label htmlFor="upload-archive-leftImage" className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                    {uploadingField === 'leftImage' ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {archiveForm.leftImage && <img src={archiveForm.leftImage} className="h-16 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Image Name</label>
                  <input type="text" name="leftImageName" value={archiveForm.leftImageName} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Image Status</label>
                  <input type="text" name="leftImageStatus" value={archiveForm.leftImageStatus} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Sticky Note Text</label>
                <input type="text" name="stickyNoteText" value={archiveForm.stickyNoteText} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Right Small Image</h3>
              <div>
                <label className="block text-xs mb-1">Right Image</label>
                <div className="flex gap-4 items-center">
                  <input type="text" name="rightImage" value={archiveForm.rightImage} onChange={handleArchiveChange} className="flex-1 bg-black/50 border border-white/20 p-2 text-white rounded" />
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e as any, 'rightImage', 'archive' as any)} className="hidden" id="upload-archive-rightImage" />
                  <label htmlFor="upload-archive-rightImage" className="bg-white/10 hover:bg-white/20 px-4 py-2 cursor-pointer rounded whitespace-nowrap">
                    {uploadingField === 'rightImage' ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
                {archiveForm.rightImage && <img src={archiveForm.rightImage} className="h-16 object-cover mt-2 rounded border border-white/10" alt="Preview"/>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Image Name</label>
                  <input type="text" name="rightImageName" value={archiveForm.rightImageName} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Image Date</label>
                  <input type="text" name="rightImageDate" value={archiveForm.rightImageDate} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border border-white/10 p-4 rounded bg-[#100c0c]">
              <h3 className="font-bold text-[#f3d4d6]">Submit Form</h3>
              <div>
                <label className="block text-xs mb-1">Form Heading</label>
                <input type="text" name="formHeading" value={archiveForm.formHeading} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
              </div>
              <div>
                <label className="block text-xs mb-1">Form Description</label>
                <textarea name="formDesc" value={archiveForm.formDesc} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded min-h-[60px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Placeholder</label>
                  <input type="text" name="formPlaceholder" value={archiveForm.formPlaceholder} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
                <div>
                  <label className="block text-xs mb-1">Button Text</label>
                  <input type="text" name="formBtnText" value={archiveForm.formBtnText} onChange={handleArchiveChange} className="w-full bg-black/50 border border-white/20 p-2 text-white rounded" />
                </div>
              </div>
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={isLoading || uploadingField !== null}
          className="w-full bg-[#7a1022] hover:bg-red-800 text-white font-bold py-4 rounded transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : `Save ${activeTab.toUpperCase()} to Live Site`}
        </button>
      </form>
    </div>
  );
};
