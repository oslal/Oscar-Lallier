# oslal — oslal.ca  (v0.5.0)

Personal site of Oscar Lallier. Plain HTML / CSS / JS, hosted on GitHub Pages.

## Structure

    index.html                          /                       landing (rotating welcome model)
    informations/index.html             /informations           about (contact, experience, education, awards)
    css/style.css                                               all styles
    js/main.js                                                  grid, language, nav, list + project rendering, animations
    js/projects.js                                              ← the project list / metadata (edit to add/remove)
    js/institutions.js                                          ← institution → website link map
    assets/fonts/                                               PP Neue Montreal
    assets/glb/                                                 welcome models (1.glb … 7.glb)
    archives/index.html                 /archives               project list
    archives/_template/index.html                               copy this folder for a new project
    archives/<slug>/index.html          /archives/<slug>        one folder per project (prose + images)
    archives/<slug>/img/                                        that project's images
    CNAME                                                       custom domain — do NOT delete

## Grid

10 columns, 24px margin, 16px gutter. Row height is computed by JS into the
`--row-h` CSS variable so cells stay square-ish on every page. Click the active
nav item to toggle the green grid guides (they now span the full page height).

## Add a project

1. In `js/projects.js`, add an entry (name/type/institution/year, plus optional
   `preview`, `award`, `collaborators`). Set `page: true` to make it a link.
2. Copy `archives/_template/` to `archives/<slug>/` (folder name = your slug).
3. Put images in `archives/<slug>/img/` (main image: `img-main.webp`).
4. Edit only the subtitle + body prose in that page's `index.html`.
   Title / type / institution / date / award / collaborators are pulled
   automatically from `projects.js` by matching the folder name to the URL.

## Institutions

`js/institutions.js` maps an institution name to its website. If a project's
`institution` matches a key (in either language), it renders as a link with a ↗.

## Local preview

Clean URLs and root-relative paths need a server:

    python3 -m http.server 8000

then open <http://localhost:8000>.

## ⚠ To verify (flagged during the v0.5.0 build)

- "Collège de Montréal" vs "Collège de Maisonneuve" — your text said Montréal,
  the URL points to Maisonneuve. Confirm and fix the name/label.
- CB Architectes / Kuník de Morsier listed as two firms under one title — confirm.
- Awards list on the informations page is a rough draft — refine names/years.
- McGill / EPFL each have a second project-specific URL (MAE exhibition, IBOIS
  lab) — add those per-project if needed.
