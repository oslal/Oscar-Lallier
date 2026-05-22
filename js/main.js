/* oslal — v0.4.3  →  js/main.js */

/* Grid config — keep in sync with .page-grid in css/style.css */
const GRID = { cols: 10, rows: 6, gutter: 10, margin: 25 };

/* ---------- Translations ---------- */
const translations = {
  fr: {
    nav_archives: 'Archives',
    nav_info: 'Informations',
    col_project: 'Projet',
    info_soon: 'Informations à venir.'
  },
  en: {
    nav_archives: 'Archives',
    nav_info: 'Informations',
    col_project: 'Project',
    info_soon: 'Informations coming soon.'
  }
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

  for (let i = 0; i < GRID.cols; i++) {
    const x1 = m + i * (colW + g);
    const x2 = x1 + colW;
    seg(x1, m, x1, H - m);
    seg(x2, m, x2, H - m);
  }
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
  renderProjects();
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

/* ---------- Archives: render the list from js/projects.js ---------- */
function renderProjects() {
  const list = document.getElementById('project-list');
  if (!list || typeof PROJECTS === 'undefined') return;

  const lang = store.lang();
  const pick = (v) =>
    (v && typeof v === 'object') ? (v[lang] ?? v.fr ?? v.en ?? '') : (v ?? '');

  list.innerHTML = '';
  PROJECTS.forEach(p => {
    const row = document.createElement('div');
    row.className = 'project-row';

    const name = document.createElement('div');
    name.className = 'p-name';
    if (p.page) {
      const a = document.createElement('a');
      a.href = `/archives/${p.slug}/`;   // root-relative clean URL
      a.textContent = pick(p.name);
      name.appendChild(a);
    } else {
      name.textContent = pick(p.name);
    }

    const type = document.createElement('div');
    type.className = 'p-type';
    type.textContent = pick(p.type);

    const inst = document.createElement('div');
    inst.className = 'p-inst';
    inst.textContent = pick(p.institution);

    const date = document.createElement('div');
    date.className = 'p-date';
    date.textContent = p.year ?? '';

    row.append(name, type, inst, date);
    list.appendChild(row);
  });
}

/* ---------- Random welcome model (landing only) ---------- */
function initModel() {
  const mv = document.getElementById('model');
  if (!mv) return;
  const n = Math.floor(Math.random() * 7) + 1;       // 1..7
  mv.setAttribute('src', `/assets/glb/${n}.glb`);    // root-relative
}

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  applyLang();
  initNav();
  applyGuides();
  drawGrid();
  renderProjects();
  initModel();
});
window.addEventListener('resize', drawGrid);
