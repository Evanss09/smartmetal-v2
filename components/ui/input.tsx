'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={`bg-surface border border-neutral-800 text-neutral-100 px-4 py-3 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 transition-colors duration-150 w-full ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
