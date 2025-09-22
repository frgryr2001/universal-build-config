import { COMMON_EXTENSIONS, WithReactOptions } from "@stageit-labs/core";
import {
  ViteConfiguration,
  VitePluginContext,
  ViteConfigPlugin,
} from "../types";
import react from "@vitejs/plugin-react";
import reactSwc from "@vitejs/plugin-react-swc";

/**
 * React plugin that adds React-specific configuration to vite
 * Includes sensible defaults for React development with fast refresh and optimizations
 */
export function withReact(options: WithReactOptions = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext = {}) => {
    const {
      refresh = context.mode === "development",
      runtime = "automatic",
      development = context.mode === "development",
      importSource = "react",
    } = options;

    const plugins = [...(config.plugins || [])];

    // Add React plugin with optimized defaults
    try {
      plugins.push(
        react({
          jsxRuntime: runtime,
          jsxImportSource: importSource,
          // Enable babel plugins for better development experience
        }),
      );
    } catch (error) {
      console.warn(
        "@vitejs/plugin-react not found. Trying @vitejs/plugin-react-swc as fallback.",
        error
      );

      // Fallback: try @vitejs/plugin-react-swc for better performance
      try {
        plugins.push(
          reactSwc({
            jsxImportSource: importSource,
            // SWC-specific optimizations
            plugins: development ? [] : undefined,
          }),
        );
      } catch (swcError) {
        console.warn(
          "No React plugin found. Install @vitejs/plugin-react or @vitejs/plugin-react-swc.",
          swcError
        );
      }
    }

    return {
      ...config,
      plugins,

      // Enhanced resolve configuration for React
      resolve: {
        ...config.resolve,
        extensions: [
          ...COMMON_EXTENSIONS,
          ...(config.resolve?.extensions || []).filter(
            (ext) => ![".tsx", ".ts", ".jsx", ".js"].includes(ext),
          ),
        ],
      },

      // Optimized dependency pre-bundling for React
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react-dom/client",
          ...(config.optimizeDeps?.include || []),
        ],
        exclude: [
          ...(config.optimizeDeps?.exclude || []),
        ],
        ...config.optimizeDeps,
      },

      // Enhanced build configuration for React
      build: {
        ...config.build,
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            manualChunks: (id: string) => {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
            },
          },
        },
      },

      // ESBuild configuration for React/JSX
      esbuild: {
        ...config.esbuild,
      },

      // Define React-specific globals
      define: {
        __DEV__: JSON.stringify(development),
        'process.env.NODE_ENV': JSON.stringify(context.mode || 'development'),
        ...config.define,
      },

    };
  };
}
