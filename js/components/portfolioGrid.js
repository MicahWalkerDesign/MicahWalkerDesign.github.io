/**
 * portfolioGrid.js
 * Handles dynamic rendering of project cards with technical metadata 
 * and intersection observer triggers.
 */

import { getCurrentLanguage, t } from '../i18n.js';

// Setup observer storage to prevent duplicates
let observer;

/**
 * Loads portfolio data from JSON file.
 * @returns {Promise<Object>} Portfolio data object
 */
export async function loadPortfolioData() {
  try {
    const response = await fetch('assets/portfolio.json');
    if (!response.ok) throw new Error('Failed to load portfolio data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Using default/fallback portfolio data:', error);
    return { projects: [] };
  }
}

export async function initPortfolio() {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  try {
    const data = await loadPortfolioData();
    const lang = getCurrentLanguage();

    // Clear skeletons
    container.innerHTML = '';

    // Handle legacy or new structure
    const projects = data.projects || [];

    projects.forEach((project, index) => {
      const card = document.createElement('article');
      // Use existing case-card class for styling, add reveal for animation
      card.className = 'case-card reveal';
      // Stagger the animation delay based on index
      card.style.transitionDelay = `${index * 0.1}s`;

      const title = getLocalizedValue(project.title, lang);
      const description = getLocalizedValue(project.description, lang);
      const techStack = project.techStack || [];

      card.innerHTML = `
        <div class="case-card__header">
          <h3 class="case-card__title">${title}</h3>
        </div>
        
        <div class="case-card__tags tech-stack">
          ${techStack.map((tech, i) => `<span class="badge" style="animation-delay: ${i * 50}ms">${tech}</span>`).join('')}
        </div>
        </div>
        
        <p class="case-card__summary">${description}</p>
        
        <div class="case-card__links" style="margin-top: auto; padding-top: 1rem; display: flex; gap: 1rem;">
          <a href="${project.sourceUrl}" class="btn-link" target="_blank" rel="noopener noreferrer" aria-label="Source Code for ${title}">
            Source Code →
          </a>
          ${project.liveUrl && project.liveUrl !== '#' ? `
            <a href="${project.liveUrl}" class="btn-link" target="_blank" rel="noopener noreferrer" aria-label="Live Demo for ${title}">
              Live Demo →
            </a>
          ` : ''}
        </div>
      `;

      container.appendChild(card);
    });

    // Re-initialize the Observer for the newly injected elements
    // Note: main.js also calls setupScrollReveal, but we do it here closely to rendering
    observeElements();

  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = `<p class="error">Failed to load projects. Please try refreshing.</p>`;
  }
}

export function refreshPortfolio(container, data) {
  // Simple re-init to handle language changes
  initPortfolio();
}

function observeElements() {
  // Disconnect previous observer if exists to avoid accumulation
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animation only triggers once
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/**
 * Gets localized value from an object with language keys.
 */
function getLocalizedValue(obj, lang) {
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object' || obj === null) return '';
  return obj[lang] || obj.en || '';
}
