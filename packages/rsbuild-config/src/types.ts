import { RsbuildConfig } from "@rsbuild/core";
import {
  BasePluginContext,
  BaseConfigPlugin,
  BasePluginComposer,
} from "@stageit-labs/shared-config";

// Use Rsbuild's official RsbuildConfig type as the base configuration
export type RsbuildConfiguration = RsbuildConfig;

export interface RsbuildPluginContext extends BasePluginContext {
  // Rsbuild-specific context properties from CreateRsbuildOptions
  target?: "web" | "node" | "web-worker";
  environment?: string;
  cwd?: string;
}

export type RsbuildConfigPlugin = BaseConfigPlugin<
  RsbuildConfiguration,
  RsbuildPluginContext
>;
export type RsbuildPluginComposer = BasePluginComposer<
  RsbuildConfiguration,
  RsbuildPluginContext
>;
