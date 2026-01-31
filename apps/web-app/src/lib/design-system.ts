// Design System Constants
export const colors = {
  primary: {
    name: 'Deep Blue',
    description: 'Trust, professionalism, and reliability',
    main: '#2563eb',
  },
  secondary: {
    name: 'Emerald Green',
    description: 'Growth, success, and verification',
    main: '#10b981',
  },
  accent: {
    name: 'Amber',
    description: 'Important actions and highlights',
    main: '#f59e0b',
  },
} as const;

export const typography = {
  fontFamilies: {
    sans: 'Inter, system-ui, sans-serif',
    display: 'Cal Sans, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  soft: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
  medium: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
  hard: '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
} as const;
