import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
  lockHeading?: string;
  lockSubtext?: string;
  birthdayHeading?: string;
  bgImage?: string;
  ropePolaroids?: string[];
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

export interface ZineSplitItem { image: string; backText: string; desc: string; }
export interface ZineSplitShowcaseContent {
  items: ZineSplitItem[];
}

export interface CoverflowGalleryContent {
  images: string[];
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
  tvVideoUrls: string[];
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
  isUnlocked: boolean;
  isPublished: boolean;
 
  // Actions
  fetchWishBySlug: (slug: string) => Promise<void>;
  fetchWishById: (id: string) => Promise<void>;
  createWish: (slug: string, name: string) => Promise<string>;
  updateSection: (section: keyof WishData['content'], content: any) => Promise<void>;
  setUnlocked: (unlocked: boolean) => void;
  subscribeToWish: (slug: string) => () => void;
  refreshWish: () => Promise<void>;
}

// --- Defaults ---
const defaultSplashScreen: SplashScreenContent = {
  targetDate: '2026-12-31T00:00:00', correctMonth: '12', correctDay: '25', correctYear: '2000',
  promptHeading: 'A surprise awaits.', btnNowText: 'Open Now', btnLaterText: 'Later',
  recipientName: 'Beautiful', clockText: 'TIME IS TICKING',
  splashImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
  lockHeading: 'Enter the passcode',
  lockSubtext: 'Your special day',
  birthdayHeading: 'HAPPY BIRTHDAY BEAUTIFUL!',
  bgImage: '',
  ropePolaroids: [],
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
  items: [
    { image: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800', backText: 'I CAN ALWAYS MAKE YOU SMILE', desc: 'A moment of laughter.' },
    { image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', backText: 'HAPPY BIRTHDAY', desc: 'Celebrating you.' },
    { image: 'https://images.unsplash.com/photo-1520113412048-285b0d0dc522?w=800', backText: 'LOVE TO TEASE YOU!', desc: 'My favorite hobby.' },
    { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', backText: 'FOREVER MOMENTS', desc: 'Every second is a treasure.' },
  ]
};

const defaultCoverflowGallery: CoverflowGalleryContent = {
  images: [
    'https://images.unsplash.com/photo-1530103862676-fa390d6259c7',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176',
    'https://images.unsplash.com/photo-1533294160622-d5fece3e080d',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74'
  ]
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
  tvType: 'slideshow',    tvVideoUrls: [], tvSlideshowImages: [],
  polaroids: Array(7).fill({ url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74', text: 'A memory...' })
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const normalizeClientContent = (content: any) => {
  if (!content || typeof content !== 'object') return {};
  const c = { ...content };

  // Normalize Coverflow Gallery
  let cg = c.coverflowGallery || {};
  if (!Array.isArray(cg.images) || cg.images.length === 0) {
    const extracted = [
      cg.image1,
      cg.image2,
      cg.image3,
      cg.image4,
      cg.image5,
      cg.image6,
      cg.image7,
      cg.image8,
    ].filter(Boolean);
    if (extracted.length > 0) {
      cg = { ...cg, images: extracted };
    }
  }
  c.coverflowGallery = cg;

  // Normalize Zine Split Showcase
  let zs = c.zineSplitShowcase || {};
  if (!Array.isArray(zs.items) || zs.items.length === 0) {
    const extractedItems: ZineSplitItem[] = [];
    for (let i = 1; i <= 6; i++) {
      if (zs[`image${i}`] || zs[`backText${i}`] || zs[`desc${i}`]) {
        extractedItems.push({
          image: zs[`image${i}`] || '',
          backText: zs[`backText${i}`] || '',
          desc: zs[`desc${i}`] || '',
        });
      }
    }
    if (extractedItems.length > 0) {
      zs = { ...zs, items: extractedItems };
    }
  }
  c.zineSplitShowcase = zs;

  // Normalize Memories
  let mem = c.memories || {};
  if (mem.tvVideoUrl && (!mem.tvVideoUrls || mem.tvVideoUrls.length === 0)) {
    mem = { ...mem, tvVideoUrls: [mem.tvVideoUrl] };
  }
  c.memories = mem;

  return c;
};

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
  isUnlocked: sessionStorage.getItem('wish_unlocked') === 'true',
  isPublished: false,

  fetchWishBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cms/slug/${slug}`);
      if (!response.ok) throw new Error('Wish not found');
      const data: WishData = await response.json();
      
      const content = normalizeClientContent(data.content || {});
      set({
        currentWishId: data.id,
        currentWishSlug: data.slug,
        scrapbookHero: { ...defaultScrapbookHero, ...(content.scrapbookHero || {}) },
        splashScreen: { ...defaultSplashScreen, ...(content.splashScreen || {}) },
        zineSplitShowcase: { ...defaultZineSplitShowcase, ...(content.zineSplitShowcase || {}) },
        coverflowGallery: { ...defaultCoverflowGallery, ...(content.coverflowGallery || {}) },
        zineArchive: { ...defaultZineArchive, ...(content.zineArchive || {}) },
        giftSequence: { ...defaultGiftSequence, ...(content.giftSequence || {}) },
        memories: { ...defaultMemories, ...(content.memories || {}) },
        isPublished: data.is_published,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWishById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { useAuthStore } = await import('./authStore');
      const token = useAuthStore.getState().getToken() || localStorage.getItem('admin_token') || sessionStorage.getItem('makeawish_admin_token') || '';
      const response = await fetch(`${API_URL}/api/cms/id/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!response.ok) throw new Error('Wish not found');
      const data: WishData = await response.json();
      
      const content = normalizeClientContent(data.content || {});
      set({
        currentWishId: data.id,
        currentWishSlug: data.slug,
        scrapbookHero: { ...defaultScrapbookHero, ...(content.scrapbookHero || {}) },
        splashScreen: { ...defaultSplashScreen, ...(content.splashScreen || {}) },
        zineSplitShowcase: { ...defaultZineSplitShowcase, ...(content.zineSplitShowcase || {}) },
        coverflowGallery: { ...defaultCoverflowGallery, ...(content.coverflowGallery || {}) },
        zineArchive: { ...defaultZineArchive, ...(content.zineArchive || {}) },
        giftSequence: { ...defaultGiftSequence, ...(content.giftSequence || {}) },
        memories: { ...defaultMemories, ...(content.memories || {}) },
        isPublished: data.is_published,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createWish: async (slug, name) => {
    set({ isLoading: true });
    const { useAuthStore } = await import('./authStore');
    const token = useAuthStore.getState().getToken() || localStorage.getItem('admin_token') || sessionStorage.getItem('makeawish_admin_token') || '';
    const response = await fetch(`${API_URL}/api/cms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ slug, recipient_name: name })
    });
    if (response.status === 401) {
      window.location.href = '/login';
      return '';
    }
    const data = await response.json();
    set({ isLoading: false });
    return data.id;
  },

  updateSection: async (section, content) => {
    const id = get().currentWishId;
    if (!id) return;

    const payload: any = {};
    
    // Check if we are updating a top-level property or a content section
    if (section === 'is_published' as any) {
      set({ isPublished: content });
      payload.is_published = content;
    } else {
      // Local update for the specific section
      set({ [section]: content } as any);
      
      // Reconstruct the full content object from current store state
      const updatedContent = {
        scrapbookHero: section === 'scrapbookHero' ? content : get().scrapbookHero,
        splashScreen: section === 'splashScreen' ? content : get().splashScreen,
        zineSplitShowcase: section === 'zineSplitShowcase' ? content : get().zineSplitShowcase,
        coverflowGallery: section === 'coverflowGallery' ? content : get().coverflowGallery,
        zineArchive: section === 'zineArchive' ? content : get().zineArchive,
        giftSequence: section === 'giftSequence' ? content : get().giftSequence,
        memories: section === 'memories' ? content : get().memories,
      };
      
      payload.content = updatedContent;
    }

    const { useAuthStore } = await import('./authStore');
    const token = useAuthStore.getState().getToken() || localStorage.getItem('admin_token') || '';
    const response = await fetch(`${API_URL}/api/cms/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.reload();
    }
  },

  setUnlocked: (unlocked) => {
    sessionStorage.setItem('wish_unlocked', unlocked ? 'true' : 'false');
    set({ isUnlocked: unlocked });
  },

  refreshWish: async () => {
    const slug = get().currentWishSlug;
    if (!slug) return;
    
    try {
      const response = await fetch(`${API_URL}/api/cms/slug/${slug}`);
      if (!response.ok) return;
      const data: WishData = await response.json();
      const content = data.content || {};
      
      set({
        isPublished: data.is_published,
        scrapbookHero: { ...defaultScrapbookHero, ...(content.scrapbookHero || {}) },
        splashScreen: { ...defaultSplashScreen, ...(content.splashScreen || {}) },
        zineSplitShowcase: { ...defaultZineSplitShowcase, ...(content.zineSplitShowcase || {}) },
        coverflowGallery: { ...defaultCoverflowGallery, ...(content.coverflowGallery || {}) },
        zineArchive: { ...defaultZineArchive, ...(content.zineArchive || {}) },
        giftSequence: { ...defaultGiftSequence, ...(content.giftSequence || {}) },
        memories: { ...defaultMemories, ...(content.memories || {}) },
      });
    } catch (err) {
      console.error('[Realtime] Fallback refresh failed:', err);
    }
  },

  subscribeToWish: (slug: string) => {
    console.log(`[Realtime] Initializing subscription for: ${slug}`);
    
    const channel = supabase
      .channel(`wish-realtime-${slug}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'wishes', 
          filter: `slug=eq.${slug}` 
        },
        async (payload) => {
          console.log('[Realtime] Change detected:', payload);
          
          // Strategy: If payload is full, use it. Otherwise, trigger a fresh fetch.
          const data = payload.new as WishData;
          if (data && data.content && Object.keys(data.content).length > 0) {
            console.log('[Realtime] Using payload data');
            const content = data.content;
            set({
              isPublished: data.is_published,
              scrapbookHero: { ...defaultScrapbookHero, ...(content.scrapbookHero || {}) },
              splashScreen: { ...defaultSplashScreen, ...(content.splashScreen || {}) },
              zineSplitShowcase: { ...defaultZineSplitShowcase, ...(content.zineSplitShowcase || {}) },
              coverflowGallery: { ...defaultCoverflowGallery, ...(content.coverflowGallery || {}) },
              zineArchive: { ...defaultZineArchive, ...(content.zineArchive || {}) },
              giftSequence: { ...defaultGiftSequence, ...(content.giftSequence || {}) },
              memories: { ...defaultMemories, ...(content.memories || {}) },
            });
          } else {
            console.log('[Realtime] Payload incomplete, fetching fresh data...');
            await get().refreshWish();
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status for ${slug}:`, status);
      });
    
    return () => {
      console.log(`[Realtime] Cleaning up subscription for ${slug}`);
      supabase.removeChannel(channel);
    };
  }
}));
