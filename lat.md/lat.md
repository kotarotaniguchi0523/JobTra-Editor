# JobTra Editor

JobTra Editor is a static, browser-local Japanese entry-sheet editor built around build-time RSC composition and small interaction islands.

The architecture is documented in [[architecture#Static RSC tree]], local data ownership in [[state#Browser-local draft state]], and export behavior in [[export#Serverless export]].

Repository structure and naming are defined in [[architecture#Feature-slice layout]], while the refactoring rules learned from this codebase are captured in [[lessons#Refactoring lessons]].

## Knowledge map

These entries are the maintained architecture and delivery references for this repository.

- [[architecture]] — Server-owned tree, client islands, composition, and folder conventions.
- [[export]] — Browser-only Markdown and minitype PDF export behavior.
- [[lessons]] — Current refactoring rules and state-ownership lessons.
- [[state]] — Draft state, persistence, URL ownership, and async interaction boundaries.
- [[validation-and-delivery]] — Valibot, React Compiler, CI, and quality gates.
