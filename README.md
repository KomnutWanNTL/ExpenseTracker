
# Expense Tracker (React + Vite)

> **Personal Expense Tracker – Fast, Local, Mobile-first**

## Project Status

- **Phase 3: All core features implemented**
- **Current focus:** Manual QA, Reliability, Performance, Mobile UX polish

---

## Features

- **Quick Add:** เพิ่มรายจ่ายด้วย input เดียว (เช่น `ข้าว 50`) กด Enter บันทึกทันที
- **Auto Categorization:** ระบบแยกหมวดหมู่อัตโนมัติ + จดจำหมวดหมู่ที่ผู้ใช้แก้ไข
- **Expense List:** ดู/แก้ไข/ลบรายการย้อนหลัง, เลือกเดือน, pagination
- **Dashboard:** สรุปยอดรายวัน/รายเดือน, Pie chart, Line chart
- **Budget Control:** ตั้งงบรายเดือนต่อหมวด, แจ้งเตือนเมื่อใกล้เต็ม/เกินงบ
- **CSV Export/Import:** ส่งออก/นำเข้าข้อมูลเป็นไฟล์ CSV
- **Offline-first:** ใช้งานได้แม้ไม่มีอินเทอร์เน็ต (PWA-ready)
- **Local Storage:** ข้อมูลเก็บในเครื่องคุณเท่านั้น ไม่มี backend/cloud
- **Mobile-first:** ออกแบบให้ใช้งานง่ายบนมือถือ, รองรับ one-handed/keyboard-first

---

## Usage

### Development

```sh
npm install
npm run dev
```

### Production Build

```sh
npm run build
npm run preview
```

### Deploy to GitHub Pages

```sh
npm run deploy
```
ดูผลลัพธ์ที่ branch `gh-pages` (ดูวิธีตั้งค่าใน Settings > Pages)

---

## Data & Privacy

- ข้อมูลทั้งหมดเก็บในเครื่อง (localStorage)
- ไม่มีการส่งข้อมูลออกนอกเครื่อง/ไม่มี backend
- รองรับ export/import CSV เพื่อ backup หรือย้ายข้อมูล

---

## Reset/Import/Export

- Export: ปุ่มส่งออก CSV อยู่ในหน้าแอป
- Import: ปุ่มนำเข้า CSV อยู่ในหน้าแอป (รองรับ merge/replace)
- Reset: ลบข้อมูลได้จาก UI (หรือ clear localStorage ด้วย browser devtools)

---

## Requirements & Implementation

- ดูรายละเอียดฟีเจอร์, ข้อกำหนด, และแผนงานได้ที่:
  - [`_requirement/requirement.md`](./_requirement/requirement.md)
  - [`_requirement/IMPLEMENTATION_TASKS.md`](./_requirement/IMPLEMENTATION_TASKS.md)

---

## Tech Stack

- React + TypeScript + Vite
- Chart.js (ผ่าน react-chartjs-2)
- LocalStorage (พร้อมต่อยอด IndexedDB)

---