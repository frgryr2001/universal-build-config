import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['__tests__/**/*.{test,spec}.{js,ts}'],
  },
  resolve: {
    alias: {
      '@repo/test-utils': new URL('../test-utils/src', import.meta.url).pathname,
      '@frgryr1/compiler-core': new URL('../core/src', import.meta.url).pathname,
    }
  }
})