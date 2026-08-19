// ─────────────────────────────────────────────────────────────
// Drape Studio — 3D Viewport (Engine Integration Boundary)
// ─────────────────────────────────────────────────────────────
//
// Mounts the existing custom WebGL 3D engine via DrapeEngineAdapter.
// Exposes camera controls (Front, Back, Left, Right, Reset)
// while keeping React decoupled from GPU rendering details.
// ─────────────────────────────────────────────────────────────

import { useRef, useEffect, useState, useCallback } from 'react';
import type { DrapeStudioViewportProps } from '../../types/studio';
import { DrapeEngineAdapter, type CameraPreset } from '../../engine/DrapeEngineAdapter';
import { useStudioState } from '../../state/studioState';
import './DrapeStudioViewport.css';

export function DrapeStudioViewport({ onReady, className = '' }: DrapeStudioViewportProps) {
  const { state } = useStudioState();
  const engineMountRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<DrapeEngineAdapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize engine on mount
  useEffect(() => {
    let isSubscribed = true;

    if (engineMountRef.current && !adapterRef.current) {
      const adapter = new DrapeEngineAdapter();
      adapterRef.current = adapter;

      adapter
        .initialize(engineMountRef.current, {
          onLoaded: () => {
            if (isSubscribed) {
              setIsLoading(false);
              // Apply initial customization options to WebGL 3D model
              adapter.updateCustomization(state);
              if (onReady) onReady();
            }
          },
        })
        .catch(err => {
          console.warn('3D Studio Engine Initialization:', err);
          if (isSubscribed) {
            setIsLoading(false);
          }
        });
    }

    // Clean up on unmount
    return () => {
      isSubscribed = false;
      if (adapterRef.current) {
        adapterRef.current.dispose();
        adapterRef.current = null;
      }
    };
  }, [onReady]);

  // Reactive 3D PBR Material & Mesh Customization Update
  useEffect(() => {
    if (adapterRef.current && !isLoading) {
      adapterRef.current.updateCustomization(state);
    }
  }, [state, isLoading]);

  // Camera preset handlers
  const handlePreset = useCallback((preset: CameraPreset) => {
    if (adapterRef.current) {
      adapterRef.current.setCameraPreset(preset);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (adapterRef.current) {
      adapterRef.current.resetCamera();
    }
  }, []);

  return (
    <div className={`ds-viewport ds-animate-fade-in ${className}`.trim()}>
      {/* 3D Engine Mount Point */}
      <div ref={engineMountRef} className="ds-viewport__engine-mount" />

      {/* Showroom Corner Framing Accents */}
      <div className="ds-viewport__corner ds-viewport__corner--tl" />
      <div className="ds-viewport__corner ds-viewport__corner--tr" />
      <div className="ds-viewport__corner ds-viewport__corner--bl" />
      <div className="ds-viewport__corner ds-viewport__corner--br" />

      {/* Floating Camera Preset Controls */}
      <div className="ds-viewport__presets" aria-label="Camera presets">
        <button
          type="button"
          className="ds-viewport__preset-btn"
          onClick={() => handlePreset('front')}
          title="Front View"
        >
          Front
        </button>
        <button
          type="button"
          className="ds-viewport__preset-btn"
          onClick={() => handlePreset('back')}
          title="Back View"
        >
          Back
        </button>
        <button
          type="button"
          className="ds-viewport__preset-btn"
          onClick={() => handlePreset('left')}
          title="Left View"
        >
          Left
        </button>
        <button
          type="button"
          className="ds-viewport__preset-btn"
          onClick={() => handlePreset('right')}
          title="Right View"
        >
          Right
        </button>
        <button
          type="button"
          className="ds-viewport__preset-btn ds-viewport__preset-btn--reset"
          onClick={handleReset}
          title="Reset View"
        >
          Reset
        </button>
      </div>

      {/* Interaction Hints Overlay */}
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

      {/* Polished Loading State Overlay */}
      {isLoading && (
        <div className="ds-viewport__loading">
          <div className="ds-viewport__loading-spinner" />
          <p className="ds-viewport__loading-text">Preparing your 3D studio...</p>
        </div>
      )}
    </div>
  );
}
