/**
 * Mock configurations for different bundlers
 */

export const mockViteConfig = {
  plugins: [],
  build: {},
  resolve: {},
  server: {},
  preview: {},
};

export const mockRspackConfig = {
  mode: 'development' as const,
  entry: {},
  output: {},
  resolve: {},
  module: { rules: [] },
  plugins: [],
};

export const mockRsbuildConfig = {
  source: {},
  output: {},
  resolve: {},
  tools: {},
  plugins: [],
};

/**
 * Mock bundler-specific plugins
 */
export const mockVitePlugins = {
  react: () => ({ name: 'mock-react-plugin' }),
  pwa: () => ({ name: 'mock-pwa-plugin' }),
};

export const mockRspackPlugins = {
  ReactRefreshPlugin: class MockReactRefreshPlugin {
    name = 'MockReactRefreshPlugin';
  },
  DefinePlugin: class MockDefinePlugin {
    name = 'MockDefinePlugin';
    constructor(public definitions: Record<string, any>) {}
  },
};

/**
 * Mock external dependencies
 */
export const mockDependencies = {
  '@vitejs/plugin-react': mockVitePlugins.react,
  'vite-plugin-pwa': mockVitePlugins.pwa,
  '@rspack/plugin-react-refresh': mockRspackPlugins.ReactRefreshPlugin,
  '@rspack/core': {
    DefinePlugin: mockRspackPlugins.DefinePlugin,
  },
};

/**
 * Helper to create mock module resolution
 */
export function createMockRequire(mocks: Record<string, any> = {}) {
  return (id: string) => {
    if (mocks[id]) return mocks[id];
    if (mockDependencies[id as keyof typeof mockDependencies]) {
      return mockDependencies[id as keyof typeof mockDependencies];
    }
    throw new Error(`Mock not found for module: ${id}`);
  };
}