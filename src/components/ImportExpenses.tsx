import React, { useRef } from 'react';
import type { Expense } from '../types/expense';

interface ImportExpensesProps {
  onImport: (expenses: Expense[]) => void;
}

// Map Thai category label back to key
const CATEGORY_LABELS: Record<string, string> = {
  'อาหาร': 'food',
  'เดินทาง': 'transport',
  'ช็อปปิ้ง': 'shopping',
  'บิล': 'bills',
  'บันเทิง': 'entertainment',
  'สุขภาพ': 'health',
  'อื่น ๆ': 'other',
};

function parseCSV(csv: string): Expense[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  // Only support new export format: id, date, category, note, amount, createdAt
  if (headers.includes('id') && headers.includes('date') && headers.includes('category')) {
    const idx = (name: string) => headers.findIndex(h => h === name);
    return lines.slice(1).map(line => {
      // Split CSV line with support for quoted cells
      const cols: string[] = [];
      let cur = '', inQuotes = false;
      for (let i = 0; i < line.length; ++i) {
        const c = line[i];
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"'; ++i;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          cols.push(cur); cur = '';
        } else {
          cur += c;
        }
      }
      cols.push(cur);
      // Map Thai label to key if needed
      let category = cols[idx('category')].replace(/^"|"$/g, '').trim();
      if (Object.keys(CATEGORY_LABELS).includes(category)) {
        category = CATEGORY_LABELS[category];
      }
      let id = cols[idx('id')].replace(/^"|"$/g, '').trim();
      if (!id) id = crypto.randomUUID();
      return {
        id,
        date: cols[idx('date')].replace(/^"|"$/g, '').trim(),
        category,
        note: cols[idx('note')].replace(/^"|"$/g, '').trim(),
        amount: Number(cols[idx('amount')]),
        createdAt: cols[idx('createdAt')].replace(/^"|"$/g, '').trim(),
      };
    });
  }
  return [];
}


// Merge logic: update if id exists, insert if new
function mergeExpensesWithConfirmation(existing: Expense[], imported: Expense[]): Expense[] | null {
  const existingMap = new Map(existing.map(e => [e.id, e]));
  const toUpdate: Expense[] = [];
  const toInsert: Expense[] = [];
  for (const imp of imported) {
    if (imp.id && existingMap.has(imp.id)) {
      toUpdate.push(imp);
    } else {
      toInsert.push(imp);
    }
  }
  if (toUpdate.length > 0) {
    const confirmMsg = `พบข้อมูลซ้ำจำนวน ${toUpdate.length} รายการ\nต้องการอัปเดตข้อมูลเดิมหรือไม่?\n(OK = อัปเดต, Cancel = ข้าม)`;
    if (!window.confirm(confirmMsg)) return null;
  }
  // Update: replace by id, Insert: append
  const updated = existing.map(e => {
    const found = toUpdate.find(i => i.id === e.id);
    return found ? found : e;
  });
  return [...toInsert, ...updated];
}

const ImportExpenses: React.FC<ImportExpensesProps> = ({ onImport }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  // Get current expenses from localStorage (sync with app)
  function getCurrentExpenses(): Expense[] {
    try {
      const raw = localStorage.getItem('expenses');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.expenses)) return parsed.expenses;
      // fallback for old format
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch { return []; }
  }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const imported = parseCSV(text);
      if (imported.length === 0) {
        alert('ไฟล์ไม่ถูกต้องหรือไม่มีข้อมูล');
        return;
      }
      const current = getCurrentExpenses();
      const merged = mergeExpensesWithConfirmation(current, imported);
      if (!merged) return; // user cancelled
      // Save to localStorage in correct payload shape
      try {
        localStorage.setItem('expenses', JSON.stringify({ expenses: merged }));
      } catch {}
      onImport(merged);
    };
    reader.readAsText(file, 'utf-8');
  };
  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <button
        className="header-btn import-btn"
        style={{ minWidth: 0 }}
        onClick={() => fileInput.current?.click()}
      >
        Import
      </button>
    </>
  );
};

export default ImportExpenses;
