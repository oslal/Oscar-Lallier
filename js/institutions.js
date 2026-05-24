/* oslal — institution lookup  →  js/institutions.js  (v0.5.0)

   Maps an institution to its website. Used by both the Archives list and the
   project pages to turn an institution name into a link with an ↗ arrow.

   The KEY is the canonical English name. Each entry can carry a French label
   (fr) — most names read the same in both languages, so fr is optional.

   To resolve a project's `institution` field, main.js checks the field's EN
   and FR strings against these keys (see institutionURL() in main.js).

   ── Flagged for your review (from planning notes) ──
   • McGill has two relevant URLs (the M.Arch. program + the MAE exhibition).
     The program URL is used here; the exhibition is project-specific — add it
     per-project if needed.
   • EPFL likewise: the architecture section is used here; the IBOIS lab is a
     project-specific link.
   • "Collège de Montréal" vs "Collège de Maisonneuve": the SLA program + the
     URL you gave point to Maisonneuve, so that's what's mapped. Verify which
     you actually attended and adjust the key/label if needed.
*/

const INSTITUTIONS = {
  'McGill University': {
    fr: 'Université McGill',
    url: 'https://www.mcgill.ca/architecture/'
  },
  'EPFL': {
    // École polytechnique fédérale de Lausanne — same acronym in FR/EN
    url: 'https://www.epfl.ch/schools/enac/'
  },
  'Université de Montréal': {
    en: 'University of Montreal',
    url: 'https://www.umontreal.ca/'
  },
  'Collège de Maisonneuve': {
    // ⚠ verify — you wrote "Collège de Montréal" but the URL is Maisonneuve
    url: 'https://www.cmaisonneuve.qc.ca/'
  },
  'CB Architectes': {
    url: 'https://cb-architectes.ch/'
  },
  'Kuník de Morsier': {
    url: 'https://kunikdemorsier.com/'
  }
};

/* Resolve a name (in either language) to its entry. Returns null if unknown. */
function institutionEntry(name) {
  if (!name) return null;
  if (INSTITUTIONS[name]) return INSTITUTIONS[name];
  const needle = String(name).trim().toLowerCase();
  for (const key in INSTITUTIONS) {
    const e = INSTITUTIONS[key];
    if (key.toLowerCase() === needle) return e;
    if (e.fr && e.fr.toLowerCase() === needle) return e;
    if (e.en && e.en.toLowerCase() === needle) return e;
  }
  return null;
}
