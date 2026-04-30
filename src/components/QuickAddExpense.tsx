
import { useRef, useEffect, forwardRef } from 'react';

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

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          ref={setRefs}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ข้าว 50"
          aria-label="เพิ่มค่าใช้จ่าย"
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            boxSizing: 'border-box',
          }}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    );
  }
);

export default QuickAddExpense;
