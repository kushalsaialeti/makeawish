export interface WishContent {
  scrapbookHero: any;
  splashScreen: any;
  zineSplitShowcase: any;
  coverflowGallery: any;
  zineArchive: any;
  giftSequence: any;
  memories: any;
}

/**
 * Returns customized default template content tailored to the specific occasion.
 */
export const getOccasionTemplate = (occasion: string, recipientName: string = 'Special One'): WishContent => {
  const normOccasion = (occasion || 'birthday').toLowerCase();

  switch (normOccasion) {
    case 'anniversary':
      return {
        splashScreen: {
          targetDate: new Date(Date.now() + 86400000 * 30).toISOString(),
          correctMonth: '06',
          correctDay: '18',
          correctYear: '2020',
          promptHeading: 'A journey of love & togetherness.',
          btnNowText: 'Open Love Vault',
          btnLaterText: 'Cherish Later',
          recipientName: recipientName,
          clockText: 'MOMENTS TOGETHER',
          splashImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
          lockHeading: 'Enter our special date',
          lockSubtext: 'The day our forever began',
          birthdayHeading: `HAPPY ANNIVERSARY ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
          topText: 'Every single second with you is a blessing I will cherish for eternity.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200',
          middleHeading1: 'Forever',
          middleHeading2: 'Together',
          middleImageLeft: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600',
          middleBottomText: 'To another year of growing, loving, and laughing together.',
          bottomImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800', backText: 'THE FIRST TIME WE MET', desc: 'When magic turned into reality.' },
            { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800', backText: 'ENDLESS CONVERSATIONS', desc: 'Talking under starry skies.' },
            { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', backText: 'MY SAFEST HAVEN', desc: 'Home is wherever you are.' },
            { image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', backText: 'FOREVER & ALWAYS', desc: 'Written in our stars.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
            'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'OUR LOVE ARCHIVE',
          viewAllText: 'VIEW ALL MEMORIES',
          leftImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
          leftImageName: 'OUR SPECIAL MOMENT',
          leftImageStatus: 'FEATURED',
          stickyNoteText: 'I would choose you in every lifetime!',
          rightImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
          rightImageName: 'LIFELONG BOND',
          rightImageDate: 'ANNIVERSARY EDITION',
          formHeading: 'LEAVE A LOVE NOTE',
          formDesc: 'Write something romantic & timeless',
          formPlaceholder: 'Your heartfelt words...',
          formBtnText: 'SAVE NOTE',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Who said "I love you" first?',
              options: [
                { text: 'You did! 💖', isCorrect: true },
                { text: 'I did! 🥰', isCorrect: false },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'HAPPY ANNIVERSARY MY LOVE',
          letterBody: `To ${recipientName},\n\nEvery day with you is a gift I never take for granted. Thank you for filling my days with warmth, patience, understanding, and unconditional love. Here is to our past, present, and boundless future together.\n\nForever yours ❤️`,
          letterFooter: 'With all my heart & soul',
          ctaText: 'EXPERIENCE OUR TIMELINE',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
            text: 'A timeless chapter together...',
          }),
        },
      };

    case 'valentine':
      return {
        splashScreen: {
          targetDate: '2026-02-14T00:00:00',
          correctMonth: '02',
          correctDay: '14',
          correctYear: '2026',
          promptHeading: 'A secret love letter awaits.',
          btnNowText: 'Unlock Love Note',
          btnLaterText: 'Later',
          recipientName: recipientName,
          clockText: 'VALENTINE COUNTDOWN',
          splashImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200',
          lockHeading: 'Unlock My Heart',
          lockSubtext: 'A date etched in romance',
          birthdayHeading: `BE MY VALENTINE, ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200',
          topText: 'You make the ordinary moments feel extraordinary.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200',
          middleHeading1: 'Pure',
          middleHeading2: 'Devotion',
          middleImageLeft: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600',
          middleBottomText: 'Holding your hand is my favorite place in the whole world.',
          bottomImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800', backText: 'YOUR SWEET SMILE', desc: 'Lights up my darkest days.' },
            { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800', backText: 'EVERY LITTLE THING', desc: 'The way you laugh and care.' },
            { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', backText: 'MY GREATEST GIFT', desc: 'Finding you in this universe.' },
            { image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', backText: 'SOUL CONNECTION', desc: 'Two hearts beating as one.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'REASONS I LOVE YOU',
          viewAllText: 'VIEW SWEET MEMORIES',
          leftImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
          leftImageName: 'SWEET VALENTINE',
          leftImageStatus: 'MY FAVORITE',
          stickyNoteText: 'You are my yesterday, today, and all my tomorrows.',
          rightImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
          rightImageName: 'FOREVER VALENTINE',
          rightImageDate: 'FEBRUARY 2026',
          formHeading: 'LEAVE A LOVE NOTE',
          formDesc: 'Send a message of love',
          formPlaceholder: 'I love you because...',
          formBtnText: 'SEND LOVE',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Will you always be my Valentine?',
              options: [
                { text: 'Yes, absolutely! 💖', isCorrect: true },
                { text: 'Forever & ever! 🌹', isCorrect: true },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'HAPPY VALENTINE’S DAY',
          letterBody: `Dearest ${recipientName},\n\nYou bring boundless joy and meaning into my life. Every day feels special because I get to share it with you. Thank you for being my anchor, my confidant, and the love of my life.\n\nWith all my love,\nAlways and forever 💖`,
          letterFooter: 'Always by your side',
          ctaText: 'VIEW OUR ROMANTIC GALLERY',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
            text: 'Love in every frame...',
          }),
        },
      };

    case 'graduation':
      return {
        splashScreen: {
          targetDate: new Date().toISOString(),
          correctMonth: '05',
          correctDay: '20',
          correctYear: '2026',
          promptHeading: 'A monumental milestone achieved.',
          btnNowText: 'View Tribute',
          btnLaterText: 'Later',
          recipientName: recipientName,
          clockText: 'ACADEMIC MILESTONE',
          splashImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
          lockHeading: 'Enter Graduation Passcode',
          lockSubtext: 'The year of triumph',
          birthdayHeading: `CONGRATULATIONS GRADUATE, ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
          topText: 'Your dedication, perseverance, and brilliance have paved the path to greatness.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=1200',
          middleHeading1: 'Class of',
          middleHeading2: 'Excellence',
          middleImageLeft: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
          middleBottomText: 'Honoring hard work, late nights, and the boundless future ahead.',
          bottomImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', backText: 'THE JOURNEY BEGAN', desc: 'Taking the first brave step.' },
            { image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', backText: 'TRIUMPH OVER OBSTACLES', desc: 'Never backing down.' },
            { image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', backText: 'FRIENDSHIPS FORGED', desc: 'Companions through it all.' },
            { image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800', backText: 'FUTURE ASPIRATIONS', desc: 'The world is yours to conquer.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
            'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'GRADUATION HONORS',
          viewAllText: 'VIEW ALL ACHIEVEMENTS',
          leftImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          leftImageName: 'DEGREE EARNED',
          leftImageStatus: 'PROUD MOMENT',
          stickyNoteText: 'So incredibly proud of everything you have accomplished!',
          rightImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
          rightImageName: 'NEW HORIZONS',
          rightImageDate: 'CLASS OF 2026',
          formHeading: 'LEAVE A CONGRATULATIONS NOTE',
          formDesc: 'Wish them luck on their career journey',
          formPlaceholder: 'Proud of you! Your message...',
          formBtnText: 'POST CONGRATULATIONS',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Ready to conquer your next big chapter?',
              options: [
                { text: 'Yes, absolutely ready! 🎓', isCorrect: true },
                { text: 'Bring on the future! 🚀', isCorrect: true },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'CONGRATULATIONS ON GRADUATING',
          letterBody: `Dear ${recipientName},\n\nWatching you grow, persist, and achieve this degree is an honor. You have proven that dedication and passion make anything possible. May this next chapter bring even greater adventures and success.\n\nProud of you always! 🎓`,
          letterFooter: 'With immense pride & respect',
          ctaText: 'EXPLORE MEMORY TIMELINE',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            text: 'A milestone achieved...',
          }),
        },
      };

    case 'milestone':
      return {
        splashScreen: {
          targetDate: new Date().toISOString(),
          correctMonth: '01',
          correctDay: '01',
          correctYear: '2026',
          promptHeading: 'Celebrating a defining victory.',
          btnNowText: 'Open Honors',
          btnLaterText: 'Later',
          recipientName: recipientName,
          clockText: 'MILESTONE MOMENT',
          splashImage: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=1200',
          lockHeading: 'Enter Milestone Code',
          lockSubtext: 'The moment of victory',
          birthdayHeading: `HONORING YOUR MILESTONE, ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=1200',
          topText: 'A testament to resilience, focus, and unwavering ambition.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
          middleHeading1: 'Extraordinary',
          middleHeading2: 'Achievement',
          middleImageLeft: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
          middleBottomText: 'Standing proud at the summit of your hard work.',
          bottomImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800', backText: 'THE SPARK', desc: 'Where the vision took shape.' },
            { image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800', backText: 'RELENTLESS EFFORT', desc: 'Overcoming every test.' },
            { image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', backText: 'VICTORY MOMENT', desc: 'Crossing the finish line.' },
            { image: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800', backText: 'THE LEGACY', desc: 'Setting new standards.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
            'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'HALL OF TRIUMPH',
          viewAllText: 'VIEW MEMORIES',
          leftImage: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800',
          leftImageName: 'THE VICTORY',
          leftImageStatus: 'MILESTONE',
          stickyNoteText: 'You proved that with grit, greatness follows!',
          rightImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800',
          rightImageName: 'NEW HEIGHTS',
          rightImageDate: 'CHAMPION 2026',
          formHeading: 'LEAVE A TRIBUTE',
          formDesc: 'Honor this extraordinary achievement',
          formPlaceholder: 'Congratulations on this milestone...',
          formBtnText: 'SUBMIT TRIBUTE',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Ready to celebrate this monumental victory?',
              options: [
                { text: 'Yes, let’s celebrate! 🏆', isCorrect: true },
                { text: 'On to higher peaks! 🌟', isCorrect: true },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'CELEBRATING YOUR MILESTONE',
          letterBody: `Dear ${recipientName},\n\nReaching this milestone is no ordinary feat. It represents countless hours of dedication, grit, and belief in yourself. We celebrate your victory today and cheer for all the triumphs ahead.\n\nCongratulations! 🏆`,
          letterFooter: 'With deepest admiration',
          ctaText: 'VIEW THE TRIBUTE VAULT',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800',
            text: 'A victory to remember...',
          }),
        },
      };

    case 'custom':
      return {
        splashScreen: {
          targetDate: new Date().toISOString(),
          correctMonth: '01',
          correctDay: '01',
          correctYear: '2026',
          promptHeading: 'A special celebration curated just for you.',
          btnNowText: 'Open Experience',
          btnLaterText: 'Later',
          recipientName: recipientName,
          clockText: 'TIME TO CELEBRATE',
          splashImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
          lockHeading: 'Enter Secret Code',
          lockSubtext: 'Your personal celebration key',
          birthdayHeading: `CELEBRATING YOU, ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
          topText: 'Every moment shared together is a story worth telling.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
          middleHeading1: 'Timeless',
          middleHeading2: 'Memories',
          middleImageLeft: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
          middleBottomText: 'Honoring our bond and the beautiful moments we share.',
          bottomImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', backText: 'A SPECIAL DAY', desc: 'Celebrating what makes you unique.' },
            { image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800', backText: 'SHARED LAUGHTER', desc: 'Treasured memories.' },
            { image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', backText: 'HEARTFELT BOND', desc: 'Always there for each other.' },
            { image: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800', backText: 'ENDLESS JOY', desc: 'To many more chapters.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
            'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'MEMORIES VAULT',
          viewAllText: 'VIEW ALL MEMORIES',
          leftImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          leftImageName: 'HIGHLIGHT',
          leftImageStatus: 'FEATURED',
          stickyNoteText: 'Best moments shared together!',
          rightImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=800',
          rightImageName: 'JOURNEY',
          rightImageDate: 'SPECIAL MOMENT',
          formHeading: 'LEAVE A NOTE',
          formDesc: 'Write something beautiful',
          formPlaceholder: 'Your message here...',
          formBtnText: 'SEND NOTE',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Ready for this special surprise?',
              options: [
                { text: 'Yes, absolutely! ✨', isCorrect: true },
                { text: 'Let’s go! 🎁', isCorrect: true },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'CELEBRATING YOU',
          letterBody: `Dear ${recipientName},\n\nThis celebration is dedicated to you and all the brightness you bring. Thank you for being such an extraordinary person. Wishing you all the happiness and joy in the world.\n\nWarmest wishes always! ✨`,
          letterFooter: 'With love and respect',
          ctaText: 'EXPLORE OUR STORYBOOK',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            text: 'A cherished moment...',
          }),
        },
      };

    case 'birthday':
    default:
      return {
        splashScreen: {
          targetDate: new Date(Date.now() + 86400000 * 10).toISOString(),
          correctMonth: '12',
          correctDay: '25',
          correctYear: '2000',
          promptHeading: 'A birthday surprise awaits.',
          btnNowText: 'Open Now',
          btnLaterText: 'Later',
          recipientName: recipientName,
          clockText: 'TIME IS TICKING',
          splashImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',
          lockHeading: 'Enter the passcode',
          lockSubtext: 'Your special birthday date',
          birthdayHeading: `HAPPY BIRTHDAY ${recipientName.toUpperCase()}!`,
          bgImage: '',
          ropePolaroids: [],
        },
        scrapbookHero: {
          topImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200',
          topText: 'May your birthday be filled with joy, blessings, and endless happiness.',
          bgMiddleImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
          middleHeading1: 'Happy',
          middleHeading2: 'Birthday',
          middleImageLeft: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600',
          middleImageRight: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
          middleBottomText: 'Wish you all the very best on this special celebration.',
          bottomImage: 'https://images.unsplash.com/photo-1502323777036-f4dd8c6b7582?w=1200',
        },
        zineSplitShowcase: {
          items: [
            { image: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800', backText: 'YOU ALWAYS MAKE ME SMILE', desc: 'A moment of pure laughter.' },
            { image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', backText: 'HAPPY BIRTHDAY', desc: 'Celebrating you today.' },
            { image: 'https://images.unsplash.com/photo-1520113412048-285b0d0dc522?w=800', backText: 'TREASURED MOMENTS', desc: 'Memories made together.' },
            { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', backText: 'FOREVER MEMORIES', desc: 'Every second is a treasure.' },
          ],
        },
        coverflowGallery: {
          images: [
            'https://images.unsplash.com/photo-1530103862676-fa390d6259c7?w=800',
            'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
            'https://images.unsplash.com/photo-1533294160622-d5fece3e080d?w=800',
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
          ],
        },
        zineArchive: {
          sectionHeading: 'BIRTHDAY ARCHIVE',
          viewAllText: 'VIEW ALL MEMORIES',
          leftImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
          leftImageName: 'BIRTHDAY BASH',
          leftImageStatus: 'FEATURED',
          stickyNoteText: 'Best moments shared together!',
          rightImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
          rightImageName: 'CELEBRATION',
          rightImageDate: 'SPECIAL EDITION',
          formHeading: 'SEND A BIRTHDAY WISH',
          formDesc: 'Write something beautiful for the birthday star!',
          formPlaceholder: 'Your warm birthday wishes...',
          formBtnText: 'SEND WISH',
        },
        giftSequence: {
          questions: [
            {
              id: '1',
              sticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
              question: 'Ready for your birthday surprise?',
              options: [
                { text: 'Yes, open it! 🎂', isCorrect: true },
                { text: 'Let’s go! 🎁', isCorrect: true },
              ],
            },
          ],
          giftType: 'video',
          giftUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          giftAlertSticker: 'https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif',
          happyStickers: [],
          sadStickers: [],
          letterTitle: 'HAPPIEST OF BIRTHDAYS',
          letterBody: `Dear ${recipientName},\n\nWishing you the happiest of birthdays! May this year bring you closer to your dreams, surround you with genuine laughter, and bless you with good health and boundless happiness.\n\nEnjoy every moment of your special day! 🎂✨`,
          letterFooter: 'With love & warmest wishes',
          ctaText: 'MORE SURPRISES INSIDE',
          promptSticker: '',
          questionBgImageLeft: '',
          questionBgImageRight: '',
        },
        memories: {
          tvType: 'slideshow',
          tvVideoUrls: [],
          tvSlideshowImages: [
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
          ],
          polaroids: Array(7).fill({
            url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
            text: 'A birthday memory...',
          }),
        },
      };
  }
};
