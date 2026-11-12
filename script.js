/**
 * NANALY デジタル名刺 - インタラクティブ演出スクリプト
 * ・背景の微細な金箔微粒子アニメーション (Ambient Gold Shimmer)
 * ・名刺カードの3Dパララックス＆光沢チルト効果 (3D Card Tilt)
 * ・リッチなマイクロインタラクション＆リップル演出
 * ・各メニューの詳細モーダル展開
 * ・名刺シェア＆QRコード表示・URLコピー
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ロード時スタッガーアニメーション開始
  document.body.classList.add('fade-in-ready');

  // 2. 背景の金箔・微粒子アニメーション
  initAmbientCanvas();

  // 3. 名刺カードの3Dチルト効果
  initCardTilt();

  // 4. メニューカードのクリック＆詳細モーダル
  initDetailModal();

  // 5. 名刺シェア・QRモーダル
  initShareModal();

  // 6. リップルエフェクト
  initRippleEffect();
});

/* ==========================================================================
   1. 背景の金箔微粒子アニメーション (Canvas)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 微粒子の生成
  const particleCount = 28;
  const particles = [];

  class GoldParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.35 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.fadeSpeed = (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.3 ? '#c3944d' : '#dfbc7a'; // ゴールド2色
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += this.fadeSpeed;

      if (this.opacity > 0.55 || this.opacity < 0.1) {
        this.fadeSpeed = -this.fadeSpeed;
      }

      // 画面上部に出たらリセット
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(195, 148, 77, 0.4)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
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
   2. 名刺カードの3Dチルト＆光沢反射 (3D Tilt & Specular Shine)
   ========================================================================== */
function initCardTilt() {
  const card = document.getElementById('business-card');
  if (!card) return;

  const shine = card.querySelector('.card-shine');
  let bounds;

  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }

  window.addEventListener('scroll', updateBounds, { passive: true });
  window.addEventListener('resize', updateBounds, { passive: true });

  card.addEventListener('mouseenter', () => {
    updateBounds();
  });

  card.addEventListener('mousemove', (e) => {
    if (!bounds) updateBounds();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 〜 1
    const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 〜 1

    const tiltX = -yPct * 6; // 最大6度傾斜
    const tiltY = xPct * 8;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.01)`;

    if (shine) {
      shine.style.opacity = '1';
      shine.style.transform = `translate(${xPct * 25}%, ${yPct * 25}%) rotate(25deg)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    if (shine) {
      shine.style.opacity = '0';
    }
  });
}

/* ==========================================================================
   3. メニュー詳細モーダル展開
   ========================================================================== */
const serviceDetails = {
  profile: {
    title: 'プロフィール',
    category: 'PROFILE',
    icon: 'image/icon-profile.png',
    html: `
      <p><strong>山本 奈々（Nana Yamamoto）</strong><br>株式会社NANALY 代表取締役</p>
      <p>「自分らしく輝き、豊かに生きる人を増やす」をミッションに、金融教育・ビジネスマナー講師、オンライン秘書事業、美容機器の開発・販売など、多岐にわたる事業を展開。</p>
      <ul>
        <li>株式会社NANALY 創業・代表取締役就任</li>
        <li>ファイナンシャルプランナーとして多数の相談実績</li>
        <li>企業研修・大学・セミナーでの登壇実績多数</li>
        <li>モデルとしても幅広く活動中</li>
      </ul>
    `
  },
  seminar: {
    title: 'セミナー講師',
    category: 'SEMINAR & LECTURE',
    icon: 'image/icon-seminar.png',
    html: `
      <p><strong>「お金の授業」＆「ビジネスマナー」研修</strong></p>
      <p>初心者にもわかりやすく、即実践できる実践型カリキュラムをお届けします。企業研修から個人向けセミナー、教育機関での特別講義まで柔軟に対応可能です。</p>
      <ul>
        <li><strong>お金の授業：</strong>資産形成の基礎、NISA・iDeCoの活用法、ライフプラン設計</li>
        <li><strong>ビジネスマナー：</strong>第一印象の磨き方、立ち居振る舞い、オンラインコミュニケーション</li>
        <li><strong>登壇形態：</strong>対面講義・オンライン（Zoom/Teams）・ハイブリッド対応</li>
      </ul>
    `
  },
  fp: {
    title: 'FP・保険代理店',
    category: 'FINANCIAL PLANNING',
    icon: 'image/icon-fp.png',
    html: `
      <p><strong>一人ひとりのライフステージに寄り添う総合金融プランニング</strong></p>
      <p>中立公正な視点から、家計の見直し、将来の資産形成、万が一への備えをトータルサポート。無理のない最適なプランをご提案します。</p>
      <ul>
        <li>ライフプラン・キャッシュフローシミュレーション</li>
        <li>保険の見直し・比較・適正化アドバイス</li>
        <li>老後資金・教育資金・住宅購入資金の計画立案</li>
        <li>個別オンライン相談受付中</li>
      </ul>
    `
  },
  secretary: {
    title: 'オンライン秘書',
    category: 'ONLINE SECRETARY',
    icon: 'image/icon-secretary.png',
    html: `
      <p><strong>ビジネスを加速させる高品質なバックオフィス＆営業代行</strong></p>
      <p>経営者や個人事業主の皆様がコア業務に専念できるよう、きめ細やかなサポート体制をご提供します。</p>
      <ul>
        <li><strong>営業代行：</strong>インサイドセールス、リスト作成、アポイント獲得支援</li>
        <li><strong>事務局運営：</strong>スケジュール管理、メール対応、資料作成</li>
        <li><strong>顧客対応：</strong>各種お問い合わせ窓口、CS業務</li>
      </ul>
    `
  },
  beauty: {
    title: '美容機器',
    category: 'BEAUTY DEVICE',
    icon: 'image/icon-beauty-device.png',
    html: `
      <p><strong>妥協のない美と機能性を追求した美容機器の開発・販売</strong></p>
      <p>毎日のケアを上質なひとときに変える、先進のビューティーテック製品をお届けします。</p>
      <ul>
        <li>サロンクオリティを自宅で再現する美顔器シリーズ</li>
        <li>人間工学に基づいたエレガントなプロダクトデザイン</li>
        <li>卸売・代理店販売・OEM/ODMのご相談も承ります</li>
      </ul>
    `
  },
  model: {
    title: 'モデル活動',
    category: 'MODELING',
    icon: 'image/icon-model.png',
    html: `
      <p><strong>各種メディア・広告・イベントへの出演</strong></p>
      <p>ブランドの魅力と世界観を最大限に引き出すビジュアル表現を行います。</p>
      <ul>
        <li>広告・スチール撮影（WEB・雑誌・カタログ等）</li>
        <li>アパレル・コスメ・ジュエリーのアンバサダー活動</li>
        <li>イベントMC・トークショー・ファッションショー出演</li>
        <li>撮影依頼・出演オファーは随時受け付けております</li>
      </ul>
    `
  },
  association: {
    title: 'こどもの未来とお金の研究会(仮)',
    category: 'GENERAL INCORPORATED ASSOCIATION',
    icon: 'image/icon-association.png',
    html: `
      <p><strong>一般社団法人 こどもの未来とお金の研究会（仮）</strong></p>
      <p>次世代を担う子どもたちが、生きる力を育み、金融リテラシーを自然に身につけられる社会の実現を目指して活動しています。</p>
      <ul>
        <li>親子で学べる体験型マネーワークショップの開催</li>
        <li>学校・地域コミュニティへの金融教育出前授業</li>
        <li>子ども向けマネー教育教材・ゲームの開発と提供</li>
        <li>賛助会員・サポーター企業様を募集しております</li>
      </ul>
    `
  }
};

const serviceDetailsEn = {
  association: {
    title: "Children's Future & Money Research (Tentative)",
    category: 'GENERAL INCORPORATED ASSOCIATION',
    icon: 'image/icon-association.png',
    html: `
      <p><strong>General Incorporated Association: Children's Future &amp; Money Research (Tentative)</strong></p>
      <p>We work toward a society where children—the next generation—naturally develop practical life skills and strong financial literacy.</p>
      <ul>
        <li>Interactive money workshops for parents and children</li>
        <li>Visiting financial literacy classes for schools and communities</li>
        <li>Development of educational financial materials and games for kids</li>
        <li>Supporting members and corporate partners welcome</li>
      </ul>
    `
  }
};

function initDetailModal() {
  const modal = document.getElementById('detail-modal');
  const closeBtn = document.getElementById('modal-close');
  const secondaryBtn = document.getElementById('modal-secondary-btn');
  const primaryBtn = document.getElementById('modal-primary-btn');
  const modalIcon = document.getElementById('modal-icon');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');

  if (!modal) return;
  let activeCategoryKey = null;

  function openModal(categoryKey) {
    const isEn = window.NANALY_I18N?.getLang?.() === 'en';
    const data = (isEn && serviceDetailsEn[categoryKey]) || serviceDetails[categoryKey];
    if (!data) return;

    activeCategoryKey = categoryKey;
    modalIcon.innerHTML = `<img src="${data.icon}" alt="${data.title}">`;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.innerHTML = data.html;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (window.NANALY_I18N?.onChange) {
    window.NANALY_I18N.onChange(() => {
      if (activeCategoryKey && modal.classList.contains('active')) {
        openModal(activeCategoryKey);
      }
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 6つのメニューカードをクリック
  document.querySelectorAll('.grid-card').forEach((card) => {
    const category = card.getAttribute('data-category');
    // プロフィール・セミナー講師カードをクリックした時は各専用ページへ遷移
    if (category === 'profile') {
      card.addEventListener('click', () => {
        window.location.href = 'page/profile/index.html#top';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'page/profile/index.html#top';
        }
      });
      return;
    }

    if (category === 'seminar') {
      card.addEventListener('click', () => {
        window.location.href = 'page/seminar/index.html#top';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'page/seminar/index.html#top';
        }
      });
      return;
    }

    if (category === 'fp') {
      card.addEventListener('click', () => {
        window.location.href = 'page/fp/index.html#top';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'page/fp/index.html#top';
        }
      });
      return;
    }

    if (category === 'secretary') {
      card.addEventListener('click', () => {
        window.location.href = 'page/secretary/index.html#top';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'page/secretary/index.html#top';
        }
      });
      return;
    }

    if (category === 'beauty') {
      card.addEventListener('click', () => {
        window.location.href = 'https://nanaly.jp/';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'https://nanaly.jp/';
        }
      });
      return;
    }

    if (category === 'model') {
      card.addEventListener('click', () => {
        window.location.href = 'page/model/index.html#top';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'page/model/index.html#top';
        }
      });
      return;
    }

    card.addEventListener('click', () => openModal(category));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(category);
      }
    });
  });

  // バナーカードをクリック
  const banner = document.querySelector('.banner-card');
  if (banner) {
    banner.addEventListener('click', () => openModal('association'));
    banner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('association');
      }
    });
  }

  // 閉じるイベント
  closeBtn.addEventListener('click', closeModal);
  secondaryBtn.addEventListener('click', closeModal);
  primaryBtn.addEventListener('click', () => {
    closeModal();
    // お問い合わせ等のアクション
    const contactBtn = document.querySelector('[data-action="contact"]');
    if (contactBtn) contactBtn.click();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  const modalParam = new URLSearchParams(window.location.search).get('modal');
  if (modalParam && serviceDetails[modalParam]) {
    openModal(modalParam);
  }
}

/* ==========================================================================
   4. フッターお問い合わせボタン＆モーダル管理
   ========================================================================== */
function initShareModal() {
  // フッターのお問い合わせボタンのハンドリング
  const contactBtn = document.querySelector('[data-action="contact"]');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      // メールアプリ（mailto:info@nanaly.jp）を直接起動
      window.location.href = 'mailto:info@nanaly.jp?subject=' + encodeURIComponent('【お問い合わせ】株式会社NANALY');
    });
  }
}

/* ==========================================================================
   5. クリック・タップ時の光輪リップルエフェクト
   ========================================================================== */
function initRippleEffect() {
  const interactiveCards = document.querySelectorAll('.grid-card, .banner-card, .action-btn');

  interactiveCards.forEach((elem) => {
    elem.addEventListener('pointerdown', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      elem.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}
