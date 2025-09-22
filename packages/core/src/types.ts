// Base configuration types that can be shared across bundlers
export interface BasePluginContext {
  mode?: "development" | "production" | "none";
  projectRoot?: string;
  sourceRoot?: string;
  outputPath?: string;
  [key: string]: any;
}

// Common plugin options interfaces
export interface WithBaseOptions {
  mode?: "development" | "production" | "none";
  entry?: string | string[] | Record<string, string | string[]>;
  outputPath?: string;
  publicPath?: string;
  sourceMap?: boolean | string;
  target?: string | string[];
}

export interface WithReactOptions {
  refresh?: boolean;
  runtime?: "automatic" | "classic";
  development?: boolean;
  importSource?: string;
}

export interface WithSassOptions {
  cssModules?: boolean;
  sourceMap?: boolean;
  sassImplementation?: string;
  additionalData?: string;
  localIdentName?: string;
}

export interface WithEnvOptions {
  variables?: Record<string, string>;
  prefix?: string;
  systemvars?: boolean;
}

// Generic plugin type that can be specialized for each bundler
export type BaseConfigPlugin<TConfig, TContext = BasePluginContext> = (
  config: TConfig,
  context?: TContext,
) => TConfig;

export type BasePluginComposer<TConfig, TContext = BasePluginContext> = (
  ...plugins: BaseConfigPlugin<TConfig, TContext>[]
) => BaseConfigPlugin<TConfig, TContext>;
