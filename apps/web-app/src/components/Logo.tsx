import React from 'react';

export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield Background - Represents Security */}
      <path
        d="M50 5 L85 20 L85 45 Q85 70 50 95 Q15 70 15 45 L15 20 Z"
        fill="url(#shieldGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Dollar Sign - Finance Symbol */}
      <g transform="translate(50, 50)">
        {/* Top curve */}
        <path
          d="M-8 -15 Q-8 -25 0 -25 Q8 -25 8 -15"
          stroke="#ffffff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bottom curve */}
        <path
          d="M8 15 Q8 25 0 25 Q-8 25 -8 15"
          stroke="#ffffff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Vertical line */}
        <line
          x1="0"
          y1="-30"
          x2="0"
          y2="30"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoWithText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-10 w-10" />
      <div className="flex flex-col">
        <span className="text-xl font-display font-bold text-neutral-900">Finance Agent</span>
        <span className="text-xs text-neutral-500 font-medium tracking-wide">
          SECURE TAX DOCUMENTS
        </span>
      </div>
    </div>
  );
}
