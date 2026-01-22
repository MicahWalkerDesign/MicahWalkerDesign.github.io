/**
 * i18n.js
 * Internationalization module for multi-language support.
 * Supports EN and ES with scalable structure for additional languages.
 * 
 * Usage:
 *   import { setLanguage, t, getCurrentLanguage } from './i18n.js';
 *   setLanguage('es');
 *   console.log(t('hero.title'));
 */

// Language dictionaries containing all translatable strings
const dictionaries = {
  en: {
    // Header / Navigation
    header: {
      experience: 'Experience',
      portfolio: 'Portfolio',
      about: 'About',
      game: 'Game',
      skipToContent: 'Skip to content',
      language: 'Language',
      theme: 'Theme'
    },
    // New Sections
    about: {
      title: 'About Me'
    },
    background: {
      title: 'Background',
      subtitle: 'Click a panel to explore my professional journey or qualifications'
    },
    contact: {
      title: "Contact",
      subtitle: "Have a project in mind? reach out via email or phone."
    },
    // Hero section
    hero: {
      greeting: "Hi, I'm",
      title: 'Micah Walker — Product Designer & Frontend Developer',
      tagline: 'Product Designer & Frontend Developer',
      subtitle: 'Designing human-centred products from idea to shipped outcome',
      description: 'I design and build digital products with a focus on clarity, motion, and grounded user experiences.',
      ctaPrimary: 'View Work',
      ctaSecondary: 'Play a Game'
    },
    // Experience timeline
    experience: {
      title: 'Experience',
      subtitle: 'A timeline of my professional journey',
      present: 'Present',
      showMore: 'Show details',
      showLess: 'Hide details',
      skills: 'Skills',
      loading: 'Loading experience...',
      expandMore: 'Expand to see more roles',
      collapseRoles: 'Collapse roles',
      linkedinNote: 'Note: This experience data is maintained manually. LinkedIn\'s API requires OAuth authentication and server-side processing, which isn\'t possible on a static GitHub Pages site.'
    },
    // Portfolio section
    portfolio: {
      title: 'Portfolio',
      bannerTitle: 'Selected Work',
      bannerDescription: 'Case studies showcasing my design process from research to implementation.',
      appDevelopment: 'App Development',
      websiteDevelopment: 'Website Development',
      viewDetails: 'View Details',
      phases: {
        ideas: 'Initial Ideas / Problem',
        design: 'Design',
        proof: 'Proof of Work',
        product: 'Product'
      },
      tools: {
        figma: 'Figma',
        adobeXd: 'Adobe XD',
        sketch: 'Sketch'
      }
    },
    // Paper toss game
    game: {
      title: 'Paper Toss',
      subtitle: 'Take a break and toss some paper',
      instructions: 'Drag and release to throw the paper into the bin. Score points for successful tosses!',
      score: 'Score:',
      start: 'Start Game',
      startGame: 'Start Game',
      playAgain: 'Play Again',
      gameOver: 'Game Over!'
    },
    // Offer modal
    offer: {
      title: 'Would you like to make me an offer?',
      salary: 'Salary',
      currency: 'Currency',
      daysPerWeek: 'Days per week',
      message: 'Optional message',
      messagePlaceholder: 'Add a personal note...',
      submit: 'Copy to Clipboard',
      email: 'Send',
      cancel: 'Cancel',
      copied: 'Offer copied to clipboard!',
      emailSubject: 'Job Offer for Micah Walker'
    },
    // Modal
    modal: {
      close: 'Close'
    },
    // Footer
    footer: {
      copyright: '© 2026 Micah Walker. All rights reserved.',
      rights: 'All rights reserved.',
      contact: 'Contact',
      tagline: '"They always say time changes things, but you actually have to change them yourself." — Andy Warhol'
    },
    // Accessibility
    a11y: {
      skipLink: 'Skip to main content',
      expandSection: 'Expand section',
      collapseSection: 'Collapse section',
      openModal: 'Open modal',
      closeModal: 'Close modal'
    }
  },

  es: {
    // Header / Navigation
    header: {
      experience: 'Experiencia',
      portfolio: 'Portafolio',
      about: 'Sobre Mí',
      game: 'Juego',
      skipToContent: 'Saltar al contenido',
      language: 'Idioma',
      theme: 'Tema'
    },
    // New Sections
    about: {
      title: 'Sobre Mí'
    },
    background: {
      title: 'Trayectoria',
      subtitle: 'Haz clic en un panel para explorar mi trayectoria profesional o cualificaciones'
    },
    contact: {
      title: 'Contact',
      subtitle: '¿Tienes un proyecto en mente? Contáctame por correo o teléfono.'
    },
    // Hero section
    hero: {
      greeting: 'Hola, soy',
      title: 'Micah Walker — Diseñador de Producto y Constructor',
      tagline: 'Diseñador de Producto y Constructor',
      subtitle: 'Diseñando productos centrados en las personas, desde la idea hasta su lanzamiento',
      description: 'Diseño y construyo productos digitales con enfoque en claridad, movimiento y experiencias de usuario sólidas.',
      ctaPrimary: 'Ver Trabajo',
      ctaSecondary: 'Jugar un Juego'
    },
    // Experience timeline
    experience: {
      title: 'Experiencia',
      subtitle: 'Una cronología de mi trayectoria profesional',
      present: 'Presente',
      showMore: 'Mostrar detalles',
      showLess: 'Ocultar detalles',
      skills: 'Habilidades',
      loading: 'Cargando experiencia...',
      expandMore: 'Expandir para ver más roles',
      collapseRoles: 'Contraer roles',
      linkedinNote: 'Nota: Estos datos de experiencia se mantienen manualmente. La API de LinkedIn requiere autenticación OAuth y procesamiento del lado del servidor, lo cual no es posible en un sitio estático de GitHub Pages.'
    },
    // Portfolio section
    portfolio: {
      title: 'Portafolio',
      bannerTitle: 'Trabajo Seleccionado',
      bannerDescription: 'Casos de estudio que muestran mi proceso de diseño desde la investigación hasta la implementación.',
      appDevelopment: 'Desarrollo de Apps',
      websiteDevelopment: 'Desarrollo Web',
      viewDetails: 'Ver Detalles',
      phases: {
        ideas: 'Ideas Iniciales / Problema',
        design: 'Diseño',
        proof: 'Prueba de Trabajo',
        product: 'Producto'
      },
      tools: {
        figma: 'Figma',
        adobeXd: 'Adobe XD',
        sketch: 'Sketch'
      }
    },
    // Paper toss game
    game: {
      title: 'Lanzamiento de Papel',
      subtitle: 'Tómate un descanso y lanza algo de papel',
      instructions: '¡Arrastra y suelta para lanzar el papel a la papelera. Gana puntos por tiros exitosos!',
      score: 'Puntuación:',
      start: 'Iniciar Juego',
      startGame: 'Iniciar Juego',
      playAgain: 'Jugar de Nuevo',
      gameOver: '¡Juego Terminado!'
    },
    // Offer modal
    offer: {
      title: '¿Te gustaría hacerme una oferta?',
      salary: 'Salario',
      currency: 'Moneda',
      daysPerWeek: 'Días por semana',
      message: 'Mensaje opcional',
      messagePlaceholder: 'Añade una nota personal...',
      submit: 'Copiar al Portapapeles',
      email: 'Enviar por Email',
      cancel: 'Cancelar',
      copied: '¡Oferta copiada al portapapeles!',
      emailSubject: 'Oferta de Trabajo para Micah Walker'
    },
    // Modal
    modal: {
      close: 'Cerrar'
    },
    // Footer
    footer: {
      copyright: '© 2026 Micah Walker. Todos los derechos reservados.',
      rights: 'Todos los derechos reservados.',
      contact: 'Contacto',
      tagline: '"Siempre dicen que el tiempo cambia las cosas, pero en realidad tienes que cambiarlas tú mismo." — Andy Warhol'
    },
    // Accessibility
    a11y: {
      skipLink: 'Saltar al contenido principal',
      expandSection: 'Expandir sección',
      collapseSection: 'Contraer sección',
      openModal: 'Abrir modal',
      closeModal: 'Cerrar modal'
    }
  },

  de: {
    // Header / Navigation
    header: {
      experience: 'Erfahrung',
      portfolio: 'Portfolio',
      about: 'Über Mich',
      game: 'Spiel',
      skipToContent: 'Zum Inhalt springen',
      language: 'Sprache',
      theme: 'Thema'
    },
    // New Sections
    about: {
      title: 'Über Mich'
    },
    background: {
      title: 'Hintergrund',
      subtitle: 'Klicken Sie auf ein Panel, um meine berufliche Laufbahn oder Qualifikationen zu erkunden'
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Haben Sie ein Projekt im Sinn? Kontaktieren Sie mich per E-Mail oder Telefon.'
    },
    // Hero section
    hero: {
      greeting: 'Hallo, ich bin',
      title: 'Micah Walker — Produktdesigner & Entwickler',
      tagline: 'Produktdesigner & Entwickler',
      subtitle: 'Menschenzentrierte Produkte gestalten, von der Idee bis zur Umsetzung',
      description: 'Ich entwerfe und entwickle digitale Produkte mit Fokus auf Klarheit, Bewegung und fundierte Nutzererfahrungen.',
      ctaPrimary: 'Arbeit ansehen',
      ctaSecondary: 'Ein Spiel spielen'
    },
    // Experience timeline
    experience: {
      title: 'Erfahrung',
      subtitle: 'Ein Zeitstrahl meiner beruflichen Laufbahn',
      present: 'Heute',
      showMore: 'Details anzeigen',
      showLess: 'Details verbergen',
      skills: 'Fähigkeiten',
      loading: 'Erfahrung wird geladen...',
      expandMore: 'Mehr Rollen anzeigen',
      collapseRoles: 'Rollen einklappen',
      linkedinNote: 'Hinweis: Diese Erfahrungsdaten werden manuell gepflegt. Die LinkedIn-API erfordert OAuth-Authentifizierung und serverseitige Verarbeitung, was auf einer statischen GitHub Pages-Website nicht möglich ist.'
    },
    // Portfolio section
    portfolio: {
      title: 'Portfolio',
      bannerTitle: 'Ausgewählte Arbeiten',
      bannerDescription: 'Fallstudien, die meinen Designprozess von der Recherche bis zur Umsetzung zeigen.',
      appDevelopment: 'App-Entwicklung',
      websiteDevelopment: 'Website-Entwicklung',
      viewDetails: 'Details ansehen',
      phases: {
        ideas: 'Erste Ideen / Problem',
        design: 'Design',
        proof: 'Arbeitsnachweis',
        product: 'Produkt'
      },
      tools: {
        figma: 'Figma',
        adobeXd: 'Adobe XD',
        sketch: 'Sketch'
      }
    },
    // Paper toss game
    game: {
      title: 'Papierwurf',
      subtitle: 'Mach eine Pause und wirf etwas Papier',
      instructions: 'Ziehen und loslassen, um das Papier in den Mülleimer zu werfen. Punkte für erfolgreiche Würfe!',
      score: 'Punktzahl:',
      start: 'Spiel starten',
      startGame: 'Spiel starten',
      playAgain: 'Nochmal spielen',
      gameOver: 'Spiel vorbei!'
    },
    // Offer modal
    offer: {
      title: 'Möchten Sie mir ein Angebot machen?',
      salary: 'Gehalt',
      currency: 'Währung',
      daysPerWeek: 'Tage pro Woche',
      message: 'Optionale Nachricht',
      messagePlaceholder: 'Eine persönliche Notiz hinzufügen...',
      submit: 'In Zwischenablage kopieren',
      email: 'Per E-Mail senden',
      cancel: 'Abbrechen',
      copied: 'Angebot in Zwischenablage kopiert!',
      emailSubject: 'Jobangebot für Micah Walker'
    },
    // Modal
    modal: {
      close: 'Schließen'
    },
    // Footer
    footer: {
      copyright: '© 2026 Micah Walker. Alle Rechte vorbehalten.',
      rights: 'Alle Rechte vorbehalten.',
      contact: 'Kontakt',
      tagline: '"Man sagt immer, die Zeit verändert die Dinge, aber man muss sie selbst verändern." — Andy Warhol'
    },
    // Accessibility
    a11y: {
      skipLink: 'Zum Hauptinhalt springen',
      expandSection: 'Abschnitt erweitern',
      collapseSection: 'Abschnitt einklappen',
      openModal: 'Modal öffnen',
      closeModal: 'Modal schließen'
    }
  }
};

// Current active language
let currentLanguage = 'en';

/**
 * Gets a nested value from an object using dot notation path.
 * @param {Object} obj - The object to search
 * @param {string} path - Dot notation path (e.g., 'hero.title')
 * @returns {string|undefined} - The value at the path or undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Translates a key to the current language.
 * Falls back to English if key not found in current language.
 * @param {string} key - Dot notation key (e.g., 'hero.title')
 * @returns {string} - Translated string or the key itself if not found
 */
export function t(key) {
  const value = getNestedValue(dictionaries[currentLanguage], key);
  if (value !== undefined) return value;

  // Fallback to English
  const fallback = getNestedValue(dictionaries.en, key);
  if (fallback !== undefined) return fallback;

  // Return key if not found (helps identify missing translations)
  console.warn(`Missing translation for key: ${key}`);
  return key;
}

/**
 * Gets the current active language code.
 * @returns {string} - Current language code ('en' or 'es')
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Gets all available language codes.
 * @returns {string[]} - Array of language codes
 */
export function getAvailableLanguages() {
  return Object.keys(dictionaries);
}

/**
 * Updates all DOM elements with data-i18n attributes.
 * Elements should have data-i18n="key.path" attribute.
 */
function updateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    // Handle different element types
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.placeholder) {
        element.placeholder = translation;
      }
    } else {
      element.textContent = translation;
    }
  });

  // Update aria-label attributes
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    element.setAttribute('aria-label', t(key));
  });

  // Update document language attribute
  document.documentElement.lang = currentLanguage;
}

/**
 * Sets the active language and updates all translated content.
 * Saves preference to localStorage and dispatches custom event.
 * @param {string} lang - Language code ('en', 'es', or 'de')
 */
export function setLanguage(lang) {
  if (!dictionaries[lang]) {
    console.warn(`Language '${lang}' not available. Falling back to English.`);
    lang = 'en';
  }

  currentLanguage = lang;
  localStorage.setItem('portfolio-language', lang);
  updateDOM();

  // Dispatch custom event for components that need to react to language changes
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));

  // Announce change to screen readers
  const announcements = {
    en: 'Language changed to English',
    es: 'Idioma cambiado a Español',
    de: 'Sprache auf Deutsch geändert'
  };
  announceToScreenReader(announcements[currentLanguage] || announcements.en);
}

/**
 * Announces a message to screen readers via ARIA live region.
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live');
  if (liveRegion) {
    liveRegion.textContent = message;
    // Clear after announcement
    setTimeout(() => { liveRegion.textContent = ''; }, 1000);
  }
}

/**
 * Initializes the i18n system.
 * Checks URL params, localStorage, and browser preference for initial language.
 */
export function initI18n() {
  // Priority: URL param > localStorage > browser language > default (en)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const storedLang = localStorage.getItem('portfolio-language');
  const browserLang = navigator.language.split('-')[0];

  let initialLang = 'en';

  if (urlLang && dictionaries[urlLang]) {
    initialLang = urlLang;
  } else if (storedLang && dictionaries[storedLang]) {
    initialLang = storedLang;
  } else if (dictionaries[browserLang]) {
    initialLang = browserLang;
  }

  currentLanguage = initialLang;
  updateDOM();

  return initialLang;
}

// Export dictionaries for components that need direct access (e.g., dynamic content)
export { dictionaries };
