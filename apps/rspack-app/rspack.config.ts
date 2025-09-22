import {defineConfig} from "@rspack/cli";
import {composePlugins, withBase, withReact} from "@stageit-labs/rspack-config";
import path, { dirname } from 'node:path';
import { fileURLToPath } from "node:url";
import {rspack} from "@rslib/core";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig(composePlugins(withBase({
    entry: "./src/main.tsx"
}), withReact(), (c) => {
    c.output.path=path.resolve(__dirname, 'dist');
    c.plugins.push(new rspack.HtmlRspackPlugin({
            template: "./index.html"
        }))
    return c;
}));
// {
//     entry: {
//         main: "./src/main.tsx"
//     },
//     resolve: {
//         extensions: ["...", ".ts", ".tsx", ".jsx"]
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.svg$/,
//                 type: "asset"
//             },
//             {
//                 test: /\.(jsx?|tsx?)$/,
//                 use: [
//                     {
//                         loader: "builtin:swc-loader",
//                         options: {
//                             jsc: {
//                                 parser: {
//                                     syntax: "typescript",
//                                     tsx: true
//                                 },
//                                 transform: {
//                                     react: {
//                                         runtime: "automatic",
//                                         development: isDev,
//                                         refresh: isDev
//                                     }
//                                 }
//                             },
//                             env: { targets }
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//     plugins: [
//         new rspack.HtmlRspackPlugin({
//             template: "./index.html"
//         }),
//         isDev ? new ReactRefreshRspackPlugin() : null
//     ].filter(Boolean),
//         optimization: {
//     minimizer: [
//         new rspack.SwcJsMinimizerRspackPlugin(),
//         new rspack.LightningCssMinimizerRspackPlugin({
//             minimizerOptions: { targets }
//         })
//     ]
// },
//     experiments: {
//         css: true
//     }
// }
