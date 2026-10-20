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
    ".agents/**",
    ".claude/skills/**",
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
  rules: {
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
