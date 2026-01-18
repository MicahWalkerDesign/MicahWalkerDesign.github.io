/**
 * game.js
 * Main Paper Toss game controller.
 * Handles game loop, input events, and game state.
 * 
 * Usage:
 *   import { PaperTossGame } from './components/paperToss/game.js';
 *   const game = new PaperTossGame(document.getElementById('game-canvas'));
 *   game.init();
 */

import { createPhysicsEngine } from './physics.js';
import { GameUI } from './ui.js';
import { t } from '../../i18n.js';

/**
 * Paper Toss Game class.
 * Manages the complete game lifecycle.
 */
export class PaperTossGame {
  /**
   * Creates a PaperTossGame instance.
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Object} [options] - Game configuration options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      maxThrows: options.maxThrows ?? 5,
      binWidth: options.binWidth ?? 58,
      binHeight: options.binHeight ?? 72,
      paperRadius: options.paperRadius ?? 14,
      enableWind: options.enableWind ?? true,
      ...options
    };
    
    // Initialize physics and UI
    this.physics = createPhysicsEngine();
    this.ui = new GameUI(canvas, this.ctx);
    
    // Debug mode (enabled via ?debug=1 in URL)
    this.debugMode = new URLSearchParams(window.location.search).has('debug');
    
    // Game state
    this.state = {
      score: 0,
      throwsRemaining: this.options.maxThrows,
      isPlaying: false,
      isGameOver: false,
      isDragging: false,
      dragStart: null,
      dragEnd: null,
      dragStartTime: null,
      powerLevel: 0,
      pull01: 0,
      showScoreTextUntil: 0,   // Timestamp when SCORE! text should stop showing
      hidePaperUntil: 0,        // Timestamp when paper should be hidden (disappear into bin)
      paperCaptured: false,     // Flag to indicate paper is being captured by bin
      captureStartTime: 0       // When capture animation started
    };
    
    // Callback for score changes
    this.onScoreChange = null;
    
    // Game objects
    this.paper = null;
    this.restingPaper = null; // Paper shown when not throwing
    this.bin = null;
    this.paperTrail = []; // Trail of positions for visual effect
    this.fireworks = []; // Active firework particles
    
    // Animation frame ID for cleanup
    this.animationFrameId = null;
    
    // Bind methods
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }
  
  /**
   * Initializes the game, sets up canvas and event listeners.
   */
  init() {
    this.setupCanvas();
    this.attachEventListeners();
    this.resetGame();
    
    // Log startup geometry once (for tuning verification)
    // Logging removed for production

    this.render();
  }
  
  /**
   * Sets up canvas size and scaling for high DPI displays.
   */
  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    
    // Set canvas internal size to match CSS size (1:1 pixel mapping)
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Store logical size for calculations
    this.width = rect.width;
    this.height = rect.height;
    
    // Ground level (where paper bounces)
    this.groundY = this.height * 0.72;
    
    // Maximum pull distance for slingshot (screen-independent normalization)
    // Normalized to canvas height for consistency across devices
    this.maxPullDistance = this.height * 0.5;
    
    // Three distance lanes for skill-based gameplay (vertical distance, not horizontal)
    // Lane letters (A/B/C) with intuitive distance labels for clarity
    // All lanes constrained to 0.25–0.50h band for consistent reachability
    // Power 3 → Lane A (far), Power 2 → Lane B (mid), Power 1 → Lane C (near)
    this.lanes = {
      A: { 
        centerY: this.height * 0.28,  // Far lane: 0.25–0.32h (highest, farthest from paper)
        minY: this.height * 0.25,
        maxY: this.height * 0.32
      },
      B: { 
        centerY: this.height * 0.38,  // Mid lane: 0.34–0.42h
        minY: this.height * 0.34,
        maxY: this.height * 0.42
      },
      C: { 
        centerY: this.height * 0.48,  // Near lane: 0.44–0.50h (lowest, nearest to paper at y=0.8h)
        minY: this.height * 0.44,
        maxY: this.height * 0.50
      }
    };
    
    // Place bin in one of the three lanes
    this.placeBinInLane();
    
    // Create resting paper position (bottom left)
    this.restingPaper = {
      x: this.width * 0.3,
      y: this.height * 0.8,
      radius: this.options.paperRadius,
      rotation: 0
    };
    
    // Handle window resize with debounce to prevent layout thrashing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.setupCanvas();
        this.render();
      }, 100);
    });
  }
  
  /**
   * Places bin randomly in one of the three distance lanes.
   * Each lane is a Y-range (depth), not X-range (horizontal).
   * Bin.x varies slightly around center; bin.y defines the throw distance.
   */
  placeBinInLane() {
    const laneKeys = Object.keys(this.lanes);
    const randomLane = laneKeys[Math.floor(Math.random() * laneKeys.length)];
    const lane = this.lanes[randomLane];
    
    // Randomize bin.y within lane bounds (with safety margin based on bin height)
    const safetyMarginY = this.options.binHeight / 2 + 10;  // Keep bin away from lane boundaries
    const clampedMinY = lane.minY + safetyMarginY;
    const clampedMaxY = lane.maxY - safetyMarginY;
    
    // Ensure min doesn't exceed max after safety margins
    const randomY = clampedMinY >= clampedMaxY 
      ? lane.centerY 
      : clampedMinY + Math.random() * (clampedMaxY - clampedMinY);
    
    // Randomize bin.x around center (small jitter for variety, ±8% of width)
    const centerX = this.width / 2;
    const jitterRange = this.width * 0.08;
    const randomX = centerX + (Math.random() - 0.5) * 2 * jitterRange;
    
    // Clamp X to viewport boundaries
    const clampedX = Math.max(
      this.options.binWidth / 2,
      Math.min(this.width - this.options.binWidth / 2, randomX)
    );
    
    this.bin = {
      x: clampedX - this.options.binWidth / 2,
      y: randomY,
      width: this.options.binWidth,
      height: this.options.binHeight,
      openingWidth: this.options.binWidth * 0.8,
      lane: randomLane,
      laneCenterY: lane.centerY  // For debug/tuning
    };
  }
  
  /**
   * Attaches mouse and touch event listeners to the canvas.
   */
  attachEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseUp);
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);
  }
  
  /**
   * Handles mouse down event - starts drag.
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseDown(event) {
    if (!this.state.isPlaying || this.state.isDragging) return;
    if (this.paper && this.paper.isFlying) return; // Can't drag while paper is flying
    
    const pos = this.getMousePosition(event);
    
    // Check if clicking on or near the resting paper
    const dx = pos.x - this.restingPaper.x;
    const dy = pos.y - this.restingPaper.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Allow clicking within paper radius + generous tolerance for small canvas
    if (distance <= this.restingPaper.radius + 30) {
      this.startDrag(pos);
    }
  }
  
  /**
   * Handles mouse move event - updates drag position.
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    if (!this.state.isDragging) return;
    
    const pos = this.getMousePosition(event);
    this.updateDrag(pos);
    this.render();
  }
  
  /**
   * Handles mouse up event - releases throw.
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseUp(event) {
    if (!this.state.isDragging) return;
    
    const pos = this.getMousePosition(event);
    this.endDrag(pos);
  }
  
  /**
   * Handles touch start event.
   * @param {TouchEvent} event - Touch event
   */
  handleTouchStart(event) {
    event.preventDefault();
    if (!this.state.isPlaying || this.state.isDragging) return;
    if (this.paper && this.paper.isFlying) return;
    
    const touch = event.touches[0];
    const pos = this.getTouchPosition(touch);
    
    // Check if touching on or near the resting paper
    const dx = pos.x - this.restingPaper.x;
    const dy = pos.y - this.restingPaper.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= this.restingPaper.radius + 15) {
      this.startDrag(pos);
    }
  }
  
  /**
   * Handles touch move event.
   * @param {TouchEvent} event - Touch event
   */
  handleTouchMove(event) {
    event.preventDefault();
    if (!this.state.isDragging) return;
    
    const touch = event.touches[0];
    const pos = this.getTouchPosition(touch);
    this.updateDrag(pos);
    this.render();
  }
  
  /**
   * Handles touch end event.
   * @param {TouchEvent} event - Touch event
   */
  handleTouchEnd(event) {
    if (!this.state.isDragging) return;
    this.endDrag(this.state.dragEnd);
  }
  
  /**
   * Gets mouse position relative to canvas.
   * @param {MouseEvent} event - Mouse event
   * @returns {Object} - Position {x, y}
   */
  getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  /**
   * Gets touch position relative to canvas.
   * @param {Touch} touch - Touch object
   * @returns {Object} - Position {x, y}
   */
  getTouchPosition(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
  
  /**
   * Starts a drag gesture for throwing.
   * @param {Object} pos - Position {x, y}
   */
  startDrag(pos) {
    this.state.isDragging = true;
    this.state.dragStart = pos;
    this.state.dragEnd = pos;
    this.state.dragStartTime = Date.now();
    this.state.powerLevel = 0;  // Will be calculated during drag
    
    // Paper stays at resting position during drag
    this.paper = null;
    
    this.render();
  }
  
  /**
   * Updates drag position during gesture and calculates power level.
   * Normalizes drag distance to resolution-independent pull factor (0-1).
   * @param {Object} pos - Position {x, y}
   */
  updateDrag(pos) {
    this.state.dragEnd = pos;
    
    // Calculate drag distance in screen pixels
    const dx = this.state.dragStart.x - pos.x;
    const dy = this.state.dragStart.y - pos.y;
    const dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize to 0-1 pull factor (resolution-independent)
    const pull01 = Math.min(dragDistance / this.maxPullDistance, 1.0);
    
    // Map to discrete power level based on pull factor thresholds
    if (pull01 < 0.33) {
      this.state.powerLevel = 1;
    } else if (pull01 < 0.66) {
      this.state.powerLevel = 2;
    } else {
      this.state.powerLevel = 3;
    }
    
    // Store pull factor for physics engine use
    this.state.pull01 = pull01;
  }
  
  /**
   * Ends drag gesture and throws the paper.
   * @param {Object} pos - End position {x, y}
   */
  endDrag(pos) {
    if (!this.state.isDragging) return;
    
    const dragTime = Date.now() - this.state.dragStartTime;
    
    // Calculate bin center as target
    const binTarget = {
      x: this.bin.x + this.bin.width / 2,
      y: this.bin.y
    };
    
    // Paper starting position for physics calculation
    const paperStart = {
      x: this.restingPaper.x,
      y: this.restingPaper.y
    };
    
    // Calculate throw velocity based on drag direction and power
    const velocity = this.physics.calculateThrowVelocity(
      this.state.dragStart,
      pos,
      dragTime,
      binTarget,
      paperStart,
      this.state.powerLevel  // Pass discrete power level (1, 2, or 3)
    );
    
    // Only throw if there's enough drag distance
    const dx = this.state.dragStart.x - pos.x;
    const dy = this.state.dragStart.y - pos.y;
    const dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    if (dragDistance >= 15) {
      // Create and launch the paper
      this.paper = {
        x: this.restingPaper.x,
        y: this.restingPaper.y,
        vx: velocity.vx,
        vy: velocity.vy,
        radius: this.options.paperRadius,
        rotation: 0,
        isFlying: true
      };
      
      // Track previous position for scoring validation
      this.prevPaperY = this.paper.y;
      this.scoredThisThrow = false;  // Latch to prevent double-scoring
      this.validEntry = false;  // Reset valid entry flag for new throw
      this.state.paperCaptured = false;  // Reset capture flag
      
      this.state.throwsRemaining--;
      
      // Start game loop
      if (!this.animationFrameId) {
        this.gameLoop();
      }
    }
    
    this.state.isDragging = false;
    this.state.dragStart = null;
    this.state.dragEnd = null;
    
    // Start game loop if not already running
    if (!this.animationFrameId) {
      this.gameLoop();
    }
  }
  
  /**
   * Main game loop - updates physics and renders.
   */
  gameLoop() {
    if (!this.paper || !this.paper.isFlying) {
      this.animationFrameId = null;
      return;
    }
    
    // Store paper position for trail effect
    this.paperTrail.push({
      x: this.paper.x,
      y: this.paper.y,
      time: Date.now(),
      rotation: this.paper.rotation
    });
    
    // Keep trail manageable (last 15 positions)
    if (this.paperTrail.length > 15) {
      this.paperTrail.shift();
    }
    
    // Update physics
    this.physics.updateProjectile(this.paper);
    
    // Check for scoring: valid entry required (swish through opening OR rim bounce-in)
    if (!this.scoredThisThrow) {
      // Define bin opening bounds
      const binCenterX = this.bin.x + this.bin.width / 2;
      const openingWidth = this.bin.openingWidth || this.bin.width * 0.8;
      const openLeft = binCenterX - openingWidth / 2;
      const openRight = binCenterX + openingWidth / 2;
      const rimY = this.bin.y;
      
      // CONDITION A: Crossing entry (swish through opening)
      if (this.prevPaperY < rimY && this.paper.y >= rimY) {
        if (this.paper.x >= openLeft && this.paper.x <= openRight) {
          // Valid entry achieved - paper crossed rim plane downward within opening
          this.validEntry = true;
          this.handleScore();
        }
      }
      // CONDITION B: Rim bounce entry (contact with rim region near opening + downward motion)
      else if (!this.validEntry) {
        const rimBand = 15;  // Thin band around rim for contact detection
        const withinRimBand = Math.abs(this.paper.y - rimY) < rimBand;
        const withinOpening = this.paper.x >= openLeft && this.paper.x <= openRight;
        const movingDownward = this.paper.vy > -2;  // Near-downward or downward velocity
        
        if (withinRimBand && withinOpening && movingDownward) {
          // Valid entry via rim bounce
          this.validEntry = true;
          this.handleScore();
        }
      }
    }
    
    // Update previous position for next frame
    this.prevPaperY = this.paper.y;
    
    // Handle paper capture animation (paper falls into bin after scoring)
    if (this.state.paperCaptured) {
      this.updateCaptureAnimation();
    }
    // Only check collisions if paper is NOT captured
    else if (this.physics.checkBinCollision(this.paper, this.bin)) {
      // Paper bounced off bin rim - continues flying
    }
    // Check for ground collision (full screen width)
    else if (!this.state.paperCaptured) {
      const groundResult = this.physics.checkGroundCollision(
        this.paper, 
        this.bin, 
        this.groundY,
        { width: this.width, height: this.height }
      );
      
      if (groundResult.stopped) {
        // Paper has come to rest on the ground
        // Floor-only blocking: if paper hits floor without valid rim entry, no score
        // (validEntry flag ensures rim bounce-ins can score even after touching floor)
        if (!this.scoredThisThrow && this.validEntry) {
          // Paper entered via rim but didn't score yet (unlikely but possible)
          // Still no score - must be fully inside to count
        }
        this.paper = null;
        this.paperTrail = []; // Clear trail
      }
      // Check if out of bounds (left/right only)
      else if (this.physics.isOutOfBounds(this.paper, { width: this.width, height: this.height })) {
        this.paper = null;
        this.paperTrail = []; // Clear trail
      }
    }
    
    // Render current frame
    this.render();
    
    // Check for game over
    if (!this.paper && this.state.throwsRemaining <= 0) {
      this.endGame();
      return;
    }
    
    // Continue loop if paper is still flying
    if (this.paper && this.paper.isFlying) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    } else {
      this.animationFrameId = null;
    }
  }
  
  /**
   * Renders the current game state to the canvas.
   */
  render() {
    this.ui.clear();
    this.ui.drawBackground(this.groundY / this.height);
    
    // Draw subtle SCORE! text behind gameplay if active
    if (Date.now() < this.state.showScoreTextUntil) {
      this.drawScoreText();
    }
    
    this.ui.drawBin(this.bin);
    this.ui.drawScore(this.state.score);
    
    // Draw wind indicator if wind is enabled
    if (this.options.enableWind) {
      const wind = this.physics.getWind();
      this.ui.drawWindIndicator(wind);
    }
    
    // Draw paper trail if paper is flying
    if (this.paper && this.paper.isFlying && this.paperTrail.length > 0) {
      this.ui.drawPaperTrail(this.paperTrail);
    }
    
    // Draw paper trail if paper is flying
    // (already drawn above)
    
    // Draw paper if exists and flying (show during capture to see it fall into bin)
    if (this.paper && this.paper.isFlying) {
      this.ui.drawPaper(this.paper, false);
    }
    // Draw resting paper when game is playing and not dragging
    else if (this.state.isPlaying && !this.state.isGameOver && !this.state.isDragging && this.state.throwsRemaining > 0) {
      this.ui.drawPaper(this.restingPaper, false);
    }
    // Draw paper with highlight during drag
    else if (this.state.isDragging) {
      this.ui.drawPaper(this.restingPaper, true);
    }
    
    // Draw trajectory guide during drag
    if (this.state.isDragging && this.state.dragEnd) {
      this.ui.drawTrajectoryGuide(
        this.state.dragStart,
        this.state.dragEnd
      );
    }
    
    // Draw instructions
    if (this.state.isPlaying && !this.paper && this.state.throwsRemaining > 0) {
      this.ui.drawInstructions(t('game.instructions'));
    }
    
    // Draw throws remaining
    if (this.state.isPlaying) {
      this.drawThrowsRemaining();
    }
    
    // Draw debug info (only if ?debug=1 in URL)
    if (this.debugMode && this.state.isPlaying) {
      this.drawDebugInfo();
    }
    
    // Draw game over overlay
    if (this.state.isGameOver) {
      this.ui.drawGameOver(this.state.score);
    }
  }
  
  /**
   * Draws landing marks that fade over time.
   */
  /**
   * Handles scoring: increments score, hides paper into bin, shows SCORE! text.
   */
  handleScore() {
    this.state.score++;
    this.scoredThisThrow = true;
    
    const now = Date.now();
    this.state.showScoreTextUntil = now + 500;  // Show SCORE! text for 0.5s
    this.state.paperCaptured = true;  // Enable capture mode
    this.state.captureStartTime = now;  // Start capture animation
    
    this.announceScore();
    if (this.onScoreChange) this.onScoreChange(this.state.score);
  }

  /**
   * Updates paper capture animation - lerps paper into bin center and downward.
   */
  updateCaptureAnimation() {
    const now = Date.now();
    const elapsed = now - this.state.captureStartTime;
    const captureDuration = 500;  // 0.5 seconds
    
    if (elapsed >= captureDuration) {
      // Capture complete - reset paper
      this.paper = null;
      this.paperTrail = [];
      this.state.paperCaptured = false;
      return;
    }
    
    // Lerp paper toward bin center
    const binCenterX = this.bin.x + this.bin.width / 2;
    const binBottomY = this.bin.y + this.bin.height;
    const lerpFactor = 0.15;  // Smooth interpolation
    
    this.paper.x += (binCenterX - this.paper.x) * lerpFactor;
    this.paper.y += 4;  // Fall downward into bin
    
    // Reduce velocity to simulate capture
    this.paper.vx *= 0.85;
    this.paper.vy = Math.min(this.paper.vy, 2);  // Cap downward velocity
    
    // Hide paper once it's deep in the bin
    if (this.paper.y > binBottomY - 10) {
      this.paper = null;
      this.paperTrail = [];
      this.state.paperCaptured = false;
    }
  }

  /**
   * Draws subtle SCORE! text in background during score animation.
   */
  drawScoreText() {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillStyle = 'rgba(100, 180, 100, 0.15)';  // Subtle green, low opacity
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = this.width / 2;
    const centerY = this.height * 0.35;  // Upper-middle area
    
    ctx.fillText('SCORE!', centerX, centerY);
    ctx.restore();
  }

  /**
   * Draws the number of throws remaining.
   */
  drawThrowsRemaining() {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#5a4a3a';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Throws: ${this.state.throwsRemaining}/${this.options.maxThrows}`,
      this.width - 12,
      24
    );
  }
  
  
  /**
   * Draws debug info overlay (only visible when ?debug=1 in URL).
   * Shows current lane, selected power, and baseSpeed for tuning.
   */
  drawDebugInfo() {
    if (!this.bin) return;
    
    const ctx = this.ctx;
    const physicsConfig = this.physics.getConfig();
    const baseSpeed = physicsConfig.powerToSpeed?.[this.state.powerLevel] || 0;
    
    // Debug text overlay
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    
    const debugLines = [
      `Lane: ${this.bin.lane}`,
      `Power: ${this.state.powerLevel}`,
      `Speed: ${baseSpeed}`,
      `Pull: ${(this.state.pull01 * 100).toFixed(0)}%`
    ];
    
    let y = 60;
    for (const line of debugLines) {
      ctx.fillText(line, 12, y);
      y += 14;
    }
    
    ctx.restore();
  }
  
  /**
   * Updates and draws all active firework particles.
   */
  drawFireworks() {
    const ctx = this.ctx;
    
    // Update and draw each particle
    this.fireworks = this.fireworks.filter(particle => {
      particle.life--;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.15; // Gravity on particles
      
      // Draw particle with fading opacity
      const opacity = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(255, 165, 0, ${opacity})`;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      
      return particle.life > 0;
    });
  }
  
  /**
   * Announces score change to screen readers.
   */
  announceScore() {
    const liveRegion = document.getElementById('aria-live');
    if (liveRegion) {
      liveRegion.textContent = `${t('game.score')}: ${this.state.score}`;
      setTimeout(() => { liveRegion.textContent = ''; }, 500);
    }
  }
  
  /**
   * Triggers a firework burst at the given position.
   * Creates 14 particles that burst outward and fade over 28 frames.
   */
  triggerFirework(x, y) {
    const particleCount = 14;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 2;
      this.fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 28,
        maxLife: 28
      });
    }
  }
  
  /**
   * Starts a new game.
   */
  startGame() {
    this.resetGame();
    this.state.isPlaying = true;
    
    // Randomize wind for this game session (more dramatic)
    if (this.options.enableWind) {
      this.physics.randomizeWind(2.5);
    }
    
    this.render();
  }
  
  /**
   * Resets game state to initial values.
   */
  resetGame() {
    this.state.score = 0;
    this.state.throwsRemaining = this.options.maxThrows;
    this.state.isPlaying = false;
    this.state.isGameOver = false;
    this.state.isDragging = false;
    this.paper = null;
    this.paperTrail = []; // Clear paper trail
    this.fireworks = []; // Clear fireworks
    
    // Place bin in a new lane for the next round
    if (this.lanes) {
      this.placeBinInLane();
    }
    
    // Reset score display
    if (this.onScoreChange) this.onScoreChange(0);
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Ends the current game and shows offer modal.
   */
  endGame() {
    this.state.isPlaying = false;
    this.state.isGameOver = true;
    this.render();
    
    // Show offer modal after short delay
    setTimeout(() => {
      this.ui.showOfferModal(this.state.score, (offerText) => {
        // Offer submitted successfully
      });
    }, 1500);
  }
  
  /**
   * Cleans up event listeners and animation frames.
   */
  destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}