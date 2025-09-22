# iCondo Compiler

A TypeScript monorepo project that provides a unified plugin-based configuration system for multiple JavaScript bundlers (Rsbuild, Rspack, and Vite). The project follows a modular architecture with shared utilities and bundler-specific implementations.

## 🎯 Project Overview

iCondo Compiler creates a consistent, type-safe, and extensible configuration system that allows developers to write bundler-agnostic code while leveraging the specific optimizations and features of each bundler.

### Core Mission

Solve configuration fragmentation across modern bundlers by providing:
- **Unified API**: Write configuration once, use across multiple bundlers
- **Type Safety**: Full TypeScript IntelliSense and compile-time validation
- **Best Practices**: Built-in optimizations and sensible defaults
- **Easy Migration**: Switch bundlers without rewriting configuration

## 🚀 Quick Start

### Setup

Install the dependencies:

```bash
pnpm install
```

### Get started

Build all packages:

```bash
pnpm build
```

Run in development mode:

```bash
pnpm dev
```

## 🏗️ Architecture

### Monorepo Structure

```
icondo-compiler/
├── packages/
│   ├── shared-config/          # @stageit-labs/core - Shared utilities and types
│   ├── vite-config/           # @stageit-labs/vite-config
│   ├── rsbuild-config/        # @stageit-labs/rsbuild-config
│   ├── rspack-config/         # @stageit-labs/rspack-config
│   ├── eslint-config/         # @repo/eslint-config
│   └── typescript-config/     # @repo/typescript-config
├── apps/                      # Example applications
│   ├── vite-app/             # Vite demo application
│   ├── rsbuild-app/          # Rsbuild demo application
│   └── rspack-app/           # Rspack demo application
└── memory-bank/              # Project documentation
```

### Technology Stack

- **Language**: TypeScript 5.5+ with strict mode
- **Package Manager**: pnpm 9.x with workspace support
- **Build System**: Turbo + rslib for fast, incremental builds
- **Bundlers**: Vite 7.1.3, Rsbuild 1.5.1, Rspack 1.5.1

## 🚀 Features

- ✅ **Multi-Bundler Support**: Supports Rspack, Vite, and Rsbuild
- ✅ **Plugin Composition**: Easily combine multiple configuration plugins
- ✅ **Shared Utilities**: Code reuse across bundlers
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Modular Exports**: Separate imports for each bundler

## 📦 Installation

### Core Packages

Install the bundler-specific configuration package you need:

```bash
# For Vite projects
pnpm add @stageit-labs/vite-config

# For Rsbuild projects
pnpm add @stageit-labs/rsbuild-config

# For Rspack projects
pnpm add @stageit-labs/rspack-config

# For shared utilities (optional)
pnpm add @stageit-labs/core
```

### Bundler Dependencies

Each bundler requires its own dependencies:

**Vite:**

```bash
pnpm add vite @vitejs/plugin-react
```

**Rsbuild:**

```bash
pnpm add @rsbuild/core @rsbuild/plugin-react
```

**Rspack:**

```bash
pnpm add @rspack/core @rspack/plugin-react-refresh
```

## 🎯 Usage

### Basic Usage Pattern

Each bundler has its own package with a consistent API:

```typescript
// For Vite
import { composePlugins, withBase, withReact } from "@stageit-labs/vite-config";

// For Rsbuild
import { composePlugins, withBase, withReact } from "@stageit-labs/rsbuild-config";

// For Rspack
import { composePlugins, withBase, withReact } from "@stageit-labs/rspack-config";

// Shared utilities (optional)
import { createCommonAliases, getEnvVars } from "@stageit-labs/core";
```

### Simple Configuration Example

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { composePlugins, withBase, withReact } from "@stageit-labs/vite-config";

export default defineConfig(
  composePlugins(
    withBase({ mode: "development" }),
    withReact({ refresh: true })
  )
);
```

## 📋 API Reference

### Plugin Composition

#### `composePlugins(...plugins)`

Combines multiple configuration plugins into a single function that transforms configuration objects.

```typescript
type ConfigPlugin<TConfig, TContext> = (
  config: TConfig,
  context?: TContext
) => TConfig;

const composePlugins = (...plugins: ConfigPlugin[]) =>
  (initialConfig: Config) =>
    plugins.reduce((config, plugin) => plugin(config), initialConfig);
```

### Core Plugins

#### `withBase(options?)`

Provides comprehensive base configuration for the bundler including:

- Development/production optimizations
- Asset handling and optimization
- CSS modules and preprocessing
- TypeScript/JSX configuration
- Performance optimizations

```typescript
withBase({
  mode: "development" | "production",
  entry: "./src/main.ts",
  outputPath: "dist",
  publicPath: "/",
  sourceMap: true,
  target: "web" | "node"
});
```

#### `withReact(options?)`

Adds React support with modern features:

```typescript
withReact({
  refresh: true,        // React Fast Refresh for development
  runtime: "automatic", // Modern JSX runtime (no React imports needed)
  development: true,    // Development mode optimizations
  importSource: "react" // JSX import source
});
```

### Advanced Plugins

#### `withPwa(options?)` (Vite only)

Adds Progressive Web App support:

```typescript
withPwa({
  registerType: "autoUpdate",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
  }
});
```

## ⚙️ Configuration Examples

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { composePlugins, withBase, withReact, withPwa } from "@stageit-labs/vite-config";

export default defineConfig(
  composePlugins(
    withBase({
      mode: "development",
      publicPath: "/app/",
      sourceMap: true
    }),
    withReact({
      refresh: true,
      runtime: "automatic"
    }),
    withPwa({
      registerType: "autoUpdate"
    }),
    // Custom configuration
    (config, context) => ({
      ...config,
      define: {
        ...config.define,
        __APP_VERSION__: JSON.stringify("1.0.0")
      }
    })
  )
);
```

### Rsbuild Configuration

```typescript
// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { composePlugins, withBase, withReact } from "@stageit-labs/rsbuild-config";

export default defineConfig(
  composePlugins(
    withBase({
      entry: "./src/main.tsx",
      publicPath: "/app/",
      sourceMap: true
    }),
    withReact({
      refresh: true,
      runtime: "automatic"
    }),
    // Custom configuration
    (config, context) => ({
      ...config,
      tools: {
        ...config.tools,
        rspack: (rspackConfig) => {
          rspackConfig.plugins.push(
            new DefinePlugin({
              __APP_VERSION__: JSON.stringify("1.0.0")
            })
          );
          return rspackConfig;
        }
      }
    })
  )
);
```

### Rspack Configuration

```typescript
// rspack.config.ts
import { composePlugins, withBase, withReact } from "@stageit-labs/rspack-config";

export default composePlugins(
  withBase({
    entry: "./src/main.tsx",
    publicPath: "/app/",
    sourceMap: true
  }),
  withReact({
    refresh: true,
    runtime: "automatic"
  }),
  // Custom configuration
  (config, context) => {
    config.plugins?.push(
      new DefinePlugin({
        __APP_VERSION__: JSON.stringify("1.0.0")
      })
    );
    return config;
  }
);
```

## 🛠️ Creating Custom Plugins

### Plugin Development Pattern

```typescript
import type { ViteConfigPlugin, VitePluginContext } from "@stageit-labs/vite-config";

const withCustomFeature = (options: CustomOptions = {}): ViteConfigPlugin => {
  return (config, context) => {
    // Validate options
    const { feature = true, customPath = "./custom" } = options;

    // Apply transformations
    return {
      ...config,
      plugins: [
        ...config.plugins,
        // Add your custom plugins
      ],
      define: {
        ...config.define,
        __CUSTOM_FEATURE__: JSON.stringify(feature)
      }
    };
  };
};

// Usage
export default defineConfig(
  composePlugins(
    withBase(),
    withReact(),
    withCustomFeature({ feature: true, customPath: "./src/custom" })
  )
);
```

### Plugin Types for Each Bundler

```typescript
// Vite
type ViteConfigPlugin = (config: ViteConfig, context: VitePluginContext) => ViteConfig;

// Rsbuild
type RsbuildConfigPlugin = (config: RsbuildConfig, context: RsbuildPluginContext) => RsbuildConfig;

// Rspack
type RspackConfigPlugin = (config: RspackConfig, context: RspackPluginContext) => RspackConfig;
```

## 🔄 Migration Guide

### From Manual Configuration

**Before (manual Vite config):**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: true
  },
  server: {
    port: 3000
  }
});
```

**After (with iCondo Compiler):**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { composePlugins, withBase, withReact } from "@stageit-labs/vite-config";

export default defineConfig(
  composePlugins(
    withBase({ sourceMap: true }),
    withReact()
  )
);
```

### Cross-Bundler Migration

The unified API makes it easy to switch between bundlers:

```typescript
// Switch from Vite to Rsbuild by changing the import
// From:
import { composePlugins, withBase, withReact } from "@stageit-labs/vite-config";

// To:
import { composePlugins, withBase, withReact } from "@stageit-labs/rsbuild-config";

// Configuration stays the same!
export default defineConfig(
  composePlugins(
    withBase({ sourceMap: true }),
    withReact()
  )
);
```

## 🎨 Advanced Features

### Environment-Specific Configuration

```typescript
// Multi-environment setup
const createConfig = (env: "development" | "production") =>
  composePlugins(
    withBase({
      mode: env,
      sourceMap: env === "development",
      minify: env === "production"
    }),
    withReact({
      refresh: env === "development"
    }),
    // Environment-specific customizations
    (config) => env === "production" ? {
      ...config,
      build: {
        ...config.build,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ["react", "react-dom"]
            }
          }
        }
      }
    } : config
  );

export default defineConfig(createConfig(process.env.NODE_ENV));
```

### Progressive Web App Setup (Vite)

```typescript
// vite.config.ts with PWA
import { defineConfig } from "vite";
import { composePlugins, withBase, withReact, withPwa } from "@stageit-labs/vite-config";

export default defineConfig(
  composePlugins(
    withBase(),
    withReact(),
    withPwa({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true
      },
      manifest: {
        name: "My App",
        short_name: "MyApp",
        description: "My awesome app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }
    })
  )
);
```

### Multi-Environment Rsbuild

```typescript
// rsbuild.config.ts with environments
import { defineConfig } from "@rsbuild/core";
import { composePlugins, withBase, withReact } from "@stageit-labs/rsbuild-config";

export default defineConfig(
  composePlugins(
    withBase(),
    withReact(),
    (config) => ({
      ...config,
      environments: {
        web: {
          source: {
            entry: { index: "./src/web/index.tsx" }
          },
          output: {
            target: "web"
          }
        },
        node: {
          source: {
            entry: { server: "./src/server/index.ts" }
          },
          output: {
            target: "node"
          }
        }
      }
    })
  )
);
```

## � Current Status

### ✅ Completed Features

- Core monorepo infrastructure with pnpm workspaces
- TypeScript 5.5+ with strict mode compliance
- Build system using Turbo + rslib for fast compilation
- Unified plugin system across all bundlers
- Base configuration plugins for all bundlers
- React support plugins with Fast Refresh
- Progressive Web App support for Vite
- Type-safe configuration with full IntelliSense
- Example applications for each bundler

### 🚧 In Development

- Enhanced base configurations with more optimization options
- Additional CSS framework integrations
- Advanced asset optimization plugins
- Server-side rendering configurations
- Comprehensive testing suite

### 📋 Planned Features

- VS Code extension for better development experience
- CLI tools for project scaffolding and migration
- Additional bundler support (e.g., Webpack, Rollup)
- Plugin marketplace and documentation site
- Performance monitoring and optimization tools

## 📄 Package Information

### Current Versions

- **TypeScript**: ^5.5.4
- **Vite**: ^7.1.3
- **Rsbuild**: ^1.5.1
- **Rspack**: ^1.5.1
- **pnpm**: 9.x
- **Node.js**: 20.19+ or 22.12+

### Package Namespace

All packages use the `@stageit-labs/` namespace:

- `@stageit-labs/core` - Shared utilities and types
- `@stageit-labs/vite-config` - Vite-specific configuration
- `@stageit-labs/rsbuild-config` - Rsbuild-specific configuration
- `@stageit-labs/rspack-config` - Rspack-specific configuration

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a Pull Request

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd icondo-compiler

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
