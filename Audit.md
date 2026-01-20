# Audit Report

Scope: Full audit of every file present in the workspace at the time of review.
Date: 2026-01-17

## Executive Summary (Observable)
- There are **two parallel stacks** for content and behavior: the current ES module stack (index.html + js/main.js + css/base.css/theme.css/components.css) and an **older, unused stack** (css/styles.css + js/script.js + data/*.json). The older stack is not referenced by index.html and contains selectors/IDs that do not exist in the current markup.
- The game code currently includes **runtime console logging** in production paths (`game.js`, `physics.js`).
- The main stylesheet `css/components.css` contains a **syntax error**: `.case-card` is missing a closing `}` before `.case-card:hover`.
- Several **asset paths referenced by JS** appear to be missing (case study images and placeholder.png).
- The header includes a **mobile menu button** that references `aria-controls="mobile-menu"`, but no `#mobile-menu` element exists in the DOM.

---

## File-by-File Findings

### index.html
**Findings**
- Includes `base.css`, `theme.css`, `components.css` only. Does not include `styles.css` or `script.js`.
- Header includes a button with `aria-controls="mobile-menu"` but there is **no element with id `mobile-menu`**.
- Footer hardcodes `2024` in markup while `i18n.js` has 2026 for footer copyright strings. The year is corrected by inline script, but the `data-i18n` strings still mention 2026.
- Uses `<a href="/">` for logo; when deployed under a subpath (e.g., GitHub Pages `/portfolio/`), `/` navigates to domain root instead of site root.

**Improvements**
- Add or remove the mobile menu container so `aria-controls` references a real element.
- Consider aligning year handling: either keep dynamic JS only, or update i18n strings to avoid conflicts with the auto year.
- Consider using a relative logo link (`./`) for better GitHub Pages compatibility.

---

### css/base.css
**Findings**
- Defines `.container` padding as `0 1rem` (overridden later by `components.css`).
- Global `transition` on `*` and pseudo-elements may cause unnecessary repaint on large DOM updates.

**Improvements**
- Remove duplicate `.container` rules or consolidate with `components.css` to avoid conflicting definitions.
- Limit global transitions to specific UI elements to reduce layout/paint overhead.

---

### css/theme.css
**Findings**
- Theme tokens are well-structured; no syntax errors found.
- Theme uses `--btn-primary-text` in a few places, but `--btn-primary-text` is also defined in both themes and in `:root` section.

**Improvements**
- Consider extracting repeated theme token comments or using a token naming convention for consistency (e.g., `--color-*` vs `--primary`).

---

### css/components.css
**Findings**
- `.container` is redefined, overriding base.css (padding uses `var(--space-4)`).
- **Syntax error:** `.case-card` block is missing a closing `}` before `.case-card:hover`. This will invalidate subsequent CSS rules in many browsers.
- Defines two separate game styling blocks: `.game__*` (current) and `.game-section` / `.game-container` / `.game-canvas` (legacy). Only `.game__*` is used by index.html.
- Mobile section adds `padding` to `.portfolio__grid`, which was removed earlier in the base styles; now reintroduced only under mobile breakpoint.

**Improvements**
- Fix missing `}` after `.case-card` to ensure stylesheet is parsed correctly.
- Remove or isolate legacy game styles (`.game-section`, `.game-canvas`, `.game-btn`) to reduce confusion.
- Consolidate `.container` definition and ensure a single source of truth.

---

### css/styles.css
**Findings**
- Not referenced by index.html. Contains a complete alternate design system and layout (timeline, portfolio, game).
- Uses different IDs (`#toss-canvas`, `.columns`, `.card`, `.timeline-list`) that are not present in current HTML.

**Improvements**
- Remove or archive if no longer used; otherwise, include explicitly and ensure HTML matches its selectors.

---

### js/main.js
**Findings**
- Initializes i18n, theme, modal, timeline, portfolio, game.
- Hardcodes sensitive personal data in contact modal (DOB and phone). This is an explicit design choice but is security/privacy-sensitive.
- Uses `openModal` with HTML string interpolation that includes `t('footer.contact')` and literal strings.

**Improvements**
- Consider moving personal data to a config file or environment to reduce accidental exposure.
- If deploying publicly, remove DOB from UI to reduce sensitive data exposure.

---

### js/i18n.js
**Findings**
- Dictionaries include EN/ES/DE. `header.skipToContent` is defined but not used in HTML (HTML uses `a11y.skipLink`).
- `footer.copyright` exists but footer markup uses hardcoded year and `footer.rights` only.

**Improvements**
- Remove unused keys or map them in HTML to avoid stale strings.
- Consolidate footer year/copyright handling to a single source.

---

### js/theme.js
**Findings**
- Theme toggles update `data-theme` and localStorage correctly.
- `prefersDarkMode()` exists but is unused.

**Improvements**
- Optionally remove unused exported helpers or integrate system preference for initial theme.

---

### js/script.js
**Findings**
- Not referenced by index.html. Contains a complete alternate app initialization and a second canvas game (`#toss-canvas`) unrelated to current markup.
- This script expects `data/experience.json`, `data/portfolio.json`, and `data/i18n.json` structures; current UI uses `assets/linkedin.json` and `portfolioGrid.js` instead.

**Improvements**
- Remove or archive if not used. If retained, ensure it is not loaded in production.

---

### js/components/accordion.js
**Findings**
- Implements keyboard navigation and ARIA for accordions.
- Uses `aria-live` announcements for expanded/collapsed states.

**Improvements**
- Optionally include the section title in announcements for better context (currently generic “Section expanded”).

---

### js/components/modal.js
**Findings**
- Creates modal dynamically and traps focus correctly.
- Stores callback on DOM element as `_onClose` (non-standard property).

**Improvements**
- Consider storing callbacks in module state rather than on DOM nodes to avoid accidental property collisions.

---

### js/components/timeline.js
**Findings**
- Loads data from `assets/linkedin.json` and renders accordion timeline.
- `visibleCount` fixed at 4; no configuration.

**Improvements**
- Consider making `visibleCount` a parameter or data-driven.

---

### js/components/portfolioGrid.js
**Findings**
- Uses `defaultPortfolioData` with image paths pointing to `assets/case-studies/*.png` which do not exist in the workspace.
- Fallback uses `assets/case-studies/placeholder.png`, but only `placeholder.svg` exists.

**Improvements**
- Replace missing image paths with existing assets or add the missing PNGs.
- Update fallback to `placeholder.svg` to match available assets.

---

### js/components/paperToss/game.js
**Findings**
- Contains console logging in `handleMouseDown` for debug. Logs mouse position and distances each click.
- Adds a `resize` event listener every time `setupCanvas()` runs, which can lead to multiple listeners over time.
- `touch` drag tolerance is smaller than mouse tolerance (15 vs 30).

**Improvements**
- Remove debug logs for production.
- Guard against multiple resize listeners (attach once or remove before re-adding).
- Align touch and mouse tolerances for consistent UX.

---

### js/components/paperToss/physics.js
**Findings**
- Contains console logging in `calculateThrowVelocity`.
- Uses fixed `friction` per frame; not scaled by `deltaTime`, making physics frame-rate dependent.

**Improvements**
- Remove debug logs for production.
- If you want consistent physics across frame rates, apply friction based on `deltaTime`.

---

### js/components/paperToss/ui.js
**Findings**
- Uses `ctx.roundRect`, which is not supported in some older browsers.
- Uses hardcoded colors and sizing values; not driven by CSS variables.

**Improvements**
- Provide a fallback for `roundRect` or precompute rounded rects.
- Consider exposing theme colors via CSS variables and passing into canvas rendering for consistency.

---

### data/experience.json
**Findings**
- Structure does not match current timeline renderer, which expects `assets/linkedin.json` with `experiences` array and nested fields.
- Not referenced by current app entrypoint.

**Improvements**
- Remove if unused, or align structure with current timeline module.

---

### data/i18n.json
**Findings**
- Structure is unrelated to `js/i18n.js` dictionaries.
- Not referenced by current app entrypoint.

**Improvements**
- Remove if unused, or align with current i18n module.

---

### data/portfolio.json
**Findings**
- Structure does not match `portfolioGrid.js` data model.
- Not referenced by current app entrypoint.

**Improvements**
- Remove if unused, or align with current portfolio module.

---

### assets/linkedin.json
**Findings**
- Data appears consistent with timeline renderer (contains `experiences` array, localized fields).
- Contains `_comment` section for documentation; harmless but increases payload.

**Improvements**
- If minimizing payload matters, remove `_comment` in production.

---

### assets/case-studies/placeholder.svg
**Findings**
- Valid SVG placeholder used for case studies. Only `.svg` exists.

**Improvements**
- Update code references to `.svg` instead of `.png` where placeholder is used.

---

### assets/icons/phase-0.svg, phase-1.svg, phase-2.svg, phase-3.svg
**Findings**
- Valid SVG icons; used in `js/script.js` only, not in current `portfolioGrid.js`.

**Improvements**
- If the new portfolio UI should use icons, integrate them into `portfolioGrid.js` or remove unused icons.

---

### assets/img/default-logo.svg
**Findings**
- Valid SVG placeholder. Used as company logo fallback in timeline styles but not directly referenced in JS.

**Improvements**
- Consider referencing it explicitly when logo images are missing.

---

### assets/img/favicon.svg
**Findings**
- Valid SVG favicon, referenced in index.html.

**Improvements**
- Consider adding a PNG favicon for broader legacy support.

---

### diagnostic.html
**Findings**
- Debug-only page for diagnosing canvas clicks and container centering.
- Not linked from main site.

**Improvements**
- Remove or keep out of production deployments if not needed by users.

---

### test_game.html
**Findings**
- Debug-only page for testing the Paper Toss game.
- Uses canvas size 250×188 (older size), not current 400×300.

**Improvements**
- Update to current canvas size or remove from production.

---

## Systemic Improvement Opportunities
1. **Remove or archive legacy stack** (css/styles.css, js/script.js, data/*.json) to reduce maintenance burden.
2. **Fix CSS syntax error** in `components.css` to ensure all rules apply reliably.
3. **Remove debug logs** in game/physics for production performance.
4. **Normalize assets**: add missing case-study images or update references to existing placeholders.
5. **Accessibility**: ensure `aria-controls` targets exist; add missing mobile menu container or remove control.
6. **Consistency**: use one source of truth for year/copyright strings.

End of report.
