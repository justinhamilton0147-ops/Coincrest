# Coincrest

A responsive React portfolio dashboard built with Vite. The interface uses illustrative crypto portfolio data and runs entirely in the browser; it does not connect to a wallet or live market feed.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Dashboard interactions

- Switch chart time ranges (1D through ALL).
- Filter holdings by asset category and search by name or ticker.
- Sort holdings by allocation.
- Responsive collapsible navigation on smaller screens.
- Demo buttons provide in-app feedback; they do not submit trades or connect to financial services.

## Structure

- `src/App.jsx` — dashboard layout, illustrative data, chart, filters, and interactions
- `src/styles.css` — responsive dashboard styling
- `src/main.jsx` — React entry point
- `index.html` — Vite document shell

All displayed portfolio values are mock data for UI demonstration only.
