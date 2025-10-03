import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/**", "node_modules/**"],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { 
      globals: globals.node 
    },
    rules: {
      "no-unused-vars": "warn",
      '@typescript-eslint/no-namespace': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
  tseslint.configs.recommended,
]);