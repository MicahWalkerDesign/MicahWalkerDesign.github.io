/**
 * theme.js
 * Theme management module for Sage/Clay theme switching.
 * Persists theme preference to localStorage.
 * 
 * Usage:
 *   import { setTheme, getTheme, toggleTheme } from './theme.js';
 *   setTheme('clay');
 */

// Available themes
const THEMES = {
  SAGE: 'sage',
  CLAY: 'clay'
};

// Default theme (dark mode)
const DEFAULT_THEME = THEMES.CLAY;

// Current active theme
let currentTheme = DEFAULT_THEME;

/**
 * Gets the current active theme.
 * @returns {string} - Current theme name ('sage' or 'clay')
 */
export function getTheme() {
  return currentTheme;
}

/**
 * Gets all available theme names.
 * @returns {string[]} - Array of theme names
 */
export function getAvailableThemes() {
  return Object.values(THEMES);
}

/**
 * Sets the active theme and applies it to the document.
 * Updates data-theme attribute on <html> and saves to localStorage.
 * @param {string} theme - Theme name ('sage' or 'clay')
 */
export function setTheme(theme) {
  // Validate theme
  if (!Object.values(THEMES).includes(theme)) {
    console.warn(`Theme '${theme}' not available. Using default.`);
    theme = DEFAULT_THEME;
  }
  
  currentTheme = theme;
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme);
  
  // Persist to localStorage
  localStorage.setItem('portfolio-theme', theme);
  
  // Update toggle button states
  updateThemeToggleUI();
  
  // Dispatch custom event for components that need to react
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  
  // Announce to screen readers
  announceThemeChange(theme);
}

/**
 * Toggles between available themes.
 * @returns {string} - The new active theme
 */
export function toggleTheme() {
  const newTheme = currentTheme === THEMES.SAGE ? THEMES.CLAY : THEMES.SAGE;
  setTheme(newTheme);
  return newTheme;
}

/**
 * Updates the visual state of theme toggle buttons.
 * Buttons should have data-theme-toggle="themeName" attribute.
 */
function updateThemeToggleUI() {
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    const buttonTheme = button.getAttribute('data-theme-toggle');
    const isActive = buttonTheme === currentTheme;
    
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive.toString());
  });
}

/**
 * Announces theme change to screen readers via ARIA live region.
 * @param {string} theme - The new theme name
 */
function announceThemeChange(theme) {
  const liveRegion = document.getElementById('aria-live');
  if (liveRegion) {
    const message = theme === THEMES.SAGE 
      ? 'Theme changed to Sage (nature green)' 
      : 'Theme changed to Clay (terracotta warm)';
    liveRegion.textContent = message;
    setTimeout(() => { liveRegion.textContent = ''; }, 1000);
  }
}

/**
 * Checks if user prefers dark color scheme.
 * Currently not used but available for future dark mode support.
 * @returns {boolean} - True if user prefers dark mode
 */
export function prefersDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Checks if user prefers reduced motion.
 * @returns {boolean} - True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initializes the theme system.
 * Checks localStorage and system preferences for initial theme.
 * @returns {string} - The initial theme applied
 */
export function initTheme() {
  // Check localStorage first
  const storedTheme = localStorage.getItem('portfolio-theme');
  
  let initialTheme = DEFAULT_THEME;
  
  if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
    initialTheme = storedTheme;
  }
  
  // Apply theme without triggering announcements (initial load)
  currentTheme = initialTheme;
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeToggleUI();
  
  return initialTheme;
}

// Export theme constants for external use
export { THEMES };
