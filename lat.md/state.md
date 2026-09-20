# Browser-local draft state

Draft data is authoritative in a browser-local external store backed by IndexedDB with a localStorage fallback, not in a server database or a React Provider tree.

## Authoritative sources

The external store in [[src/entities/draft/model/draftStore.ts]] owns the in-memory snapshot and publishes it through `useSyncExternalStore`.

The URL owns shareable selection state such as the active draft id; [[src/shared/validation/searchParams.ts]] validates and normalizes that boundary. Props and render-time derivation are preferred over copies of props in state.

## Persistence boundary

[[src/entities/draft/storage/indexedDbStorage.ts]] is the only persistence adapter for drafts and falls back to localStorage when IndexedDB is unavailable. The adapter uses [[src/entities/draft/storage/dexieDraftDatabase.ts]] so an optional public Dexie Cloud URL can synchronize the same IndexedDB records without changing the local state owner.

Dexie Cloud is opt-in at build time through `VITE_DEXIE_CLOUD_SYNC_URL`. Without that URL the app stays local-only; with it, the managed Dexie Cloud service handles authenticated incremental sync while the static app remains free of an application API server. `nameSuffix: false` preserves the existing database name and allows migration of records already stored by the raw IndexedDB adapter.

All loaded and stored data crosses the Valibot schemas in [[src/shared/validation/draftSchemas.ts]]. Persistence is browser-only and asynchronous, so it is never required for the static build to render.

### Unconfigured draft metadata

A new draft deliberately starts with `category`, `targetCount`, and `progressStatus` unset; the app never substitutes a hidden 400-character or category default.

`category` and `progressStatus` are IndexedDB indexes. Category filtering is a single selection combined with text search, while progress is an independent optional tag with `未着手`、`進行中`、`一時停止`、`完了` choices.

## State ownership

Each island owns only the interaction state that has an independent lifecycle: active export tab, export options, pending action state, editor cursor position, short-lived panel state, and browser API handles.

Derived values such as character counts, audit results, deferred projections, and selected labels are calculated from authoritative props or store snapshots during render rather than synchronized with Effects.

The character-limit policy in [[src/features/writing-assistance/lib/characterLimit.ts]] is pure: 80% of a selected upper limit is OK, the 80–90% band is the writing guide, and an unset limit produces no compliance state.

## Async interaction model

Urgent typing and pointer feedback stays synchronous; navigation, persistence completion, panel replacement, and other non-urgent updates use transitions where they improve responsiveness.

`useEffect` is reserved for external synchronization, such as bootstrapping the browser store and reflecting store/URL changes. Optimistic local edits are conditionally rolled back only when an asynchronous persistence operation fails.

The textarea measures `scrollHeight` only in its leaf Client Component and derives its height through [[src/widgets/editor/lib/textareaHeight.ts]]. Text input is never deferred or blocked by this DOM work; analysis and draft-list filtering consume deferred projections instead.

## AI writing context

[[webmcp#WebMCP writing assistance]] exposes the current draft and existing derived writing analysis to browser agents without introducing a second state owner or mutation path.

The first WebMCP phase is read-only. Draft text, STAR blocks, and snapshots remain in the external store; selected text remains a DOM-owned selection; AI-generated suggestions are returned to the user rather than automatically persisted.
