import { WithReactOptions } from "@frgryr1/compiler-core";
import {
  RspackConfiguration,
  RspackPluginContext,
  RspackConfigPlugin,
} from "../types";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";

/**
 * React plugin that adds React-specific configuration to rspack
 * Similar to NX's withReact() but without NX dependencies
 */
export function withReact(options: WithReactOptions = {}): RspackConfigPlugin {
  return (config: RspackConfiguration, context: RspackPluginContext = {}) => {
    const isDev = process.env.NODE_ENV === "development";
    const {
      refresh = isDev,
      runtime = "automatic",
      development = isDev,
      importSource = "react",
    } = options;

    const reactRules = [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                  decorators: true,
                },
                transform: {
                  react: {
                    runtime,
                    development,
                    refresh,
                    importSource,
                  },
                },
                target: "es2015",
              },
            },
          },
        ],
      },
    ];

    const plugins = [...(config.plugins || [])];

    const pl = [];

    // Add React Refresh plugin for development
    if (isDev) {
      try {
        console.log("ReactRefreshPlugin", ReactRefreshPlugin);
        plugins.push(new ReactRefreshPlugin());
        pl.push(new ReactRefreshPlugin());
      } catch (error) {
        console.warn(
          "React Refresh plugin not found. Install @rspack/plugin-react-refresh for hot reloading.",
        );
      }
    }
    console.log("withReact", plugins, pl.length);

    return {
      ...config,
      module: {
        ...config.module,
        rules: [...(config.module?.rules || []), ...reactRules],
      },
      plugins,
      resolve: {
        ...config.resolve,
        extensions: [
          ".tsx",
          ".ts",
          ".jsx",
          ".js",
          ...(config.resolve?.extensions || []).filter(
            (ext) => ![".tsx", ".ts", ".jsx", ".js"].includes(ext),
          ),
        ],
      },
    };
  };
}
