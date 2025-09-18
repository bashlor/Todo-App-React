import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      perfectionist.configs["recommended-natural"],
      ...pluginQuery.configs["flat/recommended"],
      ...tailwind.configs["flat/recommended"],
      {
        settings: {
          tailwindcss: {
            // These are the default values but feel free to customize
            callees: ["classnames", "clsx", "ctl"],
            config: "tailwind.config.js", // returned from `loadConfig()` utility if not provided
            cssFiles: [
              "**/*.css",
              "!**/node_modules",
              "!**/.*",
              "!**/dist",
              "!**/build",
            ],
            cssFilesRefreshRate: 5_000,
            removeDuplicates: true,
            skipClassAttribute: false,
            whitelist: [],
            tags: [], // can be set to e.g. ['tw'] for use in tw`bg-blue`
            classRegex: "^class(Name)?$", // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
          },
        },
      },
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
