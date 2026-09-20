# Static RSC tree

The application is a build-time React Server Components tree with browser-only interaction islands and no request-time server contract.

## Build-time ownership

Static pages, navigation, guidance, labels, and layout composition belong to Server Components and are rendered by FUNSTACK Static during the build.

The root boundary is [[src/app/Root.tsx]], and workspace route composition starts at [[src/pages/(workspace)/page.tsx]]. The build entry [[src/app/build.ts]] is a release/build concern, not a runtime server or a CI build job.

## Client islands

Client Components are limited to browser interaction, DOM integration, local pending UI, and access to browser persistence APIs.

The current islands are [[src/app/runtime/DraftRuntime.tsx]], [[src/widgets/editor/ui/WriteEditorIsland.tsx]], [[src/widgets/preview/ui/PreviewIsland.tsx]], [[src/widgets/structure/ui/StructureIsland.tsx]], the workspace leaves under [[src/widgets/workspace/ui/WorkspaceInteractionProvider.tsx]], and the writing-only [[src/features/webmcp/ui/WebMcpIsland.tsx]]. Static content is passed through them by composition instead of being reimplemented inside a client subtree.

Leaf DOM behavior stays below those islands: [[src/widgets/editor/ui/DeferredTextarea.tsx]] owns textarea sizing and cursor integration, and the workspace header progressively removes labels and static links before controls can collide at narrow desktop widths.

## Server-through-client composition

Interactive shells receive static Server Component content through children or slots so that a browser feature does not pull an entire page into the client bundle.

Workspace, preview, structure, audit, and handbook static content remains in the corresponding `rsc/` components under `src/widgets`, including [[src/widgets/workspace/rsc/WorkspaceLayout.tsx]], [[src/widgets/workspace/rsc/WorkspaceFrame.tsx]], and [[src/widgets/workspace/rsc/WorkspaceHeaderFrame.tsx]]. The workspace layout supplies these Server Component frames with client leaves such as [[src/widgets/workspace/ui/WorkspaceSidebarIsland.tsx]] and [[src/widgets/workspace/ui/WorkspaceContentIsland.tsx]]; route-provided RSC slots remain server-owned.

The browser-only draft bootstrap is scoped to [[src/pages/(workspace)/layout.tsx]], so marketing and guide routes use only the static root layout. Optional handbook, audit, export, and device-sync panels are mounted on demand by [[src/widgets/workspace/ui/WorkspaceAuxiliaryPanels.tsx]] rather than prefetching hidden deferred payloads on every workspace page.

## RSC boundary regression

The boundary regression test verifies that static workspace geometry stays server-owned and that DraftRuntime is not mounted by the root layout.

The test is maintained at [[tests/architecture/rscBoundary.test.ts]] so a future refactor cannot silently restore the former client-owned shell.

## Feature-slice layout

Source files are grouped by ownership: domain entities live in `entities`, user capabilities in `features`, composed screen parts in `widgets`, route composition in `pages`, application wiring in `app`, and cross-feature primitives in `shared`.

Shared types and pure helpers follow the same ownership rule: domain and protocol types stay in the owning entity or feature `model/` slice, UI props stay with their widget, and `shared/` contains only behavior that has no feature-specific meaning. Runtime types are derived from the Valibot schema that owns their boundary instead of being duplicated in consumers.

React components use PascalCase filenames, processing modules and schemas use camelCase filenames, feature directories use kebab-case, and framework-reserved `page.tsx` is the only deliberate component-name exception. Tests mirror the same ownership tree under [[tests/shared/validation.test.ts]].

`konsistent.json` makes these boundaries executable: a widget or feature cannot place a React component directly at its slice root, and route `page.tsx`/`layout.tsx` names remain explicit framework exceptions.

## No runtime server

The production artifact is static and does not depend on API routes, route handlers, Server Actions, Server Functions, or request-time dynamic fetches.

Browser persistence and browser export are deliberately isolated from build-time RSC code. The draft persistence island may load Dexie Cloud only when a public build-time URL is configured; the server tree never owns the database or credentials. Optional SQLite-related packages must never become a runtime data source or a client bundle dependency.
