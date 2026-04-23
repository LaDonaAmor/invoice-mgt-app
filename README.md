# Invoice Management App

> A fully responsive, accessible Invoice Management Application built with React + TypeScript.
> Submitted for the **HNGi14 Stage 2 Frontend Task**.

**Live Demo:** https://ladonaamor.github.io/invoice-mgt-app/
**Repository:** https://github.com/LaDonaAmor/invoice-mgt-app/

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Architecture](#architecture)
- [Trade-offs](#trade-offs)
- [Accessibility](#accessibility)
- [Improvements Beyond Requirements](#improvements-beyond-requirements)

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** and **npm** (or `bun` / `pnpm`)

### Install & Run Locally

```bash
git clone https://github.com/LaDonaAmor/invoice-mgt-app.git
cd invoice-mgt-app
npm install
npm run dev
```

The dev server starts at `http://localhost:8080` with Hot Module Replacement enabled.

### Available Scripts

| Script               | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the Vite dev server with HMR   |
| `npm run build`      | Production build output to `dist/`   |
| `npm run preview`    | Preview the production build locally |
| `npm run lint`       | Run ESLint across the codebase       |
| `npm test`           | Run the Vitest test suite once       |
| `npm run test:watch` | Run tests in watch mode              |

### Deploying to GitHub Pages

1. Confirm `vite.config.ts` has `base: "/invoice-mgt-app/"`.
2. Run `npm run build`.
3. Push the `dist/` folder to the `gh-pages` branch (e.g. via the `gh-pages` npm package).

---

## Features

### CRUD — Create, Read, Update, Delete

- **Create** new invoices using a drawer-style form with real-time validation
- **Read** the full invoice list and drill into any invoice's detail page
- **Update** existing invoices with all fields editable in place
- **Delete** invoices via a confirmation modal to prevent accidental removal

### Draft & Payment Flow

Invoices move through three statuses:

| Status      | Behavior                                            |
| ----------- | --------------------------------------------------- |
| **Draft**   | Saved with relaxed validation; can be edited freely |
| **Pending** | Fully validated; can be marked as Paid              |
| **Paid**    | Terminal state; cannot be reverted to Draft         |

Status is reflected consistently in the list view, detail view, and status badge color.

### Form Validation

Two-tier validation depending on the action:

- **Save as Draft** — lenient; only prevents completely empty submissions
- **Save & Send / Save Changes** — strict; enforces all of the following:
  - Client name is required
  - Client email must be a valid email format
  - Street address, city, postcode, and country fields are required
  - Invoice date and payment terms are required
  - At least one line item must be added
  - Each line item must have a name, a quantity ≥ 1, and a price > 0

Invalid fields display an inline error message, a red error border, and a submission-blocking summary alert.

### Filter by Status

- Multi-select checkbox dropdown lets users filter by **Draft**, **Pending**, and/or **Paid**
- Selecting nothing shows all invoices
- The filtered list updates immediately without a page reload
- An empty state is shown when no invoices match the active filters

### Light & Dark Mode

- One-click toggle in the sidebar
- Theme preference is persisted to `localStorage` and restored on reload
- All components re-theme automatically via CSS variable flipping; no hardcoded colors

### Responsive Design

Fully tested at the three required breakpoints:

| Breakpoint        | Behavior                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Mobile (320px+)   | Single-column layout; sidebar collapses to a top bar; detail page shows a sticky bottom action bar |
| Tablet (768px+)   | Two-column invoice rows; form widens; sidebar stays as a top bar                                   |
| Desktop (1024px+) | Full sidebar; spacious list and detail views                                                       |

### Hover & Interactive States

Every interactive element has an explicit hover/focus state: buttons, invoice list rows, filter checkboxes, form inputs, links, and icon-only controls.

### Data Persistence

All invoice data and the active theme preference are persisted to `localStorage` via a custom `useLocalStorage` hook. The app is fully refresh-safe with no backend dependency.

---

## Architecture

### Tech Stack

| Layer               | Technology                                    |
| ------------------- | --------------------------------------------- |
| UI                  | React 18 + TypeScript                         |
| Build tool          | Vite 5 (SWC)                                  |
| Styling             | Tailwind CSS v4 + CSS-variable design tokens  |
| Components          | shadcn/ui + Radix primitives                  |
| Routing             | React Router v6                               |
| State & persistence | React Context + custom `useLocalStorage` hook |
| Testing             | Vitest + Testing Library                      |

### Folder Layout

```
src/
├── components/
│   ├── filter/         # Status filter dropdown
│   ├── invoice/        # Invoice list, list item, detail view, invoice form
│   ├── layout/         # Sidebar and page shell
│   └── ui/             # Reusable primitives: Button, Modal, FormField, StatusBadge, …
├── context/            # InvoiceContext (CRUD + filtering), ThemeContext
├── hooks/              # useLocalStorage, use-toast, use-mobile
├── pages/              # Index (list), InvoiceDetailPage, NotFound
├── types/              # Domain types: Invoice, InvoiceItem, InvoiceStatus, …
├── utils/              # formatCurrency, formatDate, generateId
└── index.css           # Design tokens (HSL CSS variables, light + dark)
public/
└── favicon.svg         # Custom SVG brand mark
```

### Data Flow

```
localStorage
     │
     ▼
useLocalStorage hook
     │
     ▼
InvoiceProvider  ──── exposes: invoices, filtered, createInvoice,
     │                         updateInvoice, deleteInvoice, markAsPaid
     │
     ▼
useInvoiceCtx()  ←── consumed by any component without prop drilling
```

1. `InvoiceProvider` (`src/context/InvoiceContext.tsx`) boots with data from `localStorage`, seeded with sample invoices on first run.
2. It exposes CRUD actions and a `filtered` selector driven by the currently active status filters.
3. `ThemeContext` toggles a `dark` class on `<html>`; every color derives from a semantic CSS variable, so one class flip re-themes the entire app.

### Component Responsibilities

| Component           | Responsibility                                                   |
| ------------------- | ---------------------------------------------------------------- |
| `InvoiceList`       | Renders filtered invoice rows; shows empty state                 |
| `InvoiceItem`       | Single row in the list with status badge and hover state         |
| `InvoiceDetailPage` | Full invoice breakdown; hosts Edit, Delete, Mark as Paid actions |
| `InvoiceForm`       | Drawer-style create/edit form with two-tier validation           |
| `FilterDropdown`    | Multi-select status filter with `aria-expanded`                  |
| `StatusBadge`       | Pill badge with color driven by status token                     |
| `ConfirmModal`      | Focus-trapped delete confirmation dialog                         |

---

## Trade-offs

### `localStorage` instead of a backend

Zero infrastructure and instant persistence, at the cost of per-browser storage and no multi-device sync. The context implementation is the only layer that would need swapping for a real API client — all UI components are backend-agnostic.

### React Context over Redux / Zustand

The data set and mutation surface are small enough that Context + `useMemo` keeps the bundle lean. `@tanstack/react-query` is already installed for a future migration should the app grow to need server state or optimistic updates.

### Custom `Modal` and `FormField` primitives alongside shadcn/ui

The Figma design uses a drawer-style new-invoice form and a custom status pill that diverge from shadcn defaults. Wrapping bespoke primitives kept the markup faithful to the design without fighting Radix variants or overriding their internal styles.

### Plain validation instead of `react-hook-form` + Zod

The form has draft vs. strict modes with field-level error keys that map directly to the UI. A single bespoke validator was simpler than maintaining two parallel Zod schemas. The `react-hook-form` dependency is available and the form is structured to make a future migration straightforward.

### Hash-based routing on GitHub Pages

GitHub Pages has no SPA fallback, so a hard refresh on `/invoice/XX1234` would 404 with `BrowserRouter`. `HashRouter` is the practical workaround at zero infrastructure cost; a custom deployment target (Vercel, Netlify, or a server with a rewrite rule) would allow switching back to `BrowserRouter`.

---

## Accessibility

### Semantic HTML

`<main>`, `<article>`, `<address>`, `<ul>` / `<li>` for invoice items, real `<button>` and `<a>` elements — no clickable `<div>` elements anywhere.

### Keyboard Support

Every interactive control is reachable via Tab. The modal traps focus, returns focus to the trigger on close, and dismisses on `Escape`. The status filter dropdown closes on outside click or `Escape`.

### Visible Focus

A shared `.focus-ring` utility applies a 2 px ring with offset, themed correctly for both light and dark modes.

### ARIA Attributes

| Element                                       | ARIA                                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Modal                                         | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`                                               |
| Form inputs                                   | `<label>` linked via `htmlFor`, `aria-invalid` on error, `role="alert"` summary on submission failure |
| Filter button                                 | `aria-expanded`, `role="listbox"` on the dropdown                                                     |
| Icon-only buttons (delete item, theme toggle) | `aria-label`                                                                                          |
| Visually hidden labels                        | `sr-only` where the design omits visible text                                                         |

### Color Contrast

All text/background pairs in both themes meet **WCAG AA** (4.5 : 1 for normal text, 3 : 1 for large text). Status badges use a tinted background with a saturated label color to maintain contrast without relying on color alone.

### Reduced Motion

Animations are limited to short opacity/scale transitions and respect `prefers-reduced-motion` where applicable.

---

## Improvements Beyond Requirements

| Feature                           | Description                                                                                                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Custom SVG favicon & branding** | Replaced the default Vite logo with a custom purple brand mark (`public/favicon.svg`, `#7C5DFA`) matching the app's design token. Declared via `<link rel="icon" type="image/svg+xml">` in `index.html` for crisp, resolution-independent rendering in all modern browsers |
| **Light & dark mode**             | Persisted user preference with one-click toggle                                                                                                                                                                                                                            |
| **Automatic persistence**         | Invoice data and filter state survive page refreshes via `localStorage`                                                                                                                                                                                                    |
| **Two-tier form validation**      | Lenient for Save as Draft, strict for Save & Send, with per-field error messages                                                                                                                                                                                           |
| **Dynamic line items**            | Live per-row totals and an aggregated invoice total computed in the provider                                                                                                                                                                                               |
| **Multi-select status filter**    | Filter by any combination of Draft, Pending, and Paid simultaneously                                                                                                                                                                                                       |
| **Fully responsive**              | Sidebar collapses, rows reflow, and the detail page gets a sticky bottom action bar on mobile                                                                                                                                                                              |
| **Focus-trapped modal + drawer**  | Built from scratch for accessible, keyboard-friendly editing and confirmation dialogs                                                                                                                                                                                      |
| **Vitest + Testing Library**      | Test suite wired up with jsdom and a working sample test                                                                                                                                                                                                                   |
| **Token-driven design system**    | Adding a new theme requires editing one CSS variable block in `index.css`                                                                                                                                                                                                  |
| **Deterministic invoice IDs**     | Frontend Mentor-style IDs (`#XX1234`) generated consistently per invoice                                                                                                                                                                                                   |

---

## License

Built for the HNGi14 internship Task.

## Author

Racheal I. Ogunmodede (TechNurse)

---
