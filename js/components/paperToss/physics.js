/**
 * physics.js
 * Simple 2D physics engine for the paper toss game.
 * Handles gravity, velocity, wind, collision detection.
 * 
 * Usage:
 *   import { createPhysicsEngine } from './physics.js';
 *   const physics = createPhysicsEngine({ gravity: 0.5 });
 */

/**
 * Creates a new physics engine instance.
 * @param {Object} options - Physics configuration
 * @param {number} [options.gravity=0.3] - Gravity acceleration (tuned for fun gameplay)
 * @param {number} [options.friction=0.99] - Air friction (velocity multiplier)
 * @param {number} [options.bounceFactor=0.35] - Bounce dampening on collision
 * @returns {Object} - Physics engine API
 */
export function createPhysicsEngine(options = {}) {
  // Global throw power multiplier. Increases base speed for all power levels.
  const POWER_MULT = 1.2;
  const config = {
    gravity: options.gravity ?? 0.3,        // Tuned for satisfying arc
    friction: options.friction ?? 0.99,      // Subtle air resistance
    bounceFactor: options.bounceFactor ?? 0.35,
    minThrowSpeed: 8,                        // Minimum throw velocity
    maxThrowSpeed: 36,                       // Maximum throw velocity (adjusted for +20% power)
    powerScale: 1.8,                         // Multiplier for throw power
    // Resolution-independent power level to speed mapping
    // Power level is intuitive: bigger pull (Power 3) = stronger throw
    // Each power level maps to a lane distance with consistent reach
    // Tuned for skill-based learning: correct power + forgiving angle → 90%+ success
    // Lane distances from paper start (y=0.8h): A/Far=198px, B/Mid=108px, C/Near=18px
    powerToSpeed: {
      1: 12,    // Power 1 (small pull) → Near lane (C, 18px)
      2: 20,    // Power 2 (medium pull) → Mid lane (B, 108px)
      3: 30     // Power 3 (big pull) → Far lane (A, 198px)
    }
  };
  
  // Wind state - constant per round, low impact
  let wind = {
    enabled: false,
    speed: 0,      // -1.5 to 1.5 (capped low for beginner success)
    direction: 0,  // in degrees for display (0 = right, 180 = left)
    gustiness: 0   // No frame-by-frame randomness
  };
  
  return {
    /**
     * Sets wind parameters.
     * @param {number} speed - Wind speed (-3 to 3)
     */
    setWind(speed) {
      wind.enabled = speed !== 0;
      wind.speed = speed;
      wind.direction = speed >= 0 ? 0 : 180;
    },
    
    /**
     * Gets current wind state.
     * @returns {Object} - Wind state {enabled, speed, direction}
     */
    getWind() {
      return { ...wind };
    },
    
    /**
     * Randomizes wind for variety (capped low).
     * @param {number} maxSpeed - Maximum wind speed (default 1.5 for beginner success)
     */
    randomizeWind(maxSpeed = 1.5) {
      // Low wind impact so it doesn't prevent beginners from succeeding
      const speed = (Math.random() - 0.5) * 2 * maxSpeed;
      wind.gustiness = 0; // No per-frame randomness
      this.setWind(speed);
    },
    
    /**
     * Updates a projectile's position based on velocity, gravity, and wind.
     * @param {Object} projectile - Object with x, y, vx, vy properties
     * @param {number} deltaTime - Time since last update (normalized)
     * @returns {Object} - Updated projectile
     */
    updateProjectile(projectile, deltaTime = 1) {
      // Apply gravity to vertical velocity (stronger for better arc)
      projectile.vy += config.gravity * deltaTime;
      
      // Apply wind to horizontal velocity (more noticeable)
      if (wind.enabled) {
        const windEffect = wind.speed * 0.015 * deltaTime;
        // Add gustiness for variation
        const gust = (Math.random() - 0.5) * wind.gustiness * 0.02;
        projectile.vx += (windEffect + gust);
      }
      
      // Apply friction (subtle)
      projectile.vx *= config.friction;
      projectile.vy *= config.friction;
      
      // Update position
      projectile.x += projectile.vx * deltaTime;
      projectile.y += projectile.vy * deltaTime;
      
      // Add rotation based on velocity (more dramatic spin)
      projectile.rotation = (projectile.rotation || 0) + (projectile.vx * 0.08 + projectile.vy * 0.03);
      
      return projectile;
    },
    
    /**
     * Calculates initial velocity from drag gesture using discrete power level.
     * Power level is resolution-independent (1, 2, or 3).
     * @param {Object} start - Start position {x, y}
     * @param {Object} end - End position {x, y}
     * @param {number} time - Drag duration in ms
     * @param {Object} target - Target bin position {x, y}
     * @param {Object} paperStart - Paper starting position {x, y}
     * @param {number} powerLevel - Discrete power level (1, 2, or 3)
     * @returns {Object} - Velocity {vx, vy}
     */
    calculateThrowVelocity(start, end, time, target = null, paperStart = null, powerLevel = 1) {
      // Drag vector (gesture direction)
      let dx = end.x - start.x;
      let dy = end.y - start.y;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);
      
      // Minimum drag distance check
      if (dragDistance < 15) {
        return { vx: 0, vy: 0 };
      }
      
      // Determine forward direction (toward bin if available, else to the right)
      const forwardX = target && paperStart ? (target.x - paperStart.x) : 1;
      const forwardY = target && paperStart ? (target.y - paperStart.y) : 0;
      const forwardMag = Math.sqrt(forwardX * forwardX + forwardY * forwardY) || 1;
      const forwardUnitX = forwardX / forwardMag;
      const forwardUnitY = forwardY / forwardMag;
      
      // If dragging backward relative to forward direction, invert for slingshot
      const dragDotForward = dx * forwardUnitX + dy * forwardUnitY;
      if (dragDotForward < 0) {
        dx = -dx;
        dy = -dy;
      }
      
      // Normalize throw direction
      const dirX = dx / dragDistance;
      const dirY = dy / dragDistance;
      
      // Use power level to determine throw speed (resolution-independent)
      // Each power level maps to a specific speed for consistent lane reach
      const powerLevel_clamped = Math.max(1, Math.min(3, Math.floor(powerLevel || 1)));
      const baseSpeed = config.powerToSpeed[powerLevel_clamped] * POWER_MULT;
      
      // Calculate velocity components (canvas y increases downward)
      const vx = dirX * baseSpeed;
      const vy = dirY * baseSpeed;
      
      return {
        vx: Math.max(-config.maxThrowSpeed, Math.min(config.maxThrowSpeed, vx)),
        vy: Math.max(-36, Math.min(12, vy))
      };
    },
    
    /**
     * Checks if a point is inside a rectangle (for bin collision).
     * @param {Object} point - Point with x, y
     * @param {Object} rect - Rectangle with x, y, width, height
     * @returns {boolean} - True if point is inside rectangle
     */
    pointInRect(point, rect) {
      return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
      );
    },
    
    /**
     * Checks if a circle overlaps with a rectangle.
     * @param {Object} circle - Circle with x, y, radius
     * @param {Object} rect - Rectangle with x, y, width, height
     * @returns {boolean} - True if overlapping
     */
    circleRectCollision(circle, rect) {
      // Find closest point on rectangle to circle center
      const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
      const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
      
      // Calculate distance from closest point to circle center
      const dx = circle.x - closestX;
      const dy = circle.y - closestY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < circle.radius;
    },
    
    /**
     * Checks if projectile has entered the bin opening from above.
     * Forgiving collision for satisfying gameplay.
     * @param {Object} projectile - Projectile with x, y, radius
     * @param {Object} bin - Bin with x, y, width, openingWidth
     * @returns {boolean} - True if projectile entered bin
     */
    checkBinEntry(projectile, bin) {
      const openingLeft = bin.x + (bin.width - bin.openingWidth) / 2;
      const openingRight = openingLeft + bin.openingWidth;
      const openingTop = bin.y - 5; // Slightly above rim
      const openingBottom = bin.y + 40; // Deeper entry zone
      
      // More generous horizontal check (add radius for forgiveness)
      const effectiveLeft = openingLeft - projectile.radius * 0.3;
      const effectiveRight = openingRight + projectile.radius * 0.3;
      
      return (
        projectile.x >= effectiveLeft &&
        projectile.x <= effectiveRight &&
        projectile.y >= openingTop &&
        projectile.y <= openingBottom &&
        projectile.vy > -2 // Allow slight upward velocity
      );
    },
    
    /**
     * Checks and handles collision with bin rim (bounces off).
     * @param {Object} projectile - Projectile with x, y, vx, vy, radius
     * @param {Object} bin - Bin with x, y, width, height, openingWidth
     * @returns {boolean} - True if collision occurred
     */
    checkBinCollision(projectile, bin) {
      const rimThickness = 8;
      const openingLeft = bin.x + (bin.width - bin.openingWidth) / 2;
      const openingRight = openingLeft + bin.openingWidth;
      
      // Left rim of bin
      const leftRim = {
        x: bin.x,
        y: bin.y,
        width: (bin.width - bin.openingWidth) / 2,
        height: rimThickness
      };
      
      // Right rim of bin
      const rightRim = {
        x: openingRight,
        y: bin.y,
        width: (bin.width - bin.openingWidth) / 2,
        height: rimThickness
      };
      
      // Left side wall
      const leftWall = {
        x: bin.x,
        y: bin.y,
        width: rimThickness,
        height: bin.height
      };
      
      // Right side wall
      const rightWall = {
        x: bin.x + bin.width - rimThickness,
        y: bin.y,
        width: rimThickness,
        height: bin.height
      };
      
      const rims = [leftRim, rightRim, leftWall, rightWall];
      
      for (const rim of rims) {
        if (this.circleRectCollision({ ...projectile, radius: projectile.radius }, rim)) {
          // Bounce off
          if (rim === leftRim || rim === rightRim) {
            // Hit top rim - bounce up and away
            projectile.vy = -Math.abs(projectile.vy) * config.bounceFactor;
            if (rim === leftRim) {
              projectile.vx = -Math.abs(projectile.vx) * config.bounceFactor - 1;
            } else {
              projectile.vx = Math.abs(projectile.vx) * config.bounceFactor + 1;
            }
          } else {
            // Hit side wall - bounce horizontally
            projectile.vx = -projectile.vx * config.bounceFactor;
          }
          return true;
        }
      }
      
      return false;
    },
    
    /**
     * Checks and handles collision with ground (full screen width).
     * Paper bounces off ground with satisfying physics.
     * @param {Object} projectile - Projectile with x, y, vx, vy, radius
     * @param {Object} bin - Bin with x, y, width, height
     * @param {number} groundY - Y position of the ground
     * @param {Object} bounds - Screen bounds {width, height}
     * @returns {Object} - {collided: boolean, stopped: boolean}
     */
    checkGroundCollision(projectile, bin, groundY, bounds = null) {
      const groundLevel = groundY;
      
      if (projectile.y + projectile.radius >= groundLevel) {
        // Bounce off ground
        projectile.y = groundLevel - projectile.radius;
        projectile.vy = -Math.abs(projectile.vy) * config.bounceFactor;
        projectile.vx *= 0.75; // Ground friction
        
        // Add slight random variation to bounce for realism
        projectile.vx += (Math.random() - 0.5) * 0.3;
        
        // Check if stopped (low velocity)
        const speed = Math.sqrt(projectile.vx * projectile.vx + projectile.vy * projectile.vy);
        if (speed < 1.2) {
          projectile.vx = 0;
          projectile.vy = 0;
          return { collided: true, stopped: true };
        }
        return { collided: true, stopped: false };
      }
      return { collided: false, stopped: false };
    },
    
    /**
     * Checks if projectile is out of bounds (left/right sides only).
     * @param {Object} projectile - Projectile with x, y
     * @param {Object} bounds - Bounds with width, height
     * @returns {boolean} - True if out of bounds
     */
    isOutOfBounds(projectile, bounds) {
      const margin = 30;
      return (
        projectile.x < -margin ||
        projectile.x > bounds.width + margin
      );
    },
    
    /**
     * Gets the current configuration.
     * @returns {Object} - Current physics config
     */
    getConfig() {
      return { ...config };
    }
  };
}
