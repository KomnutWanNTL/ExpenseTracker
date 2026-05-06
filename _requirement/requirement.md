# 1. Objective

ระบบบันทึกรายจ่ายส่วนบุคคลแบบ **เร็วที่สุด (≤ 3 วินาที/รายการ)**
ลดภาระการกรอกข้อมูล และแสดงภาพรวมการใช้เงินแบบทันที

---

# 2. Scope

* ใช้คนเดียว (Single user)
* ใช้ผ่าน Web (Mobile-first, ทำเป็น PWA ได้)
* เก็บข้อมูลในเครื่อง (Local-first)

---

# 3. Functional Requirements

## 3.1 Quick Add Expense (Core)

**FR-01** ผู้ใช้สามารถเพิ่มรายการรายจ่ายผ่าน input เดียว

* รูปแบบ: `ข้อความ + จำนวนเงิน`
* ตัวอย่าง: `ข้าว 50`

**FR-02** ระบบต้อง parse ข้อมูลอัตโนมัติ:

* amount = ตัวเลขท้าย
* note = ข้อความด้านหน้า
* category = auto detect

**FR-03**

* กด Enter = บันทึกทันที
* หลังบันทึก → clear input + focus กลับทันที

**FR-04**

* รองรับ input ผิดพลาด:

  * ไม่มีตัวเลข → reject + แจ้งเตือนสั้น
  * มีหลายตัวเลข → ใช้ตัวท้าย

---

## 3.2 Expense List

**FR-05** แสดงรายการล่าสุด (เรียงตามเวลา)

* แสดง: note, amount, category, date

**FR-06** ผู้ใช้สามารถ:

* ลบรายการ
* แก้ไขรายการ

---

## 3.3 Auto Categorization

**FR-07** ระบบต้อง map keyword → category
**FR-08** หากไม่ match → default = “อื่น ๆ”

**FR-09** ผู้ใช้สามารถ override category ได้

---

## 3.4 Dashboard

**FR-10** แสดง summary:

* รายจ่ายวันนี้
* รายจ่ายเดือนนี้

**FR-11** แสดงกราฟ:

* Pie chart: สัดส่วนตาม category
* Line chart: รายจ่ายรายวัน

(ใช้ Chart.js หรือเทียบเท่า)

---

## 3.5 Budget Control

**FR-12** ผู้ใช้สามารถตั้ง budget ต่อ category (รายเดือน)

**FR-13** ระบบต้อง:

* คำนวณ % การใช้
* แสดงสถานะ (ปกติ / ใกล้เต็ม / เกิน)

**FR-14** เมื่อเกิน budget:

* แสดง visual alert (สีแดง)
* ไม่ต้อง push notification (เวอร์ชันแรก)

---

## 3.6 Data Storage

**FR-15** ข้อมูลต้องถูกเก็บในเครื่อง:

* localStorage (ขั้นต่ำ)
* หรือ IndexedDB (ถ้าข้อมูลมาก)

**FR-16** ข้อมูลต้อง persist หลัง reload

---

## 3.7 Export / Backup

**FR-17** ผู้ใช้สามารถ export ข้อมูลเป็น CSV ได้

**FR-18** รองรับ import กลับ (optional v1.1)

---

## 3.2 Category Learning (New Feature)

**FR-05** ระบบต้องจดจำการแก้ไขหมวดหมู่ของรายการที่ผู้ใช้เปลี่ยนแปลง เช่น หากผู้ใช้กรอก "airportlink" แล้วระบบใส่ "อื่น ๆ" แต่ผู้ใช้แก้เป็น "การเดินทาง" ครั้งถัดไปที่กรอก "airportlink" ระบบต้องเลือก "การเดินทาง" ให้โดยอัตโนมัติ

### ตัวอย่าง
1. กรอก "airportlink" ระบบใส่ "อื่น ๆ"
2. ผู้ใช้แก้ไขเป็น "การเดินทาง"
3. ครั้งถัดไปที่กรอก "airportlink" ระบบเลือก "การเดินทาง" ให้ทันที

**Acceptance Criteria**
- ระบบจดจำการแก้ไขหมวดหมู่ตาม note
- เมื่อกรอก note เดิม ระบบเลือกหมวดหมู่ที่เคยแก้ไขล่าสุด
- ข้อมูล mapping นี้ต้องถูกบันทึกแบบ persistent (localStorage หรือเทียบเท่า)
- ไม่มีผลกระทบต่อประสิทธิภาพหรือ UX เดิม

---

# 4. Non-Functional Requirements

## 4.1 Performance

* เพิ่มรายการ ≤ 100 ms
* โหลดหน้าแรก ≤ 1 วินาที

---

## 4.2 Usability

* เพิ่มรายการ ≤ 3 วินาที
* ใช้งานด้วยมือเดียวบนมือถือได้

---

## 4.3 Reliability

* ข้อมูลไม่หายเมื่อ refresh / ปิด browser
* handle error input ได้

---

## 4.4 Offline Support

* ใช้งานได้โดยไม่ต้อง internet (PWA-ready)

---

# 5. Data Model

```json
{
  "id": "uuid",
  "amount": 50,
  "category": "food",
  "note": "ข้าว",
  "date": "ISO string",
  "createdAt": "ISO string"
}
```

---

# 6. UX Requirements (Critical)

* เปิดแอป → cursor อยู่ที่ input ทันที
* ไม่มี popup เกินจำเป็น
* ทุก action ≤ 2 step
* ใช้ keyboard (Enter) เป็นหลัก

---

# 7. Tech Constraints

* Frontend: React
* Build tool: Vite
* No backend (v1)
* Responsive (mobile-first)

---

# 8. Out of Scope (ห้ามทำใน v1)

* ระบบ login / multi-user
* sync cloud
* ระบบบัญชีซับซ้อน
* AI recommendation

---

# 9. Success Criteria

* ผู้ใช้สามารถเพิ่มรายการได้ ≥ 10 รายการ/วัน โดยไม่รู้สึกเหนื่อย
* ใช้งานต่อเนื่อง ≥ 7 วัน
* เวลาเฉลี่ยต่อการเพิ่มรายการ ≤ 3 วินาที

---

# 10. Roadmap (สั้นและชัด)

**Phase 1 (MVP)**

* Quick add
* List
* Summary วันนี้

**Phase 2**

* Auto category
* Dashboard

**Phase 3**

* Budget
* Export
