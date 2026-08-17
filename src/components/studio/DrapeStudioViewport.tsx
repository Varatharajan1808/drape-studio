// ─────────────────────────────────────────────────────────────
// Drape Studio — 3D Viewport (Integration Boundary)
// ─────────────────────────────────────────────────────────────

import { useRef, useEffect } from 'react';
import type { DrapeStudioViewportProps } from '../../types/studio';
import './DrapeStudioViewport.css';

function SareeSilhouette() {
  return (
    <div className="ds-viewport__silhouette">
      <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Head */}
        <ellipse cx="60" cy="22" rx="12" ry="14" stroke="currentColor" strokeWidth="1.2" />
        {/* Neck */}
        <line x1="60" y1="36" x2="60" y2="46" stroke="currentColor" strokeWidth="1.2" />
        {/* Shoulders */}
        <path d="M60 46 C60 46, 38 48, 30 56" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 46 C60 46, 82 48, 90 56" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Torso / blouse */}
        <path d="M30 56 L28 90 Q28 92 30 92 L50 94" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M90 56 L92 90 Q92 92 90 92 L70 94" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Waist */}
        <path d="M50 94 Q60 96 70 94" stroke="currentColor" strokeWidth="1" />
        {/* Saree drape — flowing curves */}
        <path
          d="M50 94 C46 110, 32 130, 28 155 Q26 170, 34 185 L86 185 Q94 170, 92 155 C88 130, 74 110, 70 94"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Pallu drape over shoulder */}
        <path
          d="M90 56 C94 60, 98 70, 96 82 Q94 90, 86 96 C78 102, 60 105, 54 110"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 2"
          opacity="0.6"
        />
        {/* Saree pleats */}
        <path d="M48 140 L52 185" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <path d="M54 138 L56 185" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <path d="M60 136 L60 185" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <path d="M66 138 L64 185" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <path d="M72 140 L68 185" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        {/* Floor line */}
        <line x1="28" y1="185" x2="92" y2="185" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </svg>
    </div>
  );
}

export function DrapeStudioViewport({ onReady, className = '' }: DrapeStudioViewportProps) {
  const engineMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (engineMountRef.current && onReady) {
      onReady();
    }
  }, [onReady]);

  return (
    <div className={`ds-viewport ds-animate-fade-in ${className}`.trim()}>
      <div ref={engineMountRef} className="ds-viewport__engine-mount" />

      <div className="ds-viewport__stage">
        <div className="ds-viewport__corner ds-viewport__corner--tl" />
        <div className="ds-viewport__corner ds-viewport__corner--tr" />
        <div className="ds-viewport__corner ds-viewport__corner--bl" />
        <div className="ds-viewport__corner ds-viewport__corner--br" />

        <div className="ds-viewport__content">
          <SareeSilhouette />
          <h2 className="ds-viewport__title">3D Saree Preview</h2>
          <p className="ds-viewport__subtitle">
            Your interactive saree experience will appear here
          </p>
        </div>

        <div className="ds-viewport__shimmer" />
      </div>

      <div className="ds-viewport__hints">
        <span className="ds-viewport__hint">
          <span className="ds-viewport__hint-icon" aria-hidden="true">↔</span>
          Drag to rotate
        </span>
        <span className="ds-viewport__hint">
          <span className="ds-viewport__hint-icon" aria-hidden="true">⌕</span>
          Scroll to zoom
        </span>
      </div>
    </div>
  );
}
