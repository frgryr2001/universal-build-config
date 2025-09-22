# [TASK001] - Enhance withBase & withReact Vite Configuration

**Status:** In Progress
**Added:** 2025-09-05
**Updated:** 2025-09-05

## Task receipt & plan
I will update the task to list concrete, opinionated but practical defaults to add to `with-base.ts` and `with-react.ts`, include acceptance criteria, tests, and next steps for implementation and verification. Then you'll be able to implement these changes in code and validate them against example apps.

Checklist (requirements)
- [ ] Produce a short, actionable list of defaults to add to `with-base.ts` (only common/popular options).
- [ ] Produce a short, actionable list of defaults to add to `with-react.ts` (React-specific developer DX defaults).
- [ ] Add acceptance criteria and simple tests to validate behavior (build + types + dev server).
- [ ] Add migration/implementation notes and next steps (what code files to edit, what to run).

## Concrete enhancements to add (withBase)
These are pragmatic, commonly-needed defaults. Add items incrementally and keep them opt-out via options when necessary.

1. Resolve / alias / extensions
   - COMMON_EXTENSIONS (['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'])
   - sensible `alias` for `@` → project `src` and any monorepo package aliases

2. Server (dev)
   - port: 3000 (configurable)
   - host: false (default) / allow override
   - open: false
   - strictPort: false
   - hmr: { overlay: true }
   - cors: true
   - watch: { ignored: ['**/node_modules/**', '**/.git/**'] }

3. Build
   - outDir: configurable ('dist')
   - target: 'es2020' / configurable
   - sourcemap: mode === 'development'
   - minify: 'esbuild' (or 'terser' opt-in)
   - cssCodeSplit: true
   - assetsInlineLimit: 4096 (4kb)
   - rollupOptions.manualChunks: vendor splitting (react, react-dom, lodash, etc.)
   - brotliSize: false (faster)

4. CSS
   - modules: { localsConvention: 'camelCaseOnly', generateScopedName: '[name]__[local]___[hash:base64:5]' }
   - preprocessorOptions: basic scss config (includePaths if monorepo uses shared styles)
   - postcss: respect existing project PostCSS config if present

5. OptimizeDeps / esbuild
   - optimizeDeps: { include: [], exclude: [] } with a default include for commonly slow deps (react, react-dom, clsx)
   - esbuild: { jsxFactory, jsxFragment, target: 'es2020' } forwarded from options

6. Assets & static handling
   - assetsInclude: common static extensions (svg, webp, avif, ico, fonts)
   - publicDir: 'public' (respect existing project)

7. Env, Define, and Mode
   - envPrefix: ['VITE_', 'APP_'] (configurable)
   - envDir: project root by default
   - define: allow user overrides; provide common defaults (process.env.NODE_ENV)

8. Preview
   - preview.port: 5000
   - preview.host: 'localhost'

9. Plugins and diagnostics (opt-in)
   - Optional integration hooks for `vite-plugin-checker` (TS and ESLint) — enabled by flag
   - Optional `visualizer` plugin hook for bundle analysis — opt-in via options

10. Source maps and mode-specific defaults
   - dev: inline sourcemaps
   - prod: external source maps only when requested via option

## Concrete enhancements to add (withReact)
Focus on developer experience and common React defaults.

1. Plugin defaults
   - Include `@vitejs/plugin-react` (or `@vitejs/plugin-react-swc` opt-in) with:
     - jsxRuntime: 'automatic'
     - fastRefresh: true

2. Dev DX
   - Fast refresh enabled by default
   - React refresh overlay configuration (errors overlay)
   - Auto include react and react-dom as external vendor splits in manualChunks

3. Type checking & linting (opt-in)
   - Option to enable `vite-plugin-checker` for TypeScript and ESLint (recommended in dev)

4. SWC option
   - Expose an option to use the SWC plugin for better performance and set recommended defaults (minify, target)

5. Accessibility / Prod hints
   - Option to warn on large bundle sizes or missing react devtools hook in production builds (opt-in via plugin)

## Acceptance criteria
- Unit/Integration: `pnpm --filter @stageit-labs/vite-config build` succeeds and emits `.d.ts` without ts-errors.
- App build: `pnpm --filter vite-app build` succeeds with the new defaults and produces stable outputs.
- Dev server: `pnpm --filter vite-app dev` starts and respects configured `server.port` and HMR overlay.
- Types: Editor IntelliSense resolves types from `@stageit-labs/vite-config` after package build (verify by opening `apps/vite-app/vite.config.ts`).
- Opt-in features (checker, visualizer) are behind flags and do not run unless enabled.

## Tests & validation steps
1. Local quick smoke
   - Build the config package: `pnpm --filter @stageit-labs/vite-config build`
   - Rebuild apps: `pnpm --filter vite-app build`
   - Start dev server: `pnpm --filter vite-app dev` and verify port/HMR behavior

2. Types
   - Ensure `packages/*/dist/*.d.ts` includes the new option types
   - Restart TS server in editor (or reload window) and confirm IntelliSense

3. CI
   - Add a CI job that runs `pnpm -w -r build` and `pnpm -w -r test` (if tests exist)
   - Add a small smoke integration step that starts vite in preview mode and checks an HTTP 200

## Implementation notes (what to edit)
- Edit `packages/vite-config/src/plugins/with-base.ts` to add the defaults above, expose options to opt-out.
- Edit `packages/vite-config/src/plugins/with-react.ts` to wire `@vitejs/plugin-react` with recommended defaults and make `vite-plugin-checker` opt-in.
- Add/extend types in `packages/shared-config/src/types.ts` (or equivalent) for new options and export them.
- Update package `build` script (rslib) to regenerate `.d.ts` and publish artifacts locally for testing.

## Next steps (short)
1. Implement the minimal changes in `with-base.ts` and `with-react.ts` following the lists above.
2. Run local builds and validate acceptance criteria.
3. Add a small unit/integration test (optional) that imports `composePlugins` and asserts the produced config object contains expected keys (server.port, css.modules, build.outDir).
4. Add documentation snippet in `packages/vite-config/README.md` showing common options and how to opt-out features.

## Progress Tracking (updated)

**Overall Status:** In Progress - 60% Complete

### Subtasks (updated)
| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 1.1 | Research Vite documentation and common patterns | Complete | 2025-09-05 | — |
| 1.2 | Design comprehensive configuration structure | Complete | 2025-09-05 | — |
| 1.3 | Implement enhanced withBase plugin (draft) | Complete | 2025-09-05 | Draft implementation exists in codebase |
| 1.4 | Implement withReact defaults and opt-in plugins | In Progress | 2025-09-05 | Needs final wiring for checker/opt-in features |
| 1.5 | Test build process with enhanced configuration | Not Started | 2025-09-05 | Smoke tests planned in next step |
| 1.6 | Verify TypeScript IntelliSense support | Not Started | 2025-09-05 | Verify after package build and TS server restart |
| 1.7 | Test with example applications | Not Started | 2025-09-05 | Run `vite-app` dev + build |
| 1.8 | Update documentation and examples | Not Started | 2025-09-05 | Add README snippets |

## Quick notes / rationale
- Keep sensible defaults minimal and opt-outable. The goal is to improve DX out of the box without surprising users.
- Put expensive tools (checker, visualizer) behind explicit flags.
- Keep CSS module naming stable and predictable so style migration is easy.
