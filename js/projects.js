/* oslal — project manifest  →  js/projects.js
   Single source of truth for the Archives list.

   To add a project, add an object to the array below.
   - slug:        folder name under archives/<slug>/ and the URL (no spaces)
   - name / type: a plain string (same in both languages) OR { fr: '…', en: '…' }
   - institution: usually identical in both languages — plain string
   - year:        any string, e.g. '2024' or '2022 / 2023'
   - page:        true if a detail page exists at archives/<slug>/  (omit / false = no link)

   Order in the array = order shown on the page.
*/

const PROJECTS = [
  // {
  //   slug: 'prototyping-forest-resilience',
  //   name: 'Prototyping Forest Resilience',
  //   type: { fr: 'Projet de maîtrise', en: 'Masters Project' },
  //   institution: 'McGill University',
  //   year: '2025 / 2026',
  //   page: true
  // },
];
