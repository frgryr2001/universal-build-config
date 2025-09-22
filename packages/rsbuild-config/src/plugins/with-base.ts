import { WithBaseOptions, createCommonAliases } from "@frgryr1/compiler-core";
import {
  RsbuildConfiguration,
  RsbuildPluginContext,
  RsbuildConfigPlugin,
} from "../types";

/**
 * Base plugin that provides essential rsbuild configuration
 * Equivalent to withBase for other bundlers
 */
export function withBase(options: WithBaseOptions = {}): RsbuildConfigPlugin {
  return (config: RsbuildConfiguration, context: RsbuildPluginContext = {}) => {
    const mode = context.mode || options.mode || "development";
    const outputPath = context.outputPath || options.outputPath || "dist";
    const {
      entry = "./src/main.ts",
      publicPath = "/",
      sourceMap = mode === "development",
      target = "web",
    } = options;

    return {
      ...config,
      source: {
        entry: typeof entry === "string"
          ? { index: entry }
          : Array.isArray(entry)
          ? { index: entry }
          : entry,
        ...config.source,
      },
      resolve: {
        alias: {
          ...createCommonAliases(),
          ...config.resolve?.alias,
        },
        ...config.resolve,
      },
      output: {
        target: target as "web" | "node" | "web-worker",
        distPath: {
          root: outputPath,
          ...config.output?.distPath,
        },
        filename: {
          js: mode === "production" ? "[name].[contenthash].js" : "[name].js",
          css:
            mode === "production" ? "[name].[contenthash].css" : "[name].css",
          ...config.output?.filename,
        },
        assetPrefix: publicPath,
        cleanDistPath: true,
        ...config.output,
      },
      server: {
        port: 3000,
        host: "localhost",
        ...config.server,
      },
      dev: {
        hmr: mode === "development",
        liveReload: mode === "development",
        ...config.dev,
      },
      tools: {
        rspack: (rspackConfig: any) => {
          // Add source map configuration
          if (sourceMap) {
            rspackConfig.devtool =
              mode === "development" ? "eval-source-map" : "source-map";
          }
          return rspackConfig;
        },
        ...config.tools,
      },
      plugins: [...(config.plugins || [])],
    };
  };
}
