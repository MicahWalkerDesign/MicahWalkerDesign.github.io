# Micah Walker — Portfolio Website

A static portfolio website for Product Designer & Builder, built with vanilla HTML, CSS, and JavaScript (ES Modules). Deployable on GitHub Pages.

## 🌍 Theme: Earth / Motion / Clarity

The design system features two themes:
- **Sage** (default): Nature-inspired greens
- **Clay**: Warm terracotta tones

## ✨ Features

- **Responsive Design**: Mobile-first approach
- **Multilingual**: English and Spanish support
- **Accessible**: ARIA labels, keyboard navigation, focus trapping
- **Dark/Light Themes**: Sage and Clay color schemes
- **Experience Timeline**: Accordion-style work history loaded from JSON
- **Portfolio Grid**: Case studies with expandable phases
- **Paper Toss Game**: Canvas-based game with physics simulation

## 📁 Project Structure

```
├── index.html                    # Main page
├── css/
│   ├── base.css                  # Reset and foundational styles
│   ├── theme.css                 # Theme tokens and color schemes
│   └── components.css            # All component styles
├── js/
│   ├── main.js                   # Entry point
│   ├── i18n.js                   # Internationalization
│   ├── theme.js                  # Theme switching
│   └── components/
│       ├── accordion.js          # Reusable accordion
│       ├── modal.js              # Accessible modal
│       ├── timeline.js           # Experience timeline
│       ├── portfolioGrid.js      # Portfolio cards
│       └── paperToss/
│           ├── game.js           # Game controller
│           ├── physics.js        # 2D physics engine
│           └── ui.js             # Game UI rendering
├── assets/
│   ├── linkedin.json             # Work experience data
│   ├── img/                      # Images and icons
│   └── case-studies/             # Case study screenshots
└── README.md
```

## 🚀 Local Development

### Using Python (built-in):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Using Node.js:
```bash
npx serve
```

### Using VS Code:
Install the "Live Server" extension and click "Go Live" in the status bar.

Then open `http://localhost:8000` in your browser.

## 📦 Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` → `/ (root)`
   - Click Save

3. Your site will be live at `https://YOUR_USERNAME.github.io/portfolio/`

## 📝 Updating Content

### Work Experience

Edit `assets/linkedin.json` to update work history. Each entry supports multilingual titles and descriptions:

```json
{
  "title": {
    "en": "Product Designer",
    "es": "Diseñador de Producto"
  },
  "company": "Company Name",
  "location": "City, Country",
  "startDate": "2023-01",
  "endDate": null,
  "description": {
    "en": "English description...",
    "es": "Spanish description..."
  }
}
```

> **Note on LinkedIn API**: LinkedIn's API requires OAuth authentication and server-side token management, which isn't possible on a static site. The JSON file approach is the recommended solution for GitHub Pages.

### Portfolio Case Studies

Edit the `defaultPortfolioData` object in `js/components/portfolioGrid.js` to add or modify case studies.

Each case study has 4 phases:
0. **Research** - User research, competitor analysis
1. **Proof of Work** - Design files, prototypes
2. **Final Design** - Screenshots, design system
3. **Reflection** - Learnings, outcomes

### Adding Images

1. Place images in `assets/img/` or `assets/case-studies/`
2. Reference them in the portfolio data or HTML
3. Optimize images for web (WebP preferred)

## 🌐 Adding a New Language

1. Add translations to `js/i18n.js`:
   ```javascript
   const dictionaries = {
     en: { ... },
     es: { ... },
     de: {  // German example
       header: {
         experience: 'Erfahrung',
         portfolio: 'Portfolio',
         game: 'Spiel'
       },
       // ... more translations
     }
   };
   ```

2. Add language toggle button in `index.html`:
   ```html
   <button data-lang-toggle="de" aria-pressed="false">DE</button>
   ```

## 🎨 Modifying Themes

Edit `css/theme.css` to customize colors:

```css
[data-theme="sage"] {
  --color-primary: #4A7C59;
  --color-primary-light: #6B9E7C;
  --color-primary-dark: #2E5339;
  /* ... more tokens */
}

[data-theme="clay"] {
  --color-primary: #C4704A;
  --color-primary-light: #D4896B;
  --color-primary-dark: #A55A38;
  /* ... more tokens */
}
```

## ♿ Accessibility

- Skip link for keyboard users
- ARIA labels and live regions
- Focus visible outlines
- Reduced motion support
- Semantic HTML structure
- Color contrast meets WCAG AA

## 📄 License

© 2024 Micah Walker. All rights reserved.
