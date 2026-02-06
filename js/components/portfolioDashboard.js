/**
 * portfolioDashboard.js
 * Handles the logic for the "Block Style" interactive dashboard.
 * Manages state for active project, device frames, and story panels.
 */

import { getCurrentLanguage, t } from '../i18n.js';

// State
let projects = [];
let activeProjectId = null;

// DOM Elements cache
let dom = {
  container: null,
  nav: null,
  viewport: null,
  video: null,
  storyHeader: null,
  storyContent: null,
  powerTags: null,
  skeleton: null
};

/**
 * Initializes the dashboard
 */
export async function initDashboard() {
  dom.container = document.querySelector('.portfolio-dashboard');
  if (!dom.container) return;

  // Cache DOM elements based on the new structure in index.html
  dom.nav = dom.container.querySelector('.project-nav');
  dom.viewport = dom.container.querySelector('.device-frame');
  dom.video = dom.container.querySelector('.device-video');
  dom.iframe = dom.container.querySelector('.device-iframe'); // Cache Iframe
  dom.storyHeader = dom.container.querySelector('.story-panel__header');
  dom.storyContent = dom.container.querySelector('.story-panel__content');
  dom.powerTags = dom.container.querySelector('.power-tags');
  dom.skeleton = dom.container.querySelector('.viewport-skeleton');

  try {
    const data = await loadPortfolioData();
    projects = data.projects || [];

    if (projects.length === 0) {
      console.warn('No projects found');
      return;
    }

    // Initialize with first project or featured one
    // We can prioritize p1 (App) or p2 (Web)
    const initial = projects.find(p => p.id === 'p1') || projects[0];
    activeProjectId = initial.id;

    renderProjectNav();
    updateDashboard(initial);

  } catch (error) {
    console.error('Failed to init dashboard:', error);
  }
}

/**
 * Loads data from JSON
 */
async function loadPortfolioData() {
  const response = await fetch('assets/portfolio.json');
  if (!response.ok) throw new Error('Failed to load data');
  return await response.json();
}

/**
 * Renders the Left Column (Project Navigation)
 */
function renderProjectNav() {
  if (!dom.nav) return;
  dom.nav.innerHTML = '';
  const lang = getCurrentLanguage();

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = `project-nav__card ${project.id === activeProjectId ? 'active' : ''}`;
    card.dataset.id = project.id;
    card.role = 'button';
    card.tabIndex = 0;
    card.setAttribute('aria-label', `View project ${getLocalizedValue(project.title, lang)}`);

    const title = getLocalizedValue(project.title, lang);

    card.innerHTML = `
      <div class="project-nav__title">${title}</div>
      <div class="project-nav__category">${project.category || 'Project'}</div>
    `;

    // Click Event
    card.addEventListener('click', () => handleProjectSwitch(project.id));

    // Keyboard Event
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProjectSwitch(project.id);
      }
    });

    dom.nav.appendChild(card);
  });
}

/**
 * Handles switching active project
 */
function handleProjectSwitch(id) {
  if (activeProjectId === id) return;
  activeProjectId = id;

  // 1. Update Nav UI
  document.querySelectorAll('.project-nav__card').forEach(card => {
    if (card.dataset.id === id) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // 2. Update Content
  const project = projects.find(p => p.id === id);
  if (project) {
    updateDashboard(project);
  }
}

/**
 * Updates the Center and Right columns
 */
function updateDashboard(project) {
  const lang = getCurrentLanguage();

  // --- Middle Column: Device Viewport ---

  // Show skeleton while loading
  if (dom.skeleton) dom.skeleton.classList.add('active');

  // Switch Frame Type
  if (dom.viewport) {
    dom.viewport.className = 'device-frame'; // reset
    dom.viewport.classList.add(`device-frame--${project.deviceType || 'browser'}`);

    // Manage Browser Chrome
    const existingChrome = dom.viewport.querySelector('.browser-chrome');
    if (project.deviceType === 'iphone') {
      if (existingChrome) existingChrome.remove();
    } else {
      // Ensure browser chrome exists
      if (!existingChrome) {
        const chrome = document.createElement('div');
        chrome.className = 'browser-chrome';
        chrome.innerHTML = `
          <div class="browser-dot red"></div>
          <div class="browser-dot yellow"></div>
          <div class="browser-dot green"></div>
        `;
        dom.viewport.insertBefore(chrome, dom.viewport.firstChild);
      }
    }
  }

  // Handle Embed vs Video vs YouTube Carousel
  if (project.youtubeIds && project.youtubeIds.length > 0) {
    // Show Carousel
    if (dom.video) { dom.video.style.display = 'none'; dom.video.pause(); }
    if (dom.iframe) dom.iframe.style.display = 'none';

    // Check if carousel already exists
    let carousel = dom.viewport.querySelector('.youtube-carousel');
    if (!carousel) {
      carousel = document.createElement('div');
      carousel.className = 'youtube-carousel';
      dom.viewport.appendChild(carousel);
    }
    carousel.style.display = 'flex';

    // Render Carousel Content
    renderYouTubeCarousel(carousel, project.youtubeIds);
    if (dom.skeleton) dom.skeleton.classList.remove('active');

  } else if (project.embedUrl && dom.iframe) {
    // Show Iframe
    const carousel = dom.viewport.querySelector('.youtube-carousel');
    if (carousel) carousel.style.display = 'none';

    if (dom.video) {
      dom.video.style.display = 'none';
      dom.video.pause();
    }

    dom.iframe.style.display = 'block';

    // Only reload if source changed to avoid flickering
    if (dom.iframe.src !== project.embedUrl) {
      dom.iframe.src = project.embedUrl;
      dom.iframe.onload = () => {
        if (dom.skeleton) dom.skeleton.classList.remove('active');
      };
    } else {
      if (dom.skeleton) dom.skeleton.classList.remove('active');
    }

  } else if (dom.video) {
    // Show Video
    const carousel = dom.viewport.querySelector('.youtube-carousel');
    if (carousel) carousel.style.display = 'none';

    if (dom.iframe) {
      dom.iframe.style.display = 'none';
      dom.iframe.src = 'about:blank';
    }
    dom.video.style.display = 'block';

    dom.video.style.opacity = '0';

    setTimeout(() => {
      dom.video.src = project.videoUrl || '';
      dom.video.load();
      dom.video.play().catch(() => { });
      dom.video.onloadeddata = () => {
        dom.skeleton.classList.remove('active');
        dom.video.style.opacity = '1';
      };
      dom.video.onerror = () => {
        dom.skeleton.classList.remove('active');
      };
    }, 200);
  }

  // --- Right Column: Story Panel ---
  if (dom.storyContent && project.story) {
    dom.storyContent.innerHTML = ''; // Clear previous

    const sections = ['why', 'result'];
    const labels = {
      why: 'The Why',
      result: 'The Result'
    };

    sections.forEach((key, index) => {
      if (project.story[key]) {
        const text = getLocalizedValue(project.story[key], lang);
        const section = document.createElement('div');
        section.className = 'story-section reveal';
        section.style.animationDelay = `${index * 100}ms`;

        section.innerHTML = `
          <div class="story-section__label">${labels[key]}</div>
          <p class="story-section__text">${text}</p>
        `;
        dom.storyContent.appendChild(section);
      }
    });
  }

  // Update Power Tags
  if (dom.powerTags) {
    dom.powerTags.innerHTML = '';
    const tags = project.powerTags || [];
    tags.forEach((tag, index) => {
      const span = document.createElement('span');
      span.className = 'power-tag';
      span.textContent = tag;
      span.style.animationDelay = `${index * 50}ms`;
      span.classList.add('badge');
      dom.powerTags.appendChild(span);
    });
  }
}

/**
 * Renders the YouTube carousel content (Facade + Nav)
 */
function renderYouTubeCarousel(container, videoIds) {
  let currentIndex = 0;

  // Render Frame
  const renderFrame = () => {
    const videoId = videoIds[currentIndex];

    // Check if we have an active iframe already to avoid reloading if possible
    // But for carousel, we likely need to swap content.
    // Facade approach is best for performance.

    container.innerHTML = `
      <div class="youtube-embed-wrapper" id="yt-wrapper-${videoId}">
        <div class="youtube-facade" style="background-image: url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg');" onclick="this.style.display='none'; document.getElementById('yt-frame-${videoId}').src='https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1';">
          <div class="play-button"></div>
        </div>
        <iframe id="yt-frame-${videoId}" class="youtube-iframe" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
      
      ${videoIds.length > 1 ? `
      <div class="carousel-nav">
        <button class="carousel-btn prev-btn" aria-label="Previous video">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="carousel-dots">
          ${videoIds.map((_, i) => `<div class="carousel-dot ${i === currentIndex ? 'active' : ''}"></div>`).join('')}
        </div>
        <button class="carousel-btn next-btn" aria-label="Next video">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>` : ''}
    `;

    // Attach Listeners
    if (videoIds.length > 1) {
      container.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
        renderFrame();
      });
      container.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % videoIds.length;
        renderFrame();
      });
    }
  };

  renderFrame();
}

/**
 * Public method to refresh UI when language changes
 */
export function refreshDashboard() {
  const lang = getCurrentLanguage();
  renderProjectNav();
  if (activeProjectId) {
    const project = projects.find(p => p.id === activeProjectId);
    if (project) updateDashboard(project);
  }
}

/**
 * Helper for localization
 */
function getLocalizedValue(obj, lang) {
  if (typeof obj === 'string') return obj;
  if (!obj) return '';
  return obj[lang] || obj.en || '';
}
