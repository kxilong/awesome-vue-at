import { defineConfig, loadEnv } from "vite";
import createVitePlugins from "./vite/plugins";

const fs = require("fs");
const path = require("path");

// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: "./",
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    server: {
      port: 9000,
      proxy: {
        "/proxy": {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: command === "serve" && env.VITE_OPEN_PROXY == "true",
          rewrite: (path) => path.replace(/\/proxy/, ""),
        },
      },
    },
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  });
};
