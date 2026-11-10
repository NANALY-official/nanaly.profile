/**
 * プロフィールページ インタラクティブ演出スクリプト
 * ・画面全体を舞う繊細な金箔微粒子アニメーション (Full-Page Gold Shimmer)
 * ・ページ上部から下部まで確実に発火するスタッガーフェードイン＆ライン描画演出
 * ・写真・見出し・各セクションのマウス追従パララックス＆3Dチルト効果
 * ・クリック／タップ時のゴールドリップル演出
 */
document.addEventListener('DOMContentLoaded', () => {
  initAmbientGoldCanvas();
  initScrollReveal();
  initFullPageParallax();
  initGoldRipple();
});

/* ==========================================================================
   1. 画面全体を舞う金箔微粒子アニメーション
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

  const particleCount = 30;
  const particles = [];

  class GoldDust {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.38 + 0.14);
      this.speedX = (Math.random() - 0.5) * 0.28;
      this.opacity = Math.random() * 0.42 + 0.14;
      this.fadeSpeed = (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.35 ? '#c5a67c' : '#dfbc7a';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += this.fadeSpeed;

      if (this.opacity > 0.56 || this.opacity < 0.1) {
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
   2. 上部・中部・下部すべての要素を順番にアニメーション表示
   ========================================================================== */
function initScrollReveal() {
  const revealSpecs = [
    // 左カラム上部（ヘッダー・プロフィール写真・名前）
    { selector: '.profile-header', cls: 'js-anim-item', delay: 40 },
    { selector: '.script-profile-img', cls: 'js-anim-item from-left', delay: 120 },
    { selector: '.hero-name-group', cls: 'js-anim-item from-left', delay: 200 },
    { selector: '.hero-photo-col', cls: 'js-anim-item scale-up', delay: 260 },
    // 左カラム中部（出身地・得意なこと・趣味・スポーツカー・アニメ・海外旅行）
    { selector: '.bio-row', cls: 'js-anim-item from-left', stagger: 110, baseDelay: 320 },
    { selector: '.hobby-section-title', cls: 'js-anim-item', delay: 100 },
    { selector: '.cars-header', cls: 'js-anim-item from-left', delay: 120 },
    { selector: '.cars-intro-banner', cls: 'js-anim-item scale-up', delay: 180 },
    { selector: '.cars-photo-wrap', cls: 'js-anim-item scale-up', delay: 240 },
    { selector: '.cars-names-row', cls: 'js-anim-item', delay: 300 },
    { selector: '.hobby-split-block', cls: 'js-anim-item from-left', stagger: 140, baseDelay: 120 },
    // 左カラム下部（いま、頑張っていること）
    { selector: '.effort-box', cls: 'js-anim-item scale-up', delay: 120 },
    // 右カラム全体（わたしの活動 ヘッダー＆5項目すべて）
    { selector: '.activities-header', cls: 'js-anim-item', delay: 80 },
    { selector: '.activity-item', cls: 'js-anim-item from-right', stagger: 120, baseDelay: 160 },
    // フッターボタン
    { selector: '.bottom-top-nav', cls: 'js-anim-item', delay: 120 }
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

  const lineNodes = document.querySelectorAll('.header-line, .hobby-line');
  lineNodes.forEach((line) => {
    line.classList.add('js-line-draw');
    allTargets.push(line);
  });

  if (!('IntersectionObserver' in window)) {
    allTargets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // 初期状態（opacity: 0）を確実にブラウザに描画させてからObserverを開始することで、
  // 画面上部・中部の要素もページ表示時に必ずアニメーションさせる
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
          threshold: 0.08,
          rootMargin: '0px 0px -16px 0px'
        }
      );

      allTargets.forEach((el) => observer.observe(el));
    });
  });
}

/* ==========================================================================
   3. ページ全体のマウス追従パララックス（上部・中部・右カラム連動）
   ========================================================================== */
function initFullPageParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sheet = document.querySelector('.profile-sheet');
  const personPhoto = document.querySelector('.hero-photo-col');
  const carsWrap = document.querySelector('.cars-photo-wrap');
  const cornerTopLeft = document.querySelector('.corner-top-left');
  const slantedImgs = document.querySelectorAll('.activity-photo-side');

  if (!sheet) return;

  sheet.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth <= 820) return;
      const rect = sheet.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      if (personPhoto && personPhoto.classList.contains('is-visible')) {
        personPhoto.style.transform = `translate3d(${xPct * 10}px, ${yPct * 6}px, 0)`;
      }
      if (carsWrap && carsWrap.classList.contains('is-visible')) {
        carsWrap.style.transform = `translate3d(${xPct * 7}px, ${yPct * 4}px, 0)`;
      }
      if (cornerTopLeft) {
        cornerTopLeft.style.transform = `translate3d(${-xPct * 5}px, ${-yPct * 5}px, 0)`;
      }
      slantedImgs.forEach((imgWrap, idx) => {
        const factor = (idx % 2 === 0 ? 1 : -1) * 4;
        imgWrap.style.transform = `translate3d(${xPct * 5}px, ${yPct * factor}px, 0)`;
      });
    },
    { passive: true }
  );

  sheet.addEventListener('mouseleave', () => {
    if (personPhoto) personPhoto.style.transform = '';
    if (carsWrap) carsWrap.style.transform = '';
    if (cornerTopLeft) cornerTopLeft.style.transform = '';
    slantedImgs.forEach((imgWrap) => {
      imgWrap.style.transform = '';
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
