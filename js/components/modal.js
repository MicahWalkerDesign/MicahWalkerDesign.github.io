/**
 * modal.js
 * Reusable modal component with focus trap, keyboard support, and ARIA.
 * 
 * Usage:
 *   import { openModal, closeModal, initModal } from './components/modal.js';
 *   initModal();
 *   openModal({ title: 'My Modal', content: '<p>Hello</p>' });
 */

// Modal state
let isOpen = false;
let previouslyFocusedElement = null;
let modalElement = null;
let backdropElement = null;

/**
 * Initializes the modal system.
 * Creates modal elements if they don't exist, attaches event listeners.
 * Should be called once on page load.
 */
export function initModal() {
  // Create modal structure if it doesn't exist
  if (!document.getElementById('modal')) {
    createModalElements();
  }
  
  modalElement = document.getElementById('modal');
  backdropElement = document.getElementById('modal-backdrop');
  
  // Close on backdrop click
  backdropElement?.addEventListener('click', closeModal);
  
  // Close on ESC key (handled globally)
  document.addEventListener('keydown', handleGlobalKeydown);
  
  // Close button handler
  const closeBtn = modalElement?.querySelector('.modal-close');
  closeBtn?.addEventListener('click', closeModal);
}

/**
 * Creates the modal DOM elements dynamically.
 * Appends modal structure to body.
 */
function createModalElements() {
  const html = `
    <div id="modal-backdrop" class="modal-backdrop" aria-hidden="true"></div>
    <div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title"></h2>
        <button class="modal-close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div id="modal-body" class="modal-body"></div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

/**
 * Opens the modal with specified content.
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title text
 * @param {string} options.content - HTML content for modal body
 * @param {Function} [options.onClose] - Callback when modal closes
 * @returns {HTMLElement} - The modal element
 */
export function openModal({ title, content, onClose, className }) {
  if (!modalElement) {
    initModal();
    modalElement = document.getElementById('modal');
    backdropElement = document.getElementById('modal-backdrop');
  }
  
  // Store the currently focused element to restore later
  previouslyFocusedElement = document.activeElement;
  
  // Reset classes and apply new ones
  modalElement.className = 'modal'; 
  if (className) {
    modalElement.classList.add(className);
  }
  
  // Set modal content
  const titleElement = modalElement.querySelector('#modal-title');
  const bodyElement = modalElement.querySelector('#modal-body');
  
  if (titleElement) titleElement.textContent = title;
  if (bodyElement) bodyElement.innerHTML = content;
  
  // Store onClose callback
  modalElement._onClose = onClose;
  
  // Show modal
  backdropElement?.classList.add('open');
  modalElement?.classList.add('open');
  backdropElement?.setAttribute('aria-hidden', 'false');
  modalElement?.setAttribute('aria-hidden', 'false');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  isOpen = true;
  
  // Focus the first focusable element or the close button
  requestAnimationFrame(() => {
    const firstFocusable = getFirstFocusableElement(modalElement);
    if (firstFocusable) {
      firstFocusable.focus();
    }
  });
  
  // Announce to screen readers
  announceToScreenReader('Dialog opened');
  
  return modalElement;
}

/**
 * Closes the currently open modal.
 * Restores focus to the previously focused element.
 */
export function closeModal() {
  if (!isOpen || !modalElement) return;
  
  // Call onClose callback if provided
  if (modalElement._onClose) {
    modalElement._onClose();
    modalElement._onClose = null;
  }
  
  // Hide modal
  backdropElement?.classList.remove('open');
  modalElement?.classList.remove('open');
  backdropElement?.setAttribute('aria-hidden', 'true');
  modalElement?.setAttribute('aria-hidden', 'true');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  isOpen = false;
  
  // Restore focus to previously focused element
  if (previouslyFocusedElement && previouslyFocusedElement.focus) {
    previouslyFocusedElement.focus();
  }
  
  // Announce to screen readers
  announceToScreenReader('Dialog closed');
}

/**
 * Checks if the modal is currently open.
 * @returns {boolean} - True if modal is open
 */
export function isModalOpen() {
  return isOpen;
}

/**
 * Handles global keydown events for modal.
 * Closes on ESC, traps focus with Tab.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleGlobalKeydown(event) {
  if (!isOpen) return;
  
  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeModal();
      break;
    case 'Tab':
      handleTabKey(event);
      break;
  }
}

/**
 * Handles Tab key for focus trapping within modal.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleTabKey(event) {
  const focusableElements = getFocusableElements(modalElement);
  
  if (focusableElements.length === 0) return;
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    // Shift + Tab: going backwards
    if (document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  } else {
    // Tab: going forwards
    if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
}

/**
 * Gets all focusable elements within a container.
 * @param {HTMLElement} container - Container element
 * @returns {HTMLElement[]} - Array of focusable elements
 */
function getFocusableElements(container) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  
  return Array.from(container.querySelectorAll(selector));
}

/**
 * Gets the first focusable element within a container.
 * @param {HTMLElement} container - Container element
 * @returns {HTMLElement|null} - First focusable element or null
 */
function getFirstFocusableElement(container) {
  const focusable = getFocusableElements(container);
  return focusable.length > 0 ? focusable[0] : null;
}

/**
 * Announces a message to screen readers.
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live');
  if (liveRegion) {
    liveRegion.textContent = message;
    setTimeout(() => { liveRegion.textContent = ''; }, 500);
  }
}

/**
 * Updates the modal content dynamically without closing it.
 * @param {Object} options - Update options
 * @param {string} [options.title] - New title (optional)
 * @param {string} [options.content] - New content (optional)
 */
export function updateModalContent({ title, content }) {
  if (!modalElement || !isOpen) return;
  
  if (title !== undefined) {
    const titleElement = modalElement.querySelector('#modal-title');
    if (titleElement) titleElement.textContent = title;
  }
  
  if (content !== undefined) {
    const bodyElement = modalElement.querySelector('#modal-body');
    if (bodyElement) bodyElement.innerHTML = content;
  }
}
