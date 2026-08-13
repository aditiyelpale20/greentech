// BHARTI GREEN TECH - Admin Language Manager
(function() {
  let rawLang = localStorage.getItem('adminLanguage') || navigator.language || 'en';
  let activeLang = rawLang.split('-')[0].toLowerCase();
  if (!['en', 'hi', 'mr'].includes(activeLang)) {
    activeLang = 'en';
  }

  const adminI18n = {
    get currentLanguage() {
      return activeLang;
    },

    // Translate nested key (e.g. "login.title")
    t(path) {
      if (!window.ADMIN_TRANSLATIONS || !window.ADMIN_TRANSLATIONS[activeLang]) {
        return path;
      }
      
      const parts = path.split('.');
      let current = window.ADMIN_TRANSLATIONS[activeLang];
      
      for (const part of parts) {
        if (current && current[part] !== undefined) {
          current = current[part];
        } else {
          // Fallback to English if key missing in active language
          let fallback = window.ADMIN_TRANSLATIONS['en'];
          for (const fbPart of parts) {
            if (fallback && fallback[fbPart] !== undefined) {
              fallback = fallback[fbPart];
            } else {
              return path;
            }
          }
          return fallback;
        }
      }
      return current;
    },

    // Scan DOM and replace tags
    translatePage() {
      // 1. Text elements
      const textElements = document.querySelectorAll('[data-admin-i18n]');
      textElements.forEach(el => {
        const key = el.getAttribute('data-admin-i18n');
        const translated = this.t(key);
        if (translated !== key) {
          el.textContent = translated;
        }
      });

      // 2. Input Placeholders
      const placeholders = document.querySelectorAll('[data-admin-i18n-placeholder]');
      placeholders.forEach(el => {
        const key = el.getAttribute('data-admin-i18n-placeholder');
        const translated = this.t(key);
        if (translated !== key) {
          el.setAttribute('placeholder', translated);
        }
      });
    },

    // Update active language and notify
    changeLanguage(lang) {
      lang = lang.split('-')[0].toLowerCase();
      const validLangs = ['en', 'hi', 'mr'];
      if (!validLangs.includes(lang)) {
        lang = 'en';
      }
      activeLang = lang;
      localStorage.setItem('adminLanguage', lang);
      
      this.translatePage();

      // Dispatch custom event so the page lists can re-render in the new language
      const event = new CustomEvent('adminLanguageChanged', { detail: { language: lang } });
      window.dispatchEvent(event);
    }
  };

  // Expose to window
  window.adminI18n = adminI18n;

  // Auto-translate static DOM on load
  document.addEventListener('DOMContentLoaded', () => {
    adminI18n.translatePage();
    
    // Sync header dropdown value if present
    const selector = document.getElementById('adminLanguageSelect');
    if (selector) {
      selector.value = activeLang;
    }
  });
})();
