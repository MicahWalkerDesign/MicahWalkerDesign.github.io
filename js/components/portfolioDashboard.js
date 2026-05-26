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
  dom.footer = document.getElementById('project-footer');

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

  // Clear footer first
  if (dom.footer) dom.footer.innerHTML = '';

  // --- Middle Column: Device Viewport ---
  if (dom.skeleton) dom.skeleton.classList.add('active');

  // Hide all existing media elements
  const existingImg = dom.viewport && dom.viewport.querySelector('.device-screenshot');
  const existingAbstract = dom.viewport && dom.viewport.querySelector('.device-abstract');
  if (existingImg) existingImg.style.display = 'none';
  if (existingAbstract) existingAbstract.style.display = 'none';
  if (dom.video) { dom.video.style.display = 'none'; dom.video.pause && dom.video.pause(); }
  if (dom.iframe) { dom.iframe.style.display = 'none'; dom.iframe.src = 'about:blank'; }
  const existingCarousel = dom.viewport && dom.viewport.querySelector('.youtube-carousel');
  if (existingCarousel) existingCarousel.style.display = 'none';

  // Switch Frame Type
  if (dom.viewport) {
    dom.viewport.className = 'device-frame';
    const existingChrome = dom.viewport.querySelector('.browser-chrome');
    if (project.deviceType === 'iphone' || project.deviceType === 'abstract') {
      if (existingChrome) existingChrome.remove();
      if (project.deviceType === 'abstract') {
        dom.viewport.classList.add('device-frame--abstract');
      } else {
        dom.viewport.classList.add('device-frame--iphone');
      }
    } else {
      dom.viewport.classList.add('device-frame--browser');
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

  // --- RENDER CENTER CONTENT ---

  if (project.deviceType === 'abstract' && project.abstracts) {
    // Abstract text panel (no iframe)
    let abstractEl = dom.viewport && dom.viewport.querySelector('.device-abstract');
    if (!abstractEl) {
      abstractEl = document.createElement('div');
      abstractEl.className = 'device-abstract';
      dom.viewport.appendChild(abstractEl);
    }
    abstractEl.innerHTML = project.abstracts.map(a => `
      <div class="abstract-card">
        <div class="abstract-card__title">${a.title}</div>
        <div class="abstract-card__subtitle">${a.subtitle}</div>
        <p class="abstract-card__summary">${a.summary}</p>
        <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="abstract-card__link">
          Read in ${a.journal} →
        </a>
      </div>
    `).join('');
    abstractEl.style.display = 'block';
    if (dom.skeleton) dom.skeleton.classList.remove('active');

  } else if (project.imageUrl) {
    // Static image in phone frame
    let imgEl = dom.viewport && dom.viewport.querySelector('.device-screenshot');
    if (!imgEl) {
      imgEl = document.createElement('img');
      imgEl.className = 'device-screenshot';
      dom.viewport.appendChild(imgEl);
    }
    imgEl.src = project.imageUrl;
    imgEl.alt = getLocalizedValue(project.title, lang) + ' screenshot';
    imgEl.style.display = 'block';
    imgEl.onload = () => { if (dom.skeleton) dom.skeleton.classList.remove('active'); };
    imgEl.onerror = () => { if (dom.skeleton) dom.skeleton.classList.remove('active'); };

  } else if (project.embedUrl && dom.iframe) {
    // Website iframe
    dom.iframe.style.display = 'block';
    if (dom.iframe.src !== project.embedUrl) {
      dom.iframe.src = project.embedUrl;
      dom.iframe.onload = () => { if (dom.skeleton) dom.skeleton.classList.remove('active'); };
    } else {
      if (dom.skeleton) dom.skeleton.classList.remove('active');
    }

  } else if (project.youtubeIds && project.youtubeIds.length > 0) {
    let carousel = dom.viewport && dom.viewport.querySelector('.youtube-carousel');
    if (!carousel) {
      carousel = document.createElement('div');
      carousel.className = 'youtube-carousel';
      dom.viewport.appendChild(carousel);
    }
    carousel.style.display = 'flex';
    renderYouTubeCarousel(carousel, project.youtubeIds);
    if (dom.skeleton) dom.skeleton.classList.remove('active');

  } else if (dom.video) {
    dom.video.style.display = 'block';
    dom.video.style.opacity = '0';
    setTimeout(() => {
      dom.video.src = project.videoUrl || '';
      dom.video.load();
      dom.video.play().catch(() => {});
      dom.video.onloadeddata = () => {
        if (dom.skeleton) dom.skeleton.classList.remove('active');
        dom.video.style.opacity = '1';
      };
      dom.video.onerror = () => { if (dom.skeleton) dom.skeleton.classList.remove('active'); };
    }, 200);
  } else {
    if (dom.skeleton) dom.skeleton.classList.remove('active');
  }

  // --- Right Column: Story Panel ---
  const rolesEl = dom.container.querySelector('.story-panel__roles');
  if (rolesEl) rolesEl.textContent = project.category || '';

  if (dom.storyContent) {
    dom.storyContent.innerHTML = '';

    // Why & Result
    ['why', 'result'].forEach((key, index) => {
      const labels = { why: 'The Why', result: 'The Result' };
      if (project.story && project.story[key]) {
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

    // App Store button (story panel only)
    if (project.appStoreUrl) {
      const appBtn = document.createElement('a');
      appBtn.href = project.appStoreUrl;
      appBtn.target = '_blank';
      appBtn.rel = 'noopener noreferrer';
      appBtn.className = 'story-appstore-btn';
      appBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> View on App Store`;
      dom.storyContent.appendChild(appBtn);
    }
  }

  // Power Tags
  if (dom.powerTags) {
    dom.powerTags.innerHTML = '';
    (project.powerTags || []).forEach((tag, i) => {
      const span = document.createElement('span');
      span.className = 'power-tag badge';
      span.style.animationDelay = `${i * 50}ms`;
      span.textContent = tag;
      dom.powerTags.appendChild(span);
    });
  }

  // --- Footer: Learnings / Papers / Channel ---
  if (!dom.footer) return;

  if (project.learnings && project.learnings.length > 0) {
    // App projects: horizontal learnings grid
    const label = document.createElement('div');
    label.className = 'project-footer__label';
    label.textContent = 'Learnings by Role';
    dom.footer.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'footer-learnings';
    project.learnings.forEach(item => {
      const card = document.createElement('div');
      card.className = 'footer-learning-card';
      const bullets = item.points.map(p => `<li>${p}</li>`).join('');
      card.innerHTML = `
        <div class="footer-learning-card__role">${item.role}</div>
        <ul class="footer-learning-card__points">${bullets}</ul>
      `;
      grid.appendChild(card);
    });
    dom.footer.appendChild(grid);

  } else if (project.papers && project.papers.length > 0) {
    // Research: paper links in footer
    const label = document.createElement('div');
    label.className = 'project-footer__label';
    label.textContent = 'Published Research';
    dom.footer.appendChild(label);

    const linksRow = document.createElement('div');
    linksRow.className = 'footer-papers';
    project.papers.forEach(paper => {
      const a = document.createElement('a');
      a.href = paper.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'footer-paper-link';
      a.innerHTML = `<span class="footer-paper-link__title">${paper.title}</span><span class="footer-paper-link__journal">${paper.journal}</span>`;
      linksRow.appendChild(a);
    });
    dom.footer.appendChild(linksRow);

  } else if (project.channelUrl) {
    // Movement / YouTube: channel link + tags in footer
    const label = document.createElement('div');
    label.className = 'project-footer__label';
    label.textContent = 'Links & Skills';
    dom.footer.appendChild(label);

    const row = document.createElement('div');
    row.className = 'footer-links-row';

    const chanBtn = document.createElement('a');
    chanBtn.href = project.channelUrl;
    chanBtn.target = '_blank';
    chanBtn.rel = 'noopener noreferrer';
    chanBtn.className = 'story-appstore-btn';
    chanBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube Channel`;
    row.appendChild(chanBtn);

    if (project.embedUrl) {
      const siteBtn = document.createElement('a');
      siteBtn.href = project.embedUrl;
      siteBtn.target = '_blank';
      siteBtn.rel = 'noopener noreferrer';
      siteBtn.className = 'story-appstore-btn story-appstore-btn--secondary';
      siteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Visit Website`;
      row.appendChild(siteBtn);
    }

    dom.footer.appendChild(row);
  }
}

/**
 * Renders the YouTube carousel content (Facade + Nav)
 */
function renderYouTubeCarousel(container, videoIds) {
  let currentIndex = 0;
  let player = null;

  // Load YouTube API if not present
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Render Frame
  const renderFrame = (autoPlay = false) => {
    const videoId = videoIds[currentIndex];

    // Cleanup previous player
    if (player) {
      player.destroy();
      player = null;
    }

    // HTML Structure
    container.innerHTML = `
      <div class="youtube-embed-wrapper" id="yt-wrapper-${videoId}">
        <div id="player-${videoId}" class="youtube-iframe"></div>
        ${!autoPlay ? `
        <div class="youtube-facade" id="facade-${videoId}" style="background-image: url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg');">
          <div class="play-button"></div>
        </div>` : ''}
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

    const initPlayer = () => {
      // Ensure API is ready
      if (!window.YT || !window.YT.Player) {
        window.onYouTubeIframeAPIReady = () => initPlayer();
        return;
      }

      // If player already exists, don't re-init
      if (player) return;

      const facade = document.getElementById(`facade-${videoId}`);
      if (facade) facade.style.display = 'none';

      player = new YT.Player(`player-${videoId}`, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'autoplay': 1,
          'controls': 1,
          'rel': 0,
          'modestbranding': 1,
          'mute': 1 // Mute required for browser autoplay policy
        },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Auto-play logic: Check for visibility using IntersectionObserver
    // If autoPlay arg is true (from sequential play), init immediately.
    // Otherwise, wait for scroll or click.
    if (autoPlay) {
      setTimeout(initPlayer, 100);
    } else {
      // Observer for "Autoplay on Scroll"
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            initPlayer();
            observer.disconnect(); // Only trigger once per carousel load
          }
        });
      }, { threshold: 0.5 });

      observer.observe(container);

      // Keep click listener just in case or for immediate interaction
      const facade = document.getElementById(`facade-${videoId}`);
      if (facade) {
        facade.addEventListener('click', () => {
          initPlayer();
        });
      }
    }

    // Attach Nav Listeners
    if (videoIds.length > 1) {
      container.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
        renderFrame(false); // Manual nav stops autoplay chain usually, or resets to facade
      });
      container.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % videoIds.length;
        renderFrame(false);
      });
    }
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.ENDED is 0
    if (event.data === 0) {
      // Video ended, auto-advance
      currentIndex = (currentIndex + 1) % videoIds.length;
      renderFrame(true); // Auto-play next
    }
  };

  renderFrame(false);
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
