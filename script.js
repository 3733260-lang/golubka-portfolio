// Scroll-reveal с лёгким сдвигом по времени для соседних блоков
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

// Хедер получает фон/блюр после начала скролла
const header = document.querySelector('header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Карусель скринов лендингов в разделе "Лендинги и концепты"
document.querySelectorAll('.exp-shot').forEach(shot => {
  const slides = shot.querySelectorAll('.exp-slide');
  if (slides.length <= 1) { shot.classList.add('single'); return; }
  const dots = shot.querySelectorAll('.exp-dot');
  let idx = 0;
  const show = i => {
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  };
  const prevBtn = shot.querySelector('.exp-prev');
  const nextBtn = shot.querySelector('.exp-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; show(idx); });
  if (nextBtn) nextBtn.addEventListener('click', () => { idx = (idx + 1) % slides.length; show(idx); });
});

// Лайтбокс-галерея для плашек лендингов ("Изучить макеты")
(function () {
  const galleries = {
    nocobase: ['assets/decor/gallery/nocobase/1.jpg', 'assets/decor/gallery/nocobase/2.jpg'],
    nft: [
      'assets/decor/gallery/nft/1.jpg',
      'assets/decor/gallery/nft/2.jpg',
      'assets/decor/gallery/nft/3.jpg',
      'assets/decor/gallery/nft/4.jpg',
      'assets/decor/gallery/nft/5.jpg'
    ],
    matreshka: [
      'assets/decor/gallery/matreshka/1.jpg',
      'assets/decor/gallery/matreshka/2.jpg',
      'assets/decor/gallery/matreshka/3.jpg'
    ],
    vfs: ['assets/decor/gallery/vfs/1.jpg']
  };

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const img = lightbox.querySelector('.lightbox-img');
  const counter = lightbox.querySelector('.lightbox-counter');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let current = [];
  let index = 0;

  function update() {
    img.src = current[index];
    counter.textContent = (index + 1) + ' / ' + current.length;
    lightbox.classList.toggle('single', current.length <= 1);
  }
  function open(key) {
    current = galleries[key] || [];
    if (!current.length) return;
    index = 0;
    update();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function prev() { index = (index - 1 + current.length) % current.length; update(); }
  function next() { index = (index + 1) % current.length; update(); }

  document.querySelectorAll('.exp-link[data-gallery]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      open(link.dataset.gallery);
    });
  });
  document.querySelectorAll('.exp-card[data-gallery]').forEach(card => {
    card.addEventListener('click', () => {
      open(card.dataset.gallery);
    });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();

// Копирование email в буфер обмена по клику (хедер + футер)
document.querySelectorAll('.email-copy').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];

    let tip = link.querySelector('.copy-tooltip');
    if (!tip) {
      tip = document.createElement('span');
      tip.className = 'copy-tooltip';
      link.appendChild(tip);
    }

    const showTooltip = text => {
      tip.textContent = text;
      requestAnimationFrame(() => tip.classList.add('show'));
      clearTimeout(link._tipTimeout);
      link._tipTimeout = setTimeout(() => tip.classList.remove('show'), 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => showTooltip('Адрес скопирован'))
        .catch(() => showTooltip('Не удалось скопировать'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showTooltip('Адрес скопирован');
      } catch (err) {
        showTooltip('Не удалось скопировать');
      }
      document.body.removeChild(ta);
    }
  });
});
