# Expense Tracker Implementation Checklist

อ้างอิงจาก [requirement.md](./requirement.md)

ไฟล์นี้ใช้สำหรับ:
- เช็คว่างานทำครบตาม requirement หรือยัง
- ใช้เป็น working checklist เพื่อกลับมาทำงานต่อจากจุดเดิมได้ทันที
- ใช้เป็นเกณฑ์ก่อนปิด MVP และ phase ถัดไป

## วิธีใช้

- เปลี่ยน `[ ]` เป็น `[x]` เมื่องานเสร็จจริง
- ถ้างานเริ่มแล้วแต่ยังไม่เสร็จ ให้เติมสถานะในบรรทัด `Status:`
- ถ้ามี decision สำคัญ ให้บันทึกไว้ใน `Notes:` ของ task นั้น
- ห้ามข้าม acceptance checklist ของแต่ละ section

---

## 1. Project Status

**Current Phase:** Not started

**Current Focus:** Setup

**Last Updated:** 2026-04-29

**Blocked By:** None

---

## 2. Delivery Plan

### Phase 0: Foundation
- [ ] Project scaffold พร้อมใช้งาน
- [ ] App structure และ shared types พร้อม
- [ ] Storage abstraction พร้อม
- [ ] Mobile-first shell พร้อม

### Phase 1: MVP
- [ ] Quick add ใช้งานได้ครบ
- [ ] Expense list ใช้งานได้ครบ
- [ ] Edit/Delete ใช้งานได้ครบ
- [ ] Today summary ใช้งานได้ครบ
- [ ] Data persist หลัง reload

### Phase 2: Smart Categorization + Dashboard
- [ ] Auto category ใช้งานได้ครบ
- [ ] Category override ใช้งานได้ครบ
- [ ] Monthly summary ใช้งานได้ครบ
- [ ] Pie chart และ line chart ใช้งานได้ครบ

### Phase 3: Budget + Export
- [ ] Budget per category ใช้งานได้ครบ
- [ ] Budget status/alert ใช้งานได้ครบ
- [ ] CSV export ใช้งานได้ครบ

---

## 3. Implementation Backlog

## A. Setup and Architecture

### A1. Bootstrap project
- [ ] Create React + Vite project
- [ ] Confirm dev server starts successfully
- [ ] Confirm production build succeeds
- [ ] Add basic README usage notes

Requirement refs: Tech Constraints, NFR Performance

Status: Not started

Notes:
- Build tool must be Vite
- Frontend must be React

### A2. Define folder structure
- [ ] Create folders for `src/app`
- [ ] Create folders for `src/components`
- [ ] Create folders for `src/features/expenses`
- [ ] Create folders for `src/features/dashboard`
- [ ] Create folders for `src/features/budget`
- [ ] Create folders for `src/storage`
- [ ] Create folders for `src/utils`
- [ ] Create folders for `src/types`

Requirement refs: Tech Constraints

Status: Not started

Notes:
- Keep feature boundaries clear to reduce refactor cost later

### A3. Define shared domain types
- [ ] Define `Expense` type from the requirement data model
- [ ] Define `Category` type/list
- [ ] Define `Budget` type
- [ ] Define `BudgetStatus` type
- [ ] Define storage payload types if needed

Requirement refs: Section 5 Data Model, FR-12, FR-13

Status: Not started

Notes:
- Expense should include `id`, `amount`, `category`, `note`, `date`, `createdAt`

### A4. Create storage abstraction
- [ ] Create expense storage service
- [ ] Create budget storage service
- [ ] Add safe parse/serialize handling
- [ ] Add fallback for empty or corrupted local data
- [ ] Ensure reload persists data correctly

Requirement refs: FR-15, FR-16, Reliability

Status: Not started

Notes:
- Start with localStorage
- Keep API abstraction ready for IndexedDB later if needed

### A5. Create app shell and base UI system
- [ ] Build mobile-first page shell
- [ ] Add layout spacing tokens
- [ ] Add color tokens and state colors
- [ ] Add typography scale
- [ ] Add reusable button/input/card primitives if needed

Requirement refs: Usability, Mobile-first, Responsive

Status: Not started

Notes:
- Main flow must be usable one-handed on mobile

Acceptance checklist:
- [ ] App layout works on mobile width first
- [ ] Touch targets are usable on small screens
- [ ] Base shell is ready for quick add as first focus area

---

## B. Quick Add Expense (Core MVP)

### B1. Create quick-add input
- [ ] Build a single input field for expense entry
- [ ] Show placeholder/example like `ข้าว 50`
- [ ] Keep input prominent as primary action on first screen

Requirement refs: FR-01, UX Requirements

Status: Not started

### B2. Implement autofocus and focus recovery
- [ ] Auto-focus input when app opens
- [ ] Restore focus after successful save
- [ ] Preserve fast keyboard flow after validation errors

Requirement refs: FR-03, UX Requirements

Status: Not started

### B3. Implement expense parser utility
- [ ] Parse trailing number as amount
- [ ] Parse leading text as note
- [ ] If multiple numbers exist, use the last one
- [ ] Trim redundant whitespace
- [ ] Return structured parse result with validation state

Requirement refs: FR-02, FR-04

Status: Not started

Notes:
- Make parser a pure function with unit tests

### B4. Implement input validation and feedback
- [ ] Reject input with no numeric amount
- [ ] Show short non-blocking error message
- [ ] Prevent invalid records from being saved

Requirement refs: FR-04, Reliability

Status: Not started

### B5. Implement submit-on-Enter flow
- [ ] Save record on Enter
- [ ] Prevent duplicate save on rapid Enter presses
- [ ] Clear input immediately after success

Requirement refs: FR-03, Usability

Status: Not started

### B6. Implement create expense action
- [ ] Generate unique expense id
- [ ] Set `createdAt` timestamp
- [ ] Set `date` value consistently
- [ ] Add expense to in-memory UI state
- [ ] Persist expense through storage layer

Requirement refs: Section 5 Data Model, FR-16

Status: Not started

### B7. Add tests for quick add
- [ ] Parser test: `ข้าว 50`
- [ ] Parser test: multiple numbers uses last one
- [ ] Parser test: missing number is invalid
- [ ] UI test: Enter saves successfully
- [ ] UI test: successful save clears and refocuses input

Requirement refs: FR-01 to FR-04, UX Requirements

Status: Not started

Acceptance checklist:
- [ ] User can type `ข้าว 50` and press Enter to save immediately
- [ ] Invalid input is rejected with a short message
- [ ] Input clears after save
- [ ] Input focus returns automatically after save
- [ ] Main flow can be completed in <= 3 seconds per item

---

## C. Expense List and Record Management

### C1. Build expense list view
- [ ] Render latest expenses sorted by time descending
- [ ] Show note
- [ ] Show amount
- [ ] Show category
- [ ] Show date

Requirement refs: FR-05

Status: Not started

### C2. Format date and currency display
- [ ] Add date formatting helper
- [ ] Add amount formatting helper
- [ ] Keep display consistent across summary and list

Requirement refs: FR-05

Status: Not started

### C3. Implement delete action
- [ ] Add delete control per item
- [ ] Remove item from UI state
- [ ] Persist deletion to storage

Requirement refs: FR-06

Status: Not started

### C4. Implement edit action
- [ ] Add edit control per item
- [ ] Allow editing note
- [ ] Allow editing amount
- [ ] Allow editing category
- [ ] Allow editing date if needed by UX design
- [ ] Persist edits to storage

Requirement refs: FR-06, FR-09

Status: Not started

Notes:
- Keep edit flow fast; avoid heavy modal UX if it slows down the main flow

### C5. Add empty state and loading-safe rendering
- [ ] Show useful empty state when no expenses exist
- [ ] Prevent hydration flicker on initial load
- [ ] Handle malformed storage data safely

Requirement refs: Reliability, Usability

Status: Not started

### C6. Add tests for CRUD flow
- [ ] Add expense renders in latest-first order
- [ ] Delete removes item correctly
- [ ] Edit updates visible values correctly
- [ ] Reload restores saved list correctly

Requirement refs: FR-05, FR-06, FR-16

Status: Not started

Acceptance checklist:
- [ ] Latest expenses appear first
- [ ] Each item shows note, amount, category, and date
- [ ] User can delete an item
- [ ] User can edit an item
- [ ] Data remains after refresh

---

## D. Auto Categorization

### D1. Define category set for v1
- [ ] Finalize category names for MVP
- [ ] Add default category `อื่น ๆ`

Requirement refs: FR-08

Status: Not started

### D2. Implement keyword mapping table
- [ ] Add food keywords
- [ ] Add transport keywords
- [ ] Add household/general purchase keywords
- [ ] Add bill/payment keywords
- [ ] Add entertainment keywords

Requirement refs: FR-07

Status: Not started

### D3. Implement category detection utility
- [ ] Detect category from note text
- [ ] Normalize input before matching
- [ ] Fallback to `อื่น ๆ` when no match exists

Requirement refs: FR-07, FR-08

Status: Not started

### D4. Connect auto categorization to save flow
- [ ] Apply detected category during quick add
- [ ] Store detected category in expense record

Requirement refs: FR-02, FR-07, FR-08

Status: Not started

### D5. Implement manual category override
- [ ] Allow category override during edit
- [ ] Optionally allow override before save if UX supports it

Requirement refs: FR-09

Status: Not started

### D6. Add tests for categorization
- [ ] Keyword match returns expected category
- [ ] Unknown text returns `อื่น ๆ`
- [ ] Manual override persists correctly

Requirement refs: FR-07 to FR-09

Status: Not started

Acceptance checklist:
- [ ] Category is auto-detected for known keywords
- [ ] Unknown notes default to `อื่น ๆ`
- [ ] User can override category manually

---

## E. Summary and Dashboard

### E1. Implement summary calculations
- [ ] Calculate total expense for today
- [ ] Calculate total expense for current month

Requirement refs: FR-10

Status: Not started

### E2. Build summary cards
- [ ] Display today's total prominently
- [ ] Display monthly total prominently

Requirement refs: FR-10

Status: Not started

### E3. Implement category aggregation
- [ ] Group expenses by category
- [ ] Calculate totals for pie chart data

Requirement refs: FR-11

Status: Not started

### E4. Implement daily aggregation
- [ ] Group expenses by day
- [ ] Calculate totals for line chart data

Requirement refs: FR-11

Status: Not started

### E5. Integrate chart library
- [ ] Install chart library
- [ ] Render pie chart for category breakdown
- [ ] Render line chart for daily spending
- [ ] Ensure charts are mobile-friendly

Requirement refs: FR-11, Tech Constraints

Status: Not started

### E6. Add empty states and chart fallback handling
- [ ] Show graceful state when no expense data exists
- [ ] Prevent chart rendering errors with empty datasets

Requirement refs: Reliability

Status: Not started

### E7. Add tests for dashboard logic
- [ ] Today summary calculation test
- [ ] Monthly summary calculation test
- [ ] Category grouping test
- [ ] Daily grouping test

Requirement refs: FR-10, FR-11

Status: Not started

Acceptance checklist:
- [ ] Today's total is correct
- [ ] Monthly total is correct
- [ ] Pie chart displays category distribution
- [ ] Line chart displays daily totals

---

## F. Budget Control

### F1. Define budget model and storage
- [ ] Define monthly budget structure per category
- [ ] Persist budgets in storage layer

Requirement refs: FR-12, FR-15, FR-16

Status: Not started

### F2. Build budget settings UI
- [ ] Create form for setting monthly budget per category
- [ ] Validate numeric input
- [ ] Save budget values

Requirement refs: FR-12

Status: Not started

### F3. Implement budget usage calculations
- [ ] Calculate monthly spent amount per category
- [ ] Calculate percentage used per category

Requirement refs: FR-13

Status: Not started

### F4. Implement budget status rules
- [ ] Define normal state
- [ ] Define near-limit state
- [ ] Define over-budget state

Requirement refs: FR-13

Status: Not started

Notes:
- Suggested thresholds:
- Normal: < 80%
- Near limit: 80% to 100%
- Over budget: > 100%

### F5. Build budget status UI
- [ ] Show percentage used
- [ ] Show visual status per category
- [ ] Show red alert for over-budget categories

Requirement refs: FR-13, FR-14

Status: Not started

### F6. Add tests for budget behavior
- [ ] Percentage calculation test
- [ ] Status classification test
- [ ] Over-budget alert rendering test

Requirement refs: FR-12 to FR-14

Status: Not started

Acceptance checklist:
- [ ] User can set monthly budget per category
- [ ] App shows percentage used correctly
- [ ] App shows status correctly
- [ ] Over-budget state is visually highlighted in red

---

## G. Export / Backup

### G1. Implement CSV export utility
- [ ] Convert expense records to CSV rows
- [ ] Include headers
- [ ] Ensure date/category/note/amount fields are exported correctly

Requirement refs: FR-17

Status: Not started

### G2. Implement export action in UI
- [ ] Add export button
- [ ] Trigger CSV download from browser

Requirement refs: FR-17

Status: Not started

### G3. Verify CSV compatibility
- [ ] Confirm Thai text exports correctly
- [ ] Confirm spreadsheet tools can open the file cleanly

Requirement refs: FR-17

Status: Not started

### G4. Prepare import-back placeholder
- [ ] Add note or TODO for import support in v1.1
- [ ] Keep data shape compatible with later import flow

Requirement refs: FR-18

Status: Not started

Acceptance checklist:
- [ ] User can export data as CSV
- [ ] Exported file includes all expected fields
- [ ] Thai text is readable after opening the file

---

## H. Reliability, Offline, and Performance

### H1. Reliability hardening
- [ ] Handle invalid input safely
- [ ] Handle empty storage safely
- [ ] Handle corrupted storage payload safely
- [ ] Prevent silent failures during save/load

Requirement refs: Reliability, FR-04

Status: Not started

### H2. Offline-ready behavior
- [ ] Ensure app works without internet
- [ ] Keep all core flows local-first
- [ ] Prepare PWA-ready structure if included in v1

Requirement refs: Offline Support, Scope

Status: Not started

### H3. Performance checks
- [ ] Validate add expense flow feels instant
- [ ] Validate first page load is lightweight
- [ ] Avoid unnecessary re-renders in main flow

Requirement refs: NFR Performance

Status: Not started

### H4. Mobile usability checks
- [ ] Validate one-handed use for primary actions
- [ ] Validate keyboard-first main flow
- [ ] Validate no unnecessary popups in primary flow
- [ ] Validate each core action stays within 2 steps

Requirement refs: Usability, UX Requirements

Status: Not started

Acceptance checklist:
- [ ] Add expense flow is responsive and low-friction
- [ ] App works offline for core local features
- [ ] Main actions are usable on mobile with one hand

---

## 4. Testing Checklist

### Unit Tests
- [ ] Expense parser tests complete
- [ ] Category detection tests complete
- [ ] Summary calculation tests complete
- [ ] Budget calculation tests complete
- [ ] CSV export formatting tests complete

### Integration / UI Tests
- [ ] Quick add flow test complete
- [ ] Expense list render test complete
- [ ] Edit expense flow test complete
- [ ] Delete expense flow test complete
- [ ] Persistence after reload test complete
- [ ] Budget UI flow test complete
- [ ] Export flow test complete

### Manual QA
- [ ] Mobile layout checked
- [ ] Keyboard-first flow checked
- [ ] Reload persistence checked
- [ ] Offline behavior checked
- [ ] Invalid input behavior checked

---

## 5. MVP Exit Criteria

MVP ถือว่าเสร็จเมื่อทุกข้อด้านล่างเป็นจริง:

- [ ] เปิดแอปแล้ว cursor อยู่ที่ input ทันที
- [ ] พิมพ์ `ข้าว 50` แล้วกด Enter เพื่อบันทึกได้ทันที
- [ ] หลังบันทึก input ถูกล้างและ focus กลับทันที
- [ ] ระบบ parse amount/note ได้ถูกต้อง
- [ ] ระบบ reject input ที่ไม่มีตัวเลข
- [ ] รายการล่าสุดแสดงผลถูกต้อง
- [ ] ผู้ใช้ลบรายการได้
- [ ] ผู้ใช้แก้ไขรายการได้
- [ ] ข้อมูลยังอยู่หลัง refresh
- [ ] แสดง summary วันนี้ได้ถูกต้อง
- [ ] การเพิ่มรายการทำได้เร็วและไม่รู้สึกหน่วง

---

## 6. Phase 2 Exit Criteria

- [ ] ระบบ auto-detect category ได้
- [ ] หากไม่ match ให้เป็น `อื่น ๆ`
- [ ] ผู้ใช้ override category ได้
- [ ] แสดงรายจ่ายเดือนนี้ได้
- [ ] Pie chart ใช้งานได้
- [ ] Line chart ใช้งานได้

---

## 7. Phase 3 Exit Criteria

- [ ] ผู้ใช้ตั้ง budget ต่อ category ได้
- [ ] ระบบคำนวณเปอร์เซ็นต์การใช้ได้ถูกต้อง
- [ ] ระบบแสดงสถานะ ปกติ / ใกล้เต็ม / เกิน ได้ถูกต้อง
- [ ] เมื่อเกิน budget มี visual alert สีแดง
- [ ] ผู้ใช้ export ข้อมูลเป็น CSV ได้

---

## 8. Open Decisions

- [ ] Decide whether to use TypeScript or plain JavaScript
- [ ] Decide chart library (`Chart.js` or equivalent)
- [ ] Decide edit UX (`inline`, `drawer`, or `modal`)
- [ ] Decide whether PWA setup is included in MVP or only PWA-ready structure
- [ ] Decide whether quick add should support decimal amounts in v1

---

## 9. Work Log

### 2026-04-29
- Created implementation checklist from requirement.md
- No implementation started yet
