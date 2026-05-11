import { create } from 'zustand';

// Define the shape of our CMS content for the scrapbook hero
export interface ScrapbookHeroContent {
  topImage: string;
  topText: string;
  bgMiddleImage: string;
  middleHeading1: string;
  middleHeading2: string;
  middleImageLeft: string;
  middleImageRight: string;
  middleBottomText: string;
  bottomImage: string;
}

// Define the shape of our CMS content for the splash screen
export interface SplashScreenContent {
  targetDate: string;
  correctMonth: string;
  correctDay: string;
  correctYear: string;
  promptHeading: string;
  btnNowText: string;
  btnLaterText: string;
}

export interface ZineSplitShowcaseContent {
  image1: string;
  backText1: string;
  desc1: string;
  image2: string;
  backText2: string;
  desc2: string;
  image3: string;
  backText3: string;
  desc3: string;
  image4: string;
  backText4: string;
  desc4: string;
}

export interface CoverflowGalleryContent {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
}

export interface ZineArchiveContent {
  sectionHeading: string;
  viewAllText: string;
  leftImage: string;
  leftImageName: string;
  leftImageStatus: string;
  stickyNoteText: string;
  rightImage: string;
  rightImageName: string;
  rightImageDate: string;
  formHeading: string;
  formDesc: string;
  formPlaceholder: string;
  formBtnText: string;
}

export interface CmsState {
  scrapbookHero: ScrapbookHeroContent | null;
  splashScreen: SplashScreenContent | null;
  zineSplitShowcase: ZineSplitShowcaseContent | null;
  coverflowGallery: CoverflowGalleryContent | null;
  zineArchive: ZineArchiveContent | null;
  isLoading: boolean;
  error: string | null;
  fetchCmsContent: () => Promise<void>;
  updateScrapbookHero: (content: Partial<ScrapbookHeroContent>) => Promise<void>;
  updateSplashScreen: (content: Partial<SplashScreenContent>) => Promise<void>;
  updateZineSplitShowcase: (content: Partial<ZineSplitShowcaseContent>) => Promise<void>;
  updateCoverflowGallery: (content: Partial<CoverflowGalleryContent>) => Promise<void>;
  updateZineArchive: (content: Partial<ZineArchiveContent>) => Promise<void>;
}

// Default fallback content in case DB is empty
const defaultSplashScreen: SplashScreenContent = {
  targetDate: '2026-12-31T00:00:00',
  correctMonth: '12',
  correctDay: '25',
  correctYear: '2000',
  promptHeading: 'A surprise awaits.',
  btnNowText: 'Open Now',
  btnLaterText: 'Later'
};
const defaultScrapbookHero: ScrapbookHeroContent = {
  topImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop',
  topText: 'May your birthday be filled with joy, blessings, and endless happiness.',
  bgMiddleImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  middleHeading1: 'Happy',
  middleHeading2: 'Birthday',
  middleImageLeft: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=600&auto=format&fit=crop',
  middleImageRight: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  middleBottomText: 'Wish you all the best',
  bottomImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?q=80&w=1200&auto=format&fit=crop',
};

const defaultZineSplitShowcase: ZineSplitShowcaseContent = {
  image1: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=800&auto=format&fit=crop',
  backText1: 'I CAN ALWAYS MAKE YOU SMILE',
  desc1: 'A moment of pure joy and endless laughter.',
  image2: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
  backText2: 'HAPPY BIRTHDAY',
  desc2: 'Celebrating you today and always.',
  image3: 'https://images.unsplash.com/photo-1520113412048-285b0d0dc522?q=80&w=800&auto=format&fit=crop',
  backText3: 'LOVE TO TEASE YOU!',
  desc3: 'Because annoying you is my favorite hobby.',
  image4: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
  backText4: "YOU'RE AMAZING AND I LOVE YOU.",
  desc4: 'More than words can ever say.',
};

const defaultCoverflowGallery: CoverflowGalleryContent = {
  image1: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
  image2: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop',
  image3: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=800&auto=format&fit=crop',
  image4: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
  image5: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
};

const defaultZineArchive: ZineArchiveContent = {
  sectionHeading: 'The Archive',
  viewAllText: 'View All Entries (402)',
  leftImage: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1200&auto=format&fit=crop',
  leftImageName: '001_LOST_FOUND.PNG',
  leftImageStatus: 'REDACTED',
  stickyNoteText: '"POLISH IS THE ENEMY OF AUTHENTICITY."',
  rightImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
  rightImageName: '002_MIDNIGHT_VOICE.JPG',
  rightImageDate: 'JULY 26 - 11:32 PM',
  formHeading: 'Submit Your Truth',
  formDesc: 'We are collecting fragments of the real. Upload your unedited moments to the permanent archive.',
  formPlaceholder: 'YOUR_ALIAS',
  formBtnText: 'GO',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useCmsStore = create<CmsState>((set, get) => ({
  scrapbookHero: defaultScrapbookHero,
  splashScreen: defaultSplashScreen,
  zineSplitShowcase: defaultZineSplitShowcase,
  coverflowGallery: defaultCoverflowGallery,
  zineArchive: defaultZineArchive,
  isLoading: false,
  error: null,
  
  fetchCmsContent: async () => {
    // Only set loading to true if we don't have data yet, to avoid flickering during polling
    if (!get().scrapbookHero) set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_URL}/api/cms`);
      if (!response.ok) throw new Error('Failed to fetch CMS content');
      
      const data = await response.json();
      
      // Map DB content to our state
      const scrapbookData = data.find((item: any) => item.section_id === 'scrapbook_hero');
      const splashData = data.find((item: any) => item.section_id === 'splash_screen');
      const zineSplitData = data.find((item: any) => item.section_id === 'zine_split_showcase');
      const coverflowData = data.find((item: any) => item.section_id === 'coverflow_gallery');
      const zineArchiveData = data.find((item: any) => item.section_id === 'zine_archive');
      
      // We check JSON stringify to avoid unnecessary state updates if nothing changed
      if (scrapbookData && scrapbookData.content && JSON.stringify(get().scrapbookHero) !== JSON.stringify(scrapbookData.content)) {
        set({ scrapbookHero: { ...defaultScrapbookHero, ...scrapbookData.content } });
      }
      if (splashData && splashData.content && JSON.stringify(get().splashScreen) !== JSON.stringify(splashData.content)) {
        set({ splashScreen: { ...defaultSplashScreen, ...splashData.content } });
      }
      if (zineSplitData && zineSplitData.content && JSON.stringify(get().zineSplitShowcase) !== JSON.stringify(zineSplitData.content)) {
        set({ zineSplitShowcase: { ...defaultZineSplitShowcase, ...zineSplitData.content } });
      }
      if (coverflowData && coverflowData.content && JSON.stringify(get().coverflowGallery) !== JSON.stringify(coverflowData.content)) {
        set({ coverflowGallery: { ...defaultCoverflowGallery, ...coverflowData.content } });
      }
      if (zineArchiveData && zineArchiveData.content && JSON.stringify(get().zineArchive) !== JSON.stringify(zineArchiveData.content)) {
        set({ zineArchive: { ...defaultZineArchive, ...zineArchiveData.content } });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateScrapbookHero: async (content) => {
    const currentContent = get().scrapbookHero;
    const newContent = { ...currentContent, ...content };
    set({ scrapbookHero: newContent as ScrapbookHeroContent });
    try {
      const response = await fetch(`${API_URL}/api/cms/scrapbook_hero`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent })
      });
      if (!response.ok) throw new Error('Failed to save CMS content');
    } catch (error: any) { set({ error: error.message }); }
  },

  updateSplashScreen: async (content) => {
    const currentContent = get().splashScreen;
    const newContent = { ...currentContent, ...content };
    set({ splashScreen: newContent as SplashScreenContent });
    try {
      const response = await fetch(`${API_URL}/api/cms/splash_screen`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent })
      });
      if (!response.ok) throw new Error('Failed to save CMS content');
    } catch (error: any) { set({ error: error.message }); }
  },

  updateZineSplitShowcase: async (content) => {
    const currentContent = get().zineSplitShowcase;
    const newContent = { ...currentContent, ...content };
    set({ zineSplitShowcase: newContent as ZineSplitShowcaseContent });
    try {
      const response = await fetch(`${API_URL}/api/cms/zine_split_showcase`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent })
      });
      if (!response.ok) throw new Error('Failed to save CMS content');
    } catch (error: any) { set({ error: error.message }); }
  },

  updateCoverflowGallery: async (content) => {
    const currentContent = get().coverflowGallery;
    const newContent = { ...currentContent, ...content };
    set({ coverflowGallery: newContent as CoverflowGalleryContent });
    try {
      const response = await fetch(`${API_URL}/api/cms/coverflow_gallery`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent })
      });
      if (!response.ok) throw new Error('Failed to save CMS content');
    } catch (error: any) { set({ error: error.message }); }
  },

  updateZineArchive: async (content) => {
    const currentContent = get().zineArchive;
    const newContent = { ...currentContent, ...content };
    set({ zineArchive: newContent as ZineArchiveContent });
    try {
      const response = await fetch(`${API_URL}/api/cms/zine_archive`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent })
      });
      if (!response.ok) throw new Error('Failed to save CMS content');
    } catch (error: any) { set({ error: error.message }); }
  }
}));
