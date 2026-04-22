# Bolt's Journal - Critical Learnings

## 2025-05-15 - Initializing Bolt's Journal
**Learning:** Performance optimizations should be measurable and not sacrifice readability.
**Action:** Always verify with benchmarks or logical analysis of complexity.

## 2025-05-16 - Sprite Component Optimizations
**Learning:** Systemic UI performance gains can be achieved by memoizing frequent leaf components and caching expensive derived state from JSON manifests using `WeakMap`. Coalescing concurrent network requests for shared assets (like sprite manifests) prevents redundant I/O and CPU spikes during high-load UI transitions (e.g., opening a complex settlement screen).
**Action:** Use `WeakMap` for per-object metadata caching and a promise-based "pending" cache for shared resources. Avoid the `delete` operator in hot paths to satisfy ESLint `@typescript-eslint/no-dynamic-delete`.
