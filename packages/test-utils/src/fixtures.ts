/**
 * Test fixtures for different configuration scenarios
 */

export const fixtures = {
  vite: {
    minimal: {
      plugins: [],
    },
    withServer: {
      plugins: [],
      server: {
        port: 3000,
        host: true,
      },
    },
    withBuild: {
      plugins: [],
      build: {
        outDir: 'dist',
        sourcemap: true,
      },
    },
    complete: {
      plugins: [],
      server: { port: 3000 },
      build: { outDir: 'dist', sourcemap: true },
      resolve: { alias: { '@': './src' } },
    },
  },

  rspack: {
    minimal: {
      mode: 'development' as const,
      entry: './src/main.ts',
    },
    withOutput: {
      mode: 'development' as const,
      entry: './src/main.ts',
      output: {
        path: 'dist',
        filename: '[name].js',
      },
    },
    withModule: {
      mode: 'development' as const,
      entry: './src/main.ts',
      module: {
        rules: [],
      },
    },
    complete: {
      mode: 'development' as const,
      entry: './src/main.ts',
      output: { path: 'dist', filename: '[name].js' },
      resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
      module: { rules: [] },
      plugins: [],
    },
  },

  rsbuild: {
    minimal: {
      source: {
        entry: { index: './src/main.ts' },
      },
    },
    withOutput: {
      source: {
        entry: { index: './src/main.ts' },
      },
      output: {
        distPath: { root: 'dist' },
      },
    },
    withResolve: {
      source: {
        entry: { index: './src/main.ts' },
      },
      resolve: {
        alias: { '@': './src' },
      },
    },
    complete: {
      source: { entry: { index: './src/main.ts' } },
      output: { distPath: { root: 'dist' } },
      resolve: { alias: { '@': './src' } },
      plugins: [],
    },
  },
};

/**
 * Test scenarios for different plugin combinations
 */
export const scenarios = {
  development: {
    mode: 'development',
    sourceMap: true,
    minify: false,
  },
  production: {
    mode: 'production',
    sourceMap: false,
    minify: true,
  },
  customPaths: {
    entry: './src/app.tsx',
    outputPath: 'build',
    publicPath: '/app/',
  },
  react: {
    refresh: true,
    runtime: 'automatic',
    development: true,
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html}'],
    },
  },
};

/**
 * Expected output templates for validation
 */
export const expectedOutputs = {
  vite: {
    base: {
      mode: 'development',
      base: '/',
      build: {
        outDir: 'dist',
        sourcemap: true,
        minify: false,
        target: ['es2020'],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: { '@': './src', '~': './src' },
      },
    },
  },

  rspack: {
    base: {
      mode: 'development',
      output: {
        path: 'dist',
        filename: '[name].js',
        publicPath: '/',
        clean: true,
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      },
    },
  },

  rsbuild: {
    base: {
      source: {
        entry: { index: './src/main.ts' },
      },
      output: {
        target: 'web',
        distPath: { root: 'dist' },
        filename: { js: '[name].js' },
      },
      resolve: {
        alias: { '@': './src', '~': './src' },
      },
    },
  },
};