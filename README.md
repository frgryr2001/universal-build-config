# Rslib project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

# Multi-Bundler Config Override Library

A library for overriding configurations for **Rspack**, **Vite**, and **Rsbuild** similar to NX's approach but without depending on the NX library.

## 🚀 Features

- ✅ **Multi-Bundler Support**: Supports Rspack, Vite, and Rsbuild
- ✅ **Plugin Composition**: Easily combine multiple configuration plugins
- ✅ **Shared Utilities**: Code reuse across bundlers
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Modular Exports**: Separate imports for each bundler

## 📦 Installation

```bash
npm install libs
# Or
yarn add libs
# Or
pnpm add libs
```

### Dependencies for each bundler:

**Rspack:**

```bash
npm install @rspack/core @rspack/plugin-react-refresh
```

**Vite:**

```bash
npm install vite @vitejs/plugin-react
```

**Rsbuild:**

```bash
npm install @rsbuild/core @rsbuild/plugin-react
```

## 🎯 Usage

### Separate imports for each bundler:

```typescript
// Rspack
import { composePlugins, withBase, withReact } from "libs/rspack";

// Vite
import { composePlugins, withBase, withReact } from "libs/vite";

// Rsbuild
import { composePlugins, withBase, withReact } from "libs/rsbuild";

// Shared utilities
import { createCommonAliases, getEnvVars } from "libs/shared";
```

## 📋 API Reference

### Common Plugins

All bundlers support the following plugins:

#### `composePlugins(...plugins)`

Combines multiple configuration plugins into a single function.

#### `withBase(options?)`

Provides basic configuration for the bundler.

```typescript
withBase({
  mode: "development",
  entry: "./src/main.ts",
  outputPath: "dist",
  publicPath: "/",
  sourceMap: true,
  target: "web",
});
```

#### `withReact(options?)`

Adds React support.

```typescript
withReact({
  refresh: true, // React Refresh for development
  runtime: "automatic", // JSX runtime
  development: true, // Development mode
  importSource: "react", // Import source for JSX
});
```

## ⚙️ Default Configurations

### Rspack Default Config

When using `withBase()` for Rspack, the following defaults are applied:

```typescript
{
  mode: 'development',
  output: {
    path: 'dist',
    clean: true,
    filename: '[name].js', // '[name].[contenthash].js' in production
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': './src',
      '~': './src'
    }
  },
  module: {
    rules: [], // Populated by other plugins
  },
  plugins: [], // Populated by other plugins
  optimization: {
    runtimeChunk: false,
  }
}
```

### Vite Default Config

When using `withBase()` for Vite, the following defaults are applied:

```typescript
{
  mode: 'development',
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true, // false in production
    minify: false,   // true in production
    target: ['es2015'],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': './src',
      '~': './src'
    }
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  plugins: [] // Populated by other plugins
}
```

### Rsbuild Default Config

When using `withBase()` for Rsbuild, the following defaults are applied:

```typescript
{
  mode: 'development',
  source: {
    entry: {
      index: './src/index.tsx'
    },
    alias: {
      '@': './src',
      '~': './src'
    }
  },
  output: {
    distPath: {
      root: 'dist'
    },
    filename: {
      js: '[name].js', // '[name].[contenthash].js' in production
    },
    sourceMap: {
      js: 'source-map', // false in production
    }
  },
  server: {
    port: 3000,
    host: true,
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  plugins: [] // Populated by other plugins
}
```

## 🔧 Configuration Examples

### Rspack Configuration

```typescript
// rspack.config.ts
import { composePlugins, withBase, withReact } from "libs/rspack";

export default composePlugins(
  withBase({
    entry: "./src/main.tsx",
    publicPath: "/custom-path/",
    sourceMap: true,
  }),
  withReact({
    refresh: true,
    runtime: "automatic",
  }),
  // Custom plugin
  (config, context) => {
    config.plugins?.push(
      new (require("@rspack/core").DefinePlugin)({
        "process.env.MY_VAR": JSON.stringify("custom-value"),
      }),
    );

    config.module?.rules?.push({
      test: /\.s[ac]ss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: "[local]-[hash:base64:5]",
            },
          },
        },
        {
          loader: "sass-loader",
          options: {
            api: "modern-compiler",
            implementation: require.resolve("sass-embedded"),
          },
        },
      ],
      type: "css/auto",
    });

    return config;
  },
);
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { composePlugins, withBase, withReact } from "libs/vite";

export default defineConfig(
  composePlugins(
    withBase({
      publicPath: "/custom-path/",
      sourceMap: true,
    }),
    withReact({
      refresh: true,
      runtime: "automatic",
    }),
    // Custom plugin
    (config, context) => {
      return {
        ...config,
        define: {
          ...config.define,
          "process.env.MY_VAR": JSON.stringify("custom-value"),
        },
        css: {
          ...config.css,
          modules: {
            generateScopedName: "[local]-[hash:base64:5]",
          },
          preprocessorOptions: {
            scss: {
              api: "modern-compiler",
            },
          },
        },
      };
    },
  )(),
);
```

### Rsbuild Configuration

```typescript
// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { composePlugins, withBase, withReact } from "libs/rsbuild";

export default defineConfig(
  composePlugins(
    withBase({
      entry: "./src/main.tsx",
      publicPath: "/custom-path/",
      sourceMap: true,
    }),
    withReact({
      refresh: true,
      runtime: "automatic",
    }),
    // Custom plugin
    (config, context) => {
      return {
        ...config,
        tools: {
          ...config.tools,
          rspack: (rspackConfig: any) => {
            rspackConfig.plugins.push(
              new (require("@rspack/core").DefinePlugin)({
                "process.env.MY_VAR": JSON.stringify("custom-value"),
              }),
            );
            return rspackConfig;
          },
        },
      };
    },
  )(),
);
```

## 🏗️ Library Structure

```
src/
├── shared/           # Common utilities and types
│   ├── types.ts     # Base types for all bundlers
│   ├── utils.ts     # Shared utilities
│   └── plugins/     # Shared plugin utilities
├── rspack/          # Rspack-specific
│   ├── types.ts
│   ├── compose-plugins.ts
│   ├── plugins/
│   └── index.ts
├── vite/            # Vite-specific
│   ├── types.ts
│   ├── compose-plugins.ts
│   ├── plugins/
│   └── index.ts
├── rsbuild/         # Rsbuild-specific
│   ├── types.ts
│   ├── compose-plugins.ts
│   ├── plugins/
│   └── index.ts
└── examples/        # Configuration examples
    ├── rspack.config.ts
    ├── vite.config.ts
    └── rsbuild.config.ts
```

## 🔄 Comparison with NX

| NX                                      | This Library                              |
| --------------------------------------- | ----------------------------------------- |
| `composePlugins(withNx(), withReact())` | `composePlugins(withBase(), withReact())` |
| Only supports Rspack/Webpack            | Supports Rspack, Vite, Rsbuild            |
| Depends on @nx/\*                       | Independent, no NX dependency             |
| Integrated with NX workspace            | Can be used anywhere                      |

## 🛠️ Creating Custom Plugins

```typescript
import { BaseConfigPlugin } from "libs/shared";

// For Rspack
const withCustomFeature = (options = {}): RspackConfigPlugin => {
  return (config, context) => {
    // Modify config here
    return {
      ...config,
      // Your modifications
    };
  };
};

// For Vite
const withCustomFeature = (options = {}): ViteConfigPlugin => {
  return (config, context) => {
    // Modify config here
    return {
      ...config,
      // Your modifications
    };
  };
};

// Usage
export default composePlugins(
  withBase(),
  withCustomFeature({ option: "value" }),
);
```

## 🎨 Advanced Examples

### Multi-environment Rsbuild

```typescript
export default defineConfig(
  composePlugins(withBase(), withReact(), (config) => ({
    ...config,
    environments: {
      web: {
        source: { entry: { index: "./src/web/index.tsx" } },
        output: { target: "web" },
      },
      node: {
        source: { entry: { server: "./src/server/index.ts" } },
        output: { target: "node" },
      },
    },
  }))(),
);
```

### Vite with Proxy

```typescript
export default defineConfig(
  composePlugins(withBase(), withReact(), (config) => ({
    ...config,
    server: {
      ...config.server,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  }))(),
);
```

## 📝 Migration Guide

### From NX Rspack

```typescript
// Before (NX)
import { composePlugins, withNx, withReact } from "@nx/rspack";

export default composePlugins(
  withNx(),
  withReact(),
  // custom config
);

// After (This library)
import { composePlugins, withBase, withReact } from "libs/rspack";

export default composePlugins(
  withBase(),
  withReact(),
  // custom config
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License
