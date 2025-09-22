export * from "./types";
export { composePlugins, createBaseConfig } from "./compose-plugins";
export { withBase } from "./plugins/with-base";
export { withReact } from "./plugins/with-react";
export { withPwa } from "./plugins/with-pwa";

// Re-export shared types
export type {
  WithBaseOptions,
  WithReactOptions,
  WithSassOptions,
  WithEnvOptions,
} from "@stageit-labs/shared-config";
