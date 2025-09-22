import { BaseConfigPlugin, BasePluginContext } from "./types";

/**
 * Generic compose plugins function that works for any bundler
 */
export function createComposePlugins<TConfig, TContext = BasePluginContext>() {
  return function composePlugins(
    ...plugins: BaseConfigPlugin<TConfig, TContext>[]
  ): BaseConfigPlugin<TConfig, TContext> {
    return (initialConfig: TConfig, context: TContext = {} as TContext) => {
      return plugins.reduce((config, plugin) => {
        if (typeof plugin !== "function") {
          throw new Error(
            "Each plugin must be a function that accepts (config, context) and returns config",
          );
        }

        try {
          const result = plugin(config, context);
          if (!result || typeof result !== "object") {
            throw new Error("Plugin must return a valid configuration object");
          }
          return result;
        } catch (error) {
          console.error("Error applying plugin:", error);
          throw error;
        }
      }, initialConfig);
    };
  };
}

/**
 * Merge objects deeply, with special handling for arrays
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        // @ts-ignore
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Get environment variables with prefix
 */
export function getEnvVars(
  prefix = "REACT_APP_",
  systemvars = true,
): Record<string, string> {
  const envVars: Record<string, string> = {};

  if (systemvars) {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(prefix)) {
        envVars[`process.env.${key}`] = JSON.stringify(process.env[key]);
      }
    });
  }

  return envVars;
}

/**
 * Create common module rules for different file types
 */
export function createCommonRules() {
  return {
    // TypeScript/JavaScript rules
    createTsJsRule: (options: any = {}) => ({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      ...options,
    }),

    // CSS rules
    createCssRule: (options: any = {}) => ({
      test: /\.css$/,
      ...options,
    }),

    // Sass/SCSS rules
    createSassRule: (options: any = {}) => ({
      test: /\.s[ac]ss$/,
      ...options,
    }),

    // Asset rules
    createAssetRule: (options: any = {}) => ({
      test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
      type: "asset",
      ...options,
    }),
  };
}

/**
 * Common file extensions for different bundlers
 */
export const COMMON_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".json"];

/**
 * Common aliases
 */
export function createCommonAliases(sourceRoot = "src") {
  return {
    "@": `/${sourceRoot}`,
    "~": `/${sourceRoot}`,
  };
}
