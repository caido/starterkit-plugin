import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import zipPack from "vite-plugin-zip-pack";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "../",
        },
      ],
    }),
    zipPack({
      outFileName: "plugin.zip",
    }),
  ],
});
