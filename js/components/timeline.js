/**
 * timeline.js
 * Renders work experience timeline from linkedin.json data.
 * Generates accordion-style expandable timeline items.
 * 
 * Usage:
 *   import { renderTimeline, loadExperienceData } from './components/timeline.js';
 *   const data = await loadExperienceData();
 *   renderTimeline(document.getElementById('timeline'), data);
 */

import { getCurrentLanguage, t } from '../i18n.js';
import { initAccordions } from './accordion.js';

/**
 * Loads experience data from linkedin.json file.
 * Returns the experiences array with multilingual content.
 * @returns {Promise<Object>} - The parsed experience data
 */
export async function loadExperienceData() {
  try {
    const response = await fetch('./assets/linkedin.json');
    if (!response.ok) {
      throw new Error(`Failed to load linkedin.json: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading experience data:', error);
    return { experiences: [] };
  }
}

/**
 * Renders the experience timeline into a container element.
 * Creates accordion items for each experience entry.
 * @param {HTMLElement} container - Container to render timeline into
 * @param {Object} data - Experience data from linkedin.json
 * @returns {Object|null} - Accordion API for programmatic control
 */
export function renderTimeline(container, data) {
  if (!container || !data || !data.experiences) {
    console.warn('renderTimeline: Missing container or data');
    return null;
  }
  
  const lang = getCurrentLanguage();
  const experiences = data.experiences;
  const visibleCount = 4;
  const hasMore = experiences.length > visibleCount;
  
  // Build timeline HTML - first 4 visible, rest hidden
  const visibleItems = experiences.slice(0, visibleCount).map((exp, index) => {
    return createTimelineItem(exp, lang, index);
  }).join('');
  
  const hiddenItems = hasMore ? experiences.slice(visibleCount).map((exp, index) => {
    return createTimelineItem(exp, lang, index + visibleCount);
  }).join('') : '';
  
  const expandButton = hasMore ? `
    <div class="timeline-expand">
      <button type="button" class="timeline-expand-btn" aria-expanded="false">
        <span class="timeline-expand-text">${t('experience.expandMore') || 'Expand to see more roles'}</span>
        <svg class="timeline-expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </div>
  ` : '';
  
  const hiddenSection = hasMore ? `
    <div class="timeline-hidden" aria-hidden="true">
      ${hiddenItems}
    </div>
  ` : '';
  
  container.innerHTML = `<div class="timeline">${visibleItems}${expandButton}${hiddenSection}</div>`;
  
  // Set up expand button functionality
  if (hasMore) {
    const expandBtn = container.querySelector('.timeline-expand-btn');
    const hiddenSection = container.querySelector('.timeline-hidden');
    const expandText = container.querySelector('.timeline-expand-text');
    
    expandBtn?.addEventListener('click', () => {
      const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
      
      expandBtn.setAttribute('aria-expanded', (!isExpanded).toString());
      hiddenSection?.classList.toggle('visible', !isExpanded);
      hiddenSection?.setAttribute('aria-hidden', isExpanded.toString());
      expandBtn.classList.toggle('expanded', !isExpanded);
      
      if (expandText) {
        expandText.textContent = isExpanded 
          ? (t('experience.expandMore') || 'Expand to see more roles')
          : (t('experience.collapseRoles') || 'Collapse roles');
      }
    });
  }
  
  // Initialize accordion functionality
  const timelineElement = container.querySelector('.timeline');
  return initAccordions(timelineElement);
}

/**
 * Creates HTML for a single timeline item.
 * @param {Object} exp - Experience object from data
 * @param {string} lang - Current language code
 * @param {number} index - Item index for unique IDs
 * @returns {string} - HTML string for timeline item
 */
function createTimelineItem(exp, lang, index) {
  const role = getLocalizedValue(exp.role, lang);
  const company = exp.company;
  const location = getLocalizedValue(exp.location, lang);
  const dates = getLocalizedValue(exp.dates.display, lang);
  const description = getLocalizedValue(exp.description, lang);
  const bullets = getLocalizedValue(exp.bullets, lang) || [];
  const skills = exp.skills || [];
  
  return `
    <div class="timeline-item">
      <div class="timeline-item-wrapper">
        <button 
          class="accordion-trigger" 
          id="exp-trigger-${index}"
          aria-expanded="false"
          aria-controls="exp-panel-${index}"
        >
          <div class="accordion-header-content">
            <div class="role-title">${role}</div>
            <div class="company-name">${company}</div>
            <div class="role-dates">${dates} · ${location}</div>
          </div>
          <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <div 
          class="accordion-panel" 
          id="exp-panel-${index}"
          aria-labelledby="exp-trigger-${index}"
          role="region"
        >
          ${description ? `<p class="role-description">${description}</p>` : ''}
          ${bullets.length > 0 ? createBulletList(bullets) : ''}
          ${skills.length > 0 ? createSkillTags(skills) : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates HTML for a bullet point list.
 * @param {string[]} bullets - Array of bullet point strings
 * @returns {string} - HTML string for bullet list
 */
function createBulletList(bullets) {
  const items = bullets.map(bullet => `<li>${bullet}</li>`).join('');
  return `<ul class="role-bullets">${items}</ul>`;
}

/**
 * Creates HTML for skill tags.
 * @param {string[]} skills - Array of skill names
 * @returns {string} - HTML string for skill tags
 */
function createSkillTags(skills) {
  const tags = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
  return `
    <div class="skill-tags-container">
      <span class="skill-tags-label">${t('experience.skills')}:</span>
      <div class="skill-tags">${tags}</div>
    </div>
  `;
}

/**
 * Gets localized value from an object with language keys.
 * Falls back to English if current language not available.
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
 * Re-renders the timeline with current language.
 * Call this when language changes.
 * @param {HTMLElement} container - Container element
 * @param {Object} data - Experience data
 * @returns {Object|null} - New accordion API
 */
export function refreshTimeline(container, data) {
  return renderTimeline(container, data);
}
