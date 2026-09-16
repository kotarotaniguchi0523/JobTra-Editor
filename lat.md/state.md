# Browser-local draft state

Draft data is authoritative in a browser-local external store backed by IndexedDB with a localStorage fallback, not in a server database or a React Provider tree.

## Authoritative sources

The external store in [[src/entities/draft/model/draftStore.ts]] owns the in-memory snapshot and publishes it through `useSyncExternalStore`.

The URL owns shareable selection state such as the active draft id; [[src/shared/validation/searchParams.ts]] validates and normalizes that boundary. Props and render-time derivation are preferred over copies of props in state.

## Persistence boundary

[[src/entities/draft/storage/indexedDbStorage.ts]] is the only persistence adapter for drafts and falls back to localStorage when IndexedDB is unavailable.

All loaded and stored data crosses the Valibot schemas in [[src/shared/validation/draftSchemas.ts]]. Persistence is browser-only and asynchronous, so it is never required for the static build to render.

## State ownership

Each island owns only the interaction state that has an independent lifecycle: active export tab, export options, pending action state, editor cursor position, short-lived panel state, and browser API handles.

Derived values such as character counts, audit results, deferred projections, and selected labels are calculated from authoritative props or store snapshots during render rather than synchronized with Effects.

## Async interaction model

Urgent typing and pointer feedback stays synchronous; navigation, persistence completion, panel replacement, and other non-urgent updates use transitions where they improve responsiveness.

`useEffect` is reserved for external synchronization, such as bootstrapping the browser store and reflecting store/URL changes. Optimistic local edits are conditionally rolled back only when an asynchronous persistence operation fails.
