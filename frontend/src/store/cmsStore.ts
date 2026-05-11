import { create } from 'zustand';

// --- Interfaces (Same as before but nested in a single object) ---
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

export interface SplashScreenContent {
  targetDate: string;
  correctMonth: string;
  correctDay: string;
  correctYear: string;
  promptHeading: string;
  btnNowText: string;
  btnLaterText: string;
  recipientName: string;
  clockText: string;
  splashImage: string;
}

export interface QuestionOption { text: string; isCorrect: boolean; }
export interface QuestionStep { id: string; sticker: string; question: string; options: QuestionOption[]; }

export interface GiftSequenceContent {
  questions: QuestionStep[];
  giftType: 'video' | 'photo';
  giftUrl: string;
  giftAlertSticker: string;
  happyStickers: string[];
  sadStickers: string[];
  letterTitle: string;
  letterBody: string;
  letterFooter: string;
  ctaText: string;
  promptSticker: string;
  questionBgImageLeft: string;
  questionBgImageRight: string;
}

export interface ZineSplitShowcaseContent {
  image1: string; backText1: string; desc1: string;
  image2: string; backText2: string; desc2: string;
  image3: string; backText3: string; desc3: string;
  image4: string; backText4: string; desc4: string;
}

export interface CoverflowGalleryContent {
  image1: string; image2: string; image3: string; image4: string; image5: string;
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

export interface PolaroidItem { url: string; text: string; }
export interface MemoriesContent {
  tvType: 'video' | 'slideshow';
  tvVideoUrl: string;
  tvSlideshowImages: string[];
  polaroids: PolaroidItem[];
}

export interface WishData {
  id: string;
  slug: string;
  recipient_name: string;
  is_published: boolean;
  content: {
    scrapbookHero?: ScrapbookHeroContent;
    splashScreen?: SplashScreenContent;
    zineSplitShowcase?: ZineSplitShowcaseContent;
    coverflowGallery?: CoverflowGalleryContent;
    zineArchive?: ZineArchiveContent;
    giftSequence?: GiftSequenceContent;
    memories?: MemoriesContent;
  };
}

export interface CmsState {
  // Current active wish data
  currentWishId: string | null;
  currentWishSlug: string | null;
  
  // Individual components (mapped from currentWish.content)
  scrapbookHero: ScrapbookHeroContent | null;
  splashScreen: SplashScreenContent | null;
  zineSplitShowcase: ZineSplitShowcaseContent | null;
  coverflowGallery: CoverflowGalleryContent | null;
  zineArchive: ZineArchiveContent | null;
  giftSequence: GiftSequenceContent | null;
  memories: MemoriesContent | null;
  
  isLoading: boolean;
  error: string | null;
  isSplashCompleted: boolean;

  // Actions
  fetchWishBySlug: (slug: string) => Promise<void>;
  fetchWishById: (id: string) => Promise<void>;
  createWish: (slug: string, name: string) => Promise<string>;
  updateSection: (section: keyof WishData['content'], content: any) => Promise<void>;
  setSplashCompleted: (completed: boolean) => void;
}

// --- Defaults ---
const defaultSplashScreen: SplashScreenContent = {
  targetDate: '2026-12-31T00:00:00', correctMonth: '12', correctDay: '25', correctYear: '2000',
  promptHeading: 'A surprise awaits.', btnNowText: 'Open Now', btnLaterText: 'Later',
  recipientName: 'Beautiful', clockText: 'TIME IS TICKING',
  splashImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
};

const defaultScrapbookHero: ScrapbookHeroContent = {
  topImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200',
  topText: 'May your birthday be filled with joy, blessings, and endless happiness.',
  bgMiddleImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  middleHeading1: 'Happy', middleHeading2: 'Birthday',
  middleImageLeft: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600',
  middleImageRight: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
  middleBottomText: 'Wish you all the best',
  bottomImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=1200',
};

const defaultZineSplitShowcase: ZineSplitShowcaseContent = {
  image1: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800', backText1: 'I CAN ALWAYS MAKE YOU SMILE', desc1: 'A moment of laughter.',
  image2: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', backText2: 'HAPPY BIRTHDAY', desc2: 'Celebrating you.',
  image3: 'https://images.unsplash.com/photo-1520113412048-285b0d0dc522?w=800', backText3: 'LOVE TO TEASE YOU!', desc3: 'My favorite hobby.',
  image4: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', backText4: 'FOREVER MOMENTS', desc4: 'Every second is a treasure.',
};

const defaultCoverflowGallery: CoverflowGalleryContent = {
  image1: 'https://images.unsplash.com/photo-1530103862676-fa390d6259c7',
  image2: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3',
  image3: 'https://images.unsplash.com/photo-1513151233558-d860c5398176',
  image4: 'https://images.unsplash.com/photo-1533294160622-d5fece3e080d',
  image5: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74',
};

const defaultZineArchive: ZineArchiveContent = {
  sectionHeading: 'MEMORIES ARCHIVE', viewAllText: 'VIEW ALL MEMORIES',
  leftImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74', leftImageName: 'BIRTHDAY BASH', leftImageStatus: 'FEATURED',
  stickyNoteText: 'Best moments shared together!',
  rightImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176', rightImageName: 'SUMMER VIBES', rightImageDate: 'JUNE 2023',
  formHeading: 'SEND A WISH', formDesc: 'Write something beautiful!', formPlaceholder: 'Your message here...', formBtnText: 'SEND WISH',
};

const defaultGiftSequence: GiftSequenceContent = {
  questions: [{ id: '1', sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif', question: 'Ready?', options: [{ text: 'Yes!', isCorrect: true }, { text: 'No', isCorrect: false }] }],
  giftType: 'video', giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
  happyStickers: [], sadStickers: [], letterTitle: 'HAPPY BIRTHDAY', letterBody: 'Wishing you the best...', letterFooter: 'Love you!', ctaText: 'More inside...', promptSticker: '',
  questionBgImageLeft: '', questionBgImageRight: ''
};

const defaultMemories: MemoriesContent = {
  tvType: 'slideshow', tvVideoUrl: '', tvSlideshowImages: [],
  polaroids: Array(7).fill({ url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74', text: 'A memory...' })
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useCmsStore = create<CmsState>((set, get) => ({
  currentWishId: null,
  currentWishSlug: null,
  scrapbookHero: null,
  splashScreen: null,
  zineSplitShowcase: null,
  coverflowGallery: null,
  zineArchive: null,
  giftSequence: null,
  memories: null,
  isLoading: false,
  error: null,
  isSplashCompleted: false,

  fetchWishBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cms/slug/${slug}`);
      if (!response.ok) throw new Error('Wish not found');
      const data: WishData = await response.json();
      
      set({
        currentWishId: data.id,
        currentWishSlug: data.slug,
        scrapbookHero: { ...defaultScrapbookHero, ...data.content.scrapbookHero },
        splashScreen: { ...defaultSplashScreen, ...data.content.splashScreen },
        zineSplitShowcase: { ...defaultZineSplitShowcase, ...data.content.zineSplitShowcase },
        coverflowGallery: { ...defaultCoverflowGallery, ...data.content.coverflowGallery },
        zineArchive: { ...defaultZineArchive, ...data.content.zineArchive },
        giftSequence: { ...defaultGiftSequence, ...data.content.giftSequence },
        memories: { ...defaultMemories, ...data.content.memories },
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWishById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cms/id/${id}`);
      if (!response.ok) throw new Error('Wish not found');
      const data: WishData = await response.json();
      
      set({
        currentWishId: data.id,
        currentWishSlug: data.slug,
        scrapbookHero: { ...defaultScrapbookHero, ...data.content.scrapbookHero },
        splashScreen: { ...defaultSplashScreen, ...data.content.splashScreen },
        zineSplitShowcase: { ...defaultZineSplitShowcase, ...data.content.zineSplitShowcase },
        coverflowGallery: { ...defaultCoverflowGallery, ...data.content.coverflowGallery },
        zineArchive: { ...defaultZineArchive, ...data.content.zineArchive },
        giftSequence: { ...defaultGiftSequence, ...data.content.giftSequence },
        memories: { ...defaultMemories, ...data.content.memories },
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createWish: async (slug, name) => {
    set({ isLoading: true });
    const response = await fetch(`${API_URL}/api/cms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, recipient_name: name })
    });
    const data = await response.json();
    set({ isLoading: false });
    return data.id;
  },

  updateSection: async (section, content) => {
    const id = get().currentWishId;
    if (!id) return;

    // Local update
    set({ [section]: content } as any);

    // Persist to DB
    const currentContent = {
      scrapbookHero: get().scrapbookHero,
      splashScreen: get().splashScreen,
      zineSplitShowcase: get().zineSplitShowcase,
      coverflowGallery: get().coverflowGallery,
      zineArchive: get().zineArchive,
      giftSequence: get().giftSequence,
      memories: get().memories,
    };

    await fetch(`${API_URL}/api/cms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { ...currentContent, [section]: content } })
    });
  },

  setSplashCompleted: (completed) => set({ isSplashCompleted: completed }),
}));
