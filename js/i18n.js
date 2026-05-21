const translations = {
  fr: {
    nav_home:     "Accueil",
    nav_archives: "Archives",
    nav_about:    "À propos",
    lang_toggle:  "EN",

    // Landing
    landing_intro: "Architecte en formation, basé·e à Montréal.",
    landing_featured_title: "Projets sélectionnés",

    // Archives
    archives_title: "Archives",
    archives_col_project: "Projet",
    archives_col_year:    "Année",
    archives_col_school:  "École",
    archives_col_type:    "Type",

    // About
    about_title:    "À propos",
    about_bio:      "Votre texte biographique ici.",
    about_cv_title: "Parcours",
    about_contact_title: "Contact",
    about_cv_download: "Télécharger le CV (PDF)",

    // Footer
    footer: "© 2025 oslal",
  },
  en: {
    nav_home:     "Home",
    nav_archives: "Archives",
    nav_about:    "About",
    lang_toggle:  "FR",

    // Landing
    landing_intro: "Architecture student based in Montréal.",
    landing_featured_title: "Selected projects",

    // Archives
    archives_title: "Archives",
    archives_col_project: "Project",
    archives_col_year:    "Year",
    archives_col_school:  "School",
    archives_col_type:    "Type",

    // About
    about_title:    "About",
    about_bio:      "Your biographical text here.",
    about_cv_title: "Background",
    about_contact_title: "Contact",
    about_cv_download: "Download CV (PDF)",

    // Footer
    footer: "© 2025 oslal",
  }
};

function getLang() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "fr";
}

function setLang(lang) {
  const url = new URL(window.location.href);
  if (lang === "fr") url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  window.location.href = url.toString();
}

function applyTranslations() {
  const lang = getLang();
  const t = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-href]").forEach(el => {
    const key = el.getAttribute("data-i18n-href");
    if (t[key] !== undefined) el.href = t[key];
  });
}

function initLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  const lang = getLang();
  btn.textContent = translations[lang].lang_toggle;
  btn.addEventListener("click", () => setLang(lang === "fr" ? "en" : "fr"));
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  initLangToggle();
});
