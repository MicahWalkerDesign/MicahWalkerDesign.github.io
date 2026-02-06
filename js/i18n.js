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
      title: 'About Me',
      bio: "I'm a Product Designer & Exercise Physiologist who spent my career working in clinical rehabilitation, researching and tackling complex problems in the human body. Now I design and build digital solutions."
    },
    skills: {
      frontend: 'Frontend',
      design: 'Design',
      tools: 'Tools',
      backend: 'Back End',
      prototyping: 'Prototyping',
      systems: 'Systems',
      motion: 'Motion'
    },
    qualifications: {
      title: 'Qualifications',
      hint: 'Education & achievements',
      edu: {
        title: 'Education',
        d1: { title: 'Bachelor of Exercise & Sport Science', meta: 'University of Newcastle • 2016' },
        d2: { title: 'Mechatronics Engineering Coursework', meta: 'University of Newcastle • 2 years (2013)' }
      },
      certs: {
        title: 'Certifications',
        c1: { title: 'Sales Psychology & Account Management', meta: '2025' },
        c2: { title: 'Qualitative & Quantitative Research Methods', meta: '2023' },
        c3: { title: 'Rehabilitation Trainer for Orthopedic Diseases', meta: '2021' }
      },
      innovations: {
        title: 'Technical Innovations',
        i1: { title: 'Autonomous Flight Systems (Quadcopter)', meta: 'Project | 2013', desc: 'Hardware Integration: Custom multi-rotor UAV with calibrated PID tuning for stability.' },
        i2: { title: 'Embedded Retail Systems (Innovation Award)', meta: 'Project | 2011', desc: 'Full-Stack Development: Hardware-based shopping scanner with relational database telemetry.' }
      }
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
      title: 'Micah Walker — Frontend Engineer & Technical Product Designer',
      tagline: 'Frontend Engineer & Technical Product Designer',
      subtitle: 'Product Designer — Health, Performance & Wellness',
      description: 'I design health and performance products that people actually stick with by leveraging personal experience and combining behavior-change thinking, research, and clean UI.',
      ctaPrimary: 'Contact',
      ctaSecondary: 'Take a Break'
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

    // Modal
    modal: {
      close: 'Close'
    },
    // Resume
    resume: {
      download: 'Download Resume'
    },
    // Tags
    tags: {
      'Human-Systems Integration': 'Human-Systems Integration',
      'Clinical Workflows': 'Clinical Workflows',
      'Data Synchronization': 'Data Synchronization',
      'Stateless Architecture': 'Stateless Architecture',
      'JSON Hydration': 'JSON Hydration',
      'Computer Vision': 'Computer Vision',
      'Classification': 'Classification',
      'Accessibility': 'Accessibility',
      'Information Architecture': 'Information Architecture',
      'Bilingual Support': 'Bilingual Support',
      'System': 'System',
      'App': 'App',
      'AI / ML': 'AI / ML',
      'React': 'React',
      'Vanilla JS': 'Vanilla JS',
      'Lighthouse 100': 'Lighthouse 100',
      'Swift / SwiftUI': 'Swift / SwiftUI',
      'CoreML': 'CoreML',
      'iOS': 'iOS',
      'React Native': 'React Native'
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
      title: 'Sobre Mí',
      bio: "Soy Diseñador de Productos con experiencia en Fisiología del Ejercicio e investigación clínica, que pasó su carrera trabajando en rehabilitación clínica, investigando y abordando problemas complejos en el cuerpo humano. Ahora diseño y construyo soluciones digitales."
    },
    skills: {
      frontend: 'Frontend',
      design: 'Diseño',
      tools: 'Herramientas',
      backend: 'Back End',
      prototyping: 'Prototipado',
      systems: 'Sistemas',
      motion: 'Movimiento'
    },
    qualifications: {
      title: 'Cualificaciones',
      hint: 'Educación y logros',
      edu: {
        title: 'Educación',
        d1: { title: 'Licenciatura en Ciencias del Ejercicio y del Deporte', meta: 'Universidad de Newcastle • 2016' },
        d2: { title: 'Curso de Ingeniería Mecatrónica', meta: 'Universidad de Newcastle • 2 años (2013)' }
      },
      certs: {
        title: 'Certificaciones',
        c1: { title: 'Psicología de Ventas y Gestión de Cuentas', meta: '2025' },
        c2: { title: 'Métodos de Investigación Cualitativa y Cuantitativa', meta: '2023' },
        c3: { title: 'Entrenador de Rehabilitación para Enfermedades Ortopédicas', meta: '2021' }
      },
      innovations: {
        title: 'Innovaciones Técnicas',
        i1: { title: 'Sistemas de Vuelo Autónomo (Quadcopter)', meta: 'Proyecto | 2013', desc: 'Integración de Hardware: UAV multirotor personalizado con ajuste PID calibrado para estabilidad.' },
        i2: { title: 'Sistemas Minoristas Embebidos (Premio a la Innovación)', meta: 'Proyecto | 2011', desc: 'Desarrollo Full-Stack: Escáner de compras basado en hardware con telemetría de base de datos relacional.' }
      }
    },
    background: {
      title: 'Trayectoria',
      subtitle: 'Haz clic en un panel para explorar mi trayectoria profesional o cualificaciones'
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Ubicado en España (CET). Abierto a 100% remoto (UE/UK).'
    },
    // Hero section
    hero: {
      greeting: 'Hola, soy',
      title: 'Micah Walker — Diseñador de Productos',
      tagline: 'UX de cambio de comportamiento • Investigación → Flujos → UI',
      subtitle: 'Diseñador de Productos — Salud, Rendimiento y Bienestar',
      description: 'Diseño productos de salud y rendimiento que la gente realmente usa, aprovechando la experiencia personal y combinando pensamiento de cambio de comportamiento, investigación y UI limpia.',
      ctaPrimary: 'Contacto',
      ctaSecondary: 'Ver Proyectos'
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

    // Modal
    modal: {
      close: 'Cerrar'
    },
    // Resume
    resume: {
      download: 'Descargar CV'
    },
    // Tags
    tags: {
      'Human-Systems Integration': 'Integración Humano-Sistema',
      'Clinical Workflows': 'Flujos Clínicos',
      'Data Synchronization': 'Sincronización de Datos',
      'Stateless Architecture': 'Arquitectura Sin Estado',
      'JSON Hydration': 'Hidratación JSON',
      'Computer Vision': 'Visión por Computadora',
      'Classification': 'Clasificación',
      'Accessibility': 'Accesibilidad',
      'Information Architecture': 'Arquitectura de Información',
      'Bilingual Support': 'Soporte Bilingüe',
      'System': 'Sistema',
      'App': 'Aplicación',
      'AI / ML': 'IA / ML'
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
      title: 'Über Mich',
      bio: "Ich bin Produktdesigner mit Hintergrund in Sportphysiologie und klinischer Forschung, der seine Karriere in der klinischen Rehabilitation verbracht hat, wo ich komplexe Probleme des menschlichen Körpers erforscht und gelöst habe. Jetzt entwerfe und entwickle ich digitale Lösungen."
    },
    skills: {
      frontend: 'Frontend',
      design: 'Design',
      tools: 'Werkzeuge',
      backend: 'Back End',
      prototyping: 'Prototyping',
      systems: 'Systeme',
      motion: 'Bewegung'
    },
    qualifications: {
      title: 'Qualifikationen',
      hint: 'Ausbildung & Erfolge',
      edu: {
        title: 'Ausbildung',
        d1: { title: 'Bachelor in Bewegungs- und Sportwissenschaft', meta: 'Universität Newcastle • 2016' },
        d2: { title: 'Mechatronik-Ingenieurstudium (Grundstudium)', meta: 'Universität Newcastle • 2 Jahre (2013)' }
      },
      certs: {
        title: 'Zertifizierungen',
        c1: { title: 'Verkaufspsychologie & Account Management', meta: '2025' },
        c2: { title: 'Qualitative & Quantitative Forschungsmethoden', meta: '2023' },
        c3: { title: 'Rehabilitationstrainer für orthopädische Erkrankungen', meta: '2021' }
      },
      innovations: {
        title: 'Technische Innovationen',
        i1: { title: 'Autonome Flugsysteme (Quadcopter)', meta: 'Projekt | 2013', desc: 'Hardware-Integration: Kundenspezifisches Multirotor-UAV mit kalibrierter PID-Abstimmung für Stabilität.' },
        i2: { title: 'Eingebettete Einzelhandelssysteme (Innovationspreis)', meta: 'Projekt | 2011', desc: 'Full-Stack-Entwicklung: Hardwarebasierter Einkaufsscanner mit relationaler Datenbanktelemetrie.' }
      }
    },
    background: {
      title: 'Hintergrund',
      subtitle: 'Klicken Sie auf ein Panel, um meine berufliche Laufbahn oder Qualifikationen zu erkunden'
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Standort Spanien (CET). Offen für 100% Remote (EU/UK).'
    },
    // Hero section
    hero: {
      greeting: 'Hallo, ich bin',
      title: 'Micah Walker — Produktdesigner',
      tagline: 'Verhaltensänderungs-UX • Forschung → Flows → UI',
      subtitle: 'Produktdesigner — Gesundheit, Leistung & Wellness',
      description: 'Ich entwerfe Gesundheits- und Leistungsprodukte, die Menschen tatsächlich nutzen, indem ich persönliche Erfahrung mit Verhaltensänderungs-Denken, Forschung und klarem UI kombiniere.',
      ctaPrimary: 'Kontakt',
      ctaSecondary: 'Projekte ansehen'
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

    // Modal
    modal: {
      close: 'Schließen'
    },
    // Resume
    resume: {
      download: 'Lebenslauf herunterladen'
    },
    // Tags
    tags: {
      'Human-Systems Integration': 'Mensch-System-Integration',
      'Clinical Workflows': 'Klinische Arbeitsabläufe',
      'Data Synchronization': 'Datensynchronisation',
      'Stateless Architecture': 'Zustandslose Architektur',
      'JSON Hydration': 'JSON-Hydratation',
      'Computer Vision': 'Computer Vision',
      'Classification': 'Klassifizierung',
      'Accessibility': 'Barrierefreiheit',
      'Information Architecture': 'Informationsarchitektur',
      'Bilingual Support': 'Zweisprachige Unterstützung',
      'System': 'System',
      'App': 'App',
      'AI / ML': 'KI / ML'
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
