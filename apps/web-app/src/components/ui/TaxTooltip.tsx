import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle, Info, BookOpen, ExternalLink } from 'lucide-react';

interface TooltipProps {
  term: string;
  description: string;
  example?: string;
  link?: string;
  children: React.ReactNode;
  icon?: 'help' | 'info' | 'book';
}

export const TaxTooltip: React.FC<TooltipProps> = ({
  term,
  description,
  example,
  link,
  children,
  icon = 'help',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If not enough space below, show above
      setPosition(spaceBelow < 250 && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  }, [isOpen]);

  const IconComponent = {
    help: HelpCircle,
    info: Info,
    book: BookOpen,
  }[icon];

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        className="inline-flex items-center gap-1 cursor-help group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="border-b border-dotted border-neutral-400 group-hover:border-primary-500 transition-colors">
          {children}
        </span>
        <IconComponent className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors shrink-0" />
      </div>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className={cn(
              'absolute z-50 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-neutral-200 p-4',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              position === 'bottom'
                ? 'top-full left-1/2 -translate-x-1/2 mt-2'
                : 'bottom-full left-1/2 -translate-x-1/2 mb-2'
            )}
          >
            {/* Arrow */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-neutral-200 rotate-45',
                position === 'bottom'
                  ? 'top-0 -translate-y-1/2 border-t border-l'
                  : 'bottom-0 translate-y-1/2 border-b border-r'
              )}
            />

            <div className="relative">
              <h4 className="font-semibold text-primary-900 mb-2 text-sm">{term}</h4>
              <p className="text-sm text-neutral-700 mb-2 leading-relaxed">{description}</p>

              {example && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-xs font-medium text-blue-900 mb-1">💡 Example:</p>
                  <p className="text-xs text-blue-800 leading-relaxed">{example}</p>
                </div>
              )}

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Learn more on CRA website
                </a>
              )}

              {/* Mobile close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden absolute top-0 right-0 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaxTooltip;
