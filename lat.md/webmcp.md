# WebMCP writing assistance

WebMCP is a progressive browser enhancement that exposes the existing writing model to an AI agent without adding a server, provider, or second draft store.

## Imperative strategy

The writing flow uses imperative tools because the useful agent paths are semantic writing tasks rather than one-to-one exposure of the editor's buttons and forms.

The first release is deliberately read-only: the agent can inspect context, request existing analysis, and compare versions, while the human editor remains the only path that changes text. Export, deletion, restoration, and direct AI mutation are separate future decisions.

## Client boundary and lifecycle

[[src/features/webmcp/ui/WebMcpIsland.tsx#WebMcpIsland]] is a leaf Client Component mounted only by the writing page, so the Static RSC workspace composition and other routes do not become WebMCP dependencies.

[[src/features/webmcp/lib/registerWritingTools.ts#registerWritingTools]] feature-detects both the browser model context and its `registerTool` method, registers the tools in parallel, and passes an AbortSignal so route unmount unregisters them. Unsupported or incomplete browser implementations keep the normal editor behavior unchanged.

## Tool surface

[[src/features/webmcp/lib/writingTools.ts#writingTools]] exposes three read-only paths with JSON-serializable results and `untrustedContentHint` because their payloads can contain user-authored draft text.

### Context retrieval

`get_writing_context` returns the active draft, the current textarea selection, STAR blocks, or one existing snapshot according to a Valibot-validated scope. User-authored text is bounded before returning, and truncation is explicit in the result.

The tool uses [[src/entities/draft/model/draftStore.ts]] as the authoritative source and reads the textarea only for the browser-owned selection range. It returns a stable content digest from [[src/features/webmcp/lib/contentRevision.ts#getContentDigest]] so an eventual mutation phase can detect stale context.

### Existing writing analysis

`analyze_writing` adapts the existing pure writing-assistance functions into structured agent context without changing the draft.

The result includes metrics from [[src/features/writing-assistance/lib/analyzer.ts#calculateMetrics]], audit checks from [[src/features/writing-assistance/lib/analyzer.ts#auditText]], STAR ratio feedback from [[src/features/writing-assistance/lib/ratioBalance.ts#calculateRatioBalance]], redundancy matches from [[src/features/writing-assistance/lib/sculptor.ts#detectRedundancies]], and STAR block completeness.

### Version comparison

`compare_writing_versions` compares the current content with an existing [[src/entities/draft/model/types.ts#DraftSnapshot]] and returns both bounded contents, revision digests, character counts, and a deterministic changed window.

Snapshots remain owned by the draft model and are not copied into a WebMCP-specific cache. Character counts are recomputed from snapshot content at the tool boundary rather than trusting persisted display metadata. The agent interprets the difference and explains writing trade-offs; it does not restore or overwrite a version in this phase.

## State and mutation boundary

WebMCP does not own React state, URL state, persistence, or optimistic updates; the existing draft store and IndexedDB adapter remain authoritative.

The first phase has no mutation tool. A future `apply_writing_patch` must use a shared range-based command through [[src/entities/draft/model/draftStore.ts#draftActions]], verify a base revision, show a diff for human confirmation, and reuse the existing optimistic persistence and rollback path.

## Navigation boundary

Same-origin route changes use standard anchor elements so FUNSTACK Router can intercept them; custom `window.navigation` and `window.location` calls are not part of the application navigation layer.

The structure editor's return-to-writing action is owned by [[src/widgets/structure/ui/StarStructureEditor.tsx#StarStructureEditor]] through a normal `href`, while the existing draft update happens before the link navigation.
