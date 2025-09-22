import { createComposePlugins } from "@frgryr1/compiler-core";
import { ViteConfiguration, VitePluginContext, ViteConfigPlugin } from "./types";

/**
 * Compose multiple vite configuration plugins into a single configuration function
 * Uses the shared compose plugins utility
 */
const baseComposePlugins = createComposePlugins<ViteConfiguration, VitePluginContext>();

/**
 * Vite-specific compose plugins that returns a configuration object directly
 * This is compatible with Vite's defineConfig function
 */
export function composePlugins(
  ...plugins: ViteConfigPlugin[]
): ((env: { command: string; mode: string }) => ViteConfiguration) | ViteConfiguration {
  const composedPlugin = baseComposePlugins(...plugins);


  return (env: { command: string; mode: string }) => {
    const context: VitePluginContext = {
      mode: env.mode as "development" | "production" | "none",
      command: env.command as "build" | "serve"
    };
    return composedPlugin({}, context);
  };
}

/**
 * Create a base vite configuration with sensible defaults
 */
export function createBaseConfig(
  context: VitePluginContext = {},
): ViteConfiguration {
  const { mode = "development", outputPath = "dist" } = context;

  return {
    mode,
    base: "/",
    build: {
      outDir: outputPath,
      sourcemap: mode === "development",
      minify: mode === "production",
      target: "es2015",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    plugins: [],
    server: {
      port: 3000,
    },
  };
}
