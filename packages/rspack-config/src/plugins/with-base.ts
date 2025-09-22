import { WithBaseOptions, COMMON_EXTENSIONS } from "@frgryr1/compiler-core";
import {
  RspackConfiguration,
  RspackPluginContext,
  RspackConfigPlugin,
} from "../types";

/**
 * Base plugin that provides essential rspack configuration
 * Similar to NX's withNx() but without NX dependencies
 */
export function withBase(options: WithBaseOptions = {}): RspackConfigPlugin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (config: RspackConfiguration, context: RspackPluginContext = {}) => {
    const {
      mode = context.mode || "development",
      entry = "./src/main.ts",
      outputPath = context.outputPath || "dist",
      publicPath = "/",
      sourceMap = mode === "development",
      target = "web",
    } = options;

    const isDev = mode === "development";
    const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];
    console.log("withBase", config.plugins);
    return {
      ...config,
      mode,
      entry: config.entry || entry,
      target: config.target || target,
      output: {
        path: outputPath,
        filename:
          mode === "production" ? "[name].[contenthash].js" : "[name].js",
        chunkFilename:
          mode === "production"
            ? "[name].[contenthash].chunk.js"
            : "[name].chunk.js",
        publicPath,
        clean: true,
        ...config.output,
      },
      resolve: {
        extensions: COMMON_EXTENSIONS,
        ...config.resolve,
      },
      experiments: {
        css: true,
        ...config.experiments,
      },
      devtool: sourceMap
        ? mode === "development"
          ? "eval-source-map"
          : "source-map"
        : false,
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
          },
        },
        ...config.optimization,
      },
      module: {
        rules: [
          ...(config.module?.rules || [
            {
              test: /\.svg$/,
              type: "asset",
            },
            {
              test: /\.(jsx?|tsx?)$/,
              use: [
                {
                  loader: "builtin:swc-loader",
                  options: {
                    jsc: {
                      parser: {
                        syntax: "typescript",
                        tsx: true,
                      },
                      transform: {
                        react: {
                          runtime: "automatic",
                          development: isDev,
                          refresh: isDev,
                        },
                      },
                    },
                    env: { targets },
                  },
                },
              ],
            },
          ]),
        ],
      },
      plugins: [...(config.plugins || [])],
    };
  };
}
