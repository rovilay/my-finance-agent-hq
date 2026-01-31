import React from 'react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line no-undef
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// eslint-disable-next-line no-undef
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
        )}
        <input
          type={type}
          className={cn('input', error && 'input-error', className)}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// eslint-disable-next-line no-undef
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// eslint-disable-next-line no-undef
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
        )}
        <textarea
          className={cn('input min-h-[100px] resize-y', error && 'input-error', className)}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
