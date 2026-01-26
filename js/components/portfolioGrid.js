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
      const techStack = project.techStack || [];
      const caseStudy = project.caseStudy || {};

      // Populate content
      card.querySelector('.case-card__title').textContent = title;

      // Populate Bubble Content
      const problemText = getLocalizedValue(caseStudy.problem, lang);
      const solutionText = getLocalizedValue(caseStudy.solution, lang);
      const evidenceText = getLocalizedValue(caseStudy.evidence, lang) || getLocalizedValue(caseStudy.result, lang);

      // Default state: Problem is active
      const display = card.querySelector('.bubble-display');
      if (display) {
        display.querySelector('[data-content="problem"]').textContent = problemText || 'Problem statement...';
        display.querySelector('[data-content="solution"]').textContent = solutionText || 'Solution details...';
        display.querySelector('[data-content="evidence"]').textContent = evidenceText || 'Evidence/Results...';
      }

      // Interactive Bubble Logic
      const bubbles = card.querySelectorAll('.bubble-btn');
      const texts = card.querySelectorAll('.bubble-text');

      bubbles.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent card expansion if any
          const target = btn.dataset.target;

          // 1. Update Buttons
          bubbles.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // 2. Update Content
          texts.forEach(t => {
            t.classList.remove('active');
            if (t.dataset.content === target) {
              t.classList.add('active');
            }
          });
        });
      });

      // Featured / Code Snippet Logic
      if (project.isFeatured) {
        card.classList.add('featured');
        const codeWindow = cardFragment.querySelector('.code-window');
        if (codeWindow && project.codeSnippet) {
          codeWindow.style.display = 'block';
          codeWindow.querySelector('.code-content').textContent = project.codeSnippet.code;
        }
      }

      // Render tags
      const tagsContainer = card.querySelector('.tech-stack');
      techStack.forEach((tech, i) => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.animationDelay = `${i * 50}ms`;
        // Try to translate tag, fallback to original string
        const translatedTag = t(`tags.${tech}`) !== `tags.${tech}` ? t(`tags.${tech}`) : tech;
        span.textContent = translatedTag;
        tagsContainer.appendChild(span);
      });

      // Handle links (support both legacy and new formats)
      // Handle links (support both legacy and new formats)
      const sourceLink = card.querySelector('.source-link');
      const sourceUrl = project.sourceUrl || project.links?.source;

      if (sourceLink) {
        if (sourceUrl || project.codeSnippet) {
          sourceLink.href = sourceUrl || '#';
          sourceLink.setAttribute('aria-label', `Source Code for ${title}`);

          sourceLink.addEventListener('click', (e) => {
            if (project.codeSnippet) {
              e.preventDefault();
              import('../components/modal.js').then(({ openModal }) => {
                const codeHtml = `
                  <div class="code-window" style="max-height: 80vh; overflow-y: auto;">
                    <div class="code-header">
                      <div class="dot red"></div>
                      <div class="dot yellow"></div>
                      <div class="dot green"></div>
                    </div>
                    <pre class="code-content" style="white-space: pre-wrap;">${project.codeSnippet.code}</pre>
                  </div>
                  <div style="margin-top: 1rem; text-align: right;">
                    ${sourceUrl && sourceUrl !== '#' ? `<a href="${sourceUrl}" target="_blank" class="btn btn--secondary">View on GitHub</a>` : ''}
                  </div>
                `;
                openModal({ title: `${title} - Source Code`, content: codeHtml, className: 'modal--wide' });
              });
            } else if (!sourceUrl || sourceUrl === '#') {
              e.preventDefault(); // No link and no snippet
            }
          });
        } else {
          sourceLink.remove();
        }
      }

      const liveLink = card.querySelector('.live-link');
      const liveUrl = project.liveUrl || project.links?.demo;

      if (liveLink) {
        if (liveUrl === 'self') {
          liveLink.href = '#';
          liveLink.addEventListener('click', (e) => {
            e.preventDefault();
            import('../components/modal.js').then(({ openModal }) => {
              openModal({
                title: title,
                content: `<p class="modal-text">You are already on this site!</p><p class="modal-subtext">This portfolio is the live demo of Project 2.</p>`
              });
            });
          });
        } else if (liveUrl && liveUrl !== '#') {
          liveLink.href = liveUrl;
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
