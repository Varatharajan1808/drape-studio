// ─────────────────────────────────────────────────────────────
// Drape Studio — App Root
// ─────────────────────────────────────────────────────────────

import { Header } from './components/layout/Header';
import { StudioPage } from './pages/Studio/StudioPage';

export function App() {
  return (
    <>
      <Header />
      <StudioPage />
    </>
  );
}
