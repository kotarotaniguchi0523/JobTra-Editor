# Validation and delivery

The repository treats type safety, static output, agent documentation, and independent CI checks as part of the architecture rather than optional cleanup.

## Valibot boundaries

Untrusted draft data and URL search parameters are parsed through [[src/shared/validation/draftSchemas.ts]] and [[src/shared/validation/searchParams.ts]] instead of scattered ad-hoc sanitizers.

Schemas define the accepted id, category, text, timestamp, snapshot, query, and URL parameter shapes; invalid values resolve to explicit safe fallbacks.

Draft schemas also accept an explicit unconfigured category and character limit, and normalize legacy records with no progress field to `null` rather than discarding them.

WebMCP inputs use the same Valibot boundary through [[src/features/webmcp/model/writingToolSchemas.ts]], and the development-only `package.json` dependency `webmcp-types` supplies the current browser API types without entering the client bundle.

## React compiler policy

[[vite.config.ts]] applies the React Compiler during the production transform, so manual `memo`, `useMemo`, and `useCallback` are not used as routine render protection.

Memoization is justified only when an external API contract or measured expensive calculation requires stable identity; state reduction is never performed solely to reduce the visible Hook count.

## Independent CI

`.github/workflows/ci.yml` keeps formatting, TypeScript, tests, Knip, Konsistent, the minitype smoke test, and `lat check` as independent jobs with no dependency waterfall.

Every GitHub Action reference is pinned to a full commit SHA, Node and npm installation are lockfile-reproducible, and the CI workflow intentionally does not contain a production build job. The static build remains an explicit local/release verification command.

## Quality gates

The local commands `npm run format:check`, `npm run lint`, `npm test`, `npm run knip`, `npm run konsistent:validate`, `npm run konsistent`, `npm run verify:pdf`, and `npm run lat:check` are the minimum review gates for source changes.

`konsistent.json` is validated before the structural audit. Its conventions are evidence-based: feature and widget slices are layer directories, React components are PascalCase, TypeScript modules are camelCase, and route-reserved names are scoped to `src/pages`.

The evidence review covered 3 feature roots (3/3 have no direct source files), 6 widget roots (6/6 have no direct source files after the workspace boundary move), and 50 non-route React component files (50/50 use PascalCase). The 7 `page.tsx`/`layout.tsx` route files are a separate framework-reserved cohort; the editor widget intentionally has no `rsc/` layer because it has no static slot to own, so a universal `rsc/` rule was not added.

The `lat.md` and `konsistent` packages are devDependencies only; neither is imported by the application and neither may enter the browser bundle. Their generated caches are ignored by their respective ignore rules.

## Editor regressions

The unit suite verifies the blank draft factory, nullable persistence fields, the 80% character-limit policy, category-specific Tab guidance, and pure textarea height calculation.

The Playwright workflow verifies the empty first launch, an unconfigured new draft, IndexedDB persistence, and header-control geometry at 768px, 900px, and 1024px widths.
