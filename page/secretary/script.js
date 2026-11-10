/**
 * オンライン秘書と営業代行ページ インタラクティブ演出スクリプト
 * ・画面全体を舞う繊細な金箔微粒子アニメーション (Full-Page Gold Shimmer)
 * ・ページ上部から下部まで順番に発火するスタッガーフェードイン＆ライン描画演出
 * ・写真・イラストのマウス追従パララックス効果
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
    // 左カラム・右カラム共通ヘッダー
    { selector: '.col-brand-header', cls: 'js-anim-item', stagger: 80, baseDelay: 40 },
    // 左カラム上部（ヒーロー・3つの丸アイコン）
    { selector: '.sec-hero-text', cls: 'js-anim-item from-left', delay: 100 },
    { selector: '.sec-hero-photo', cls: 'js-anim-item scale-up', delay: 180 },
    { selector: '.benefit-circle', cls: 'js-anim-item scale-up', stagger: 90, baseDelay: 220 },
    // 各セクション見出し・ブロック
    { selector: '.service-block', cls: 'js-anim-item from-left', stagger: 120, baseDelay: 120 },
    { selector: '.consult-block', cls: 'js-anim-item', delay: 100 },
    { selector: '.consult-card', cls: 'js-anim-item scale-up', stagger: 60, baseDelay: 140 },
    { selector: '.arrange-block', cls: 'js-anim-item from-left', delay: 120 },
    // 右カラム（お悩み・料金プラン）
    { selector: '.worries-block', cls: 'js-anim-item from-right', delay: 140 },
    { selector: '.pricing-block', cls: 'js-anim-item', delay: 140 },
    { selector: '.pricing-card', cls: 'js-anim-item scale-up', stagger: 90, baseDelay: 180 },
    { selector: '.pricing-note-card', cls: 'js-anim-item from-right', stagger: 100, baseDelay: 240 },
    { selector: '.bottom-support-visual', cls: 'js-anim-item scale-up', delay: 300 },
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

  const lineNodes = document.querySelectorAll('.brand-line, .sub-tag-line, .inline-header-line');
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
   3. ページ全体のマウス追従パララックス
   ========================================================================== */
function initFullPageParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sheet = document.querySelector('.secretary-sheet');
  const heroPhoto = document.querySelector('.sec-hero-photo');
  const travelPhoto = document.querySelector('.arrange-photo-side');
  const worriesIllust = document.querySelector('.worries-illust-box');
  const cornerTopLeft = document.querySelector('.corner-top-left');

  if (!sheet) return;

  sheet.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth <= 820) return;
      const rect = sheet.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroPhoto && heroPhoto.classList.contains('is-visible')) {
        heroPhoto.style.transform = `translate3d(${xPct * 8}px, ${yPct * 5}px, 0)`;
      }
      if (travelPhoto) {
        travelPhoto.style.transform = `translate3d(${xPct * 6}px, ${yPct * 4}px, 0)`;
      }
      if (worriesIllust) {
        worriesIllust.style.transform = `translate3d(${xPct * 7}px, ${yPct * 5}px, 0)`;
      }
      if (cornerTopLeft) {
        cornerTopLeft.style.transform = `translate3d(${-xPct * 5}px, ${-yPct * 5}px, 0)`;
      }
    },
    { passive: true }
  );

  sheet.addEventListener('mouseleave', () => {
    if (heroPhoto) heroPhoto.style.transform = '';
    if (travelPhoto) travelPhoto.style.transform = '';
    if (worriesIllust) worriesIllust.style.transform = '';
    if (cornerTopLeft) cornerTopLeft.style.transform = '';
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
