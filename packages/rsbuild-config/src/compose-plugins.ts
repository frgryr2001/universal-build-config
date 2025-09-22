import { createComposePlugins } from "@frgryr1/compiler-core";
import {
  RsbuildConfiguration,
  RsbuildPluginContext,
  RsbuildConfigPlugin,
} from "./types";

/**
 * Compose multiple rsbuild configuration plugins into a single configuration function
 * Uses the shared compose plugins utility
 */
const baseComposePlugins = createComposePlugins<
  RsbuildConfiguration,
  RsbuildPluginContext
>();

/**
 * Rsbuild-specific compose plugins that returns a configuration object directly
 * This is compatible with Rsbuild's defineConfig function
 */
export function composePlugins(
  ...plugins: RsbuildConfigPlugin[]
): RsbuildConfiguration {
  const composedPlugin = baseComposePlugins(...plugins);
  // Call the composed plugin with an empty initial config
  return composedPlugin({}, {});
}

/**
 * Create a base rsbuild configuration with sensible defaults
 */
export function createBaseConfig(
  context: RsbuildPluginContext = {},
): RsbuildConfiguration {
  const mode = context.mode || "development";
  const outputPath = context.outputPath || "dist";

  return {
    source: {
      entry: {
        index: "./src/main.ts",
      },
    },
    output: {
      target: "web",
      distPath: {
        root: outputPath,
      },
      cleanDistPath: true,
      assetPrefix: "/",
    },
    server: {
      port: 3000,
    },
    dev: {
      hmr: mode === "development",
      liveReload: mode === "development",
    },
    plugins: [],
  };
}
