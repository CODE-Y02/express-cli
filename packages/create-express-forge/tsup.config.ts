import path from "node:path";
import fs from "fs-extra";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
  target: "es2022",
  splitting: false,
  onSuccess: async () => {
    await fs.copy(path.resolve("templates"), path.resolve("dist/templates"));
    console.log("✅ Copied templates to dist/");
  },
});
