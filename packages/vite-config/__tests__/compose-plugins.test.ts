import { describe, it, expect } from 'vitest';
import { composePlugins } from '../src/compose-plugins';
import { ViteConfiguration, VitePluginContext, ViteConfigPlugin } from '../src/types';

// Extended test config type for testing
interface TestConfig extends ViteConfiguration {
  pluginA?: boolean;
  pluginB?: boolean;
  pluginC?: boolean;
  value?: string;
  array?: string[];
  isDev?: boolean;
  isProd?: boolean;
  isServe?: boolean;
  isBuild?: boolean;
  context1?: string;
  context2?: string;
  command?: any;  // Allow command for testing
}

// Simple mock plugins for testing
function mockPluginA(options: any = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    pluginA: true,
    value: options.value || 'A',
  });
}

function mockPluginB(options: any = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    pluginB: true,
    value: ((config as TestConfig).value || '') + (options.value || 'B'),
  });
}

function mockPluginC(options: any = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    pluginC: true,
    array: [...((config as TestConfig).array || []), options.value || 'C'],
  });
}

// Helper function to create context-aware plugin (reduces nesting)
function createContextAwarePlugin(): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    mode: (context as any)?.mode || 'unknown',
    command: context?.command || 'unknown',
  });
}

// Helper function to create context plugin 1 (reduces nesting)
function createContextPlugin1(): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    context1: (context as any)?.mode,
  });
}

// Helper function to create context plugin 2 (reduces nesting)
function createContextPlugin2(): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    context2: (context as any)?.mode,
  });
}

// Helper function to create base plugin (reduces nesting)
function createMockBasePlugin(): ViteConfigPlugin {
  return (config: ViteConfiguration): TestConfig => ({
    ...config,
    mode: 'development',
    build: { outDir: 'dist' },
    plugins: [],
  });
}

// Helper function to create react plugin (reduces nesting)
function createMockReactPlugin(): ViteConfigPlugin {
  return (config: ViteConfiguration): TestConfig => ({
    ...config,
    plugins: [...((config.plugins as any[]) || []), { name: 'react' }],
  });
}

// Helper function to create mode plugin for dev (reduces nesting)
function createDevModePlugin(): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    isDev: (context as any).mode === 'development',
    isServe: context.command === 'serve',
  });
}

// Helper function to create mode plugin for prod (reduces nesting)
function createProdModePlugin(): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext): TestConfig => ({
    ...config,
    isProd: (context as any).mode === 'production',
    isBuild: context.command === 'build',
  });
}

// Helper function to safely call composed function
function callComposed(composed: any, env: { command: string; mode: string }): TestConfig {
  if (typeof composed === 'function') {
    return composed(env) as TestConfig;
  }
  return composed as TestConfig;
}

describe('composePlugins (Vite)', () => {
  describe('Basic functionality', () => {
    it('should be a function', () => {
      expect(typeof composePlugins).toBe('function');
    });

    it('should return a function or config', () => {
      const composed = composePlugins();
      expect(['function', 'object']).toContain(typeof composed);
    });

    it('should handle no plugins', () => {
      const composed = composePlugins();
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('Single plugin composition', () => {
    it('should apply single plugin correctly', () => {
      const composed = composePlugins(mockPluginA({ value: 'test' }));
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.pluginA).toBe(true);
      expect(result.value).toBe('test');
    });
  });

  describe('Multiple plugin composition', () => {
    it('should apply plugins in order', () => {
      const composed = composePlugins(
        mockPluginA({ value: 'first' }),
        mockPluginB({ value: 'second' })
      );
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.pluginA).toBe(true);
      expect(result.pluginB).toBe(true);
      expect(result.value).toBe('firstsecond');
    });

    it('should compose three plugins correctly', () => {
      const composed = composePlugins(
        mockPluginA({ value: 'A' }),
        mockPluginB({ value: 'B' }),
        mockPluginC({ value: 'C' })
      );
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.pluginA).toBe(true);
      expect(result.pluginB).toBe(true);
      expect(result.pluginC).toBe(true);
      expect(result.value).toBe('AB');
      expect(result.array).toEqual(['C']);
    });

    it('should handle array accumulation', () => {
      const composed = composePlugins(
        mockPluginC({ value: 'first' }),
        mockPluginC({ value: 'second' }),
        mockPluginC({ value: 'third' })
      );
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.pluginC).toBe(true);
      expect(result.array).toEqual(['first', 'second', 'third']);
    });
  });

  describe('Context passing', () => {
    it('should pass context to plugins', () => {
      const composed = composePlugins(createContextAwarePlugin());
      const result = callComposed(composed, { command: 'build', mode: 'production' });

      expect(result.mode).toBe('production');
      expect(result.command).toBe('build');
    });

    it('should pass same context to all plugins', () => {
      const composed = composePlugins(createContextPlugin1(), createContextPlugin2());
      const result = callComposed(composed, { command: 'build', mode: 'production' });

      expect(result.context1).toBe('production');
      expect(result.context2).toBe('production');
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle base + react plugin composition', () => {
      const composed = composePlugins(createMockBasePlugin(), createMockReactPlugin());
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.mode).toBe('development');
      expect(result.build?.outDir).toBe('dist');
      expect(result.plugins).toHaveLength(1);
      expect((result.plugins as any[])?.[0]).toEqual({ name: 'react' });
    });
  });

  describe('Environment handling', () => {
    it('should handle development environment', () => {
      const composed = composePlugins(createDevModePlugin());
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result.isDev).toBe(true);
      expect(result.isServe).toBe(true);
    });

    it('should handle production environment', () => {
      const composed = composePlugins(createProdModePlugin());
      const result = callComposed(composed, { command: 'build', mode: 'production' });

      expect(result.isProd).toBe(true);
      expect(result.isBuild).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty plugin array', () => {
      const composed = composePlugins(...[]);
      const result = callComposed(composed, { command: 'serve', mode: 'development' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});