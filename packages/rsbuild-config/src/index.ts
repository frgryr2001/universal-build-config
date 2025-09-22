export * from "./types";
export { composePlugins, createBaseConfig } from "./compose-plugins";
export { withBase } from "./plugins/with-base";
export { withReact } from "./plugins/with-react";

// Re-export shared types
export type {
  WithBaseOptions,
  WithReactOptions,
  WithSassOptions,
  WithEnvOptions,
} from "@stageit-labs/core";
