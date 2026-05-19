import { useState } from 'react';
import { setCategoryForNote } from '../storage/noteCategoryMapping';
import type { Expense, Category } from '../types/expense';

interface EditExpenseProps {
  expense: Expense;
  onSave: (expense: Expense) => void;
  onClose: () => void;
}

export default function EditExpense({ expense, onSave, onClose }: EditExpenseProps) {
  const [note, setNote] = useState(expense.note);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);

  function handleSave() {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('จำนวนเงินไม่ถูกต้อง');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      alert('วันที่ไม่ถูกต้อง');
      return;
    }
    // Save note→category mapping if category changed or always (safe to always update)
    if (note.trim()) {
      setCategoryForNote(note, category);
    }
    onSave({
      ...expense,
      note,
      amount: parsedAmount,
      category,
      date,
    });
    onClose();
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-sheet" onClick={e => e.stopPropagation()}>
        <div className="edit-header">
          <h2 className="edit-title">แก้ไขรายการ</h2>
        </div>

        <div className="edit-body">
          <div className="edit-field">
            <label className="edit-label">หมายเหตุ</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="เช่น ข้าว"
              className="edit-input"
            />
          </div>

          <div className="edit-field">
            <label className="edit-label">วันที่</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="edit-input"
            />
          </div>

          <div className="edit-field">
            <label className="edit-label">จำนวนเงิน</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              className="edit-input"
            />
          </div>

          <div className="edit-field">
            <label className="edit-label">หมวดหมู่</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="app-select edit-select"
            >
              <option value="food">อาหาร</option>
              <option value="transport">การเดินทาง</option>
              <option value="shopping">ช้อปปิ้ง</option>
              <option value="bills">ค่าบิล</option>
              <option value="entertainment">ความบันเทิง</option>
              <option value="health">สุขภาพ</option>
              <option value="family">ครอบครัว</option>
              <option value="other">อื่น ๆ</option>
            </select>
          </div>
        </div>

        <div className="edit-actions">
          <button onClick={onClose} className="app-btn app-btn-secondary">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="app-btn app-btn-primary">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
