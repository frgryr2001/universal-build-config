import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/**/__tests__/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.ts'],
      exclude: [
        'packages/*/src/**/*.d.ts',
        'packages/*/src/**/*.test.ts',
        'packages/*/src/**/*.spec.ts',
        'packages/*/src/**/index.ts'
      ]
    },
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json'
    }
  },
  resolve: {
    alias: {
      '@stageit-labs/core': new URL('./packages/shared-config/src', import.meta.url).pathname,
      '@stageit-labs/vite-config': new URL('./packages/vite-config/src', import.meta.url).pathname,
      '@stageit-labs/rspack-config': new URL('./packages/rspack-config/src', import.meta.url).pathname,
      '@stageit-labs/rsbuild-config': new URL('./packages/rsbuild-config/src', import.meta.url).pathname,
    }
  }
})