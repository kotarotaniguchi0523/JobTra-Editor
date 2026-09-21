# Validation and delivery

The repository treats type safety, static output, agent documentation, and independent CI checks as part of the architecture rather than optional cleanup.

## Valibot boundaries

Untrusted draft data and URL search parameters are parsed through [[src/shared/validation/draftSchemas.ts]] and [[src/shared/validation/searchParams.ts]] instead of scattered ad-hoc sanitizers.

Schemas define the accepted id, category, text, timestamp, snapshot, query, and URL parameter shapes; invalid values resolve to explicit safe fallbacks.

Draft schemas also accept an explicit unconfigured category and character limit, and normalize legacy records with no progress field to `null` rather than discarding them.

WebMCP inputs use the same Valibot boundary through [[src/features/webmcp/model/writingToolSchemas.ts]], and the development-only `package.json` dependency `webmcp-types` supplies the current browser API types without entering the client bundle.

## React compiler policy

[[vite.config.ts]] applies Vite 8's native Rust React Compiler path to browser-consumed modules, so manual `memo`, `useMemo`, and `useCallback` are not used as routine render protection.

The native compiler is pinned to `oxc-transform-react@0.145.0`, the peer-compatible release for the Vite React plugin, and recoverable compiler diagnostics are logged during builds. Vite skips repeated gzip measurement for the intentionally large lazy PDF chunk.

Memoization is justified only when an external API contract or measured expensive calculation requires stable identity; state reduction is never performed solely to reduce the visible Hook count.

## Independent CI

`.github/workflows/ci.yml` keeps formatting, TypeScript, tests, Knip, package manifest linting, Konsistent, the minitype smoke test, and `lat check` as independent jobs with no dependency waterfall.

Every GitHub Action reference is pinned to a full commit SHA. npm 12.0.2 is the sole package manager, `package-lock.json` is the sole dependency lockfile, and every CI job installs with the pinned npm release and `npm ci`. The static production build also runs as an independent CI job.

The browser job installs Chromium, Firefox, and WebKit, then runs the same Page Object workflows against the generated static site. Browser console warnings, page errors, and React/RSC hydration failures are test failures rather than ignored diagnostics.

## Quality gates

Review gates use npm scripts only for formatting, types, tests, dependency hygiene, architecture checks, and security.

The Knip command is followed by an explicit lockfile-policy check because Knip reports unused source files and dependency usage, not stray package-manager lockfiles.

Run `npm run format:check`, `npm run lint`, `npm run doctor -- . --verbose --no-cache --blocking warning --yes`, `npm test`, `npm run knip`, `npm run lint:package-json`, `npm run check:lockfiles`, `npm run konsistent:validate`, `npm run konsistent`, `npm run verify:pdf`, `npm run lat:check`, and `npm audit` before delivery.

npm 12 install scripts use a version-pinned allowlist. The required `esbuild@0.28.2` installer and minitype PDF smoke test's `better-sqlite3@12.11.1` native build are the only approved dependency scripts.

`konsistent.json` is validated before the structural audit. Its conventions are evidence-based: feature and widget slices are layer directories, React components are PascalCase, TypeScript modules are camelCase, and route-reserved names are scoped to `src/pages`.

The evidence review covered 3 feature roots (3/3 have no direct source files), 6 widget roots (6/6 have no direct source files after the workspace boundary move), and 50 non-route React component files (50/50 use PascalCase). The 7 `page.tsx`/`layout.tsx` route files are a separate framework-reserved cohort; the editor widget intentionally has no `rsc/` layer because it has no static slot to own, so a universal `rsc/` rule was not added.

The `lat.md`, `konsistent`, and `npm-package-json-lint` packages are devDependencies only; none is imported by the application and none may enter the browser bundle. Their generated caches are ignored by their respective ignore rules.

## Editor regressions

The unit suite verifies the blank draft factory, nullable persistence fields, the 80% character-limit policy, category-specific Tab guidance, and pure textarea height calculation.

The Playwright workflow verifies the empty first launch, unconfigured draft creation, IndexedDB persistence, category/progress editing, search and single-category filtering, focus controls, STAR-to-preview navigation, Markdown export, QR pairing, and header geometry at 768px, 900px, and 1024px widths. Each path runs through Page Objects on Chromium, Firefox, and WebKit.
