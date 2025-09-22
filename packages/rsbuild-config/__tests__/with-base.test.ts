import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withBase } from '../src/plugins/with-base';

// Simple mock helpers for Rsbuild
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
    target: 'web',
    ...overrides,
  };
}

describe('withBase (Rsbuild)', () => {
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
      expect(result.source).toBeDefined();
      expect(result.output).toBeDefined();
    });
  });

  describe('Source configuration', () => {
    it('should configure entry with string', () => {
      const plugin = withBase(createMockBaseOptions({ entry: './src/app.tsx' }));
      const result = plugin({}, createMockContext());

      expect(result.source?.entry).toEqual({ index: './src/app.tsx' });
    });

    it('should handle array entry', () => {
      const plugin = withBase(createMockBaseOptions({ entry: ['./src/app.tsx', './src/polyfills.ts'] }));
      const result = plugin({}, createMockContext());

      expect(result.source?.entry).toEqual({ index: ['./src/app.tsx', './src/polyfills.ts'] });
    });

    it('should handle object entry', () => {
      const plugin = withBase(createMockBaseOptions({
        entry: { main: './src/main.tsx', admin: './src/admin.tsx' }
      }));
      const result = plugin({}, createMockContext());

      expect(result.source?.entry).toEqual({
        main: './src/main.tsx',
        admin: './src/admin.tsx'
      });
    });

    it('should preserve existing source config', () => {
      const plugin = withBase();
      const existingConfig = {
        source: {
          alias: { '@utils': './src/utils' },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.source?.alias).toBeDefined();
      expect(result.source?.entry).toBeDefined();
    });
  });

  describe('Output configuration', () => {
    it('should configure development output', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.output?.target).toBe('web');
      expect(result.output?.distPath?.root).toBe('dist');
      expect(result.output?.filename?.js).toBe('[name].js');
    });

    it('should configure production output', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.output?.target).toBe('web');
      expect(result.output?.distPath?.root).toBe('dist');
      expect(result.output?.filename?.js).toBe('[name].[contenthash].js');
    });

    it('should use context outputPath over default', () => {
      const plugin = withBase(createMockBaseOptions({}));
      const result = plugin({}, createMockContext({ outputPath: 'custom-build' }));

      expect(result.output?.distPath?.root).toBe('custom-build');
    });

    it('should use context outputPath with priority over options', () => {
      const plugin = withBase(createMockBaseOptions({ outputPath: 'options-build' }));
      const result = plugin({}, createMockContext({ outputPath: 'context-build' }));

      // Context outputPath takes priority over options
      expect(result.output?.distPath?.root).toBe('context-build');
    });

    it('should handle custom target', () => {
      const plugin = withBase(createMockBaseOptions({ target: 'node' }));
      const result = plugin({}, createMockContext());

      expect(result.output?.target).toBe('node');
    });

    it('should preserve existing output config with priority', () => {
      const plugin = withBase();
      const existingConfig = {
        output: {
          assetPrefix: '/custom-assets/',
          filename: {
            css: '[name].custom.css',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      // Existing config takes priority due to spread order
      expect(result.output?.assetPrefix).toBe('/custom-assets/');
      expect(result.output?.filename?.css).toBe('[name].custom.css');
      // js filename gets overridden by existing config spread
      expect(result.output?.filename?.js).toBeUndefined();
    });
  });

  describe('Resolve configuration', () => {
    it('should set common aliases', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.resolve?.alias).toMatchObject({
        '@': '/src',
        '~': '/src',
      });
    });

    it('should merge existing resolve config with existing taking priority', () => {
      const plugin = withBase();
      const existingConfig = {
        resolve: {
          alias: {
            '@components': './src/components',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      // Existing aliases are preserved, common aliases are not overwritten
      expect(result.resolve?.alias).toMatchObject({
        '@components': './src/components',
      });
      // Common aliases should not override existing ones
      expect(result.resolve?.alias).not.toHaveProperty('@');
      expect(result.resolve?.alias).not.toHaveProperty('~');
    });
  });

  describe('Development configuration', () => {
    it('should configure development server', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.dev?.hmr).toBe(true);
      expect(result.dev?.liveReload).toBe(true);
    });

    it('should configure server settings', () => {
      const plugin = withBase(createMockBaseOptions({}));
      const result = plugin({}, createMockContext());

      expect(result.server?.port).toBe(3000);
      expect(result.server?.host).toBe('localhost');
    });

    it('should disable HMR in production', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.dev?.hmr).toBe(false);
      expect(result.dev?.liveReload).toBe(false);
    });
  });

  describe('Tools configuration', () => {
    it('should configure rspack tools', () => {
      const plugin = withBase(createMockBaseOptions({ sourceMap: true }));
      const result = plugin({}, createMockContext());

      expect(result.tools?.rspack).toBeDefined();
      expect(typeof result.tools?.rspack).toBe('function');
    });

    it('should preserve existing tools config', () => {
      const plugin = withBase();
      const existingConfig = {
        tools: {
          rspack: vi.fn(),
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.tools?.rspack).toBeDefined();
    });
  });

  describe('Configuration merging', () => {
    it('should preserve existing config properties', () => {
      const plugin = withBase();
      const existingConfig = {
        html: {
          title: 'Test App'
        },
        security: {
          nonce: 'test-nonce'
        }
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.html?.title).toBe('Test App');
      expect(result.security?.nonce).toBe('test-nonce');
    });

    it('should merge source configuration deeply', () => {
      const plugin = withBase(createMockBaseOptions({ entry: './src/custom.tsx' }));
      const existingConfig = {
        source: {
          alias: { '@utils': './src/utils' },
          define: { __VERSION__: '1.0.0' },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.source?.entry).toEqual({ index: './src/custom.tsx' });
      expect(result.source?.alias).toBeDefined();
      expect(result.source?.define?.__VERSION__).toBe('1.0.0');
    });

    it('should merge output configuration deeply', () => {
      const plugin = withBase(createMockBaseOptions({}));
      const existingConfig = {
        output: {
          assetPrefix: '/cdn/',
          copy: [{ from: 'public', to: 'assets' }],
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.output?.distPath?.root).toBe('dist');
      expect(result.output?.assetPrefix).toBe('/cdn/');
      expect(result.output?.copy).toEqual([{ from: 'public', to: 'assets' }]);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined context', () => {
      const plugin = withBase();
      const result = plugin({});

      expect(result).toBeDefined();
      expect(result.source).toBeDefined();
      expect(result.output).toBeDefined();
    });

    it('should handle empty options', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext());

      expect(result).toBeDefined();
      expect(result.source).toBeDefined();
      expect(result.output).toBeDefined();
    });
  });

  describe('Context-based configuration', () => {
    it('should use context mode for configuration', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.output?.filename?.js).toBe('[name].[contenthash].js');
      expect(result.dev?.hmr).toBe(false);
    });

    it('should use context outputPath when options outputPath is not provided', () => {
      const plugin = withBase({});
      const result = plugin({}, createMockContext({ outputPath: 'context-dist' }));

      expect(result.output?.distPath?.root).toBe('context-dist');
    });

    it('should use context outputPath with priority over options', () => {
      const plugin = withBase(createMockBaseOptions({
        outputPath: 'options-dist'
      }));
      const result = plugin({}, createMockContext({
        outputPath: 'context-dist'
      }));

      // Context takes priority over options
      expect(result.output?.distPath?.root).toBe('context-dist');
    });
  });

  describe('Source map configuration', () => {
    it('should configure source maps via rspack tools', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'development',
        sourceMap: true
      }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.tools?.rspack).toBeDefined();

      // Test the rspack function
      const mockRspackConfig = {};
      const rspackFn = result.tools?.rspack as Function;
      const rspackResult = rspackFn(mockRspackConfig);

      expect(rspackResult.devtool).toBe('eval-source-map');
    });

    it('should disable source maps when sourceMap is false', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'production',
        sourceMap: false
      }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      const mockRspackConfig = {};
      const rspackFn = result.tools?.rspack as Function;
      const rspackResult = rspackFn(mockRspackConfig);

      expect(rspackResult.devtool).toBeUndefined();
    });

    it('should configure production source maps', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'production',
        sourceMap: true
      }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      const mockRspackConfig = {};
      const rspackFn = result.tools?.rspack as Function;
      const rspackResult = rspackFn(mockRspackConfig);

      expect(rspackResult.devtool).toBe('source-map');
    });
  });

  describe('Plugin configuration', () => {
    it('should initialize empty plugins array', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.plugins).toEqual([]);
    });

    it('should preserve existing plugins', () => {
      const existingPlugin = { name: 'existing-plugin', setup: vi.fn() };
      const plugin = withBase();
      const existingConfig = {
        plugins: [existingPlugin],
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.plugins).toContain(existingPlugin);
    });
  });
});