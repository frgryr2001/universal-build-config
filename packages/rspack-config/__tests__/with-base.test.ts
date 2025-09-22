import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withBase } from '../src/plugins/with-base';

// Simple mock helpers
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

describe('withBase (Rspack)', () => {
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
      expect(result.output?.filename).toBe('[name].js');
      // Rspack uses 'eval-source-map' for development
      expect(result.devtool).toBe('eval-source-map');
    });

    it('should configure development optimization settings', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      // Rspack doesn't set minimize in base plugin
      expect(result.optimization?.runtimeChunk).toBe(false);
      // SplitChunks should be configured
      expect(result.optimization?.splitChunks).toBeDefined();
    });

    it('should enable CSS experiments for development', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'development' }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.experiments?.css).toBe(true);
    });
  });

  describe('Production mode', () => {
    it('should apply production optimizations', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.mode).toBe('production');
      expect(result.output?.filename).toBe('[name].[contenthash].js');
      expect(result.output?.chunkFilename).toBe('[name].[contenthash].chunk.js');
    });

    it('should enable production optimizations', () => {
      const plugin = withBase(createMockBaseOptions({ mode: 'production' }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      // Rspack doesn't set these in base plugin
      expect(result.optimization?.runtimeChunk).toBe(false);
      expect(result.optimization?.splitChunks).toBeDefined();
    });

    it('should disable source maps for production', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'production',
        sourceMap: false
      }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.devtool).toBe(false);
    });
  });

  describe('Configuration options', () => {
    it('should handle custom output path', () => {
      const plugin = withBase(createMockBaseOptions({ outputPath: 'custom-dist' }));
      const result = plugin({}, createMockContext());

      expect(result.output?.path).toBe('custom-dist');
    });

    it('should handle custom public path', () => {
      const plugin = withBase(createMockBaseOptions({ publicPath: '/app/' }));
      const result = plugin({}, createMockContext());

      expect(result.output?.publicPath).toBe('/app/');
    });

    it('should handle custom entry point', () => {
      const plugin = withBase(createMockBaseOptions({ entry: './src/app.tsx' }));
      const result = plugin({}, createMockContext());

      expect(result.entry).toBe('./src/app.tsx');
    });

    it('should handle custom target', () => {
      const plugin = withBase(createMockBaseOptions({ target: 'node' }));
      const result = plugin({}, createMockContext());

      expect(result.target).toBe('node');
    });

    it('should handle source map options', () => {
      const plugin = withBase(createMockBaseOptions({
        mode: 'development',
        sourceMap: true
      }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      // Rspack uses 'eval-source-map' for development
      expect(result.devtool).toBe('eval-source-map');
    });
  });

  describe('Resolve configuration', () => {
    it('should set common extensions', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.resolve?.extensions).toEqual(['.tsx', '.ts', '.jsx', '.js', '.json']);
    });

    it('should merge existing resolve config', () => {
      const plugin = withBase();
      const existingConfig = {
        resolve: {
          alias: {
            '@components': './src/components',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.resolve?.extensions).toEqual(['.tsx', '.ts', '.jsx', '.js', '.json']);
      expect(result.resolve?.alias?.['@components']).toBe('./src/components');
    });
  });

  describe('Module configuration', () => {
    it('should initialize module rules', () => {
      const plugin = withBase();
      const result = plugin({}, createMockContext());

      expect(result.module?.rules).toBeDefined();
      expect(Array.isArray(result.module?.rules)).toBe(true);
    });

    it('should preserve existing module rules', () => {
      const plugin = withBase();
      const existingConfig = {
        module: {
          rules: [{ test: /\.css$/, use: 'css-loader' }],
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.module?.rules).toHaveLength(1);
      expect(result.module?.rules?.[0]).toEqual({ test: /\.css$/, use: 'css-loader' });
    });
  });

  describe('Configuration merging', () => {
    it('should preserve existing config properties', () => {
      const plugin = withBase();
      const existingConfig = {
        plugins: [{ name: 'existing-plugin' }],
        devServer: { port: 4000 },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.plugins).toEqual(existingConfig.plugins);
      expect(result.devServer?.port).toBe(4000);
    });

    it('should merge output configuration correctly', () => {
      const plugin = withBase(createMockBaseOptions({ outputPath: 'custom-dist' }));
      const existingConfig = {
        output: {
          library: 'MyLibrary',
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.output?.path).toBe('custom-dist');
      expect(result.output?.library).toBe('MyLibrary');
    });

    it('should merge optimization configuration', () => {
      const plugin = withBase();
      const existingConfig = {
        optimization: {
          splitChunks: {
            chunks: 'all',
          },
        },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.optimization?.splitChunks?.chunks).toBe('all');
      expect(result.optimization?.runtimeChunk).toBe(false);
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

      expect(result.output?.path).toBe('context-dist');
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
      expect(result.output?.path).toBe('options-dist');
    });
  });
});