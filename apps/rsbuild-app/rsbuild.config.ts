import { defineConfig } from "@rsbuild/core";
import {
  composePlugins,
  withBase,
  withReact,
} from "@stageit-labs/rsbuild-config";
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
