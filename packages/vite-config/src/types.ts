import { UserConfig } from "vite";
import {
  BasePluginContext,
  BaseConfigPlugin,
  BasePluginComposer,
} from "@frgryr1/compiler-core";

// Use Vite's official UserConfig type as the base configuration
export type ViteConfiguration = UserConfig;

export interface VitePluginContext extends BasePluginContext {
  // Vite-specific context properties from ConfigEnv
  command?: "build" | "serve";
  // Remove mode override - inherit from BasePluginContext
  isSsrBuild?: boolean;
  isPreview?: boolean;
}

export type ViteConfigPlugin = BaseConfigPlugin<
  ViteConfiguration,
  VitePluginContext
>;
export type VitePluginComposer = BasePluginComposer<
  ViteConfiguration,
  VitePluginContext
>;

export type WithPwaOptions =  {
  registerType?: "autoUpdate" | "prompt",
  base ?: string;
  srcDir?: string;
  includeAssets?: string[];
  manifest?: {
    name?: string;
    short_name?: string;
    description?: string;
    theme_color?: string;
    background_color?: string;
    display?: "standalone" | "fullscreen" | "minimal-ui" | "browser";
    orientation?: "any" | "natural" | "landscape" | "portrait";
    scope?: string;
    start_url?: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }>;
  };
  workbox?: {
    globPatterns?: string[];
    globIgnores?: string[];
    navigateFallback?: string;
  }
  devOptions?: {
    enabled?: boolean;
    type?: "module" | "classic";
    navigateFallback?: string;
  };
  disabled?: boolean;
  injectRegister?: false | "inline" | "script" | "script-defer" | "auto" | null ;
  fileName?: string;
  strategies?: "generateSW" | "injectManifest";
}
