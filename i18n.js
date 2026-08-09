// BHARTI GREEN TECH - i18n Core Translation Engine
window.i18n = {
  currentLanguage: (typeof localStorage !== 'undefined' && localStorage.getItem('language')) || 'en',
  translations: (typeof window !== 'undefined' && window.TRANSLATIONS) ? window.TRANSLATIONS : {},

  /**
   * Loads the specified language JSON from the translations directory or memory.
   */
  async loadTranslations(lang) {
    if (this.translations && this.translations[lang]) {
      this.currentLanguage = lang;
      return this.translations[lang];
    }

    if (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS[lang]) {
      this.translations[lang] = window.TRANSLATIONS[lang];
      this.currentLanguage = lang;
      return window.TRANSLATIONS[lang];
    }

    try {
      const response = await fetch(`translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.translations[lang] = data;
      this.currentLanguage = lang;
      return data;
    } catch (error) {
      if (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS[lang]) {
        this.translations[lang] = window.TRANSLATIONS[lang];
        this.currentLanguage = lang;
        return window.TRANSLATIONS[lang];
      }
      if (this.translations && this.translations['en']) {
        this.currentLanguage = 'en';
        return this.translations['en'];
      }
      return {};
    }
  },

  /**
   * Resolves a key using dot-notation (e.g. "nav.home" or "products.urva-p2k2.name").
   */
  t(key, variables = {}) {
    if (!this.translations || Object.keys(this.translations).length === 0) {
      this.translations = (typeof window !== 'undefined' && window.TRANSLATIONS) ? window.TRANSLATIONS : {};
    }

    const currentDict = (this.translations && this.translations[this.currentLanguage]) 
                     || (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS[this.currentLanguage])
                     || (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS['en'])
                     || {};

    const keys = key.split('.');
    let value = currentDict;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English dictionary
        const enDict = (this.translations && this.translations['en']) 
                    || (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS['en']) 
                    || {};
        let fbVal = enDict;
        for (const fbk of keys) {
          if (fbVal && typeof fbVal === 'object' && fbk in fbVal) {
            fbVal = fbVal[fbk];
          } else {
            fbVal = null;
            break;
          }
        }
        if (fbVal !== null && fbVal !== undefined) {
          value = fbVal;
          break;
        }
        return key;
      }
    }

    if (typeof value === 'string') {
      let text = value;
      for (const [varName, varVal] of Object.entries(variables)) {
        text = text.replace(new RegExp(`{${varName}}`, 'g'), varVal);
      }
      return text;
    }

    return value;
  }
};

