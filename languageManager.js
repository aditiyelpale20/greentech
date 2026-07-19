// BHARTI GREEN TECH - i18n Page Language Controller
document.addEventListener('DOMContentLoaded', async () => {
  // 1. INITIALIZE TRANSLATION SYSTEM
  const initializeLanguage = async () => {
    // Read from localStorage (key name "language" as requested) or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    
    try {
      // 1.1 Load English first to build fallback cache in memory
      await window.i18n.loadTranslations('en');
      
      // 1.2 Load target language if not English
      if (savedLang !== 'en') {
        await window.i18n.loadTranslations(savedLang);
      }
    } catch (e) {
      console.error("Failed to load initial translations. Using fallback.", e);
    }
    
    // 1.3 Update DOM texts
    translateDOM();
    
    // 1.4 Setup dropdown values
    syncDropdowns();
  };

  // 2. DOM TRANSLATION SCANNER
  const translateDOM = () => {
    const lang = window.i18n.currentLanguage;
    
    // 2.1 Update Document HTML Lang attribute for SEO
    document.documentElement.setAttribute('lang', lang);

    // 2.2 Text content translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = window.i18n.t(key);
      if (text !== key) {
        el.textContent = text;
      }
    });

    // 2.3 HTML structure translations (for formatting/linebreaks)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const htmlText = window.i18n.t(key);
      if (htmlText !== key) {
        el.innerHTML = htmlText;
      }
    });

    // 2.4 Placeholder attribute translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const placeholderText = window.i18n.t(key);
      if (placeholderText !== key) {
        el.setAttribute('placeholder', placeholderText);
      }
    });

    // 2.5 Alt attribute translations (for screen readers and SEO)
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const altText = window.i18n.t(key);
      if (altText !== key) {
        el.setAttribute('alt', altText);
      }
    });

    // 2.6 Title attribute translations (for tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const titleText = window.i18n.t(key);
      if (titleText !== key) {
        el.setAttribute('title', titleText);
      }
    });

    // 2.7 Dispatch global custom event for page-specific scripts to redraw content
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  };

  // 3. SYNC SELECT DROPDOWNS
  const syncDropdowns = () => {
    const lang = window.i18n.currentLanguage;
    const selectors = document.querySelectorAll('#languageSelect, .lang-switcher-select');
    selectors.forEach(sel => {
      sel.value = lang;
    });
  };

  // 4. ATTACH LANGUAGE SELECTOR LISTENERS
  const setupLanguageSelectors = () => {
    // Listen on any select menu designated for language changes
    document.addEventListener('change', async (e) => {
      if (e.target && (e.target.id === 'languageSelect' || e.target.classList.contains('lang-switcher-select'))) {
        const newLang = e.target.value;
        
        // Show loader if available to avoid flashes
        const loader = document.getElementById('pageLoader');
        if (loader) {
          loader.style.opacity = '0.9';
          loader.style.visibility = 'visible';
        }

        // Persist selection
        localStorage.setItem('language', newLang);

        // Fetch translations and redraw
        try {
          await window.i18n.loadTranslations(newLang);
          translateDOM();
          syncDropdowns();
        } catch (err) {
          console.error("Error switching language:", err);
        }

        // Hide loader after smooth delay
        if (loader) {
          setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
          }, 350);
        }
      }
    });
  };

  // Run initialization
  await initializeLanguage();
  setupLanguageSelectors();
  
  // Custom trigger to hide pageLoader once translations are loaded and applied
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.style.opacity = '0';
      pageLoader.style.visibility = 'hidden';
    }, 200);
  }
});
