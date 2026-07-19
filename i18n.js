// BHARTI GREEN TECH - i18n Core Translation Engine
window.i18n = {
  currentLanguage: 'en',
  translations: {},

  /**
   * Loads the specified language JSON from the translations directory.
   * Caches in-memory to prevent multiple network hits.
   */
  async loadTranslations(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      return this.translations[lang];
    }

    if (window.TRANSLATIONS && window.TRANSLATIONS[lang]) {
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
      console.error(`i18n error loading translations for language: ${lang}`, error);
      
      // Fallback: If we have loaded 'en' successfully, use it as a silent fallback
      if (this.translations['en']) {
        console.warn(`Falling back to English cache for: ${lang}`);
        this.currentLanguage = 'en';
        return this.translations['en'];
      }
      
      throw error;
    }
  },

  /**
   * Resolves a key using dot-notation (e.g. "nav.home" or "products.urva-urja.benefits.0").
   * Performs variable interpolation if parameters are provided.
   */
  t(key, variables = {}) {
    if (!this.translations[this.currentLanguage]) {
      return key;
    }

    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback: check if the key exists in the English translation
        let fallbackVal = this.translations['en'];
        if (fallbackVal) {
          for (const fallbackK of keys) {
            if (fallbackVal && typeof fallbackVal === 'object' && fallbackK in fallbackVal) {
              fallbackVal = fallbackVal[fallbackK];
            } else {
              fallbackVal = null;
              break;
            }
          }
        }
        if (fallbackVal !== null && fallbackVal !== undefined) {
          value = fallbackVal;
          break;
        }
        return key; // Return raw key if all fails
      }
    }

    // Handle string variable interpolations (e.g. replacing "{count}")
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
