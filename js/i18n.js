/**
 * NANALY Multilingual Dictionary & Language Switcher (JP / EN)
 * Handles instant switching, localStorage persistence across all 7 pages,
 * lossless JA restoration, and hooks for dynamic modals & photo viewers.
 */
(function () {
  const STORAGE_KEY = 'nanaly_lang';

  const EN_TRANSLATIONS = {
    // ==================== SHARED ====================
    'nav.backToTop': 'Back to TOP',

    // ==================== TOP PAGE (index.html) ====================
    'top.pageTitle': 'Nana Yamamoto | NANALY Inc. Digital Business Card',
    'top.ownerName': 'Nana Yamamoto',
    'top.ownerEn': '山本 奈々',
    'top.company': 'NANALY Inc.',
    'top.jobTitle': 'Representative Director',
    'top.card.profile': 'Profile',
    'top.card.beauty': 'Beauty Devices',
    'top.card.beautySub': '<span>Dev &amp; Sales</span>',
    'top.card.secretary': 'Online Secretary',
    'top.card.secretarySub': '<span>Sales Support</span>',
    'top.card.fp': 'FP &amp; Insurance',
    'top.card.seminar': 'Seminars',
    'top.card.seminarSub': '<span>Finance Class</span><span>Business Manners</span>',
    'top.card.model': 'Modeling',
    'top.banner.sub': 'General Incorporated Association',
    'top.banner.title': "Children's Future &amp; Money Research (Tentative)",
    'top.footer.contact': 'Contact',
    'top.footer.instagram': 'Instagram',
    'top.footer.line': 'LINE',
    'top.modal.primary': 'Contact Us',
    'top.modal.secondary': 'Close',

    // ==================== PROFILE PAGE ====================
    'profile.pageTitle': 'Nana Yamamoto | Profile & My Activities - NANALY Inc.',
    'profile.titleJa': 'About Me',
    'profile.name': 'Nana Yamamoto',
    'profile.company': 'NANALY Inc.',
    'profile.role': 'Representative Director',
    'profile.fromLabel': 'From',
    'profile.fromValue': 'Fukui, Japan',
    'profile.skillLabel': 'Strengths',
    'profile.skill1': 'Sales &amp; Multitasking',
    'profile.skill2': 'Can sleep 12 hours a day',
    'profile.hobbyHeading': 'Hobbies',
    'profile.carsTitle': 'Sports Cars',
    'profile.carsLead': 'Exclusively manual transmission (MT)!',
    'profile.carsIntro': 'Meet my beloved cars.',
    'profile.animeTitle': 'Anime',
    'profile.animeDesc':
      "Steins;Gate, Code Geass, Inuyasha...<br />The list goes on and on.<br />I also enjoy trying cosplay!",
    'profile.travelTitle': 'Overseas Travel',
    'profile.travelDesc':
      "I've visited 14 countries so far,<br />and I'd love to explore art museums<br />and enjoy delicious local cuisine<br />in many more countries!",
    'profile.effortTitle': 'Current Goals',
    'profile.effort1': 'Becoming even more agile and action-oriented',
    'profile.effort2': 'Maxing out the ¥18M NISA allowance',
    'profile.activitiesHeading': 'My Activities',
    'profile.act1Title': 'Online Secretary',
    'profile.act1Desc':
      'After working as an executive secretary for directors and CEOs, I launched my independent business leveraging my agility and strengths in multitasking and task management.',
    'profile.act2Title': 'Financial Services',
    'profile.act2Desc':
      "Witnessing the loss of a friend and a family member's battle with illness made me deeply realize the importance of money and medical preparedness. I started this work to protect those around me and raise financial literacy in Japan.",
    'profile.act3Title': 'Financial Ed. for Kids',
    'profile.act3Sub': ' (Association)',
    'profile.act3Desc':
      'As one of the founders of the "Children\'s Future &amp; Money Research Association," I am dedicated to advancing financial education for the next generation.',
    'profile.act4Title': 'Beauty Business',
    'profile.act4Desc':
      'As a new venture, I am also working in the beauty sector—developing safe, Made-in-Japan professional beauty machines and exporting them overseas.',
    'profile.act5Title': 'Modeling',
    'profile.act5Sub': ' (Freelance)',
    'profile.act5Desc':
      'I work as a freelance model for kimono shoots and product advertisements, enjoying it as one of my creative pursuits.',
    'profile.detailBtn': 'Details',

    // ==================== SECRETARY PAGE ====================
    'sec.pageTitle': 'Online Secretary & Sales Support | NANALY Inc.',
    'sec.heroTitle': 'Online Secretary<br /><span class="title-particle">&amp;</span> Sales Support',
    'sec.heroLead':
      'Streamlining daily tasks so you<br />can focus on what matters most.',
    'sec.benefit1': 'Efficiency',
    'sec.benefit2': 'Sales Growth',
    'sec.benefit3': 'More Time',
    'sec.pillar1Title': 'Online Secretary',
    'sec.pillar1Intro':
      'Comprehensive administrative &amp; back-office support to ease your daily workload.',
    'sec.keyServices': 'Key Services',
    'sec.task1_1': 'Schedule management &amp; coordination',
    'sec.task1_2': 'Email &amp; inquiry<br />management',
    'sec.task1_3': 'Document creation<br /><small class="task-note">(Proposals, quotes &amp; reports)</small>',
    'sec.task1_4': 'Meeting prep &amp;<br />minutes',
    'sec.task1_5': 'Data entry &amp; organization',
    'sec.task1_6': 'Other general<br />admin support',
    'sec.consultHeading': 'Feel Free to Consult Us On',
    'sec.consult1': 'Objective<br />perspective',
    'sec.consult2': 'New business &amp;<br />planning ideas',
    'sec.consult3': 'Tax &amp;<br />insurance<br />advice',
    'sec.consult4': 'Reviewing<br />employee benefits',
    'sec.consult5': 'Website &amp; SNS<br />improvements',
    'sec.consult6': 'Planning &amp;<br />arranging dinners<br />&amp; corporate events',
    'sec.arrangeHeading': 'Travel &amp; Arrangements',
    'sec.arrangeLead': 'Planning and arranging business trips,<br />company retreats, and training tours.',
    'sec.arrangeDesc':
      'No time to plan trips from scratch? Leave it to us. For both domestic and international travel, we handle destination research, sightseeing plans, transport, accommodation comparison, and full itinerary creation.',
    'sec.arrangeBanner': 'Put agency fees toward<br />making your trip unforgettable.',
    'sec.pillar2Title': 'Sales Support',
    'sec.pillar2Intro':
      'Acting on your behalf for part or all of your sales process<br />to create opportunities and grow revenue.',
    'sec.task2_1': 'Lead list creation &amp;<br />outreach',
    'sec.task2_2': 'Appointment setting<br /><small class="task-note">(Phone, Email &amp; SNS)</small>',
    'sec.task2_3': 'Pre-meeting discovery &amp;<br />needs assessment',
    'sec.task2_4': 'Proposal creation<br />support',
    'sec.task2_5': 'Prospect follow-up &amp;<br />CRM management',
    'sec.task2_6': 'Sales reporting &amp;<br />analysis',
    'sec.worriesHeading': 'Do Any of These Sound Familiar?',
    'sec.worry1': 'Too much to do,<br />not enough time',
    'sec.worry2': 'Buried in admin work,<br />unable to focus on sales or strategy',
    'sec.worry3': 'Tasks rely on specific individuals<br />and need streamlining',
    'sec.worry4': 'Sudden staff turnover<br />leaving gaps',
    'sec.worry5': 'Need temporary coverage<br />for parental leave',
    'sec.worry6': 'Want reliable support instead<br />of handling everything alone',
    'sec.pricingHeading': 'Pricing Plans',
    'sec.plan1Name': 'Light Plan',
    'sec.plan2Name': 'Standard Plan',
    'sec.plan3Name': 'Premier Plan',
    'sec.pricePrefix': '¥',
    'sec.priceSuffix': '+/mo',
    'sec.note1':
      'Monthly, hourly, weekly, or one-off—<br />flexible contracts tailored to your needs.',
    'sec.note2':
      'For sales support,<br /><strong>performance-based pricing is available.</strong>',

    // ==================== FP & INSURANCE PAGE ====================
    'fp.pageTitle': 'FP & Insurance | NANALY Inc.',
    'fp.mainTitle': 'FP &amp; Insurance',
    'fp.subBanner': 'Policy Review &amp; New Coverage',
    'fp.qLine1': 'Are you balancing',
    'fp.qLine2': 'defense &amp; growth?',
    'fp.leadCopy':
      'Tailored to each individual, we clarify<br />the roles of public programs,<br />private insurance, and NISA.',
    'fp.kakesuteTitle': 'Are you overpaying for<br />term insurance?',
    'fp.kakesuteDesc':
      'Private insurance should cover only what<br />public programs cannot—kept to the<br />essential minimum premiums you truly need.',
    'fp.companiesTop': 'Non-Life &amp; Life Insurance Combined',
    'fp.companiesUnit': ' insurers',
    'fp.companiesSub': 'Partner Insurance Companies',
    'fp.companiesLead':
      'We compare multiple providers to<br />recommend coverage that fits you best.',
    'fp.insDamageTitle': 'Non-Life Insurance',
    'fp.insDamageSub': '(Auto, Fire, Liability, etc.)',
    'fp.insLifeTitle': 'Life Insurance',
    'fp.insLifeSub': '(Medical, Cancer, Life,<br />Asset Building, etc.)',
    'fp.supportHeading': 'Total Support for Your<br />Financial Future',
    'fp.item1Title': 'NISA',
    'fp.item1Desc': 'A tax-free system to steadily<br />grow your long-term assets',
    'fp.item2Title': 'iDeCo',
    'fp.item2Desc': 'Individual defined contribution<br />pension for retirement savings',
    'fp.item3Title': 'DC',
    'fp.item3Sub': ' (Corporate / Individual)',
    'fp.item3Desc': 'Defined contribution pension<br />useful as employee benefits',
    'fp.item4Title': 'Corporate Insurance',
    'fp.item4Desc': 'Business risk protection,<br />executive &amp; retirement prep',
    'fp.item5Title': 'Furusato Nozei',
    'fp.item5Desc': 'Enjoy regional specialties while<br />optimizing tax contributions',
    'fp.item6Title': 'Life Plan Design',
    'fp.item6Desc': 'Organizing funding plans for<br />education, housing &amp; retirement',
    'fp.recTitle': 'Recommended For',
    'fp.rec1': 'Want to review premiums and reduce waste',
    'fp.rec2': 'Want to prepare for retirement funds',
    'fp.rec3': 'Want to make full use of NISA, iDeCo &amp; DC',
    'fp.rec4': 'Want to strengthen corporate &amp; business protection',
    'fp.rec5': 'Want to make smart use of Furusato Nozei',
    'fp.rec6': 'Want to organize a clear life plan',

    // ==================== SEMINAR PAGE ====================
    'sem.pageTitle': 'Seminars & Lectures | NANALY Inc.',
    'sem.titleLine1': 'Seminars &amp;',
    'sem.titleLine2': 'Lectures',
    'sem.leadCopy':
      'Practical, actionable insights on<br />financial literacy and business etiquette.',
    'sem.moneyHeading': 'Money Seminars',
    'sem.money1Title': 'Investing Basics',
    'sem.money1Desc':
      'Learn the fundamentals of<br />asset building, NISA, and iDeCo.',
    'sem.money2Title': 'Financial Ed. for Kids',
    'sem.money2Desc':
      'Teaching the role of money—how to<br />use, save, and grow it clearly.',
    'sem.money3Title': 'Insurance Basics &amp; Review',
    'sem.money3Desc':
      'Explaining how life &amp; medical insurance<br />work and how to choose wisely.',
    'sem.money4Title': 'Social Security &amp; Taxes',
    'sem.money4Desc':
      'Essential knowledge of public healthcare,<br />pensions, and benefit systems.',
    'sem.mannerHeading': 'Business Manners',
    'sem.manner1Title': 'Business Etiquette',
    'sem.manner1Desc':
      'First steps in business manners.<br />Greetings, honorifics, business cards, and<br />phone etiquette for professionals.',
    'sem.manner2Title': 'Dining Etiquette',
    'sem.manner2Desc':
      'Fundamentals of Japanese &amp; Western dining<br />and graceful table manners.',
    'sem.manner3Title': 'Proper Language &amp; Keigo',
    'sem.manner3Desc':
      'Clear explanations of commonly confused<br />honorifics and refined Japanese.',
    'sem.manner4Title': 'Business Email &amp; LINE',
    'sem.manner4Desc':
      'Writing to superiors and clients with<br />trustworthy communication basics.',
    'sem.usageHeading': 'Ways to Engage',
    'sem.usage1': 'Corporate &amp; Group Training',
    'sem.usage2': 'University &amp;<br />College Lectures',
    'sem.usage3': 'Community &amp;<br />Parent Seminars',
    'sem.usage4': 'Events &amp; Workshops',
    'sem.card1Lg': 'Private',
    'sem.card1Sm': 'Tutoring',
    'sem.card1Desc':
      "Supporting children's<br />academic learning as well as<br />financial education.",
    'sem.card2Lg': 'Corporate',
    'sem.card2Sm': 'Employee Benefits',
    'sem.card2Desc':
      'Ideal as employee benefits<br />for staff training, etiquette,<br />and financial literacy.',

    // ==================== MODEL PAGE ====================
    'model.pageTitle': 'Modeling & Photo Gallery | NANALY Inc.',
    'model.mainTitle': 'Modeling',
    'model.intro1': 'I also enjoy modeling as one<br />of my creative passions.',
    'model.intro2': 'I work independently on a freelance<br />basis with no open casting.',
    'model.intro3':
      'Between my main business work,<br />I participate in select shoots<br />through personal connections.',
    'model.adTitle': 'Product &amp; Ad Shoots',
    'model.galleryTitle': 'Photo Gallery',
    'model.salonCaption': 'Beauty &amp; Salon',
    'model.consultTitle': 'Feel Free to Ask About',
    'model.consult1Title': 'Finding a Photographer',
    'model.consult1Sub': 'Introducing photographers suited to your shoot',
    'model.consult2Title': 'Brochure Shoots &amp; Design',
    'model.consult2Sub': 'Consulting on visual concepts and layout',
    'model.consult3Title': "Kids' Photo Plans",
    'model.consult3Sub': 'Capturing meaningful milestones as they grow',
    'model.consult4Title': 'Pre-Wedding &amp; Coming-of-Age',
    'model.consult4Sub': 'Consultation for photography on special days',
    'model.pfTitle': 'Portfolio',
    'model.pfDesc':
      'Browse all 12 photographs in the<br />dedicated portfolio gallery.',
    'model.pfBtn': 'View Portfolio',

    // ==================== PORTFOLIO PAGE ====================
    'pf.pageTitle': 'PHOTO PORTFOLIO | NANALY Inc.',
    'pf.subJa': 'Modeling / Photo Gallery',
    'pf.subLead': 'Select any photo to open the full-size viewer.',
    'pf.photo01': 'Kimono Portrait',
    'pf.photo02': 'Bridal &amp; Makeup',
    'pf.photo03': 'Yukata Portrait',
    'pf.photo04': 'Lifestyle',
    'pf.photo05': 'Apparel &amp; Product',
    'pf.photo06': 'Product Visual',
    'pf.photo07': 'Product Wearing Scene',
    'pf.photo08': 'Beauty &amp; Salon Shoot',
    'pf.photo09': 'Counseling Scene',
    'pf.photo10': 'Advertising Visual',
    'pf.photo11': 'Product Usage Scenes',
    'pf.photo12': 'Behind the Scenes',
    'pf.prevBtn': 'Prev',
    'pf.backGridBtn': 'Back to Grid',
    'pf.nextBtn': 'Next',
    'pf.backModelBtn': 'Back to Modeling'
  };

  let currentLang = 'ja';
  const listeners = [];

  function detectInitialLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('lang');
      if (q === 'en' || q === 'ja') {
        localStorage.setItem(STORAGE_KEY, q);
        return q;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ja') return saved;
    } catch (_) {
      // Ignore storage restrictions
    }
    return document.documentElement.lang === 'en' ? 'en' : 'ja';
  }

  function snapshotJapanese() {
    if (document.documentElement.dataset.jaSnapshotted === 'true') return;
    document.documentElement.dataset.jaTitle = document.title;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.jaHtml === undefined) {
        el.dataset.jaHtml = el.innerHTML;
      }
    });
    document.documentElement.dataset.jaSnapshotted = 'true';
  }

  function applyLang(lang, save = true) {
    snapshotJapanese();
    currentLang = lang === 'en' ? 'en' : 'ja';
    document.documentElement.lang = currentLang;

    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, currentLang);
      } catch (_) {
        // Ignore storage restrictions
      }
    }

    // Page title
    const titleKey = document.body?.getAttribute('data-i18n-title');
    if (currentLang === 'en' && titleKey && EN_TRANSLATIONS[titleKey]) {
      document.title = EN_TRANSLATIONS[titleKey];
    } else if (document.documentElement.dataset.jaTitle) {
      document.title = document.documentElement.dataset.jaTitle;
    }

    // Elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (currentLang === 'en') {
        if (Object.prototype.hasOwnProperty.call(EN_TRANSLATIONS, key)) {
          el.innerHTML = EN_TRANSLATIONS[key];
        }
      } else if (el.dataset.jaHtml !== undefined) {
        el.innerHTML = el.dataset.jaHtml;
      }
    });

    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isMatch = btn.getAttribute('data-lang') === currentLang;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    listeners.forEach((fn) => {
      try {
        fn(currentLang);
      } catch (_) {}
    });
  }

  function bindSwitchers() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-lang');
        if (target && target !== currentLang) {
          applyLang(target, true);
        }
      });
    });
  }

  function init() {
    currentLang = detectInitialLang();
    snapshotJapanese();
    bindSwitchers();
    applyLang(currentLang, false);
  }

  window.NANALY_I18N = {
    init,
    getLang: () => currentLang,
    setLang: (lang) => applyLang(lang, true),
    onChange: (fn) => {
      if (typeof fn === 'function') listeners.push(fn);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
