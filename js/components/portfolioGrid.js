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
    },
    {
      id: 'web-mentes',
      title: 'Mentes en Movimiento',
      summary: { 
        en: 'Neurodevelopmental center digital transformation', 
        es: 'Transformación digital de centro de neurodesarrollo',
        de: 'Digitale Transformation des Neuroentwicklungszentrums' 
      },
      tags: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Strategy', 'UX Design'],
      phases: {
        ideas: {
          images: ['assets/case-studies/Mentes_html_Whiteboard.png'],
          caption: { 
            en: 'Moving from Fragmented Care to Multidisciplinary Synergy. The "Safe Harbor" concept.',
            es: 'Pasando de Atención Fragmentada a Sinergia Multidisciplinaria. El concepto de "Puerto Seguro".',
            de: 'Übergang von fragmentierter Pflege zu multidisziplinärer Synergie. Das "Sicherer Hafen"-Konzept.'
          }
        },
        design: {
          images: ['assets/case-studies/Mentes_html_Storyboard.png'],
          caption: { 
            en: 'Parent journey map: From overwhelmed to understanding the 3-step transparent clinical process.',
            es: 'Mapa del viaje de los padres: De abrumado a entender el proceso clínico transparente de 3 pasos.',
            de: 'Eltern-Reise-Karte: Von überwältigt zum Verständnis des transparenten klinischen 3-Schritte-Prozesses.'
          }
        },
        proof: {
          images: [
            'assets/case-studies/Mentes_html_Figma1.png',
            'assets/case-studies/Mentes_html_Figma2.png',
            'assets/case-studies/Mentes_html_Figma3.png',
            'assets/case-studies/Mentes_html_Figma4.png'
          ],
          caption: { 
            en: 'Soft blue tones, service-first grid, and persistent "Book Appointment" CTA.',
            es: 'Tonos azules suaves, cuadrícula de servicios primero y CTA persistente "Reservar Cita".',
            de: 'Sanfte Blautöne, Service-First-Raster und persistenter "Termin buchen" CTA.'
          }
        },
        product: {
          embedUrl: 'https://mentesenmovimiento.org',
          repoUrl: 'https://github.com/MentesenMovimiento/mentesenmovimiento.github.io',
          caption: { 
            en: 'Live site: mentesenmovimiento.org',
            es: 'Sitio en vivo: mentesenmovimiento.org',
            de: 'Live-Seite: mentesenmovimiento.org'
          }
        }
      }
    }
  ]
};

/**
 * Renders the portfolio section as a responsive grid.
 * @param {HTMLElement} container - Container to render into
 * @param {Object} [data] - Portfolio data (uses default if not provided)
 */
export function renderPortfolio(container, data = defaultPortfolioData) {
  if (!container) {
    console.warn('renderPortfolio: No container provided');
    return;
  }
  
  const lang = getCurrentLanguage();
  
  // Filter for the one finished project and add placeholders
  const finishedProject = [...data.websites, ...data.apps].find(p => p.id === 'web-mentes');
  
  const placeholders = [
    { 
      id: 'coming-soon-1', 
      isPlaceholder: true,
      title: 'Upcoming Project',
      summary: 'A new exciting project is in the works.',
      tags: ['Design', 'Development']
    },
    { 
      id: 'coming-soon-2', 
      isPlaceholder: true,
      title: 'Future Experience',
      summary: 'Another case study coming soon.',
      tags: ['UX Research', 'Prototyping']
    },
    { 
      id: 'coming-soon-3', 
      isPlaceholder: true,
      title: 'In the Lab',
      summary: 'Experimental designs and concepts.',
      tags: ['Interaction', 'Motion']
    }
  ];
  
  // Combine: Finished project first, then placeholders
  // Handle case where finishedProject might not be found (fallback to empty)
  let allProjects = [];
  if (finishedProject) {
    allProjects.push(finishedProject);
  }
  allProjects.push(...placeholders);

  const html = `
    <div class="portfolio-grid-wrapper">
      ${allProjects.map(project => createCaseCard(project, lang)).join('')}
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach event listeners to phase buttons
  attachPhaseButtonListeners(container, allProjects);
}

/**
 * Creates HTML for a single case study card.
 * @param {Object} project - Project data object
 * @param {string} lang - Current language code
 * @returns {string} - HTML string for case card
 */
function createCaseCard(project, lang) {
  if (project.isPlaceholder) {
    return `
      <div class="case-card case-card--coming-soon">
        <div class="case-card__content-blur">
          <div class="case-card__header">
            <h4 class="case-card__title">${project.title}</h4>
          </div>
          <p class="case-card__summary">${project.summary}</p>
          <div class="case-card__tags">
            ${project.tags.map(tag => `<span class="case-tag">${tag}</span>`).join('')}
          </div>
          <nav class="phase-nav">
             ${[1, 2, 3, 4].map(() => `
               <div class="phase-btn">
                 <div class="phase-btn__icon" style="background: var(--border); border-radius: 50%; opacity: 0.5;"></div>
                 <span style="background: var(--border); height: 10px; width: 40px; margin-top: 5px; opacity: 0.5;"></span>
               </div>
             `).join('')}
          </nav>
        </div>
      </div>
    `;
  }

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
 * @param {Array} projects - Array of project objects
 */
function attachPhaseButtonListeners(container, projects) {
  const phaseButtons = container.querySelectorAll('.phase-btn');
  
  phaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.getAttribute('data-project');
      const phase = button.getAttribute('data-phase');
      
      // Find project data
      const project = projects.find(p => p.id === projectId);
      
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
  
  if (phaseData.embedUrl) {
    // Embed live site
    content = createEmbedContent(phaseData, lang);
  } else if (phase === 'proof' && !phaseData.images) {
    // Proof of work has tabs for different tools (legacy structure)
    content = createProofOfWorkContent(phaseData, lang);
  } else {
    // Other phases have image galleries
    content = createGalleryContent(phaseData, lang);
  }
  
  openModal({
    title: `${projectTitle} — ${phaseTitle}`,
    content,
    className: phaseData.embedUrl ? 'modal--wide' : ''
  });
  
  // If proof phase with tabs, initialize tab switching
  if (phase === 'proof' && !phaseData.images) {
    initProofTabs();
  }
}

/**
 * Creates embed HTML for a phase (e.g. live site).
 * @param {Object} phaseData - Phase data with embedUrl and repoUrl
 * @param {string} lang - Current language code
 * @returns {string} - HTML string for embed
 */
function createEmbedContent(phaseData, lang) {
  const caption = getLocalizedValue(phaseData.caption, lang);
  
  return `
    <div class="modal-embed">
      <div class="embed-container">
        <iframe 
          src="${phaseData.embedUrl}" 
          title="Live Project Preview" 
          loading="lazy"
          allowfullscreen>
        </iframe>
      </div>
      <div class="embed-actions">
        ${phaseData.repoUrl ? `
          <a href="${phaseData.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub Repo
          </a>
        ` : ''}
        <a href="${phaseData.embedUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">
          Open Live Site
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
      ${caption ? `<p class="gallery-caption">${caption}</p>` : ''}
    </div>
  `;
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
