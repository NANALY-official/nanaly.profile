/**
 * FP・保険ページ インタラクティブ演出スクリプト
 * ・画面全体を舞う微細な金箔微粒子アニメーション (Full-Page Gold Shimmer)
 * ・上部・中部・下部すべての要素を順番にアニメーション表示
 * ・「44社」のカウントアップ演出
 * ・メインイラスト・デスク写真・筆記体ロゴの繊細なマウスパララックス効果
 * ・クリック／タップ時のゴールドリップル演出
 */
document.addEventListener('DOMContentLoaded', () => {
  initAmbientGoldCanvas();
  initScrollReveal();
  initCountUp44();
  initPhotoParallax();
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
    { selector: '.fp-header', cls: 'js-anim-item', delay: 40 },
    { selector: '.hero-photo-wrap', cls: 'js-anim-item scale-up', delay: 140 },
    { selector: '.question-block', cls: 'js-anim-item from-left', delay: 220 },
    { selector: '.kakesute-box', cls: 'js-anim-item scale-up', delay: 120 },
    { selector: '.companies-section', cls: 'js-anim-item', delay: 140 },
    { selector: '.ins-type-card', cls: 'js-anim-item scale-up', stagger: 120, baseDelay: 120 },
    { selector: '.support-header', cls: 'js-anim-item', delay: 80 },
    { selector: '.support-item', cls: 'js-anim-item from-right', stagger: 95, baseDelay: 140 },
    { selector: '.recommend-section', cls: 'js-anim-item scale-up', delay: 140 },
    { selector: '.recommend-item', cls: 'js-anim-item from-right', stagger: 75, baseDelay: 200 },
    { selector: '.desk-photo-wrap', cls: 'js-anim-item scale-up', delay: 140 },
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

  const lineNodes = document.querySelectorAll(
    '.brand-side-line, .sub-side-line, .comp-side-line, .hs-line, .header-line, .rec-side-line'
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
          threshold: 0.08,
          rootMargin: '0px 0px -16px 0px'
        }
      );

      allTargets.forEach((el) => observer.observe(el));
    });
  });
}

/* ==========================================================================
   3. 「44社」カウントアップアニメーション
   ========================================================================== */
function initCountUp44() {
  const numEl = document.querySelector('.companies-num');
  if (!numEl || !('IntersectionObserver' in window)) return;

  const target = parseInt(numEl.getAttribute('data-count') || '44', 10);
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          const duration = 1100;
          const start = performance.now();

          function tick(now) {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            numEl.textContent = String(Math.round(target * eased));
            if (elapsed < 1) {
              requestAnimationFrame(tick);
            } else {
              numEl.textContent = String(target);
            }
          }

          requestAnimationFrame(tick);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(numEl);
}

/* ==========================================================================
   4. ページ全体のマウス追従パララックス（上部・中部・下部・右カラム連動）
   ========================================================================== */
function initPhotoParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sheet = document.querySelector('.fp-sheet');
  const heroWrap = document.querySelector('.hero-photo-wrap');
  const deskPhoto = document.querySelector('.desk-photo');
  const scriptWrap = document.querySelector('.script-fp-wrap');
  const cornerTopLeft = document.querySelector('.corner-top-left');
  const archWraps = document.querySelectorAll('.ins-arch-wrap');

  if (!sheet) return;

  sheet.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth <= 820) return;
      const rect = sheet.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroWrap && heroWrap.classList.contains('is-visible')) {
        heroWrap.style.transform = `translate3d(${xPct * 8}px, ${yPct * 5}px, 0)`;
      }
      if (deskPhoto) {
        deskPhoto.style.transform = `translate3d(${xPct * 6}px, ${yPct * 4}px, 0)`;
      }
      if (scriptWrap) {
        scriptWrap.style.transform = `translate3d(${-xPct * 6}px, ${-yPct * 3}px, 0)`;
      }
      if (cornerTopLeft) {
        cornerTopLeft.style.transform = `translate3d(${-xPct * 5}px, ${-yPct * 5}px, 0)`;
      }
      archWraps.forEach((wrap, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        wrap.style.transform = `translate3d(${xPct * 5}px, ${yPct * 4 * dir}px, 0)`;
      });
    },
    { passive: true }
  );

  sheet.addEventListener('mouseleave', () => {
    if (heroWrap) heroWrap.style.transform = '';
    if (deskPhoto) deskPhoto.style.transform = '';
    if (scriptWrap) scriptWrap.style.transform = '';
    if (cornerTopLeft) cornerTopLeft.style.transform = '';
    archWraps.forEach((wrap) => {
      wrap.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. クリック／タップ時のゴールドリップルエフェクト
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
