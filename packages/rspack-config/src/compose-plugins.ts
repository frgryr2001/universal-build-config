import { createComposePlugins } from "@stageit-labs/shared-config";
import {
  RspackConfiguration,
  RspackPluginContext,
  RspackConfigPlugin,
} from "./types";

/**
 * Compose multiple rspack configuration plugins into a single configuration function
 * Uses the shared compose plugins utility
 */
const baseComposePlugins = createComposePlugins<
  RspackConfiguration,
  RspackPluginContext
>();

/**
 * Rspack-specific compose plugins that returns a configuration object directly
 * This is compatible with Rspack's defineConfig function
 */
export function composePlugins(
  ...plugins: RspackConfigPlugin[]
): RspackConfiguration {
  const composedPlugin = baseComposePlugins(...plugins);
  // Call the composed plugin with an empty initial config
  return composedPlugin({}, {});
}

/**
 * Create a base rspack configuration with sensible defaults
 */
export function createBaseConfig(
  context: RspackPluginContext = {},
): RspackConfiguration {
  const { mode = "development", outputPath = "dist" } = context;

  return {
    mode,
    output: {
      path: outputPath,
      clean: true,
      filename: mode === "production" ? "[name].[contenthash].js" : "[name].js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    module: {
      rules: [],
    },
    plugins: [],
    optimization: {
      runtimeChunk: false,
    },
  };
}
