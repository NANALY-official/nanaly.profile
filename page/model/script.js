/**
 * モデル活動・撮影ポートフォリオ インタラクティブスクリプト
 * ・12枚のポートフォリオ写真データ管理＆クリック／タップ拡大表示ビューア（PDF 2〜13ページ完全再現）
 * ・キーボード操作（左右矢印キー・Escキー）および前後の写真切り替え対応
 * ・画面全体を舞う金箔微粒子アニメーション＆スクロールフェードイン演出
 */

const PORTFOLIO_PHOTOS = [
  {
    num: '01',
    title: '和装ポートレート',
    en: 'KIMONO',
    src: 'image/IMG_2542.JPG'
  },
  {
    num: '02',
    title: 'ブライダル・メイク',
    en: 'BRIDAL / BEAUTY',
    src: 'image/IMG_2560.JPG'
  },
  {
    num: '03',
    title: '浴衣ポートレート',
    en: 'PORTRAIT',
    src: 'image/IMG_2557.JPG'
  },
  {
    num: '04',
    title: 'ライフスタイル',
    en: 'LIFESTYLE',
    src: 'image/IMG_2534.JPG'
  },
  {
    num: '05',
    title: 'アパレル・商品撮影',
    en: 'APPAREL',
    src: 'image/IMG_2535.JPG'
  },
  {
    num: '06',
    title: '商品紹介ビジュアル',
    en: 'PRODUCT VISUAL',
    src: 'image/IMG_2536.JPG'
  },
  {
    num: '07',
    title: '商品着用シーン',
    en: 'PRODUCT',
    src: 'image/IMG_2537.JPG'
  },
  {
    num: '08',
    title: '美容・サロン撮影',
    en: 'SALON',
    src: 'image/IMG_2538.JPG'
  },
  {
    num: '09',
    title: 'カウンセリングシーン',
    en: 'SALON SCENE',
    src: 'image/IMG_2541.JPG'
  },
  {
    num: '10',
    title: '商品広告ビジュアル',
    en: 'ADVERTISING',
    src: 'image/IMG_2539.JPG'
  },
  {
    num: '11',
    title: '商品カット・使用シーン',
    en: 'PRODUCT SCENES',
    src: 'image/IMG_2540.JPG'
  },
  {
    num: '12',
    title: '撮影のひとコマ',
    en: 'BEHIND THE SCENES',
    src: 'image/IMG_2543.JPG'
  }
];

// ブラウザによるスクロール位置の自動復元を無効化し、ページ遷移時に必ず最上部から表示
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initPhotoViewer();
  initAmbientGoldCanvas();
  initScrollReveal();
  initGoldRipple();
  // レイアウト完了後にも最上部を保証
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
});

window.addEventListener('pageshow', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

/* ==========================================================================
   1. ポートフォリオ拡大ビューア（タップ・クリックで大きく表示）
   ========================================================================== */
function initPhotoViewer() {
  const modal = document.getElementById('photo-viewer-modal');
  const counterEl = document.getElementById('viewer-counter');
  const titleEl = document.getElementById('viewer-title');
  const enEl = document.getElementById('viewer-en');
  const imgEl = document.getElementById('viewer-img');
  const prevBtn = document.getElementById('viewer-prev');
  const nextBtn = document.getElementById('viewer-next');
  const backBtn = document.getElementById('viewer-back');

  if (!modal) return;

  let currentIndex = 0;

  function renderSlide(index) {
    currentIndex = Math.max(0, Math.min(PORTFOLIO_PHOTOS.length - 1, index));
    const item = PORTFOLIO_PHOTOS[currentIndex];

    counterEl.textContent = `${item.num} / 12`;
    titleEl.textContent = item.title;
    enEl.textContent = item.en;

    imgEl.style.opacity = '0.25';
    imgEl.src = item.src;
    imgEl.alt = `${item.num} ${item.title}`;
    imgEl.onload = () => {
      imgEl.style.opacity = '1';
    };

    // 01の時は「前の写真」を非表示、12の時は「次の写真」を非表示（PDF 2〜13ページ準拠）
    if (currentIndex === 0) {
      prevBtn.classList.add('is-hidden');
    } else {
      prevBtn.classList.remove('is-hidden');
    }

    if (currentIndex === PORTFOLIO_PHOTOS.length - 1) {
      nextBtn.classList.add('is-hidden');
    } else {
      nextBtn.classList.remove('is-hidden');
    }
  }

  function openViewer(index) {
    renderSlide(index);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const sheet = modal.querySelector('.viewer-sheet');
    if (sheet) {
      sheet.scrollTop = 0;
    }
  }

  function closeViewer() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-open-photo').forEach((trigger) => {
    const idx = parseInt(trigger.getAttribute('data-photo-index'), 10) || 0;
    trigger.addEventListener('click', () => openViewer(idx));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openViewer(idx);
      }
    });
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) renderSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < PORTFOLIO_PHOTOS.length - 1) renderSlide(currentIndex + 1);
  });

  backBtn.addEventListener('click', closeViewer);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeViewer();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeViewer();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      renderSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < PORTFOLIO_PHOTOS.length - 1) {
      renderSlide(currentIndex + 1);
    }
  });

  // URLクエリ ?photo=N が指定されている場合は初期表示で該当写真を拡大表示
  const params = new URLSearchParams(window.location.search);
  if (params.has('photo')) {
    const initialIdx = parseInt(params.get('photo'), 10);
    if (!Number.isNaN(initialIdx) && initialIdx >= 0 && initialIdx < PORTFOLIO_PHOTOS.length) {
      openViewer(initialIdx);
    }
  }
}

/* ==========================================================================
   2. 画面全体を舞う金箔微粒子アニメーション
   ========================================================================== */
function initAmbientGoldCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-bg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener(
    'resize',
    () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    },
    { passive: true }
  );

  const particleCount = 28;
  const particles = [];

  class GoldDust {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.36 + 0.14);
      this.speedX = (Math.random() - 0.5) * 0.26;
      this.opacity = Math.random() * 0.4 + 0.14;
      this.fadeSpeed = (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.35 ? '#c5a67c' : '#dfbc7a';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += this.fadeSpeed;

      if (this.opacity > 0.55 || this.opacity < 0.1) {
        this.fadeSpeed = -this.fadeSpeed;
      }

      if (this.y < -12 || this.x < -12 || this.x > width + 12) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(197, 166, 124, 0.45)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldDust());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. スクロールフェードイン＆ライン描画アニメーション
   ========================================================================== */
function initScrollReveal() {
  const revealSpecs = [
    { selector: '.col-brand-header', cls: 'js-anim-item', stagger: 80, baseDelay: 40 },
    { selector: '.model-title-block', cls: 'js-anim-item', stagger: 100, baseDelay: 80 },
    { selector: '.hero-kimono-wrap', cls: 'js-anim-item scale-up', delay: 140 },
    { selector: '.model-intro-row', cls: 'js-anim-item from-left', stagger: 90, baseDelay: 180 },
    { selector: '.ad-shooting-block', cls: 'js-anim-item', delay: 140 },
    { selector: '.salon-photo-block', cls: 'js-anim-item scale-up', delay: 160 },
    { selector: '.gallery-consult-row', cls: 'js-anim-item from-right', stagger: 90, baseDelay: 180 },
    { selector: '.portfolio-callout-outer', cls: 'js-anim-item scale-up', delay: 200 },
    { selector: '.pf-header', cls: 'js-anim-item', delay: 80 },
    { selector: '.pf-card', cls: 'js-anim-item scale-up', stagger: 55, baseDelay: 100 },
    { selector: '.bottom-top-nav', cls: 'js-anim-item', delay: 100 }
  ];

  const allTargets = [];

  revealSpecs.forEach((spec) => {
    const nodes = document.querySelectorAll(spec.selector);
    nodes.forEach((node, idx) => {
      spec.cls.split(' ').forEach((c) => node.classList.add(c));
      const delayMs =
        spec.stagger !== undefined ? (spec.baseDelay || 0) + idx * spec.stagger : spec.delay || 0;
      node.style.transitionDelay = `${delayMs}ms`;
      allTargets.push(node);
    });
  });

  const lineNodes = document.querySelectorAll(
    '.brand-line, .header-side-line, .salon-caption-line, .callout-line, .pf-header-divider'
  );
  lineNodes.forEach((line) => {
    line.classList.add('js-line-draw');
    allTargets.push(line);
  });

  if (!('IntersectionObserver' in window)) {
    allTargets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  void document.body.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        {
          threshold: 0.06,
          rootMargin: '0px 0px -12px 0px'
        }
      );

      allTargets.forEach((el) => observer.observe(el));
    });
  });
}

/* ==========================================================================
   4. クリック／タップ時のゴールドリップルエフェクト
   ========================================================================== */
function initGoldRipple() {
  document.addEventListener(
    'pointerdown',
    (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'gold-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 680);
    },
    { passive: true }
  );
}
