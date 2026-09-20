import type { ReactNode } from 'react';

interface WorkspaceFrameProps {
  sidebar: ReactNode;
  header: ReactNode;
  draftBar: ReactNode;
  content: ReactNode;
  sidePanel: ReactNode;
  overlays: ReactNode;
}

/**
 * Static workspace geometry. Interactive leaves are supplied as slots so the
 * shell itself stays in the build-time RSC tree.
 */
export function WorkspaceFrame({
  sidebar,
  header,
  draftBar,
  content,
  sidePanel,
  overlays,
}: WorkspaceFrameProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-100 font-sans text-neutral-900">
      {sidebar}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {header}
        {draftBar}

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-5">{content}</main>
          {sidePanel}
        </div>
      </div>

      {overlays}
    </div>
  );
}
