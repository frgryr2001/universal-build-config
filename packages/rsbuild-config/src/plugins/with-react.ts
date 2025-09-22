import { WithReactOptions } from "@stageit-labs/shared-config";
import {
  RsbuildConfiguration,
  RsbuildPluginContext,
  RsbuildConfigPlugin,
} from "../types";

/**
 * React plugin that adds React-specific configuration to rsbuild
 * Uses @rsbuild/plugin-react for React support
 */
export function withReact(options: WithReactOptions = {}): RsbuildConfigPlugin {
  return (config: RsbuildConfiguration, context: RsbuildPluginContext = {}) => {
    const contextMode = context.mode || "development";
    const {
      refresh = contextMode === "development",
      runtime = "automatic",
      development = contextMode === "development",
    } = options;

    const plugins = [...(config.plugins || [])];

    // Add React plugin
    try {
      const { pluginReact } = require("@rsbuild/plugin-react");
      plugins.push(
        pluginReact({
          swcReactOptions: {
            runtime: runtime === "automatic" ? "automatic" : "classic",
            development,
            refresh: refresh && development,
            importSource: options.importSource || "react",
          },
        }),
      );
    } catch (error) {
      console.warn(
        "@rsbuild/plugin-react not found. Install it for React support.",
      );
    }

    return {
      ...config,
      plugins,
      source: {
        ...config.source,
        // Include TypeScript/JSX files
        include: [/\.(js|jsx|ts|tsx)$/, ...(config.source?.include || [])],
      },
    };
  };
}
