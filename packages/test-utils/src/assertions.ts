import { expect } from 'vitest';

/**
 * Custom assertion to check if a config has required bundler-specific properties
 */
export function expectValidViteConfig(config: any) {
  expect(config).toHaveProperty('mode');
  expect(config).toHaveProperty('build');
  expect(config).toHaveProperty('resolve');
  expect(['development', 'production']).toContain(config.mode);
}

export function expectValidRspackConfig(config: any) {
  expect(config).toHaveProperty('mode');
  expect(config).toHaveProperty('output');
  expect(config).toHaveProperty('resolve');
  expect(config).toHaveProperty('module');
  expect(['development', 'production']).toContain(config.mode);
}

export function expectValidRsbuildConfig(config: any) {
  expect(config).toHaveProperty('source');
  expect(config).toHaveProperty('output');
  expect(config).toHaveProperty('resolve');
}

/**
 * Assert that a plugin function is valid
 */
export function expectValidPlugin(plugin: any) {
  expect(plugin).toBeTypeOf('function');
  expect(plugin.length).toBeGreaterThanOrEqual(1);
}

/**
 * Assert that config contains development optimizations
 */
export function expectDevelopmentConfig(config: any, bundler: 'vite' | 'rspack' | 'rsbuild') {
  switch (bundler) {
    case 'vite':
      expect(config.mode).toBe('development');
      expect(config.build?.sourcemap).toBe(true);
      expect(config.build?.minify).toBe(false);
      break;
    case 'rspack':
      expect(config.mode).toBe('development');
      expect(config.devtool).toBeTruthy();
      break;
    case 'rsbuild':
      expect(config.output?.sourceMap?.js).toBeTruthy();
      break;
  }
}

/**
 * Assert that config contains production optimizations
 */
export function expectProductionConfig(config: any, bundler: 'vite' | 'rspack' | 'rsbuild') {
  switch (bundler) {
    case 'vite':
      expect(config.mode).toBe('production');
      expect(config.build?.minify).toBe(true);
      break;
    case 'rspack':
      expect(config.mode).toBe('production');
      expect(config.output?.filename).toContain('[contenthash]');
      break;
    case 'rsbuild':
      expect(config.output?.filename?.js).toContain('[contenthash]');
      break;
  }
}

/**
 * Assert that React plugin is properly configured
 */
export function expectReactConfig(config: any, bundler: 'vite' | 'rspack' | 'rsbuild') {
  switch (bundler) {
    case 'vite':
      expect(config.plugins).toBeDefined();
      expect(Array.isArray(config.plugins)).toBe(true);
      break;
    case 'rspack':
      expect(config.plugins).toBeDefined();
      expect(Array.isArray(config.plugins)).toBe(true);
      break;
    case 'rsbuild':
      expect(config.plugins).toBeDefined();
      expect(Array.isArray(config.plugins)).toBe(true);
      break;
  }
}

/**
 * Assert that config merging works correctly
 */
export function expectConfigMerging(result: any, userConfig: any, pluginConfig: any) {
  // User config should override plugin defaults
  Object.keys(userConfig).forEach(key => {
    if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
      expect(result[key]).toMatchObject(userConfig[key]);
    } else {
      expect(result).toHaveProperty(key);
    }
  });

  // Plugin config should be present where user didn't override
  Object.keys(pluginConfig).forEach(key => {
    if (!userConfig.hasOwnProperty(key)) {
      expect(result).toHaveProperty(key);
    }
  });
}