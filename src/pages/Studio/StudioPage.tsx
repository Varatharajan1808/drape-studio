// ─────────────────────────────────────────────────────────────
// Drape Studio — Studio Page (Sticky 3D Viewport + Customization)
// ─────────────────────────────────────────────────────────────

import { StudioStateProvider } from '../../state/studioState';
import { PageContainer } from '../../components/layout/PageContainer';
import { DrapeStudioViewport } from '../../components/studio/DrapeStudioViewport';
import { CustomizationPanel } from '../../components/studio/CustomizationPanel';
import { StudioActions } from '../../components/studio/StudioActions';
import './StudioPage.css';

export function StudioPage() {
  return (
    <StudioStateProvider>
      <main className="ds-studio-page">
        <PageContainer>
          <div className="ds-studio-page__grid">
            {/* Left Column — Sticky 3D Viewport (Always visible while scrolling options) */}
            <section className="ds-studio-page__viewport-col">
              <div className="ds-studio-page__sticky-wrapper">
                <DrapeStudioViewport />
              </div>
            </section>

            {/* Right Column — Scrollable Customization Controls */}
            <section className="ds-studio-page__customization-col">
              <CustomizationPanel />
              <div className="ds-studio-page__actions">
                <StudioActions />
              </div>
            </section>
          </div>
        </PageContainer>
      </main>
    </StudioStateProvider>
  );
}
