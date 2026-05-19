
import { useRef, useEffect, forwardRef } from 'react';
import type { KeyboardEvent } from 'react';

interface QuickAddExpenseProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const QuickAddExpense = forwardRef<HTMLInputElement, QuickAddExpenseProps>(
  ({ value, onChange, onSubmit, disabled }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Autofocus on mount
    useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
    }, []);

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter' && !disabled) {
        onSubmit();
      }
    }

    // Allow parent to control ref for focus recovery
    const setRefs = (el: HTMLInputElement | null) => {
      (inputRef as any).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref && typeof ref === 'object') (ref as any).current = el;
    };

    return (
      <div className="quick-add-wrap">
        <input
          ref={setRefs}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ข้าว 50"
          aria-label="เพิ่มค่าใช้จ่าย"
          className="quick-add-input"
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    );
  }
);

export default QuickAddExpense;
