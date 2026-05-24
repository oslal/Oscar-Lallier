/* oslal — project manifest  →  js/projects.js  (v0.5.0)
   Single source of truth for the Archives list AND each project page's metadata.

   The Archives list renders straight from this array. A project page reads its
   slug from the URL (e.g. /archives/prototyping-forest-resilience/) and pulls
   title / type / institution / year / award / collaborators from here, so you
   never type that data twice — the page's index.html only holds the prose +
   images.

   ── Fields ──
   • slug:         folder name under archives/<slug>/ and the URL (no spaces)
   • name / type:  plain string (same both languages) OR { fr:'…', en:'…' }
   • institution:  plain string OR { fr:'…', en:'…' }
                   If the name matches an entry in js/institutions.js it
                   becomes a link with an ↗ arrow, automatically.
   • year:         any string, e.g. '2024' or '2025 / 2026'
   • page:         true if a detail page exists at archives/<slug>/
                   (omit / false → name shows as plain text, no link)
   • preview:      OPTIONAL image shown on hover in the Archives list.
                   Path is relative to site root, e.g.
                   '/archives/<slug>/img/img-main.webp'
   • award:        OPTIONAL string OR { fr:'…', en:'…' } — shown on the project page
   • collaborators: OPTIONAL array of names (strings). Shown on the project page.

   Order in the array = order shown on the page.
*/

const PROJECTS = [
  // 001
  {
    slug: 'prototyping-forest-resilience',
    name: 'Prototyping Forest Resilience',
    type: { fr: 'Projet de maîtrise', en: 'Masters Project' },
    institution: { fr: 'Université McGill', en: 'McGill University' },
    year: '2025 / 2026',
    page: true,
    preview: '/archives/prototyping-forest-resilience/img/img-main.webp',
    award: '',                 // e.g. { fr: 'Mention honorable', en: 'Honourable Mention' }
    // collaborators: ['Name One', 'Name Two'],
  },
];
