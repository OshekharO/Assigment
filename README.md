# TaskFlow

TaskFlow is a responsive SaaS project management landing page rebuilt with [Bootstrap 5.3.3](https://getbootstrap.com/).

## Overview

The page presents TaskFlow as a tool for planning work, assigning tasks, setting deadlines, and tracking progress on a visual board. It includes:

- Responsive Bootstrap navbar with collapse behavior on mobile and a single "Request demo" call-to-action
- Hero section with product copy and a custom Kanban board preview
- Feature, workflow, about, values, tagline, and pricing sections
- Demo request form with client-side validation, loading state, and simulated success feedback
- Scroll reveal effects and tagline animation that respect `prefers-reduced-motion`

## Tech stack

- HTML5
- Bootstrap 5.3.3 via CDN (CSS and JS bundle)
- Custom CSS (`styles.css`) for brand styling, board preview, and motion
- Vanilla JavaScript (`script.js`) for smooth scrolling, reveals, navbar behavior, and form handling

## Running locally

No build step is required.

```powershell
Start-Process .\index.html
```

You can also open `index.html` directly in a browser.

## Files

- `index.html` - Page structure and Bootstrap layout/components
- `styles.css` - Custom theme overrides and component styling
- `script.js` - Interaction, animation, and form validation logic
- `README.md` - Project notes

## Notes

- The demo form submission is simulated; no data is sent to a server.
- Pricing and content are illustrative.
- All navigation links point to sections within the page.
