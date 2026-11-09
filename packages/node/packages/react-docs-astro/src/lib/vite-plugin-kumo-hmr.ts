import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve once — points at the sibling kumo package root
const kumoRoot = resolve(__dirname, "../../../kumo");
const kumoSrc = resolve(kumoRoot, "src");

/**
 * Map every `@zenthcloud/kumo` sub-path export to its source equivalent.
 *
 * In dev mode Vite will resolve these to the raw .ts/.tsx source files,
 * which means file-watcher-based HMR works instantly — no rebuild of
 * the kumo package required.
 *
 * In production builds (astro build) this plugin is NOT loaded, so the
 * normal package.json `exports` field is used (dist/), which validates
 * the real consumer experience.
 */
const aliases: Record<string, string> = {
  // Main barrel — resolves to source index.ts
  "@zenthcloud/kumo": resolve(kumoSrc, "index.ts"),

  // CSS styles — resolve to source CSS
  "@zenthcloud/kumo/styles/tailwind": resolve(kumoSrc, "styles/kumo.css"),
  "@zenthcloud/kumo/styles/standalone": resolve(
    kumoSrc,
    "styles/kumo-standalone.css",
  ),
  "@zenthcloud/kumo/styles": resolve(kumoSrc, "styles/kumo.css"),

  // JSON registry — these live outside src/ and are NOT built, so same
  // path works in dev and prod.  We alias anyway so Vite can resolve
  // the workspace:* link correctly and watch the file.
  "@zenthcloud/kumo/ai/component-registry.json": resolve(
    kumoRoot,
    "ai/component-registry.json",
  ),

  // Theme generator — resolve to source TS so the docs color page
  // always reflects the latest config without a kumo build step.
  "@zenthcloud/kumo/scripts/theme-generator/config": resolve(
    kumoRoot,
    "scripts/theme-generator/config.ts",
  ),
  "@zenthcloud/kumo/scripts/theme-generator/types": resolve(
    kumoRoot,
    "scripts/theme-generator/types.ts",
  ),

  // Code highlighting has separate client and server entry points.
  "@zenthcloud/kumo/code": resolve(kumoSrc, "code/index.ts"),
  "@zenthcloud/kumo/code/server": resolve(kumoSrc, "code/server.tsx"),
};

/**
 * Vite plugin that rewires `@zenthcloud/kumo` imports to the raw source
 * files of the sibling package during `astro dev`.
 *
 * **Why not just use `resolve.alias`?**
 * `resolve.alias` is a simple prefix match — it can't distinguish
 * `@zenthcloud/kumo` from `@zenthcloud/kumo-figma` without a trailing
 * slash, and it can't handle the overlapping sub-path exports cleanly.
 * A plugin gives us exact-match control.
 */
export function kumoHmrPlugin() {
  return {
    name: "vite-plugin-kumo-hmr",
    enforce: "pre" as const,

    resolveId(source: string) {
      // Exact match first (most imports)
      if (aliases[source]) {
        return aliases[source];
      }

      // Sub-path component imports: @zenthcloud/kumo/components/button
      // → packages/kumo/src/components/button/index.ts
      if (source.startsWith("@zenthcloud/kumo/components/")) {
        const componentName = source.replace(
          "@zenthcloud/kumo/components/",
          "",
        );
        return resolve(kumoSrc, `components/${componentName}/index.ts`);
      }

      // Primitives: @zenthcloud/kumo/primitives/dialog
      // → packages/kumo/src/primitives/dialog.ts
      if (source.startsWith("@zenthcloud/kumo/primitives/")) {
        const primitiveName = source.replace(
          "@zenthcloud/kumo/primitives/",
          "",
        );
        return resolve(kumoSrc, `primitives/${primitiveName}.ts`);
      }
      if (source === "@zenthcloud/kumo/primitives") {
        return resolve(kumoSrc, "primitives/index.ts");
      }

      // Utils barrel
      if (source === "@zenthcloud/kumo/utils") {
        return resolve(kumoSrc, "utils/index.ts");
      }

      // Catalog barrel
      if (source === "@zenthcloud/kumo/catalog") {
        return resolve(kumoSrc, "catalog/index.ts");
      }

      // Registry barrel
      if (source === "@zenthcloud/kumo/registry") {
        return resolve(kumoSrc, "registry/index.ts");
      }

      // Catch-all for any other @zenthcloud/kumo/styles/* CSS imports
      if (source.startsWith("@zenthcloud/kumo/styles/")) {
        const styleName = source.replace("@zenthcloud/kumo/styles/", "");
        return resolve(kumoSrc, `styles/${styleName}.css`);
      }

      return undefined;
    },

    configResolved(config: { server: { fs: { allow: string[] } } }) {
      // Append kumo source to the existing allow list rather than replacing it.
      // Using config() would shallow-merge and override Astro/Vite defaults.
      if (config.server?.fs?.allow) {
        config.server.fs.allow.push(kumoRoot);
      }
    },
  };
}
