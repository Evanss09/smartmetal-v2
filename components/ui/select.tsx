'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`bg-surface border border-neutral-800 text-neutral-100 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors duration-150 w-full appearance-none cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
