/**
 * main.js
 * Entry point for the portfolio website.
 * Initializes all modules and sets up the application.
 * 
 * This file orchestrates:
 * - i18n (internationalization)
 * - Theme switching
 * - Timeline rendering from LinkedIn JSON
 * - Portfolio grid rendering
 * - Paper toss game initialization
 * - Modal system
 */

// Import modules
import { initI18n, setLanguage, getCurrentLanguage, t } from './i18n.js';
import { initTheme, setTheme, getTheme } from './theme.js';
import { initModal, openModal } from './components/modal.js';
import { loadExperienceData, renderTimeline, refreshTimeline } from './components/timeline.js';
import { renderPortfolio, refreshPortfolio, defaultPortfolioData } from './components/portfolioGrid.js';
import { PaperTossGame } from './components/paperToss/game.js';

// Application state
let experienceData = null;
let paperTossGame = null;

// Mobile Menu Logic
function setupMobileMenu() {
  const btn = document.querySelector('.header__menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = menu.querySelectorAll('a');
  
  if (!btn || !menu) return;
  
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });
  
  // Close menu when clicking a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });
  
  function toggleMenu(open) {
    btn.setAttribute('aria-expanded', open);
    btn.classList.toggle('is-active', open);
    menu.setAttribute('aria-hidden', !open);
    menu.classList.toggle('is-open', open);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

/**
 * Initializes the entire application.
 * Called when DOM is ready.
 */
async function initApp() {
  // Initialize core systems
  initTheme();
  initI18n();
  initModal();
  
  // Set up toggle button listeners
  setupLanguageToggles();
  setupThemeToggles();
  setupMobileMenu();
  
  // Set up contact modal

  setupContactModal();
  
  // Load and render experience timeline
  await initTimeline();
  
  // Render portfolio section
  initPortfolio();
  
  // Initialize paper toss game
  initPaperToss();
  
  // Listen for language changes to refresh content
  window.addEventListener('languagechange', handleLanguageChange);
}

/**
 * Sets up the contact modal button.
 */
function setupContactModal() {
  const contactBtn = document.getElementById('contact-modal-btn');
  
  contactBtn?.addEventListener('click', () => {
    const contactContent = `
      <div class="contact-info">
        <div class="contact-item">
          <strong>${t('footer.contact')} Details</strong>
        </div>
        <div class="contact-item">
          <span class="contact-label">Name:</span>
          <span class="contact-value">Micah Walker</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">D.O.B.:</span>
          <span class="contact-value">15 March 1993</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">Phone:</span>
          <a href="tel:+61480663328" class="contact-value">+61 480 663 328</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Email:</span>
          <a href="mailto:Micah.walker@gmail.com" class="contact-value">Micah.walker@gmail.com</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">Example Rate:</span>
          <span class="contact-value">120k AUD</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">Availability:</span>
          <span class="contact-value">4 days per week</span>
        </div>
      </div>
    `;
    
    openModal({
      title: t('footer.contact'),
      content: contactContent
    });
  });
}

/**
 * Sets up language toggle button event listeners.
 */
function setupLanguageToggles() {
  const langButtons = document.querySelectorAll('[data-lang-toggle]');
  
  langButtons.forEach(button => {
    const lang = button.getAttribute('data-lang-toggle');
    
    // Set initial active state
    if (lang === getCurrentLanguage()) {
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    }
    
    button.addEventListener('click', () => {
      setLanguage(lang);
      
      // Update button states
      langButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-lang-toggle') === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive.toString());
      });
    });
  });
}

/**
 * Sets up theme toggle button event listeners.
 */
function setupThemeToggles() {
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  
  themeButtons.forEach(button => {
    const theme = button.getAttribute('data-theme-toggle');
    
    // Set initial active state
    if (theme === getTheme()) {
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    }
    
    button.addEventListener('click', () => {
      setTheme(theme);
      
      // Update button states
      themeButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-theme-toggle') === theme;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive.toString());
      });
    });
  });
}

/**
 * Loads experience data and renders the timeline.
 */
async function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) {
    console.warn('Timeline container not found');
    return;
  }
  
  // Load experience data from JSON
  experienceData = await loadExperienceData();
  
  // Render timeline
  renderTimeline(container, experienceData);
}

/**
 * Renders the portfolio section.
 */
function initPortfolio() {
  const container = document.getElementById('portfolio-container');
  if (!container) {
    console.warn('Portfolio container not found');
    return;
  }
  
  renderPortfolio(container, defaultPortfolioData);
}

/**
 * Initializes the paper toss game.
 */
function initPaperToss() {
  const canvas = document.getElementById('game-canvas');
  const startButton = document.getElementById('start-game');
  const playAgainButton = document.getElementById('play-again');
  
  if (!canvas) {
    console.warn('Game canvas not found');
    return;
  }
  
  // Create game instance
  paperTossGame = new PaperTossGame(canvas, {
    maxThrows: 5
  });
  
  paperTossGame.init();
  
  // Update score display callback
  paperTossGame.onScoreChange = (score) => {
    const scoreElement = document.getElementById('game-score-value');
    if (scoreElement) scoreElement.textContent = score;
  };
  
  // Start button handler
  startButton?.addEventListener('click', () => {
    paperTossGame.startGame();
    startButton.style.display = 'none';
    if (playAgainButton) playAgainButton.style.display = 'inline-block';
  });
  
  // Play again button handler
  playAgainButton?.addEventListener('click', () => {
    paperTossGame.startGame();
  });
}

/**
 * Handles language change events.
 * Refreshes dynamic content with new language.
 * @param {CustomEvent} event - Language change event
 */
function handleLanguageChange(event) {
  const { language } = event.detail;
  
  // Refresh timeline with new language
  const timelineContainer = document.getElementById('timeline-container');
  if (timelineContainer && experienceData) {
    refreshTimeline(timelineContainer, experienceData);
  }
  
  // Refresh portfolio with new language
  const portfolioContainer = document.getElementById('portfolio-container');
  if (portfolioContainer) {
    refreshPortfolio(portfolioContainer);
  }
}

/**
 * Performance Optimization:
 * Adds a class to body during resize to disable transitions/animations.
 * This prevents layout thrashing and improves resize performance.
 */
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
