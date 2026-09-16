# Static RSC tree

The application is a build-time React Server Components tree with browser-only interaction islands and no request-time server contract.

## Build-time ownership

Static pages, navigation, guidance, labels, and layout composition belong to Server Components and are rendered by FUNSTACK Static during the build.

The root boundary is [[src/app/Root.tsx]], and route composition starts at [[src/pages/page.tsx]]. The build entry [[src/app/build.ts]] is a release/build concern, not a runtime server or a CI build job.

## Client islands

Client Components are limited to browser interaction, DOM integration, local pending UI, and access to browser persistence APIs.

The current islands are [[src/app/runtime/DraftRuntime.tsx]], [[src/widgets/editor/ui/WriteEditorIsland.tsx]], [[src/widgets/preview/ui/PreviewIsland.tsx]], [[src/widgets/structure/ui/StructureIsland.tsx]], and [[src/widgets/workspace/ui/WorkspaceClientShell.tsx]]. Static content is passed through them by composition instead of being reimplemented inside a client subtree.

## Server-through-client composition

Interactive shells receive static Server Component content through children or slots so that a browser feature does not pull an entire page into the client bundle.

Workspace, preview, structure, audit, and handbook static content remains in the corresponding `rsc/` components under `src/widgets`, including [[src/widgets/workspace/rsc/WorkspaceLayout.tsx]]. Interaction wrappers are kept in adjacent `ui/` files and own only their browser behavior.

## Feature-slice layout

Source files are grouped by ownership: domain entities live in `entities`, user capabilities in `features`, composed screen parts in `widgets`, route composition in `pages`, application wiring in `app`, and cross-feature primitives in `shared`.

React components use PascalCase filenames, processing modules and schemas use camelCase filenames, feature directories use kebab-case, and framework-reserved `page.tsx` is the only deliberate component-name exception. Tests mirror the same ownership tree under [[tests/shared/validation.test.ts]].

`konsistent.json` makes these boundaries executable: a widget or feature cannot place a React component directly at its slice root, and route `page.tsx`/`layout.tsx` names remain explicit framework exceptions.

## No runtime server

The production artifact is static and does not depend on API routes, route handlers, Server Actions, Server Functions, or request-time dynamic fetches.

Browser persistence and browser export are deliberately isolated from build-time RSC code. Optional SQLite-related packages must never become a runtime data source or a client bundle dependency.
