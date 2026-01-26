/**
 * ui.js
 * UI rendering and offer modal for the paper toss game.
 * Handles canvas drawing, score display, and offer form.
 * 
 * Usage:
 *   import { GameUI } from './ui.js';
 *   const ui = new GameUI(canvas, ctx);
 */

import { openModal, closeModal } from '../modal.js';
import { t, getCurrentLanguage } from '../../i18n.js';

/**
 * Game UI class for rendering game elements and handling offer modal.
 */
export class GameUI {
  /**
   * Creates a GameUI instance.
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Clears the canvas for the next frame.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the background with earthy theme colors.
   * @param {number} [groundLevel] - Optional ground Y position (0-1 ratio)
   */
  drawBackground(groundLevel = 0.75) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const groundY = height * groundLevel;

    // Sky gradient - warm earthy tones matching Clay theme
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, groundY);
    skyGradient.addColorStop(0, '#D8CFC4');   // Warm cream
    skyGradient.addColorStop(0.5, '#C9BAA8'); // Warm tan
    skyGradient.addColorStop(1, '#B8A490');   // Earthy beige

    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, width, groundY);

    // Ground gradient - deeper earthy tones
    const groundGradient = this.ctx.createLinearGradient(0, groundY, 0, height);
    groundGradient.addColorStop(0, '#8B7355');  // Warm brown
    groundGradient.addColorStop(0.4, '#6B5344'); // Medium brown
    groundGradient.addColorStop(1, '#4A3A2A');  // Deep earth

    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, groundY, width, height - groundY);

    // Ground line/edge
    this.ctx.strokeStyle = '#5C4D3A';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, groundY);
    this.ctx.lineTo(width, groundY);
    this.ctx.stroke();
  }

  /**
   * Draws the trash bin at specified position.
   * @param {Object} bin - Bin with x, y, width, height properties
   */
  drawBin(bin) {
    const ctx = this.ctx;
    const centerX = bin.x + bin.width / 2;

    // Bin shadow for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(centerX, bin.y + bin.height + 10, bin.width / 2 + 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bin body (earthy brown)
    ctx.fillStyle = '#6b5344';
    ctx.beginPath();
    ctx.roundRect(bin.x, bin.y, bin.width, bin.height, 12);
    ctx.fill();

    // Bin body gradient overlay
    const bodyGradient = ctx.createLinearGradient(bin.x, bin.y, bin.x + bin.width, bin.y);
    bodyGradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    bodyGradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    bodyGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.roundRect(bin.x, bin.y, bin.width, bin.height, 12);
    ctx.fill();

    // Circular rim (ellipse at top)
    ctx.fillStyle = '#8b7355';
    ctx.beginPath();
    ctx.ellipse(centerX, bin.y, bin.width / 2 + 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Circular opening (dark hole - ellipse)
    const openingRadiusX = (bin.openingWidth || bin.width * 0.7) / 2;
    const openingRadiusY = 12;

    // Opening depth gradient
    const openingGradient = ctx.createRadialGradient(
      centerX, bin.y, 0,
      centerX, bin.y, openingRadiusX
    );
    openingGradient.addColorStop(0, '#1a1210');
    openingGradient.addColorStop(0.7, '#2a1f18');
    openingGradient.addColorStop(1, '#3a2a20');

    ctx.fillStyle = openingGradient;
    ctx.beginPath();
    ctx.ellipse(centerX, bin.y, openingRadiusX, openingRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rim highlight
    ctx.strokeStyle = '#a08060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, bin.y, openingRadiusX + 2, openingRadiusY + 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Draws the wind indicator showing direction and speed.
   * @param {Object} wind - Wind state {enabled, speed, direction}
   */
  drawWindIndicator(wind) {
    if (!wind.enabled || Math.abs(wind.speed) < 0.1) return;

    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const y = 24;

    const direction = wind.speed > 0 ? 1 : -1;

    // Simple arrow
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.9)';
    ctx.fillStyle = 'rgba(80, 60, 40, 0.9)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Arrow line
    const arrowLength = 24;
    ctx.beginPath();
    ctx.moveTo(centerX - arrowLength / 2 * direction, y);
    ctx.lineTo(centerX + arrowLength / 2 * direction, y);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(centerX + arrowLength / 2 * direction, y);
    ctx.lineTo(centerX + (arrowLength / 2 - 4) * direction, y - 3);
    ctx.lineTo(centerX + (arrowLength / 2 - 4) * direction, y + 3);
    ctx.closePath();
    ctx.fill();

    // Speed number
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.abs(wind.speed).toFixed(1), centerX, y + 12);
  }

  /**
   * Draws a paper ball projectile.
   * @param {Object} paper - Paper with x, y, radius, rotation properties
   * @param {boolean} [isDragging=false] - Whether paper is being dragged
   */
  drawPaper(paper, isDragging = false) {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(paper.x, paper.y);
    ctx.rotate(paper.rotation || 0);

    // Shadow underneath
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(3, 5, paper.radius * 0.9, paper.radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Paper crumpled ball with gradient for 3D effect
    const radius = paper.radius || 18;
    const gradient = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.7, isDragging ? '#f8f8f5' : '#f0f0e8');
    gradient.addColorStop(1, isDragging ? '#e8e8e0' : '#d8d8d0');

    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#c0c0b0';
    ctx.lineWidth = 1.5;

    // Draw irregular circle to look crumpled
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const variance = 0.82 + Math.sin(i * 2.7) * 0.18;
      const r = radius * variance;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add some crumple lines for texture
    ctx.strokeStyle = 'rgba(180, 180, 170, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(4, 3);
    ctx.moveTo(-3, 6);
    ctx.lineTo(5, -5);
    ctx.moveTo(2, -7);
    ctx.lineTo(-4, 2);
    ctx.stroke();

    // Highlight when dragging
    if (isDragging) {
      ctx.strokeStyle = 'rgba(100, 140, 100, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws a trail effect behind the flying paper.
   * @param {Array} trail - Array of {x, y, time, rotation} positions
   */
  drawPaperTrail(trail) {
    if (trail.length < 2) return;

    const ctx = this.ctx;
    const now = Date.now();
    const maxAge = 500;

    ctx.save();

    for (let i = 0; i < trail.length - 1; i++) {
      const pos = trail[i];
      const age = now - pos.time;
      const opacity = Math.max(0, 1 - age / maxAge) * 0.3;

      if (opacity <= 0) continue;

      // Size decreases along trail
      const size = 12 - (i / trail.length) * 5;

      ctx.fillStyle = `rgba(240, 240, 230, ${opacity})`;
      ctx.strokeStyle = `rgba(200, 200, 190, ${opacity * 0.8})`;
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws a landing mark where paper landed.
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {boolean} success - Whether it was a successful throw
   * @param {number} opacity - Opacity for fading effect (0-1)
   */
  drawLandingMark(x, y, success, opacity) {
    const ctx = this.ctx;
    ctx.save();

    if (success) {
      // Epic golden celebration burst for success
      const baseRadius = 24;
      const burstRadius = baseRadius + (1 - opacity) * 40; // Expands dramatically

      // Multiple glow layers
      for (let i = 3; i > 0; i--) {
        ctx.fillStyle = `rgba(255, 215, 0, ${opacity * 0.15 * i})`;
        ctx.beginPath();
        ctx.arc(x, y, burstRadius * (1 + i * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner bright circle
      ctx.fillStyle = `rgba(255, 220, 50, ${opacity * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, burstRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Rotating star burst rays
      const rotation = (1 - opacity) * Math.PI * 0.5;
      ctx.strokeStyle = `rgba(255, 200, 50, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rotation;
        const innerR = burstRadius * 0.3;
        const outerR = burstRadius * 1.3;
        const width = i % 2 === 0 ? 3 : 2;

        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * innerR, y + Math.sin(angle) * innerR);
        ctx.lineTo(x + Math.cos(angle) * outerR, y + Math.sin(angle) * outerR);
        ctx.stroke();
      }

      // Sparkles
      for (let i = 0; i < 8; i++) {
        const sparkleAngle = (i / 8) * Math.PI * 2 + rotation * 2;
        const sparkleR = burstRadius * 1.5;
        const sparkleX = x + Math.cos(sparkleAngle) * sparkleR;
        const sparkleY = y + Math.sin(sparkleAngle) * sparkleR;

        ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Large checkmark in center
      ctx.strokeStyle = `rgba(120, 100, 30, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x - 2, y + 8);
      ctx.lineTo(x + 10, y - 8);
      ctx.stroke();

      // "SCORE!" text that fades in and up
      const textY = y - burstRadius - 8 - (1 - opacity) * 15;
      ctx.fillStyle = `rgba(218, 165, 32, ${opacity})`;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCORE!', x, textY);
    } else {
      // Earthy brown X mark for miss
      ctx.strokeStyle = `rgba(139, 90, 60, ${opacity})`;
      ctx.fillStyle = `rgba(160, 110, 80, ${opacity * 0.2})`;
      ctx.lineWidth = 3;

      // Circle background
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      // X mark
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 4);
      ctx.lineTo(x + 4, y + 4);
      ctx.moveTo(x + 4, y - 4);
      ctx.lineTo(x - 4, y + 4);
      ctx.stroke();

      // Splat effect
      ctx.strokeStyle = `rgba(160, 70, 70, ${opacity * 0.5})`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * 12, y + Math.sin(angle) * 12);
        ctx.lineTo(x + Math.cos(angle) * 18, y + Math.sin(angle) * 18);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Draws the current score on the canvas.
   * @param {number} score - Current score
   */
  drawScore(score) {
    const ctx = this.ctx;

    ctx.fillStyle = '#4a3a2a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${t('game.score')} ${score}`, 12, 24);
  }

  /**
   * Draws game instructions.
   * @param {string} message - Instruction text
   */
  drawInstructions(message) {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height - 40;
    const maxWidth = this.canvas.width - 80;

    // Semi-transparent background (smaller)
    ctx.fillStyle = 'rgba(240, 230, 220, 0.85)';
    ctx.beginPath();
    ctx.roundRect(centerX - maxWidth / 2 - 12, centerY - 15, maxWidth + 24, 30, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(100, 80, 60, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(centerX - maxWidth / 2 - 12, centerY - 15, maxWidth + 24, 30, 8);
    ctx.stroke();

    // Instruction text (smaller font)
    ctx.fillStyle = '#4a3a2a';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';

    // Wrap text if needed
    const words = message.split(' ');
    let lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Draw each line
    const lineHeight = 10;
    const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, centerX, startY + i * lineHeight);
    });
  }

  /**
   * Draws game over overlay.
   * @param {number} finalScore - Final score achieved
   */
  drawGameOver(finalScore) {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Semi-transparent earthy overlay
    ctx.fillStyle = 'rgba(40, 30, 20, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Game over text
    ctx.fillStyle = '#f0e6d8';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('game.gameOver'), centerX, centerY - 15);

    // Final score
    ctx.fillStyle = '#d4a574';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(`${t('game.score')} ${finalScore}`, centerX, centerY + 15);
  }

  /**
   * Draws a direction-focused trajectory guide (arrow showing direction only).
   * @param {Object} start - Start point {x, y}
   * @param {Object} end - End point {x, y}
   * @param {Object} physics - Physics engine for trajectory calculation
   */
  drawTrajectoryGuide(start, end, physics = null) {
    const ctx = this.ctx;

    // Calculate drag vector and power
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dragDistance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Calculate power percentage (0-100)
    const maxDrag = 120;
    const powerPercent = Math.min((dragDistance / maxDrag) * 100, 100);

    // Draw power meter arc around start point
    const meterRadius = 28;
    ctx.strokeStyle = powerPercent < 30 ? 'rgba(200, 100, 60, 0.6)' :
      powerPercent < 70 ? 'rgba(220, 180, 60, 0.7)' :
        'rgba(100, 180, 80, 0.8)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(start.x, start.y, meterRadius, -Math.PI * 0.75, -Math.PI * 0.75 + (Math.PI * 1.5 * powerPercent / 100));
    ctx.stroke();

    // Draw power percentage text
    ctx.fillStyle = 'rgba(60, 50, 40, 0.9)';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(powerPercent)}%`, start.x, start.y + 4);

    // Trajectory arrow (smaller, dynamic length based on power)
    const arrowLength = 30 + (powerPercent / 100) * 20;
    const endX = start.x + Math.cos(angle) * arrowLength;
    const endY = start.y + Math.sin(angle) * arrowLength;

    // Draw gradient line for trajectory
    const gradient = ctx.createLinearGradient(start.x, start.y, endX, endY);
    gradient.addColorStop(0, 'rgba(80, 60, 40, 0.8)');
    gradient.addColorStop(1, 'rgba(80, 60, 40, 0.3)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Pulsing dots along trajectory (smaller)
    const formHTML = `
      <form id="offer-form" class="offer-form">
        <div class="form-row">
          <label for="offer-salary">${t('offer.salaryLabel')}:</label>
          <input id="offer-salary" name="salary" type="number" placeholder="120,000" min="0" step="1000" />
          <select id="offer-currency" name="currency">
            <option value="AUD">AUD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div class="form-row">
          <label for="offer-days">${t('offer.daysLabel')}:</label>
          <select id="offer-days" name="days">
            <option value="5">${t('offer.daysOption', { count: 5 })}</option>
            <option value="4" selected>${t('offer.daysOption', { count: 4 })}</option>
            <option value="3">${t('offer.daysOption', { count: 3 })}</option>
            <option value="2">${t('offer.daysOption', { count: 2 })}</option>
          </select>
        </div>
        <div class="form-row">
          <label for="offer-message">${t('offer.messageLabel')}:</label>
          <textarea id="offer-message" name="message" rows="4" placeholder="${t('offer.messagePlaceholder')}"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="offer-cancel">${t('offer.cancel')}</button>
          <button type="button" id="offer-email">${t('offer.email')}</button>
        </div>
      </form>`;
    ctx.fill();

    // Glow effect on start point (smaller)
    ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 220, 150, 0.6)';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }






}
