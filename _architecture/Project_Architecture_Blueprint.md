# ExpenseTracker Project Architecture Blueprint

## 1. Technology Stack
- **Frontend:** React (TypeScript, Vite)
- **State Management:** React hooks (useState, useEffect)
- **Data Storage:** Browser localStorage
- **Visualization:** chart.js, react-chartjs-2
- **Testing:** Vitest
- **Build Tools:** Vite, npm scripts
- **PWA/Offline:** Service Worker, manifest.json

## 2. Architectural Patterns
- **Component-based UI:** All UI is built from React functional components.
- **Modular Utilities:** Utility modules for calculations, parsing, formatting.
- **Storage Abstraction:** Separate modules for expense, budget, and note-category mapping storage.
- **No backend:** All data is local, privacy-focused.
- **Extensible Types:** TypeScript interfaces for Expense, Budget, Category, etc.

## 3. Architecture Visualization
See the C4/Component diagram in ExpenseTracker_C4_Component.mmd for a high-level overview.

## 4. Core Architectural Components
- **UI Components:** Present data, handle user input, and trigger state changes.
- **Storage Modules:** Abstract localStorage access for expenses, budgets, and mappings.
- **Utility Modules:** Handle calculations, parsing, formatting, and category detection.
- **Service Worker:** Provides offline support and caching.

## 5. Layers and Dependencies
- UI Components depend on storage and utility modules.
- Storage modules depend on browser localStorage.
- Utility modules are stateless and reusable.

## 6. Data Architecture
- **Domain Models:** Defined in src/types (Expense, Budget, etc.)
- **Relationships:** Expenses reference categories; budgets are per-category.
- **Data Access:** CRUD via storage modules.

## 7. Cross-Cutting Concerns
- **Authentication:** None (local-only, privacy-focused)
- **Error Handling:** Try/catch in storage and parsing modules.
- **Logging:** Minimal, mostly via browser console.
- **Validation:** Input validation in UI and utility modules.
- **Configuration:** Static, via TypeScript and manifest.json.

## 8. Service Communication
- No external services; all logic is client-side.

## 9. Technology-Specific Patterns
- **React:** Component composition, state management, hooks.
- **TypeScript:** Strong typing, interfaces, enums.
- **Vite:** Fast dev/build, hot reload.

## 10. Implementation Patterns
- **Expense CRUD:** Managed in App state, persisted via storage/expenseStorage.ts
- **Budget Management:** Modular, per-category, with status calculation
- **Auto-categorization:** Uses noteCategoryMapping and detection utils
- **Visualization:** Pie/Line charts via react-chartjs-2

## 11. Testing Architecture
- **Unit Tests:** Vitest for utils and storage modules.
- **Test Data:** Mock data in test files.

## 12. Deployment Architecture
- **Build:** Vite outputs static assets.
- **PWA:** Service Worker and manifest.json for offline support.

## 13. Extension and Evolution Patterns
- Add new features by creating new components or utilities.
- Update types and storage modules for new data types.

## 14. Architectural Pattern Examples
- See code in src/components, src/utils, and src/storage for implementation patterns.

## 15. Architectural Decision Records
- **Local-Only Storage:** Privacy and offline use.
- **No Backend:** Simplicity and user control.
- **TypeScript:** Maintainability.
- **React Functional Components:** Modern best practices.
- **Vite:** Fast development/build.

## 16. Architecture Governance
- Consistency via TypeScript types and modular structure.
- No automated architectural checks; code review and static typing enforce structure.

## 17. Blueprint for New Development
- Start with new component in src/components or utility in src/utils.
- Use TypeScript interfaces for new data types.
- Integrate with storage modules for persistence.
- Test with Vitest.

---
Generated: May 7, 2026
