
# Expense Tracker (React + Vite)

Personal expense tracker focused on speed, local-first privacy, and mobile-first usage.

## Live Demo

- GitHub Pages: https://komnutwanntl.github.io/ExpenseTracker/

## Current Status

- Core implementation (Quick Add, list/edit/delete, dashboard, budgets, CSV import/export, PWA shell) is available.
- Current focus is QA, reliability hardening, and UX polish.
- Some automated tests are still failing (see Testing section).

## Implemented Features

- Quick Add with one input (example: `ข้าว 50`) and Enter-to-save flow
- Auto category detection + learned category mapping from user corrections
- Expense list with month filter, edit/delete, and pagination (10/20/50/100)
- Summary dashboard (today, monthly, category pie with percentage labels, daily trend chart with line/bar toggle)
- Monthly budget per category with near-limit/over-limit status
- CSV export and CSV import (merge/update by `id`)
- Offline-friendly setup (PWA manifest + service worker registration)
- Local-only data persistence with `localStorage`

## Planned / In Progress

- Manual QA coverage for mobile, keyboard flow, and offline behavior
- Reliability/performance hardening
- Weekly view and advanced grouped summary views (tracked in requirements/tasks)

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Chart.js via `react-chartjs-2`
- `dayjs` (timezone handling)
- Vitest (unit tests)

## Scripts

```sh
npm install
npm run dev       # start development server
npm run build     # production build
npm run preview   # preview production build
npm run test      # run unit tests
npm run deploy    # deploy dist/ to gh-pages branch
```

## Testing

Current `npm run test` result:

- Passing: 30
- Failing: 4
- Todo: 4

Known failing areas:

- `src/utils/csvExport.test.ts` (header expectation mismatch)
- `src/utils/summaryCalculations.test.ts` (referenceDate type mismatch in tests)

## Data & Privacy

- Data is stored locally on your device (`localStorage`)
- No backend and no cloud sync in this version
- CSV export/import supports backup and migration

## Import / Export / Reset

- Export: use the Export button in the app header
- Import: use the Import button in the app header (supports merge/update by `id`)
- Reset: clear data from UI flows or browser storage tools

## Requirement and Planning Docs

- `_requirement/requirement.md`
- `_requirement/IMPLEMENTATION_TASKS.md`
- `_architecture/Project_Architecture_Blueprint.md`