/* oslal — v0.1 */

/* Grid config — keep in sync with .page-grid in css/style.css */
const GRID = { cols: 10, rows: 6, gutter: 10, margin: 25 };

/* ---------- Translations ---------- */
const translations = {
  fr: { nav_archives: 'Archives', nav_info: 'Informations' },
  en: { nav_archives: 'Archives', nav_info: 'Information' }
};

/* ---------- Persistent state (carries across pages) ---------- */
const store = {
  guidesOn:  () => localStorage.getItem('oslal-guides') === 'on',
  setGuides: (on) => localStorage.setItem('oslal-guides', on ? 'on' : 'off'),
  lang:      () => (localStorage.getItem('oslal-lang') === 'en' ? 'en' : 'fr'),
  setLang:   (l) => localStorage.setItem('oslal-lang', l)
};

/* ---------- Grid overlay ---------- */
function drawGrid() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 0.75;
  ctx.globalAlpha = 0.85;

  const m = GRID.margin, g = GRID.gutter;
  const colW = (W - 2 * m - (GRID.cols - 1) * g) / GRID.cols;
  const rowH = (H - 2 * m - (GRID.rows - 1) * g) / GRID.rows;

  const seg = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // vertical: left + right edge of each column
  for (let i = 0; i < GRID.cols; i++) {
    const x1 = m + i * (colW + g);
    const x2 = x1 + colW;
    seg(x1, m, x1, H - m);
    seg(x2, m, x2, H - m);
  }
  // horizontal: top + bottom edge of each row
  for (let r = 0; r < GRID.rows; r++) {
    const y1 = m + r * (rowH + g);
    const y2 = y1 + rowH;
    seg(m, y1, W - m, y1);
    seg(m, y2, W - m, y2);
  }
}

function applyGuides() {
  const canvas = document.getElementById('grid-canvas');
  if (canvas) canvas.classList.toggle('visible', store.guidesOn());
}
function toggleGuides() {
  store.setGuides(!store.guidesOn());
  applyGuides();
}

/* ---------- Language ---------- */
function applyLang() {
  const lang = store.lang();
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t && t[k] != null) el.textContent = t[k];
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = (lang === 'fr') ? 'En' : 'Fr';
  document.documentElement.setAttribute('lang', lang);
}
function toggleLang() {
  store.setLang(store.lang() === 'fr' ? 'en' : 'fr');
  applyLang();
}

/* ---------- Navigation: active circle + click-on-current toggles guides ---------- */
function initNav() {
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(el => {
    if (el.getAttribute('data-nav') === page) {
      el.classList.add('active');
      el.addEventListener('click', e => { e.preventDefault(); toggleGuides(); });
    }
  });
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', toggleLang);
}

/* ---------- Random welcome model (landing only) ---------- */
function initModel() {
  const mv = document.getElementById('model');
  if (!mv) return;
  const n = Math.floor(Math.random() * 7) + 1;   // 1..7
  mv.setAttribute('src', `assets/glb/${n}.glb`);
}

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  applyLang();
  initNav();
  applyGuides();
  drawGrid();
  initModel();
});
window.addEventListener('resize', drawGrid);
