# Refactoring lessons

This repository favors explicit ownership and static composition over mechanically reducing Hook counts or copying a conventional SPA architecture.

## State is a responsibility signal

Several independent state variables or refs usually indicate mixed responsibilities, not an invitation to hide them in one larger reducer.

First move static display back to Server Components, split interaction ownership into leaf islands, and derive values from authoritative inputs; use a reducer only for a real discriminated state machine.

## Effects are escape hatches

An Effect must synchronize with an external system such as IndexedDB, the URL, or a browser API; it must not be the mechanism for derived state, prop mirroring, or state-to-state synchronization.

Event results belong in the event or async action path. The DOM, URL, external store, and persistence adapter should each remain a clear source of truth rather than being mirrored into extra refs and booleans.

## Async React is local

Transitions, deferred values, Suspense, `Activity`, and `useActionState` are applied at the interaction boundary that benefits from them, while urgent text input remains immediate.

Optimistic UI is appropriate for local asynchronous persistence only when the authoritative operation and a conditional rollback path are explicit; it is not a replacement for ordinary state.

## Static means browser-owned data access

Build-time RSC is for structure, static computation, and composition; IndexedDB, localStorage, minitype, clipboard, downloads, focus, and other browser APIs belong to narrow client leaves.

Adding a database package to support an export or editor feature is an architectural regression when a static browser API already provides the required capability.

## Tooling is part of the contract

Naming and placement rules keep ownership discoverable. `konsistent` makes the slice-root rule executable.

It caught the two workspace boundary components before they were moved into `ui/` and `rsc/`. React Doctor and Knip prevent accidental client expansion and dead code from hiding in feature slices.

Dependencies and GitHub Actions are pinned or lockfile-managed for reproducibility, checks run independently where possible, and generated caches or unrelated lockfiles are not committed.
