import type { WithBaseOptions, WithReactOptions } from '@stageit-labs/core';

/**
 * Test helper to create mock plugin contexts
 */
export function createMockContext(overrides: Partial<any> = {}) {
  return {
    mode: 'development' as const,
    outputPath: 'dist',
    projectRoot: process.cwd(),
    ...overrides,
  };
}

/**
 * Test helper to create mock base options
 */
export function createMockBaseOptions(overrides: Partial<WithBaseOptions> = {}): WithBaseOptions {
  return {
    mode: 'development',
    entry: './src/main.ts',
    outputPath: 'dist',
    publicPath: '/',
    sourceMap: true,
    target: 'web',
    ...overrides,
  };
}

/**
 * Test helper to create mock React options
 */
export function createMockReactOptions(overrides: Partial<WithReactOptions> = {}): WithReactOptions {
  return {
    refresh: true,
    runtime: 'automatic',
    development: true,
    importSource: 'react',
    ...overrides,
  };
}

/**
 * Test helper to validate common plugin properties
 */
export function isValidPlugin(plugin: any): boolean {
  return typeof plugin === 'function' && plugin.length >= 1;
}

/**
 * Test helper to extract config properties safely
 */
export function extractConfig<T>(result: any, path: string): T | undefined {
  return path.split('.').reduce((obj, key) => obj?.[key], result);
}

/**
 * Deep comparison helper for config objects
 */
export function configMatches(actual: any, expected: any, ignorePaths: string[] = []): boolean {
  const stringify = (obj: any) => {
    const cleaned = { ...obj };
    ignorePaths.forEach(path => {
      const keys = path.split('.');
      let current = cleaned;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key && current[key]) current = current[key];
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey && current) {
        delete current[lastKey];
      }
    });
    return JSON.stringify(cleaned, null, 2);
  };

  return stringify(actual) === stringify(expected);
}