# TaskFlow

TaskFlow is a premium SaaS project management platform landing page.

## Project description

A responsive, accessible marketing website for TaskFlow, a project management tool that helps teams plan work, assign tasks, set deadlines, and track progress on a visual board. The site includes:

- Hero section with a custom Kanban board preview built in HTML and CSS
- Three benefit presentations with varied layouts
- Three-step workflow ("How it works")
- Mandatory tagline reveal section with word-by-word scroll animation
- Two illustrative pricing plans (Free and Team)
- Validated demo request form with loading feedback and simulated success state
- Responsive navigation with a working mobile menu
- Professional footer with legal links

Built with semantic HTML, vanilla CSS, and vanilla JavaScript. No frameworks or dependencies.

## Visual design direction

- **Premium, editorial composition:** strong typography, generous intentional whitespace, varied section layouts
- **Typography:** single typeface (Geist stack), sentence case, no italics, no ultra-bold weights, Tailwind type scale
- **Color:** restrained palette with one saturated violet accent (#6D28D9), flat backgrounds (no gradients except hero heading text per design system)
- **Motion:** weighted cubic-bezier ease, transform/opacity only, scroll reveals, tagline word-by-word reveal, respects prefers-reduced-motion
- **Accessibility:** WCAG AA contrast, visible focus indicators, keyboard navigation, skip-to-content link, labeled form fields, ARIA attributes

## Running locally

There is no build step. Open `index.html` directly in a web browser:

```powershell
# From the project directory
Start-Process index.html
```

Or double-click `index.html` in File Explorer.

No server is required because the site uses only static HTML, CSS, and JavaScript.

## Files

- `index.html` - Semantic HTML structure
- `styles.css` - Responsive styles following the landing-page-design visual system
- `script.js` - Mobile menu, scroll reveals, tagline reveal, form validation
- `README.md` - This file

## Design choices

- Single typeface (system-ui stack) with system fallbacks; no Inter/Roboto/Arial/Open Sans/Helvetica/Geist per design system
- One accent color (violet #6D28D9) used as a committed field, not scattered accents
- No em dashes, no hyphens in copy, no orphaned words (text-wrap balance/pretty)
- Every font size lands on the Tailwind type scale; every spacing value from the B2 spacing table
- No background gradients except the hero heading text gradient (#000000 → #666666)
- Custom Kanban board preview authored in HTML/CSS, no stock illustrations or screenshots
- Form validation with inline errors, loading state, and honest simulated success message
- All links point to real sections on the page, no dead links
