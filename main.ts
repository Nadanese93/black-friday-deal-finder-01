// DealBeacon entry program: copies app/ and screenshots/ from this
// repository into the output directory and writes dossier.json there
// with buildDossier from vendor/makefun-frontend.ts.
// Node 22, standard library only. No network, no secrets, no reading
// anything outside this repository. Deterministic: two runs write
// byte-identical output.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");

function copyTreeSorted(fromDir: string, toDir: string): void {
  mkdirSync(toDir, { recursive: true });
  const names = readdirSync(fromDir).sort();
  for (const name of names) {
    const from = join(fromDir, name);
    const to = join(toDir, name);
    if (statSync(from).isDirectory()) {
      copyTreeSorted(from, to);
    } else {
      copyFileSync(from, to);
    }
  }
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
copyTreeSorted(join(repoDir, "app"), join(outputDir, "app"));
copyTreeSorted(join(repoDir, "screenshots"), join(outputDir, "screenshots"));
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216
  })
);
