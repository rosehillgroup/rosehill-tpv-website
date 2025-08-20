/**
 * Client-side translation system for Rosehill TPV
 * 
 * This script detects the language from the URL path and applies
 * translations from the cache file dynamically on page load.
 * 
 * URL structure:
 * - /en/about.html -> English (or just /about.html)
 * - /es/about.html -> Spanish
 * - /fr/about.html -> French  
 * - /de/about.html -> German
 */

class TranslationLoader {
  constructor() {
    this.cache = null;
    this.currentLang = this.detectLanguage();
    this.isLoaded = false;
  }

  /**
   * Detect current language from URL path
   */
  detectLanguage() {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(fr|de|es)\//);
    return langMatch ? langMatch[1] : 'en';
  }

  /**
   * Load translation cache from JSON file
   */
  async loadCache() {
    if (this.cache) return this.cache;

    try {
      const response = await fetch('/i18n/translation-cache.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      this.cache = await response.json();
      console.log(`✓ Loaded ${Object.keys(this.cache).length} translations`);
      return this.cache;
    } catch (error) {
      console.error('Failed to load translation cache:', error);
      return {};
    }
  }

  /**
   * Get translation for text in current language
   */
  translate(text) {
    if (!this.cache || this.currentLang === 'en') return text;
    
    const cacheKey = `${this.currentLang}:${text}`;
    return this.cache[cacheKey] || text;
  }

  /**
   * Translate all text nodes in the document
   */
  translatePage() {
    if (this.currentLang === 'en') return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style tags
          const parent = node.parentElement;
          if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Only process text nodes with actual content
          const text = node.textContent.trim();
          if (!text || text.length === 0) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let translatedCount = 0;
    let node;
    const nodesToTranslate = [];

    // Collect nodes first to avoid modifying DOM during traversal
    while (node = walker.nextNode()) {
      nodesToTranslate.push(node);
    }

    // Translate collected nodes
    nodesToTranslate.forEach(textNode => {
      const originalText = textNode.textContent.trim();
      const translatedText = this.translate(originalText);
      
      if (translatedText !== originalText) {
        textNode.textContent = textNode.textContent.replace(originalText, translatedText);
        translatedCount++;
      }
    });

    // Handle special cases for HTML content with inline elements
    this.translateHtmlElements();
    
    console.log(`✓ Translated ${translatedCount} text elements to ${this.currentLang}`);
  }

  /**
   * Translate elements containing HTML (like <sup> tags) that can't be handled by text node processing
   */
  translateHtmlElements() {
    if (this.currentLang === 'en') return;

    // Find elements that contain HTML markup that needs special handling
    const elementsToTranslate = document.querySelectorAll('.spec-description');
    
    elementsToTranslate.forEach(element => {
      const originalHtml = element.innerHTML;
      const translatedHtml = this.translate(originalHtml);
      
      if (translatedHtml !== originalHtml) {
        element.innerHTML = translatedHtml;
      }
    });
  }

  /**
   * Update page title and meta tags
   */
  translateMetadata() {
    if (this.currentLang === 'en') return;

    // Translate page title
    const title = document.title;
    const translatedTitle = this.translate(title);
    if (translatedTitle !== title) {
      document.title = translatedTitle;
    }

    // Translate meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const originalDesc = metaDesc.getAttribute('content');
      const translatedDesc = this.translate(originalDesc);
      if (translatedDesc !== originalDesc) {
        metaDesc.setAttribute('content', translatedDesc);
      }
    }

    // Update lang attribute
    document.documentElement.setAttribute('lang', this.currentLang);
  }

  /**
   * Update navigation links to preserve language
   */
  updateNavigation() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external links, anchors, and special URLs
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      // For non-English languages, add language prefix
      if (this.currentLang !== 'en') {
        // Skip if already has language prefix
        if (href.startsWith(`/${this.currentLang}/`)) {
          return;
        }
        
        // Add language prefix to relative links
        if (href.startsWith('/') || href.endsWith('.html')) {
          const newHref = href.startsWith('/') ? `/${this.currentLang}${href}` : `/${this.currentLang}/${href}`;
          link.setAttribute('href', newHref);
        }
      } else {
        // For English, remove any language prefixes that might exist
        if (href.startsWith('/en/')) {
          const newHref = href.replace('/en/', '/');
          link.setAttribute('href', newHref);
        }
      }
    });
  }

  /**
   * Initialize translation system
   */
  async init() {
    if (this.isLoaded) return;

    console.log(`🌐 Initializing translations for language: ${this.currentLang}`);

    await this.loadCache();
    
    // Only translate if we have cache and it's not English
    if (this.cache && Object.keys(this.cache).length > 0 && this.currentLang !== 'en') {
      this.translateMetadata();
      this.translatePage();
      this.updateNavigation();
    }

    this.isLoaded = true;
    console.log('✓ Translation system initialized');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    const translator = new TranslationLoader();
    await translator.init();
  });
} else {
  // DOM already loaded
  const translator = new TranslationLoader();
  translator.init();
}

// Export for potential manual use
window.TranslationLoader = TranslationLoader;