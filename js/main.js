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
// import { initPortfolio, refreshPortfolio } from './components/portfolioGrid.js'; // Legacy
import { initDashboard, refreshDashboard } from './components/portfolioDashboard.js';
import { PaperTossGame } from './components/paperToss/game.js';
import { initSkillDragger } from './components/skillDragger.js';
import { initParticleBackground } from './components/particleBackground.js';

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
  console.log('initApp: Starting...');
  // Initialize core systems
  initTheme();
  initI18n();
  initModal();
  initSkillDragger();
  try {
    initParticleBackground('about-particles');
    initParticleBackground('contact-particles');
  } catch (e) { console.error('Particles failed:', e); }

  // Set up toggle button listeners
  setupLanguageToggles();
  setupThemeToggles();
  setupMobileMenu();

  // Load and render experience timeline
  console.log('initApp: Calling initTimeline...');
  try {
    await initTimeline();
    console.log('initApp: initTimeline completed');
  } catch (e) {
    console.error('initTimeline failed:', e);
  }

  // Render portfolio dashboard
  console.log('initApp: Calling initDashboard...');
  try {
    await initDashboard();
    console.log('initApp: initDashboard completed');
  } catch (e) {
    console.error('initDashboard failed:', e);
  }

  // Initialize paper toss game
  console.log('initApp: Calling initPaperToss...');
  try {
    initPaperToss();
    console.log('initApp: initPaperToss completed');
  } catch (e) {
    console.error('initPaperToss failed:', e);
  }

  // Set up animations after dynamic content is loaded
  const setupFunctions = [
    { name: 'setupScrollReveal', fn: setupScrollReveal },
    { name: 'setupMagneticEffect', fn: setupMagneticEffect },
    { name: 'setupCursorGlow', fn: setupCursorGlow },
    { name: 'setupScrollProgress', fn: setupScrollProgress },
    { name: 'setupSplitPanel', fn: setupSplitPanel }
  ];

  setupFunctions.forEach(({ name, fn }) => {
    try {
      console.log(`initApp: Calling ${name}...`);
      fn();
      console.log(`initApp: ${name} completed`);
    } catch (e) {
      console.error(`${name} failed:`, e);
    }
  });

  console.log('initApp: Setup functions complete');

  // Listen for language changes to refresh content
  window.addEventListener('languagechange', handleLanguageChange);
  console.log('initApp: FINISHED');
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

// initPortfolio is now imported from portfolioGrid.js

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

  // Handle "Coffee Break" button click to open details
  const coffeeBreakBtn = document.getElementById('coffee-break-btn');
  const gameDetails = document.getElementById('game-details'); // Assuming the details element has this ID or we act on parent

  if (coffeeBreakBtn) {
    coffeeBreakBtn.addEventListener('click', (e) => {
      // Find the details element if not selected by ID (fallback to looking near the canvas)
      // The game is inside a <details> in the footer (usually). 
      // Let's assume we need to target the <details> specifically.
      // Based on typical structure, check for the details element containing the game.
      const details = document.querySelector('details'); // A bit risky if multiple, but "Game" is usually the only one or we'd add an ID.

      if (details) {
        details.open = true;
        // Scroll to it
        setTimeout(() => {
          details.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }
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

  // Refresh dashboard with new language
  refreshDashboard();

  // Re-initialize effects for new content
  setupScrollReveal();
  setupMagneticEffect();
}

/**
 * Sets up Scroll Reveal animations using IntersectionObserver.
 * Uses progressive enhancement: content is visible by default, 
 * JavaScript adds animation classes only when ready.
 */
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('active');
        entry.target.dataset.observed = 'true';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    if (!el.dataset.observed) {
      // Add pending class to hide element before animation
      el.classList.add('reveal-pending');
      // Small delay to ensure transition works
      requestAnimationFrame(() => {
        observer.observe(el);
      });
    }
  });
}

/**
 * Sets up Magnetic Effect for interactive elements.
 * Moves the element slightly towards the cursor on hover.
 */
function setupMagneticEffect() {
  const magnets = document.querySelectorAll('.magnetic');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  magnets.forEach(magnet => {
    if (magnet.dataset.magneticSetup) return;
    magnet.dataset.magneticSetup = 'true';

    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Limit the movement (e.g. 30% of the distance) to keep it subtle
      const intensity = 0.3;

      magnet.style.transform = `translate3d(${x * intensity}px, ${y * intensity}px, 0)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate3d(0, 0, 0)';
    });
  });
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

/**
 * Sets up cursor glow effect with smooth lerp animation.
 * Optimized with requestAnimationFrame for 60fps performance.
 */
function setupCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    glow.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  // Update target coordinates on move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // LERP formula: current + (target - current) * factor
    // 0.1 creates a soft, lagging follow effect for premium feel
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    // Use translate3d for GPU acceleration
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }

  // Start the animation loop
  animate();
}

/**
 * Sets up scroll progress indicator.
 */
function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // Initial call
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Sets up the split panel interaction (Experience vs Qualifications).
 */
/**
 * Sets up the split panel interaction (Experience vs Qualifications).
 * Allows clicking anywhere on the minimized panel to expand it.
 */
function setupSplitPanel() {
  const container = document.querySelector('.split-panel');
  if (!container) return;

  const sides = container.querySelectorAll('.split-panel__side');

  sides.forEach(side => {
    side.addEventListener('click', () => {
      // If already active, do nothing
      if (side.classList.contains('split-panel__side--active')) return;

      // Update active state classes
      sides.forEach(s => s.classList.remove('split-panel__side--active'));
      side.classList.add('split-panel__side--active');

      // Update ARIA attributes on buttons
      const allTabs = container.querySelectorAll('.split-panel__tab');
      allTabs.forEach(t => t.setAttribute('aria-selected', 'false'));

      const activeTab = side.querySelector('.split-panel__tab');
      if (activeTab) activeTab.setAttribute('aria-selected', 'true');
    });
  });
}

// Initialize the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
