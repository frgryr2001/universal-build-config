import { Configuration } from "@rspack/core";
import {
  BasePluginContext,
  BaseConfigPlugin,
  BasePluginComposer,
} from "@stageit-labs/shared-config";

// Use Rspack's official Configuration type as the base configuration
export type RspackConfiguration = Configuration;

export interface RspackPluginContext extends BasePluginContext {
  // Rspack-specific context properties
  target?: string | string[];
  devtool?: string | false;
}

export type RspackConfigPlugin = BaseConfigPlugin<
  RspackConfiguration,
  RspackPluginContext
>;
export type RspackPluginComposer = BasePluginComposer<
  RspackConfiguration,
  RspackPluginContext
>;
