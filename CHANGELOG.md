# Changelog

## 1.1.0

Modular build: keep the existing `aura.*` and Class APIs, and add independent subpath entries so apps only pay for effects they import.

- Subpath ESM entries: `agent-aura/fire`, `/glow`, `/border`, `/shape`, `/water`, `/cultivation`, `/demonic`, `/thunder`, `/void`, `/glitch`
- `void` stays on `aura.void()`; the subpath function is `voidAura()` because `void` is reserved
- Multi-entry Vite ESM build plus the existing CDN IIFE `build/agent-aura.min.js`
- Independent `.d.ts` per subpath
- Tree-shake, bundle-size, exports, and `npm pack --dry-run` checks in CI
- Docs: [Import Strategy](./docs/imports.md)

No breaking public API changes. Do not treat this as a published npm release until you run `npm publish` yourself.
