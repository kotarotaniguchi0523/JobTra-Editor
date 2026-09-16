import {
  WorkspaceClientShell,
  type WorkspaceClientShellProps,
} from '@widgets/workspace/ui/WorkspaceClientShell';

type WorkspaceLayoutProps = WorkspaceClientShellProps;

/**
 * Server-owned composition boundary. Route pages keep static RSC slots and
 * pass only the interactive island through to the client shell.
 */
export function WorkspaceLayout(props: WorkspaceLayoutProps) {
  return <WorkspaceClientShell {...props} />;
}
