import vue from "@vitejs/plugin-vue";

import createMock from "./mock";

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createMock());
  return vitePlugins;
}
