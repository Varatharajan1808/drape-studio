// ─────────────────────────────────────────────────────────────
// Drape Studio — Button Component
// ─────────────────────────────────────────────────────────────

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  badge?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  badge,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ds-button ds-button--${variant} ds-button--${size} ${className}`.trim()}
      {...props}
    >
      {children}
      {badge && <span className="ds-button__badge">{badge}</span>}
    </button>
  );
}
