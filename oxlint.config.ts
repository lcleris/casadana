import { defineConfig } from "oxlint"
import core from "ultracite/oxlint/core"
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins"
import react from "ultracite/oxlint/react"
import tanstack from "ultracite/oxlint/tanstack"
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins"

const reactDoctor = selectJsPlugins(["react-doctor"])

export default defineConfig({
  extends: [core, react, tanstack, reactDoctor, tanstackJsPlugins],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "apps/api/**",
    "apps/web/src/routeTree.gen.ts",
    "apps/web/src/paraglide/**",
    "packages/api/src/generated/**",
    // shadcn primitives, owned by its CLI (components.json -> aliases.ui).
    "apps/web/src/components/ui/**",
  ],
  jsPlugins: reactDoctor.jsPlugins,
  options: {
    reportUnusedDisableDirectives: "error",
    typeAware: true,
  },
  overrides: [
    {
      // The orval client's package entry. It goes away with the oRPC migration.
      files: ["packages/api/src/index.ts"],
      rules: { "oxc/no-barrel-file": "off" },
    },
  ],
  rules: {
    // CONTRIBUTING.md: `Array<T>`, never `T[]`.
    "typescript/array-type": ["error", { default: "generic" }],
    // The 10-11px uppercase mono labels are the editorial design, not body text.
    "react-doctor/no-tiny-text": "off",
    // House style: named functions and components are declarations.
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function",
      },
    ],
  },
  settings: jsPluginSettings,
})
