
import { useRef, useEffect, forwardRef } from 'react';
import type { KeyboardEvent } from 'react';

interface QuickAddExpenseProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const QuickAddExpense = forwardRef<HTMLTextAreaElement, QuickAddExpenseProps>(
  ({ value, onChange, onSubmit, disabled }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, []);

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled) onSubmit();
      }
    }

    const setRefs = (el: HTMLTextAreaElement | null) => {
      (textareaRef as any).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref && typeof ref === 'object') (ref as any).current = el;
    };

    return (
      <div className="quick-add-wrap">
        <textarea
          ref={setRefs}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ข้าว 50&#10;กาแฟ 35&#10;น้ำ 20"
          aria-label="เพิ่มค่าใช้จ่ายหลายรายการ"
          className="quick-add-input quick-add-textarea"
          autoComplete="off"
          disabled={disabled}
          rows={3}
        />
        <button
          type="button"
          className="quick-add-submit"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          aria-label="บันทึกรายจ่าย"
        >
          + เพิ่ม
        </button>
      </div>
    );
  }
);

export default QuickAddExpense;
