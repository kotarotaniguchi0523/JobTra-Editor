import type { ReactNode } from 'react';
import { WorkspaceFrame } from '@widgets/workspace/rsc/WorkspaceFrame';
import { WorkspaceHeaderFrame } from '@widgets/workspace/rsc/WorkspaceHeaderFrame';
import { WorkspaceAuxiliaryPanels } from '@widgets/workspace/ui/WorkspaceAuxiliaryPanels';
import { WorkspaceContentIsland } from '@widgets/workspace/ui/WorkspaceContentIsland';
import { WorkspaceDraftBarIsland } from '@widgets/workspace/ui/WorkspaceDraftBarIsland';
import { WorkspaceHeaderActionsIsland } from '@widgets/workspace/ui/WorkspaceHeaderActionsIsland';
import { WorkspaceHeaderMenuIsland } from '@widgets/workspace/ui/WorkspaceHeaderMenuIsland';
import { WorkspaceInteractionProvider } from '@widgets/workspace/ui/WorkspaceInteractionProvider';
import { WorkspaceSidebarIsland } from '@widgets/workspace/ui/WorkspaceSidebarIsland';
import type { WorkspaceMode } from '@widgets/workspace/ui/types';

export interface WorkspaceLayoutProps {
  children: ReactNode;
  activeMode: WorkspaceMode;
  brandSlot?: ReactNode;
  linksSlot?: ReactNode;
  handbookSlot?: ReactNode;
  guidelinesSlot?: ReactNode;
  sidebarFooterSlot?: ReactNode;
  emptyDraftGuideSlot?: ReactNode;
}

/**
 * Server-owned composition boundary. The static frame and route-provided RSC
 * slots stay here, while browser state is shared only by small client leaves.
 */
export function WorkspaceLayout(props: WorkspaceLayoutProps) {
  return (
    <WorkspaceInteractionProvider activeMode={props.activeMode}>
      <WorkspaceFrame
        sidebar={<WorkspaceSidebarIsland footerSlot={props.sidebarFooterSlot} />}
        header={
          <WorkspaceHeaderFrame
            brandSlot={props.brandSlot}
            linksSlot={props.linksSlot}
            menuSlot={<WorkspaceHeaderMenuIsland />}
            actionsSlot={<WorkspaceHeaderActionsIsland />}
          />
        }
        draftBar={<WorkspaceDraftBarIsland />}
        content={
          <WorkspaceContentIsland emptyDraftGuideSlot={props.emptyDraftGuideSlot}>
            {props.children}
          </WorkspaceContentIsland>
        }
        sidePanel={
          <WorkspaceAuxiliaryPanels
            handbookSlot={props.handbookSlot}
            guidelinesSlot={props.guidelinesSlot}
          />
        }
        overlays={null}
      />
    </WorkspaceInteractionProvider>
  );
}
