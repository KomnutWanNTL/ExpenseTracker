import { useRef, useState } from 'react';
import type { Category, Expense } from '../types/expense';
import ConfirmModal from './ConfirmModal';

interface ImportExpensesProps {
  onImport: (expenses: Expense[]) => void;
  disabled?: boolean;
}

const CATEGORY_LABELS: Record<string, Category> = {
  'อาหาร': 'food',
  'เดินทาง': 'transport',
  'ช็อปปิ้ง': 'shopping',
  'บิล': 'bills',
  'บันเทิง': 'entertainment',
  'สุขภาพ': 'health',
  'ครอบครัว': 'family',
  'อื่น ๆ': 'other',
};

const VALID_CATEGORIES: Category[] = [
  'food', 'transport', 'shopping', 'bills',
  'entertainment', 'health', 'family', 'other',
];

function parseCSV(csv: string): Expense[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  if (headers.includes('id') && headers.includes('date') && headers.includes('category')) {
    const idx = (name: string) => headers.findIndex(h => h === name);
    return lines.slice(1).map(line => {
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
      const rawCategory = cols[idx('category')].replace(/^"|"$/g, '').trim();
      const mappedCategory = CATEGORY_LABELS[rawCategory] ?? rawCategory;
      const category: Category = VALID_CATEGORIES.includes(mappedCategory as Category)
        ? (mappedCategory as Category)
        : 'other';
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

function mergeExpenses(existing: Expense[], imported: Expense[], updateExisting: boolean): Expense[] {
  if (!updateExisting) {
    const existingIds = new Set(existing.map(e => e.id));
    return [...imported.filter(i => !existingIds.has(i.id)), ...existing];
  }
  const existingMap = new Map(existing.map(e => [e.id, e]));
  for (const imp of imported) {
    if (imp.id) existingMap.set(imp.id, imp);
  }
  const merged = Array.from(existingMap.values());
  for (const imp of imported) {
    if (!imp.id || !existingMap.has(imp.id)) merged.push(imp);
  }
  return merged;
}

export default function ImportExpenses({ onImport, disabled = false }: ImportExpensesProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Expense[] | null>(null);
  const [pendingUpdateCount, setPendingUpdateCount] = useState(0);

  function getCurrentExpenses(): Expense[] {
    try {
      const raw = localStorage.getItem('expenses');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.expenses)) return parsed.expenses;
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
      const existingIds = new Set(current.map(e => e.id));
      const updateCount = imported.filter(i => i.id && existingIds.has(i.id)).length;
      if (updateCount > 0) {
        setPendingImport(imported);
        setPendingUpdateCount(updateCount);
      } else {
        doImport(current, imported, false);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  function doImport(current: Expense[], imported: Expense[], updateExisting: boolean) {
    const merged = mergeExpenses(current, imported, updateExisting);
    try {
      localStorage.setItem('expenses', JSON.stringify({ expenses: merged }));
    } catch {}
    onImport(merged);
  }

  function handleImportConfirm() {
    if (!pendingImport) return;
    const current = getCurrentExpenses();
    doImport(current, pendingImport, true);
    setPendingImport(null);
    setPendingUpdateCount(0);
  }

  function handleImportCancel() {
    if (!pendingImport) return;
    const current = getCurrentExpenses();
    doImport(current, pendingImport, false);
    setPendingImport(null);
    setPendingUpdateCount(0);
  }

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
        disabled={disabled}
      >
        Import Transaction
      </button>

      <ConfirmModal
        open={pendingImport !== null}
        title="นำเข้าข้อมูล"
        message={`พบข้อมูลซ้ำจำนวน ${pendingUpdateCount} รายการ\nต้องการอัปเดตข้อมูลเดิมหรือไม่?`}
        confirmLabel="อัปเดต"
        cancelLabel="ข้ามรายการซ้ำ"
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
      />
    </>
  );
}
