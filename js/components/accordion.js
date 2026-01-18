/**
 * accordion.js
 * Reusable accordion component with keyboard navigation and ARIA support.
 * 
 * Usage:
 *   import { initAccordions } from './components/accordion.js';
 *   initAccordions(document.getElementById('timeline-container'));
 * 
 * HTML structure expected:
 *   <div class="accordion-item">
 *     <button class="accordion-trigger" aria-expanded="false">...</button>
 *     <div class="accordion-panel">...</div>
 *   </div>
 */

/**
 * Initializes all accordions within a root element.
 * Adds click handlers, keyboard navigation, and ARIA attributes.
 * @param {HTMLElement} rootElement - Container element with accordion items
 * @returns {Object} - API for controlling accordions programmatically
 */
export function initAccordions(rootElement) {
  if (!rootElement) {
    console.warn('initAccordions: No root element provided');
    return null;
  }
  
  const triggers = rootElement.querySelectorAll('.accordion-trigger');
  
  triggers.forEach((trigger, index) => {
    const panel = trigger.nextElementSibling;
    
    // Ensure ARIA attributes are set
    setupARIA(trigger, panel, index);
    
    // Click handler
    trigger.addEventListener('click', () => {
      toggleAccordion(trigger, panel);
    });
    
    // Keyboard navigation
    trigger.addEventListener('keydown', (event) => {
      handleKeydown(event, triggers, index);
    });
  });
  
  // Return API for programmatic control
  return {
    /**
     * Expands a specific accordion by index.
     * @param {number} index - Index of accordion to expand
     */
    expand: (index) => {
      const trigger = triggers[index];
      if (trigger) {
        const panel = trigger.nextElementSibling;
        expandPanel(trigger, panel);
      }
    },
    
    /**
     * Collapses a specific accordion by index.
     * @param {number} index - Index of accordion to collapse
     */
    collapse: (index) => {
      const trigger = triggers[index];
      if (trigger) {
        const panel = trigger.nextElementSibling;
        collapsePanel(trigger, panel);
      }
    },
    
    /**
     * Collapses all accordions.
     */
    collapseAll: () => {
      triggers.forEach(trigger => {
        const panel = trigger.nextElementSibling;
        collapsePanel(trigger, panel);
      });
    },
    
    /**
     * Gets the currently expanded accordion index, or -1 if none.
     * @returns {number} - Index of expanded accordion
     */
    getExpandedIndex: () => {
      return Array.from(triggers).findIndex(t => t.getAttribute('aria-expanded') === 'true');
    }
  };
}

/**
 * Sets up ARIA attributes for accessibility.
 * @param {HTMLElement} trigger - The accordion trigger button
 * @param {HTMLElement} panel - The accordion panel content
 * @param {number} index - Index for unique IDs
 */
function setupARIA(trigger, panel, index) {
  const triggerId = trigger.id || `accordion-trigger-${index}`;
  const panelId = panel.id || `accordion-panel-${index}`;
  
  trigger.id = triggerId;
  panel.id = panelId;
  
  trigger.setAttribute('aria-controls', panelId);
  panel.setAttribute('aria-labelledby', triggerId);
  panel.setAttribute('role', 'region');
  
  // Ensure initial state is set
  if (!trigger.hasAttribute('aria-expanded')) {
    trigger.setAttribute('aria-expanded', 'false');
  }
  
  // Set initial panel state based on aria-expanded
  if (trigger.getAttribute('aria-expanded') === 'false') {
    panel.classList.remove('open');
  } else {
    panel.classList.add('open');
  }
}

/**
 * Toggles an accordion between expanded and collapsed states.
 * @param {HTMLElement} trigger - The accordion trigger button
 * @param {HTMLElement} panel - The accordion panel content
 */
function toggleAccordion(trigger, panel) {
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    collapsePanel(trigger, panel);
  } else {
    expandPanel(trigger, panel);
  }
}

/**
 * Expands an accordion panel.
 * @param {HTMLElement} trigger - The accordion trigger button
 * @param {HTMLElement} panel - The accordion panel content
 */
function expandPanel(trigger, panel) {
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('open');
  
  // Announce to screen readers
  announceChange('Section expanded');
}

/**
 * Collapses an accordion panel.
 * @param {HTMLElement} trigger - The accordion trigger button
 * @param {HTMLElement} panel - The accordion panel content
 */
function collapsePanel(trigger, panel) {
  trigger.setAttribute('aria-expanded', 'false');
  panel.classList.remove('open');
  
  // Announce to screen readers
  announceChange('Section collapsed');
}

/**
 * Handles keyboard navigation for accordions.
 * Supports Arrow keys, Home, and End.
 * @param {KeyboardEvent} event - The keyboard event
 * @param {NodeList} triggers - All accordion triggers
 * @param {number} currentIndex - Current trigger index
 */
function handleKeydown(event, triggers, currentIndex) {
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      newIndex = (currentIndex + 1) % triggers.length;
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = triggers.length - 1;
      break;
    default:
      return;
  }
  
  triggers[newIndex].focus();
}

/**
 * Announces a change to screen readers.
 * @param {string} message - Message to announce
 */
function announceChange(message) {
  const liveRegion = document.getElementById('aria-live');
  if (liveRegion) {
    liveRegion.textContent = message;
    setTimeout(() => { liveRegion.textContent = ''; }, 500);
  }
}
