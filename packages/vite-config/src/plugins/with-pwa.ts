import {
  ViteConfiguration,
  VitePluginContext,
  ViteConfigPlugin,
  WithPwaOptions,
} from "../types";
import { VitePWA } from "vite-plugin-pwa";

// PWA-specific options for Vite PWA plugin

/**
 * PWA plugin that adds Progressive Web App capabilities to Vite
 * Uses vite-plugin-pwa for service worker generation and PWA features
 */
export function withPwa(options: WithPwaOptions = {}): ViteConfigPlugin {
  return (config: ViteConfiguration, context: VitePluginContext = {}) => {
    const {
      registerType = "autoUpdate",
      includeAssets = ["favicon.ico", "apple-touch-icon.png", "safari-pinned-tab.svg"],
      manifest = {},
      workbox = {},
      devOptions = {},
      disabled = false,
      injectRegister = "auto",
      strategies = "generateSW",
      ...rest
    } = options;

    if (disabled) {
      return config;
    }

    const isDev = context.mode === "development";

    console.log(`PWA is enabled. Using strategy: ${strategies}`);
    console.log("isDev:", isDev);
    console.log("context:", context);




    const plugins = [...(config.plugins || [])];
    // Development options
    const defaultDevOptions = {
      enabled: isDev,
      type: "module" as const,
      navigateFallback: "/index.html",
      ...devOptions,
    };

    // Try to add PWA plugin
    try {
      plugins.push(
        VitePWA({
          base: options.base || "/",
          registerType,
          includeAssets,
          strategies, // Add strategies here
          manifest: {
            // Default manifest values
            ...manifest,
          },
          workbox: {
            globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            globIgnores: ["**/*.json"],
            runtimeCaching: [],
            navigateFallback : "/index.html",
            ...workbox,
          },
          injectRegister,
          devOptions: defaultDevOptions,
          ...rest,
        })
      );
    } catch (error) {
      console.warn(
        "vite-plugin-pwa not found. Install it to enable PWA features:",
        "pnpm add vite-plugin-pwa",
        error
      );
    }

    return {
      ...config,
      plugins,
    };
  };
}
