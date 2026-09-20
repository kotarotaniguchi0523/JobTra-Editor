import type { ReactNode } from 'react';
import { HeaderBrand, HeaderStaticLinks } from '@widgets/workspace/rsc/HeaderBrand';

interface WorkspaceHeaderFrameProps {
  brandSlot?: ReactNode;
  linksSlot?: ReactNode;
  menuSlot: ReactNode;
  actionsSlot: ReactNode;
}

/** Static header geometry and server-rendered brand/navigation slots. */
export function WorkspaceHeaderFrame({
  brandSlot,
  linksSlot,
  menuSlot,
  actionsSlot,
}: WorkspaceHeaderFrameProps) {
  return (
    <header
      id="app-top-header"
      className="z-20 flex min-h-[48px] shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-2.5 py-1.5 sm:min-h-[52px] sm:px-4 sm:py-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
        {menuSlot}
        {brandSlot ?? <HeaderBrand />}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="hidden 2xl:block">{linksSlot ?? <HeaderStaticLinks />}</div>
        {actionsSlot}
      </div>
    </header>
  );
}
