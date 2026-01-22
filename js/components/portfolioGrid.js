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

  // 1. Inject skeleton loaders immediately for perceived performance
  container.innerHTML = `
    <div class="skeleton-card">
      <div class="skeleton-title skeleton"></div>
      <div class="skeleton-text skeleton"></div>
      <div class="skeleton-text skeleton"></div>
      <div class="skeleton-text--short skeleton"></div>
      <div class="skeleton-tags">
        <div class="skeleton-tag skeleton"></div>
        <div class="skeleton-tag skeleton"></div>
        <div class="skeleton-tag skeleton"></div>
      </div>
    </div>
    <div class="skeleton-card">
      <div class="skeleton-title skeleton"></div>
      <div class="skeleton-text skeleton"></div>
      <div class="skeleton-text--short skeleton"></div>
      <div class="skeleton-tags">
        <div class="skeleton-tag skeleton"></div>
        <div class="skeleton-tag skeleton"></div>
      </div>
    </div>
    <div class="skeleton-card">
      <div class="skeleton-title skeleton"></div>
      <div class="skeleton-text skeleton"></div>
      <div class="skeleton-text--short skeleton"></div>
      <div class="skeleton-tags">
        <div class="skeleton-tag skeleton"></div>
        <div class="skeleton-tag skeleton"></div>
      </div>
    </div>
  `;

  try {
    const data = await loadPortfolioData();
    const lang = getCurrentLanguage();

    // 2. Clear skeletons once data is ready
    container.innerHTML = '';

    // Handle legacy or new structure
    const projects = data.projects || [];

    projects.forEach((project, index) => {
      const template = document.getElementById('portfolio-card-template');
      if (!template) return;

      const cardFragment = template.content.cloneNode(true);
      const card = cardFragment.querySelector('.case-card');

      // Stagger animation
      card.style.transitionDelay = `${index * 0.1}s`;

      const title = getLocalizedValue(project.title, lang);
      const description = getLocalizedValue(project.description, lang);
      const techStack = project.techStack || [];

      // Populate content
      card.querySelector('.case-card__title').textContent = title;
      card.querySelector('.case-card__summary').textContent = description;

      // Render tags
      const tagsContainer = card.querySelector('.tech-stack');
      techStack.forEach((tech, i) => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.animationDelay = `${i * 50}ms`;
        span.textContent = tech;
        tagsContainer.appendChild(span);
      });

      // Handle links
      const sourceLink = card.querySelector('.source-link');
      if (sourceLink) {
        sourceLink.href = project.sourceUrl;
        sourceLink.setAttribute('aria-label', `Source Code for ${title}`);
      }

      const liveLink = card.querySelector('.live-link');
      if (liveLink) {
        if (project.liveUrl && project.liveUrl !== '#') {
          liveLink.href = project.liveUrl;
          liveLink.setAttribute('aria-label', `Live Demo for ${title}`);
        } else {
          liveLink.remove();
        }
      }

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
