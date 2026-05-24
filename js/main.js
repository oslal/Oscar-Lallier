/* oslal — v0.5.0  →  js/main.js */

/* Grid config — keep in sync with .page-grid + :root in css/style.css */
const GRID = { cols: 10, rows: 6, gutter: 16, margin: 24 };

/* ---------- Translations (shared chrome only) ---------- */
const translations = {
  fr: {
    nav_archives: 'Archives',
    nav_info: 'Informations',
    col_project: 'Projet',
    col_type: 'Type',
    col_institution: 'Institution',
    col_date: 'Date',
    info_soon: 'Informations à venir.'
  },
  en: {
    nav_archives: 'Archives',
    nav_info: 'Informations',
    col_project: 'Project',
    col_type: 'Type',
    col_institution: 'Institution',
    col_date: 'Date',
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

/* Pick the right language value from a string or {fr,en} object */
function pick(v) {
  const lang = store.lang();
  return (v && typeof v === 'object') ? (v[lang] ?? v.fr ?? v.en ?? '') : (v ?? '');
}

/* ---------- Row height: square-ish cells, exactly fills landing ---------- */
/* rowH = (100vh - 2*margin - (rows-1)*gutter) / rows. Mirrors --row-h in CSS. */
function setRowHeightVar() {
  const H = window.innerHeight;
  const rowH = (H - 2 * GRID.margin - (GRID.rows - 1) * GRID.gutter) / GRID.rows;
  document.documentElement.style.setProperty('--row-h', rowH + 'px');
  return rowH;
}

/* ---------- Grid overlay (full document height) ---------- */
function drawGrid() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;

  /* Height = the page-grid's full height (grows with content on scroll pages).
     Measured off the grid, not the document, so the canvas never inflates it. */
  const grid = document.querySelector('.page-grid');
  const H = grid ? Math.max(grid.offsetHeight, window.innerHeight) : window.innerHeight;

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
  const rowH = (window.innerHeight - 2 * m - (GRID.rows - 1) * g) / GRID.rows;

  const seg = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  /* Vertical column edges — full document height */
  for (let i = 0; i < GRID.cols; i++) {
    const x1 = m + i * (colW + g);
    const x2 = x1 + colW;
    seg(x1, m, x1, H - m);
    seg(x2, m, x2, H - m);
  }

  /* Horizontal row edges — repeat down the full document height */
  const step = rowH + g;
  let r = 0;
  while (true) {
    const top = m + r * step;
    if (top > H - m + 1) break;
    const bottom = Math.min(top + rowH, H - m);
    seg(m, top, W - m, top);
    if (bottom > top) seg(m, bottom, W - m, bottom);
    r++;
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

  /* Shared chrome keyed by the translations table */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t && t[k] != null) el.textContent = t[k];
  });

  /* Page content carried inline via data-fr / data-en (preserves <br> etc.) */
  document.querySelectorAll('[data-fr], [data-en]').forEach(el => {
    const val = el.getAttribute(lang === 'fr' ? 'data-fr' : 'data-en');
    if (val != null) el.textContent = val;
  });

  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = (lang === 'fr') ? 'En' : 'Fr';
  document.documentElement.setAttribute('lang', lang);
}
function toggleLang() {
  store.setLang(store.lang() === 'fr' ? 'en' : 'fr');
  applyLang();
  renderProjects();
  renderProject();
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

/* ---------- Institution → link helper ---------- */
/* Returns an <a> (external, with ↗) if known, else a text node. */
function institutionNode(institution) {
  const label = pick(institution);
  if (!label) return document.createTextNode('');

  const entry = (typeof institutionEntry === 'function')
    ? (institutionEntry(institution && institution.en) ||
       institutionEntry(institution && institution.fr) ||
       institutionEntry(label))
    : null;

  if (entry && entry.url) {
    const a = document.createElement('a');
    a.href = entry.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'ext-link';
    a.textContent = label;
    return a;
  }
  return document.createTextNode(label);
}

/* ---------- Archives: render the list ---------- */
function renderProjects() {
  const list = document.getElementById('project-list');
  if (!list || typeof PROJECTS === 'undefined') return;

  list.innerHTML = '';

  /* One reusable hover-preview element, positioned by CSS over the list */
  let preview = document.getElementById('list-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'list-preview';
    preview.innerHTML = '<img alt="">';
    list.parentElement.appendChild(preview);
  }
  const previewImg = preview.querySelector('img');
  const hidePreview = () => preview.classList.remove('visible');

  PROJECTS.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'project-row reveal';
    row.style.setProperty('--i', i);

    const name = document.createElement('div');
    name.className = 'p-name';
    if (p.page) {
      const a = document.createElement('a');
      a.href = `/archives/${p.slug}/`;
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
    inst.appendChild(institutionNode(p.institution));

    const date = document.createElement('div');
    date.className = 'p-date';
    date.textContent = p.year ?? '';

    /* Hover preview */
    if (p.preview) {
      row.addEventListener('mouseenter', () => {
        previewImg.src = p.preview;
        preview.classList.add('visible');
      });
    } else {
      row.addEventListener('mouseenter', hidePreview);
    }

    row.append(name, type, inst, date);
    list.appendChild(row);
  });

  list.addEventListener('mouseleave', hidePreview);
}

/* ---------- Single project page (archives/<slug>/) ---------- */
function currentSlug() {
  const ds = document.body.getAttribute('data-slug');
  if (ds) return ds;
  /* derive from /archives/<slug>/ */
  const parts = window.location.pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('archives');
  if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  return null;
}

function renderProject() {
  if (document.body.getAttribute('data-page') !== 'project') return;
  if (typeof PROJECTS === 'undefined') return;

  const slug = currentSlug();
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return;

  const setText = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val || '';
  };

  document.title = `${pick(p.name)} — Oscar Lallier`;
  setText('.project-title', pick(p.name));
  setText('.pm-type', pick(p.type));
  setText('.pm-date', p.year || '');

  /* Institution (links if known) */
  const instEl = document.querySelector('.pm-inst');
  if (instEl) { instEl.textContent = ''; instEl.appendChild(institutionNode(p.institution)); }

  /* Award — hide the block when empty */
  const awardEl = document.querySelector('.project-award');
  if (awardEl) {
    const a = pick(p.award);
    awardEl.textContent = a;
    awardEl.style.display = a ? '' : 'none';
  }

  /* Collaborators — comma-separated, hide when empty */
  const collabEl = document.querySelector('.project-collaborators');
  if (collabEl) {
    collabEl.textContent = '';
    if (Array.isArray(p.collaborators) && p.collaborators.length) {
      collabEl.textContent = p.collaborators.join(', ');
      collabEl.style.display = '';
    } else {
      collabEl.style.display = 'none';
    }
  }
}

/* ---------- Footer © toggle (expand / collapse) ---------- */
function initFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  footer.addEventListener('click', (e) => {
    e.stopPropagation();
    footer.classList.toggle('open');
  });
  document.addEventListener('click', () => footer.classList.remove('open'));
}

/* ---------- Random welcome model (landing only) ---------- */
function initModel() {
  const mv = document.getElementById('model');
  if (!mv) return;
  const n = Math.floor(Math.random() * 7) + 1;       // 1..7
  mv.setAttribute('src', `/assets/glb/${n}.glb`);

  const reveal = () => mv.classList.add('loaded');
  mv.addEventListener('load', reveal);
  /* Fallback in case the load event never fires */
  setTimeout(reveal, 1200);
}

/* ---------- Reveal on scroll (info + archive rows) ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in-view'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => io.observe(el));
}

/* ---------- Keep canvas in sync with content height ---------- */
function watchHeight() {
  const grid = document.querySelector('.page-grid');
  if (!grid || !('ResizeObserver' in window)) return;
  let raf = null;
  const ro = new ResizeObserver(() => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(drawGrid);
  });
  ro.observe(grid);
}

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  setRowHeightVar();
  applyLang();
  initNav();
  initFooter();
  applyGuides();
  renderProjects();   // archives
  renderProject();    // project page
  drawGrid();
  initModel();
  initReveal();
  watchHeight();
  /* one more pass after layout settles (fonts/images) */
  requestAnimationFrame(drawGrid);
});
window.addEventListener('load', drawGrid);
window.addEventListener('resize', () => { setRowHeightVar(); drawGrid(); });
