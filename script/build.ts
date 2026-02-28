import { build } from "esbuild";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("Building client...");
execSync("npx vite build", { cwd: rootDir, stdio: "inherit" });

console.log("Building server...");
await build({
  entryPoints: [path.resolve(rootDir, "server/index.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: path.resolve(rootDir, "dist/index.cjs"),
  packages: "external",
  alias: {
    "@shared": path.resolve(rootDir, "shared"),
  },
  external: ["./vite", "@replit/*"],
});

console.log("Build complete!");
