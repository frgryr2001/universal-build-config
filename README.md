# iCondo Compiler - Universal Build Configuration

A unified plugin-based configuration system for modern JavaScript bundlers (Vite, Rspack, Rsbuild) with TypeScript support and comprehensive testing. **Now available on NPM!**

## 🎯 Project Overview

iCondo Compiler creates a consistent, type-safe, and extensible configuration system that allows developers to write bundler-agnostic code while leveraging the specific optimizations and features of each bundler.

### Core Mission

Solve configuration fragmentation across modern bundlers by providing:
- **Unified API**: Write configuration once, use across multiple bundlers
- **Type Safety**: Full TypeScript IntelliSense and compile-time validation
- **Best Practices**: Built-in optimizations and sensible defaults
- **Easy Migration**: Switch bundlers without rewriting configuration

## 📦 Published Packages

All packages are now available on NPM under the `@frgryr1` namespace:

| Package | Version | Description |
|---------|---------|-------------|
| [`@frgryr1/compiler-core`](https://npmjs.com/package/@frgryr1/compiler-core) | ![npm](https://img.shields.io/npm/v/@frgryr1/compiler-core) | Core utilities and types |
| [`@frgryr1/vite-config`](https://npmjs.com/package/@frgryr1/vite-config) | ![npm](https://img.shields.io/npm/v/@frgryr1/vite-config) | Vite configuration system |
| [`@frgryr1/rspack-config`](https://npmjs.com/package/@frgryr1/rspack-config) | ![npm](https://img.shields.io/npm/v/@frgryr1/rspack-config) | Rspack configuration system |
| [`@frgryr1/rsbuild-config`](https://npmjs.com/package/@frgryr1/rsbuild-config) | ![npm](https://img.shields.io/npm/v/@frgryr1/rsbuild-config) | Rsbuild configuration system |

## 🚀 Quick Start

### Installation

```bash
# Install packages from NPM
npm install @frgryr1/compiler-core @frgryr1/vite-config

# Or for specific bundlers
npm install @frgryr1/rspack-config
npm install @frgryr1/rsbuild-config
```

### Basic Usage

```typescript
// vite.config.ts
import { composePlugins, withBase, withReact } from '@frgryr1/vite-config';

export default composePlugins(
  withBase({ entry: './src/main.tsx' }),
  withReact()
);
```

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

```bash
icondo-compiler/
├── packages/
│   ├── core/                  # @frgryr1/compiler-core - Core utilities and types
│   ├── vite-config/           # @frgryr1/vite-config
│   ├── rsbuild-config/        # @frgryr1/rsbuild-config
│   ├── rspack-config/         # @frgryr1/rspack-config
│   ├── eslint-config/         # @repo/eslint-config (internal)
│   └── typescript-config/     # @repo/typescript-config (internal)
├── apps/                      # Example applications
│   ├── vite-app/             # Vite demo application
│   ├── rsbuild-app/          # Rsbuild demo application
│   └── rspack-app/           # Rspack demo application
└── scripts/                  # Publishing and utility scripts
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

## � Quality Metrics

### Production Ready Status ✅

- ✅ **115 Comprehensive Tests** with 100% pass rate
- ✅ **TypeScript Strict Mode** compliance (zero errors)
- ✅ **NPM Published** and publicly available
- ✅ **Complete Type Definitions** for full IntelliSense
- ✅ **Optimized Bundle Sizes** for minimal runtime overhead

### Bundle Sizes
- **Core**: 3.0 kB (1.1 kB gzipped)
- **Vite Config**: 10.1 kB (2.5 kB gzipped)
- **Rspack Config**: 8.2 kB (1.9 kB gzipped)
- **Rsbuild Config**: 6.2 kB (1.7 kB gzipped)

### Test Coverage
```bash
# Run comprehensive test suite
pnpm test

# Results: 115 tests across all packages
# ✓ @frgryr1/vite-config: 56 tests
# ✓ @frgryr1/rspack-config: 26 tests
# ✓ @frgryr1/rsbuild-config: 33 tests
```

## �📄 Package Information

### Current Versions

- **TypeScript**: ^5.5.4
- **Vite**: ^7.1.3
- **Rsbuild**: ^1.5.1
- **Rspack**: ^1.5.1
- **pnpm**: 9.x
- **Node.js**: 18+

### Package Namespace

All packages are published under the `@frgryr1/` namespace:

- `@frgryr1/compiler-core` - Core utilities and types
- `@frgryr1/vite-config` - Vite-specific configuration
- `@frgryr1/rsbuild-config` - Rsbuild-specific configuration
- `@frgryr1/rspack-config` - Rspack-specific configuration

## 📚 Documentation

- **[📖 NPM Publishing Guide](./NPM_PUBLISHING_GUIDE.md)** - Complete publishing process documentation
- **[🔧 API Reference](./packages/core/README.md)** - Core API documentation
- **[⚡ Vite Guide](./packages/vite-config/README.md)** - Vite-specific documentation
- **[📦 Rspack Guide](./packages/rspack-config/README.md)** - Rspack-specific documentation
- **[🚀 Rsbuild Guide](./packages/rsbuild-config/README.md)** - Rsbuild-specific documentation

## 🔗 NPM Links

- **NPM Profile**: [npmjs.com/~frgryr1](https://www.npmjs.com/~frgryr1)
- **Core Package**: [npmjs.com/package/@frgryr1/compiler-core](https://www.npmjs.com/package/@frgryr1/compiler-core)
- **Vite Config**: [npmjs.com/package/@frgryr1/vite-config](https://www.npmjs.com/package/@frgryr1/vite-config)
- **Rspack Config**: [npmjs.com/package/@frgryr1/rspack-config](https://www.npmjs.com/package/@frgryr1/rspack-config)
- **Rsbuild Config**: [npmjs.com/package/@frgryr1/rsbuild-config](https://www.npmjs.com/package/@frgryr1/rsbuild-config)

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
