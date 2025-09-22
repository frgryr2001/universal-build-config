import { WithBaseOptions, COMMON_EXTENSIONS, createCommonAliases } from "@stageit-labs/core";
import {
  ViteConfiguration,
  VitePluginContext,
  ViteConfigPlugin,
} from "../types";

/**
 * Base plugin that provides essential vite configuration with commonly-used defaults
 * Includes sensible defaults for development and production modes
 */
export function withBase(options: WithBaseOptions = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext = {}) => {
    const {
      mode = context.mode || "development",
      outputPath = context.outputPath || "dist",
      publicPath = "/",
      sourceMap = mode === "development",
      target = "es2020",
    } = options;

    const isProd = mode === "production";


    return {
      ...config,
      mode,
      base: publicPath,

      // Build configuration with production optimizations
      build: {
        outDir: outputPath,
        sourcemap: sourceMap as boolean,
        minify: isProd,
        target: Array.isArray(target) ? target : [target],
        rollupOptions: {
          ...config.build?.rollupOptions,
        },
        ...config.build,
      },

      // Resolve configuration with common extensions and aliases
      resolve: {
        extensions: COMMON_EXTENSIONS,
        alias: {
          ...createCommonAliases(),
          ...config.resolve?.alias,
        },
        ...config.resolve,
      },

      // Development server configuration
      server: {
        port: 3000,
        host: true,
        ...config.server,
      },

      // Preview server configuration
      preview: {
        port: 5000,
        host: true,
        ...config.preview,
      },

      // CSS configuration with modules support
      css: {
        modules: {
          localsConvention: 'camelCaseOnly',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
        ...config.css,
      },



      // Environment variables
      envPrefix: ['ICONDO_' , 'VITE_'],


      // Dependency optimization
      optimizeDeps: {
        ...config.optimizeDeps,
      },

      // ESBuild configuration
      esbuild: {
        target: target as string,
        ...config.esbuild,
      },

      // Define globals
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        ...config.define,
      },
      plugins: [...(config.plugins || [])],
    };
  };
}
