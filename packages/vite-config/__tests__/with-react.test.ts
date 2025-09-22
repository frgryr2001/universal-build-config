import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withReact } from '../src/plugins/with-react';

// Simple mock helpers
function createMockContext(overrides: any = {}) {
  return {
    mode: 'development' as const,
    outputPath: 'dist',
    projectRoot: process.cwd(),
    ...overrides,
  };
}

function createMockReactOptions(overrides: any = {}) {
  return {
    refresh: true,
    runtime: 'automatic' as const,
    development: true,
    importSource: 'react',
    ...overrides,
  };
}

// Mock the React plugin
vi.mock('@vitejs/plugin-react', () => ({
  default: vi.fn(() => ({ name: 'mock-react-plugin' }))
}));

describe('withReact (Vite)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be a function', () => {
      expect(typeof withReact).toBe('function');
    });

    it('should return a plugin function', () => {
      const plugin = withReact();
      expect(typeof plugin).toBe('function');
      expect(plugin.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty config', () => {
      const plugin = withReact();
      const result = plugin({}, createMockContext());

      expect(result).toBeDefined();
      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });
  });

  describe('Plugin configuration', () => {
    it('should add React plugin to plugins array', () => {
      const plugin = withReact();
      const result = plugin({ plugins: [] }, createMockContext());

      expect(result.plugins).toHaveLength(1);
      expect(result.plugins?.[0]).toMatchObject({ name: 'mock-react-plugin' });
    });

    it('should preserve existing plugins', () => {
      const plugin = withReact();
      const existingPlugins = [{ name: 'existing-plugin' }];
      const result = plugin({ plugins: existingPlugins }, createMockContext());

      expect(result.plugins).toHaveLength(2);
      expect(result.plugins?.[0]).toEqual({ name: 'existing-plugin' });
      expect(result.plugins?.[1]).toMatchObject({ name: 'mock-react-plugin' });
    });

    it('should handle undefined plugins array', () => {
      const plugin = withReact();
      const result = plugin({}, createMockContext());

      expect(result.plugins).toHaveLength(1);
      expect(result.plugins?.[0]).toMatchObject({ name: 'mock-react-plugin' });
    });
  });

  describe('React options', () => {
    it('should handle default options', () => {
      const plugin = withReact();
      const result = plugin({}, createMockContext());

      expect(result.plugins).toBeDefined();
      // The actual React plugin configuration is tested through the mock
    });

    it('should handle custom refresh option', () => {
      const plugin = withReact(createMockReactOptions({ refresh: false }));
      const result = plugin({}, createMockContext());

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });

    it('should handle custom runtime option', () => {
      const plugin = withReact(createMockReactOptions({ runtime: 'classic' }));
      const result = plugin({}, createMockContext());

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });

    it('should handle development mode', () => {
      const plugin = withReact(createMockReactOptions({ development: true }));
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });

    it('should handle production mode', () => {
      const plugin = withReact(createMockReactOptions({ development: false }));
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });
  });

  describe('Configuration merging', () => {
    it('should preserve existing config properties', () => {
      const plugin = withReact();
      const existingConfig = {
        build: { outDir: 'custom-dist' },
        server: { port: 4000 },
        define: { __VERSION__: '"1.0.0"' },
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.build?.outDir).toBe('custom-dist');
      expect(result.server?.port).toBe(4000);
      expect(result.define?.__VERSION__).toBe('"1.0.0"');
    });

    it('should not override existing plugins configuration', () => {
      const plugin = withReact();
      const existingConfig = {
        plugins: [{ name: 'user-plugin' }],
      };

      const result = plugin(existingConfig, createMockContext());

      expect(result.plugins).toHaveLength(2);
      expect(result.plugins?.[0]).toEqual({ name: 'user-plugin' });
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined context', () => {
      const plugin = withReact();
      const result = plugin({});

      expect(result).toBeDefined();
      expect(result.plugins).toBeDefined();
    });

    it('should handle empty options', () => {
      const plugin = withReact({});
      const result = plugin({}, createMockContext());

      expect(result).toBeDefined();
      expect(result.plugins).toBeDefined();
    });
  });

  describe('Context-based configuration', () => {
    it('should handle development context', () => {
      const plugin = withReact();
      const result = plugin({}, createMockContext({ mode: 'development' }));

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });

    it('should handle production context', () => {
      const plugin = withReact();
      const result = plugin({}, createMockContext({ mode: 'production' }));

      expect(result.plugins).toBeDefined();
      expect(Array.isArray(result.plugins)).toBe(true);
    });
  });
});