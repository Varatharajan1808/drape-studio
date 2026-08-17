// ─────────────────────────────────────────────────────────────
// Drape Studio — Page Container Component
// ─────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import './PageContainer.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`ds-page-container ${className}`.trim()}>
      {children}
    </div>
  );
}
