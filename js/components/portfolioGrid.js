/**
 * portfolioGrid.js
 * Renders portfolio case study cards with expandable phases.
 * Each phase opens a modal with gallery content.
 * 
 * Usage:
 *   import { renderPortfolio } from './components/portfolioGrid.js';
 *   renderPortfolio(document.getElementById('portfolio'), portfolioData);
 */

import { getCurrentLanguage, t } from '../i18n.js';
import { openModal } from './modal.js';

/**
 * Portfolio data structure for case studies.
 * This is placeholder data - replace with real projects.
 */
export const defaultPortfolioData = {
  apps: [
    {
      id: 'app-1',
      title: { en: 'Health Tracker Pro', es: 'Rastreador de Salud Pro', de: 'Health Tracker Pro' },
      summary: { 
        en: 'Mobile app for tracking fitness and nutrition goals', 
        es: 'Aplicación móvil para seguimiento de metas de fitness y nutrición',
        de: 'Mobile-App zur Verfolgung von Fitness- und Ernährungszielen' 
      },
      tags: ['iOS', 'Android', 'React Native'],
      phases: {
        ideas: {
          images: ['assets/case-studies/app1-ideas-1.png'],
          caption: { en: 'Initial whiteboard sessions and user research', es: 'Sesiones iniciales de pizarra e investigación de usuarios', de: 'Erste Whiteboard-Sessions und Nutzerforschung' }
        },
        design: {
          images: ['assets/case-studies/app1-design-1.png'],
          caption: { en: 'UI mockups and design system', es: 'Mockups de UI y sistema de diseño', de: 'UI-Mockups und Designsyste' }
        },
        proof: {
          figma: 'assets/case-studies/app1-figma.png',
          adobeXd: 'assets/case-studies/app1-xd.png',
          sketch: 'assets/case-studies/app1-sketch.png'
        },
        product: {
          images: ['assets/case-studies/app1-product-1.png'],
          caption: { en: 'Final shipped product', es: 'Producto final lanzado', de: 'Endgültiges ausgeliefertes Produkt' }
        }
      }
    },
    {
      id: 'app-2',
      title: { en: 'Workout Companion', es: 'Compañero de Entrenamiento', de: 'Workout-Begleiter' },
      summary: { 
        en: 'AI-powered workout planning and form correction', 
        es: 'Planificación de entrenamientos y corrección de forma con IA',
        de: 'KI-gestützte Trainingsplanung und Korrektur der Ausführung' 
      },
      tags: ['iOS', 'Swift', 'CoreML'],
      phases: {
        ideas: {
          images: ['assets/case-studies/app2-ideas-1.png'],
          caption: { en: 'Problem discovery and user interviews', es: 'Descubrimiento de problemas y entrevistas con usuarios', de: 'Problemerkennung und Nutzerinterviews' }
        },
        design: {
          images: ['assets/case-studies/app2-design-1.png'],
          caption: { en: 'Wireframes and prototypes', es: 'Wireframes y prototipos', de: 'Wireframes und Prototypen' }
        },
        proof: {
          figma: 'assets/case-studies/app2-figma.png',
          adobeXd: 'assets/case-studies/app2-xd.png',
          sketch: 'assets/case-studies/app2-sketch.png'
        },
        product: {
          images: ['assets/case-studies/app2-product-1.png'],
          caption: { en: 'App Store screenshots', es: 'Capturas de App Store', de: 'App-Store-Screenshots' }
        }
      }
    }
  ],
  websites: [
    {
      id: 'web-1',
      title: { en: 'Fitness Studio Website', es: 'Sitio Web de Estudio de Fitness', de: 'Fitnessstudio-Website' },
      summary: { 
        en: 'Marketing website with booking integration', 
        es: 'Sitio web de marketing con integración de reservas',
        de: 'Marketing-Website mit Buchungsintegration' 
      },
      tags: ['HTML', 'CSS', 'JavaScript'],
      phases: {
        ideas: {
          images: ['assets/case-studies/web1-ideas-1.png'],
          caption: { en: 'Client brief and competitor analysis', es: 'Brief del cliente y análisis de competidores', de: 'Kundenbriefing und Wettbewerbsanalyse' }
        },
        design: {
          images: ['assets/case-studies/web1-design-1.png'],
          caption: { en: 'Visual design and style guide', es: 'Diseño visual y guía de estilo', de: 'Visuelles Design und Styleguide' }
        },
        proof: {
          figma: 'assets/case-studies/web1-figma.png',
          adobeXd: 'assets/case-studies/web1-xd.png',
          sketch: 'assets/case-studies/web1-sketch.png'
        },
        product: {
          images: ['assets/case-studies/web1-product-1.png'],
          caption: { en: 'Live website', es: 'Sitio web en vivo', de: 'Live-Website' }
        }
      }
    },
    {
      id: 'web-2',
      title: { en: 'Medical Practice Portal', es: 'Portal de Práctica Médica', de: 'Portal für Arztpraxis' },
      summary: { 
        en: 'Patient portal with appointment scheduling', 
        es: 'Portal de pacientes con programación de citas',
        de: 'Patientenportal mit Terminplanung' 
      },
      tags: ['Vue.js', 'Node.js', 'PostgreSQL'],
      phases: {
        ideas: {
          images: ['assets/case-studies/web2-ideas-1.png'],
          caption: { en: 'User journey mapping', es: 'Mapeo del viaje del usuario', de: 'User Journey Mapping' }
        },
        design: {
          images: ['assets/case-studies/web2-design-1.png'],
          caption: { en: 'Component library', es: 'Librería de componentes', de: 'Komponentenbibliothek' }
        },
        proof: {
          figma: 'assets/case-studies/web2-figma.png',
          adobeXd: 'assets/case-studies/web2-xd.png',
          sketch: 'assets/case-studies/web2-sketch.png'
        },
        product: {
          images: ['assets/case-studies/web2-product-1.png'],
          caption: { en: 'Production deployment', es: 'Despliegue en producción', de: 'Produktivbereitstellung' }
        }
      }
    }
  ]
};

/**
 * Renders the portfolio section with two columns.
 * @param {HTMLElement} container - Container to render into
 * @param {Object} [data] - Portfolio data (uses default if not provided)
 */
export function renderPortfolio(container, data = defaultPortfolioData) {
  if (!container) {
    console.warn('renderPortfolio: No container provided');
    return;
  }
  
  const lang = getCurrentLanguage();
  
  const html = `
    <div class="portfolio-columns-wrapper">
      <div class="portfolio-column">
        <h3 class="portfolio-column__title" data-i18n="portfolio.appDevelopment">${t('portfolio.appDevelopment')}</h3>
        <div class="portfolio-cards" id="apps-column">
          ${data.apps.map(project => createCaseCard(project, lang)).join('')}
        </div>
      </div>
      <div class="portfolio-column">
        <h3 class="portfolio-column__title" data-i18n="portfolio.websiteDevelopment">${t('portfolio.websiteDevelopment')}</h3>
        <div class="portfolio-cards" id="websites-column">
          ${data.websites.map(project => createCaseCard(project, lang)).join('')}
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach event listeners to phase buttons
  attachPhaseButtonListeners(container, data);
}

/**
 * Creates HTML for a single case study card.
 * @param {Object} project - Project data object
 * @param {string} lang - Current language code
 * @returns {string} - HTML string for case card
 */
function createCaseCard(project, lang) {
  const title = getLocalizedValue(project.title, lang);
  const summary = getLocalizedValue(project.summary, lang);
  const tags = project.tags || [];
  
  return `
    <div class="case-card" data-project-id="${project.id}">
      <div class="case-card__header">
        <h4 class="case-card__title">${title}</h4>
      </div>
      <p class="case-card__summary">${summary}</p>
      <div class="case-card__tags">
        ${tags.map(tag => `<span class="case-tag">${tag}</span>`).join('')}
      </div>
      <nav class="phase-nav" aria-label="Project phases">
        <button class="phase-btn" data-phase="ideas" data-project="${project.id}">
          <svg class="phase-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <span data-i18n="portfolio.phases.ideas">${t('portfolio.phases.ideas')}</span>
        </button>
        <button class="phase-btn" data-phase="design" data-project="${project.id}">
          <svg class="phase-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
          </svg>
          <span data-i18n="portfolio.phases.design">${t('portfolio.phases.design')}</span>
        </button>
        <button class="phase-btn" data-phase="proof" data-project="${project.id}">
          <svg class="phase-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
          </svg>
          <span data-i18n="portfolio.phases.proof">${t('portfolio.phases.proof')}</span>
        </button>
        <button class="phase-btn" data-phase="product" data-project="${project.id}">
          <svg class="phase-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
          <span data-i18n="portfolio.phases.product">${t('portfolio.phases.product')}</span>
        </button>
      </nav>
    </div>
  `;
}

/**
 * Attaches click listeners to all phase buttons.
 * @param {HTMLElement} container - Container with phase buttons
 * @param {Object} data - Portfolio data for modal content
 */
function attachPhaseButtonListeners(container, data) {
  const phaseButtons = container.querySelectorAll('.phase-btn');
  
  phaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.getAttribute('data-project');
      const phase = button.getAttribute('data-phase');
      
      // Find project data
      const project = [...data.apps, ...data.websites].find(p => p.id === projectId);
      
      if (project) {
        openPhaseModal(project, phase);
      }
    });
  });
}

/**
 * Opens a modal displaying phase content.
 * @param {Object} project - Project data object
 * @param {string} phase - Phase name (ideas, design, proof, product)
 */
function openPhaseModal(project, phase) {
  const lang = getCurrentLanguage();
  const phaseData = project.phases[phase];
  const projectTitle = getLocalizedValue(project.title, lang);
  const phaseTitle = t(`portfolio.phases.${phase}`);
  
  let content = '';
  
  if (phase === 'proof') {
    // Proof of work has tabs for different tools
    content = createProofOfWorkContent(phaseData, lang);
  } else {
    // Other phases have image galleries
    content = createGalleryContent(phaseData, lang);
  }
  
  openModal({
    title: `${projectTitle} — ${phaseTitle}`,
    content
  });
  
  // If proof phase, initialize tab switching
  if (phase === 'proof') {
    initProofTabs();
  }
}

/**
 * Creates gallery HTML for a phase.
 * @param {Object} phaseData - Phase data with images and caption
 * @param {string} lang - Current language code
 * @returns {string} - HTML string for gallery
 */
function createGalleryContent(phaseData, lang) {
  const images = phaseData.images || [];
  const caption = getLocalizedValue(phaseData.caption, lang);
  
  return `
    <div class="modal-gallery">
      ${images.map(img => `
        <div class="gallery-item">
          <img 
            src="${img}" 
            alt="Project screenshot" 
            class="gallery-image"
            loading="lazy"
            onerror="this.src='assets/case-studies/placeholder.svg'"
          >
        </div>
      `).join('')}
      ${caption ? `<p class="gallery-caption">${caption}</p>` : ''}
    </div>
  `;
}

/**
 * Creates tabbed content for proof of work phase.
 * Shows different design tools (Figma, Adobe XD, Sketch).
 * @param {Object} phaseData - Phase data with tool images
 * @param {string} lang - Current language code
 * @returns {string} - HTML string for tabbed content
 */
function createProofOfWorkContent(phaseData, lang) {
  const tools = ['figma', 'adobeXd', 'sketch'];
  
  return `
    <div class="modal-tabs" role="tablist">
      ${tools.map((tool, index) => `
        <button 
          class="modal-tab ${index === 0 ? 'active' : ''}" 
          role="tab"
          aria-selected="${index === 0}"
          data-tool="${tool}"
        >
          ${t(`portfolio.tools.${tool}`)}
        </button>
      `).join('')}
    </div>
    <div class="modal-tab-content">
      ${tools.map((tool, index) => `
        <div 
          class="tab-panel ${index === 0 ? 'active' : ''}" 
          data-tool-panel="${tool}"
          role="tabpanel"
        >
          <img 
            src="${phaseData[tool] || 'assets/case-studies/placeholder.svg'}" 
            alt="${t(`portfolio.tools.${tool}`)} preview" 
            class="gallery-image"
            loading="lazy"
            onerror="this.src='assets/case-studies/placeholder.svg'"
          >
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Initializes tab switching for proof of work modal.
 */
function initProofTabs() {
  const tabs = document.querySelectorAll('.modal-tab');
  const panels = document.querySelectorAll('.tab-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tool = tab.getAttribute('data-tool');
      
      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Update panel visibility
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute('data-tool-panel') === tool);
      });
    });
  });
}

/**
 * Gets localized value from an object with language keys.
 * @param {Object|string} obj - Object with language keys or plain string
 * @param {string} lang - Current language code
 * @returns {*} - Localized value
 */
function getLocalizedValue(obj, lang) {
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object' || obj === null) return '';
  return obj[lang] || obj.en || '';
}

/**
 * Refreshes portfolio content with current language.
 * @param {HTMLElement} container - Container element
 * @param {Object} [data] - Portfolio data
 */
export function refreshPortfolio(container, data = defaultPortfolioData) {
  renderPortfolio(container, data);
}
