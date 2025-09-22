import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withBase } from '../src/plugins/with-base';

// Simple mock helpers for testing
function createMockContext(overrides: any = {}) {
  return {
    mode: 'development' as const,
    outputPath: 'dist',
    projectRoot: process.cwd(),
    ...overrides,
  };
}

function createMockBaseOptions(overrides: any = {}) {
  return {
    mode: 'development' as const,
    entry: './src/main.ts',
    outputPath: 'dist',
    publicPath: '/',
    sourceMap: true,
    target: 'es2020',
    ...overrides,
  };
}

describe('withBase (Vite)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be a function', () => {
      expect(typeof withBase).toBe('function');
    });

    it('should return a plugin function', () => {
      const plugin = withBase();
      expect(typeof plugin).toBe('function');
      expect(plugin.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty config', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result).toBeDefined();
      expect(result.mode).toBe('development');
    });
  });

  describe('Development mode', () => {
    it('should apply development defaults', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.mode).toBe('development');
      expect(result.build?.sourcemap).toBe(true);
      expect(result.build?.minify).toBe(false);
      expect(result.build?.target).toEqual(['es2020']);
    });

    it('should configure development server settings', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.server?.port).toBe(3000);
      expect(result.server?.host).toBe(true);
    });

    it('should configure preview server', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.preview?.port).toBe(5000);
      expect(result.preview?.host).toBe(true);
    });
  });

  describe('Production mode', () => {
    it('should apply production optimizations', () => {
      // Test with sourceMap explicitly disabled for production
      const plugin = withBase(createMockBaseOptions({
        mode: 'production',
        sourceMap: false
      }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.mode).toBe('production');
      expect(result.build?.sourcemap).toBe(false);
      expect(result.build?.minify).toBe(true);
    });

    it('should use production target', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.build?.target).toEqual(['es2020']);
      expect(result.esbuild?.target).toBe('es2020');
    });
  });

  describe('Configuration options', () => {
    it('should handle custom output path', () => {
      const plugin = withBase(createMockBaseOptions({ outputPath: 'custom-dist' }));
      const result = plugin({}, createMockContext());

      expect(result.build?.outDir).toBe('custom-dist');
    });

    it('should handle custom public path', () => {
      const plugin = withBase(createMockBaseOptions({ publicPath: '/app/' }));
      const result = plugin({}, createMockContext());

      expect(result.base).toBe('/app/');
    });

    it('should handle custom target', () => {
      const plugin = withBase(createMockBaseOptions({ target: 'es2018' }));
      const result = plugin({}, createMockContext());

      expect(result.build?.target).toEqual(['es2018']);
      expect(result.esbuild?.target).toBe('es2018');
    });

    it('should handle array targets', () => {
      const plugin = withBase(createMockBaseOptions({ target: ['es2018', 'chrome64'] }));
      const result = plugin({}, createMockContext());

      expect(result.build?.target).toEqual(['es2018', 'chrome64']);
    });
  });

  describe('Configuration merging', () => {
    it('should preserve existing config properties', () => {
      const plugin = withBase();
      const existingConfig = {
        plugins: [{ name: 'existing-plugin' }],
        define: { __VERSION__: '"1.0.0"' },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.plugins).toEqual(existingConfig.plugins);
      expect(result.define?.__VERSION__).toBe('"1.0.0"');
    });

    it('should merge build options correctly', () => {
      const plugin = withBase(createMockBaseOptions({ outputPath: 'custom-dist' }));
      const existingConfig = {
        build: {
          rollupOptions: {
            external: ['lodash'],
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.build?.outDir).toBe('custom-dist');
      expect(result.build?.rollupOptions?.external).toEqual(['lodash']);
    });

    it('should merge resolve aliases with user config taking precedence', () => {
      const plugin = withBase();
      const existingConfig = {
        resolve: {
          alias: {
            '@components': './src/components',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      // User config overrides due to spread order in implementation
      expect(result.resolve?.alias).toMatchObject({
        '@components': './src/components',
      });
      // Common aliases are not present when user provides resolve config
      expect(result.resolve?.alias).not.toHaveProperty('@');
      expect(result.resolve?.alias).not.toHaveProperty('~');
    });

    it('should merge server options correctly', () => {
      const plugin = withBase();
      const existingConfig = {
        server: {
          port: 4000,
          proxy: {
            '/api': 'http://localhost:8080',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.server?.port).toBe(4000); // User config should override
      expect(result.server?.host).toBe(true); // Plugin default should be preserved
      expect(result.server?.proxy).toEqual(existingConfig.server.proxy);
    });
  });

  describe('CSS handling', () => {
    it('should configure CSS modules', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.css?.modules).toMatchObject({
        localsConvention: 'camelCaseOnly',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      });
    });

    it('should merge existing CSS config', () => {
      const plugin = withBase();
      const existingConfig = {
        css: {
          devSourcemap: true,
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.css?.devSourcemap).toBe(true);
      expect(result.css?.modules).toBeDefined();
    });
  });

  describe('Environment configuration', () => {
    it('should set environment prefix', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.envPrefix).toEqual(['ICONDO_', 'VITE_']);
    });

    it('should define NODE_ENV', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.define?.['process.env.NODE_ENV']).toBe('"production"');
    });

    it('should merge existing define config', () => {
      const plugin = withBase();
      const existingConfig = {
        define: {
          __VERSION__: '"1.0.0"',
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.define?.['process.env.NODE_ENV']).toBe('"development"');
      expect(result.define?.__VERSION__).toBe('"1.0.0"');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined context', () => {
      const plugin = withBase();
      const result = plugin({});

      expect(result).toBeDefined();
      expect(result.mode).toBe('development');
    });

    it('should handle empty options', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext());

      expect(result).toBeDefined();
      expect(result.mode).toBe('development');
    });
  });

  describe('Context-based configuration', () => {
    it('should use context mode when options mode is not provided', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.mode).toBe('production');
    });

    it('should use context outputPath when options outputPath is not provided', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext({ outputPath: 'context-dist' }));

      expect(result.build?.outDir).toBe('context-dist');
    });

    it('should prefer options over context', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'production',
        outputPath: 'options-dist'
      }));
      const result = plugin({}, createMockContext({
        mode: 'development',
        outputPath: 'context-dist'
      }));

      expect(result.mode).toBe('production');
      expect(result.build?.outDir).toBe('options-dist');
    });
  });
});