// ─────────────────────────────────────────────────────────────
// Drape Studio — Entry Point
// ─────────────────────────────────────────────────────────────

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
