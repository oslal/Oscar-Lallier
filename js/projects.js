/* oslal — project manifest  →  js/projects.js
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
   • year:         a 4-digit year string, e.g. '2024'
   • page:         true if a detail page exists at archives/<slug>/
                   (omit / false → name shows as plain text, no link)
   • preview:      OPTIONAL override for the hover image in the Archives list.
                   Defaults to /archives/<slug>/img/<slug>_img-00.webp
                   (the naming convention). Only set this if a project deviates.
   • award:        OPTIONAL string OR { fr:'…', en:'…' } — shown on the project page
   • collaborators: OPTIONAL array of names (strings). Shown on the project page.

   Order in the array = order shown on the page.
*/

const PROJECTS = [
  {
    slug: 'prototyping-forest-resilience',
    name: "Prototyping Forest Resilience",
    type: { fr: 'Projet de maîtrise', en: 'Masters Project' },
    institution: { fr: 'Université McGill', en: 'McGill University' },
    year: '2026',
    page: true,
    award: '',                 // e.g. { fr: 'Mention honorable', en: 'Honourable Mention' }
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'forum-holzbau',
    name: "Forum Holzbau",
    type: { fr: 'Stage', en: 'Internship' },
    institution: { fr: 'Kuník de Morsier', en: 'Kuník de Morsier' },
    year: '2025',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'adaptive-reuse-mosque',
    name: "Adaptive Reuse Mosque",
    type: { fr: 'Atelier M1', en: 'M1 Studio' },
    institution: { fr: 'Université McGill', en: 'McGill University' },
    year: '2025',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'quartiers-d-hiver',
    name: "Quartiers d'Hiver",
    type: { fr: 'Atelier M1', en: 'M1 Studio' },
    institution: { fr: 'Université McGill', en: 'McGill University' },
    year: '2024',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'duramen',
    name: "Duramen",
    type: { fr: 'Atelier B3', en: 'B3 Studio' },
    institution: { fr: 'École Polytechnique Fédérale de Lausanne', en: 'Swiss Federal Institute of Technology in Lausanne' },
    year: '2024',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'dans-l-bois',
    name: "Dans'l bois",
    type: { fr: 'Atelier B3', en: 'B3 Studio' },
    institution: { fr: 'École Polytechnique Fédérale de Lausanne', en: 'Swiss Federal Institute of Technology in Lausanne' },
    year: '2023',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'maison-du-livre',
    name: "Maison du livre",
    type: { fr: 'Atelier B2', en: 'B2 Studio' },
    institution: { fr: 'Université de Montréal', en: 'University of Montreal' },
    year: '2023',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'halte',
    name: "Halte",
    type: { fr: 'Atelier B2', en: 'B2 Studio' },
    institution: { fr: 'Université de Montréal', en: 'University of Montreal' },
    year: '2022',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'shed-a-tear',
    name: "Tear a Shed",
    type: { fr: 'Atelier B1', en: 'B1 Studio' },
    institution: { fr: 'Université de Montréal', en: 'University of Montreal' },
    year: '2022',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'la-boite',
    name: "La boîte",
    type: { fr: 'Atelier B1', en: 'B1 Studio' },
    institution: { fr: 'Université de Montréal', en: 'University of Montreal' },
    year: '2021',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
  {
    slug: 'echelle-humaine',
    name: "Échelle humaine",
    // ⚠ "Capstone Project" is my translation guess for "projet d'intégration des acquis" — adjust if you'd rather keep it French-only or phrase it differently
    type: { fr: "Projet d'intégration des acquis", en: 'Capstone Project' },
    institution: 'Collège de Maisonneuve',
    year: '2021',
    page: true,
    award: '',
    // collaborators: ['Name One', 'Name Two'],
  },
// Fin de la page
];
