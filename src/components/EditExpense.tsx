import { useState } from 'react';
import { setCategoryForNote } from '../storage/noteCategoryMapping';
import type { Expense } from '../types/expense';

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
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            วันที่
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxHeight: '80vh',
          padding: '20px 16px',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>แก้ไขรายการ</h2>
        </div>


        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            หมายเหตุ
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="เช่น ข้าว"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            วันที่
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            จำนวนเงิน
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            หมวดหมู่
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          >
            <option value="food">อาหาร</option>
            <option value="transport">ขนส่ง</option>
            <option value="shopping">ช้อปปิ้ง</option>
            <option value="bills">ค่าบิล</option>
            <option value="entertainment">ความบันเทิง</option>
            <option value="health">สุขภาพ</option>
            <option value="other">อื่น ๆ</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            className="app-btn app-btn-secondary"
            style={{ flex: 1 }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="app-btn app-btn-primary"
            style={{ flex: 1 }}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
