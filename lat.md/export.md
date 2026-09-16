# Serverless export

Markdown and Japanese print-ready PDF exports are generated in the browser, so static hosting can provide the complete export workflow without an application server.

## Browser PDF pipeline

[[src/features/export/lib/exportPdf.ts]] builds a structured document and loads minitype plus bundled Japanese fonts lazily in the browser.

The PDF path uses A4 output, Japanese typography, metadata, and STAR sections when selected. [[src/features/export/lib/pdfClient.ts]] owns the browser download boundary, while [[scripts/verify-minitype-export.ts]] verifies the same minitype pipeline from the CLI.

## Markdown pipeline

[[src/features/export/lib/exportMarkdown.ts]] serializes a validated draft into Markdown with optional YAML frontmatter, STAR structure, audit summary, and a browser download or clipboard operation.

Markdown generation is pure with respect to the draft and options; DOM APIs are used only by the final download/copy interaction.

## Export interaction ownership

The export feature is split by responsibility: [[src/features/export/ui/ExportModal.tsx]] owns dialog/tab composition, panel components own options and actions, and feedback/button components own presentation.

`useActionState` represents each asynchronous browser action, while `Activity` preserves the modal and tab subtree semantics. Export option state is local to the panel that edits it and is not lifted into a page or provider.

## Failure and fallback

PDF generation reports an actionable error and offers the browser print-to-PDF fallback; clipboard failure reports an error without corrupting the draft.

No export action calls a route handler, Server Action, server database, or remote API. SQLite-related dependencies that appear in development tooling do not change this guarantee.
