// ─────────────────────────────────────────────────────────────
// Drape Studio — Studio Page
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
          {/* 3D Viewport — Engine Integration Boundary */}
          <section className="ds-studio-page__viewport">
            <DrapeStudioViewport />
          </section>

          {/* Customization Controls */}
          <section className="ds-studio-page__customization">
            <CustomizationPanel />
          </section>

          {/* Actions */}
          <section className="ds-studio-page__actions">
            <StudioActions />
          </section>
        </PageContainer>
      </main>
    </StudioStateProvider>
  );
}
