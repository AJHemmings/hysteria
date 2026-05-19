import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import './DatePicker.css';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

function parseDate(str: string): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function displayDate(str: string): string {
  const date = parseDate(str);
  if (!date) return str;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DatePicker({ value, onChange, placeholder = 'Select a date', required, id }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = parseDate(value);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(formatDate(date));
      setOpen(false);
    }
  };

  return (
    <div className="dp-container" ref={containerRef}>
      <button
        type="button"
        id={id}
        className={`dp-trigger form-input${value ? '' : ' dp-trigger--empty'}`}
        onClick={() => setOpen((o) => !o)}
        aria-required={required}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span>{value ? displayDate(value) : placeholder}</span>
        <svg className="dp-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="7" y1="2" x2="7" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="2" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div className="dp-popover glass-card" role="dialog" aria-label="Calendar">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? new Date()}
            disabled={{ before: new Date() }}
            captionLayout="dropdown"
            startMonth={new Date()}
            endMonth={new Date(new Date().getFullYear() + 3, 11)}
            classNames={{
              root: 'dp',
              months: 'dp__months',
              month: 'dp__month',
              month_caption: 'dp__caption',
              caption_label: 'dp__caption-label',
              dropdowns: 'dp__dropdowns',
              dropdown_root: 'dp__dropdown-root',
              dropdown: 'dp__dropdown',
              months_dropdown: 'dp__months-dropdown',
              years_dropdown: 'dp__years-dropdown',
              nav: 'dp__nav',
              button_previous: 'dp__nav-btn',
              button_next: 'dp__nav-btn',
              chevron: 'dp__chevron',
              month_grid: 'dp__month-grid',
              weekdays: 'dp__weekdays',
              weekday: 'dp__weekday',
              weeks: 'dp__weeks',
              week: 'dp__week',
              day: 'dp__day',
              day_button: 'dp__day-btn',
              today: 'dp__day--today',
              selected: 'dp__day--selected',
              outside: 'dp__day--outside',
              disabled: 'dp__day--disabled',
            }}
          />
        </div>
      )}
    </div>
  );
}
