import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, //  For the browser environment
        describe: true, // For test grouping
        test: true, // For creating tests
        it: true, // Alternative for creating tests
        expect: true, // For testpåstander
        require: true, // For Node.js modules like Tailwind config
        module: true, // For Node.js modules like the Tailwind config
        process: true, // For environment variables
        vi: true, //  Vitest's mock function
        global: true, // Node's global object
      },
    },
  },
  pluginJs.configs.recommended,
];
