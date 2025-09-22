import { defineConfig } from "@rsbuild/core";
import {
  composePlugins,
  withBase,
  withReact,
} from "@frgryr1/rsbuild-config";
export default defineConfig(
  composePlugins(
    withBase({
      entry: "./src/index.tsx",
    }),
    withReact(),
    (config) => {
      return config;
    },
  ),
);
