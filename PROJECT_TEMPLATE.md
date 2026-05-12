# Project Template: React + TypeScript + Vite

## โครงสร้างไฟล์หลัก

```
.
├── public/                  # ไฟล์ static assets (icon, manifest, sw.js)
├── src/
│   ├── app/                 # (Optional) โค้ดระดับแอป เช่น context, hooks
│   ├── assets/              # รูปภาพหรือไฟล์ asset อื่นๆ
│   ├── components/          # React components หลัก
│   ├── features/            # แยกตามฟีเจอร์ (feature-based structure)
│   ├── storage/             # จัดการ local storage หรือ data persistence
│   ├── types/               # TypeScript types/interfaces
│   ├── utils/               # ฟังก์ชันช่วยเหลือ/utility
│   ├── App.tsx              # Entry point ของแอป
│   ├── main.tsx             # Bootstrap แอป
│   ├── index.css            # CSS หลัก
│   └── App.css              # CSS ของ App component
├── index.html               # HTML template หลัก
├── package.json             # รายการ dependencies และ scripts
├── tsconfig.json            # TypeScript config
├── tsconfig.app.json        # TypeScript config สำหรับแอป
├── tsconfig.node.json       # TypeScript config สำหรับ Node
├── vite.config.ts           # Vite config
├── eslint.config.js         # ESLint config
├── README.md                # คำอธิบายโปรเจกต์
└── _requirement/            # โฟลเดอร์สำหรับ requirement หรือเอกสาร
```

## จุดเด่น

- ใช้ React (TypeScript) + Vite (รวดเร็ว, hot reload)
- แยกโฟลเดอร์ components, features, utils, types ชัดเจน
- มี test files (เช่น .test.ts) คู่กับ utils/storage
- รองรับ PWA (มี manifest, sw.js)
- ตั้งค่า ESLint และ TypeScript ครบถ้วน

## ตัวอย่าง Scripts ใน package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

## วิธีสร้างโปรเจกต์ใหม่

1. สร้างโปรเจกต์ใหม่ด้วย Vite:  
   `npm create vite@latest my-app -- --template react-ts`
2. คัดลอกโครงสร้างโฟลเดอร์และไฟล์จาก template นี้
3. ติดตั้ง dependencies ที่จำเป็น:  
   `npm install`
4. ตั้งค่า tsconfig, vite.config, eslint ตามตัวอย่าง
5. เริ่มพัฒนาได้เลย!

## การตั้งค่าและใช้งาน gh-pages (Deploy GitHub Pages)

### ติดตั้ง gh-pages

```bash
npm install gh-pages --save-dev
```

### เพิ่ม scripts ใน `package.json`

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### ตั้งค่า `homepage` ใน `package.json`
เช่น
```json
{
  "homepage": "https://<github-username>.github.io/<repo-name>/"
}
```

### วิธี deploy
1. รันคำสั่ง build และ deploy:
   ```bash
   npm run deploy
   ```
2. ตรวจสอบผลลัพธ์ที่ GitHub Pages URL ตามที่ตั้งค่าไว้ใน `homepage`

---

---

สามารถนำ markdown นี้ไปปรับใช้กับโปรเจกต์ใหม่ได้ทันที
