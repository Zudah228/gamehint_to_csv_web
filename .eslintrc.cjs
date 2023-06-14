module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "unused-imports", "prettier", "jsdoc"],
  rules: {
    // error rules
    "no-debugger": "error",
    "no-var": "error",
    "no-irregular-whitespace": [
      "error",
      {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      },
    ],

    // warn rules
    "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    "generator-star-spacing": ["warn", { before: false, after: true }],
    "prefer-const": "warn",
    "padded-blocks": [
      "off",
      {
        blocks: "always",
        classes: "always",
        switches: "never",
      },
    ],
    "no-multi-spaces": "warn",
    "comma-dangle": "off",
    "no-trailing-spaces": "warn",
    indent: ["off"],
    semi: ["warn", "always"],
    "max-len": [
      "warn",
      {
        code: 120,
        ignoreStrings: true,
      },
    ],
    "space-before-blocks": "warn",
    quotes: ["warn", "double"],
    "object-curly-spacing": ["warn", "always"],
    "keyword-spacing": "warn",
    "no-empty": "warn",
    "space-before-function-paren": "off",
    "brace-style": "off",
    "comma-spacing": "warn",
    capIsNew: 0,
    "quote-props": ["warn", "as-needed"],
    capIsNewExceptions: 0,
    "eol-last": ["warn", "always"],
    "operator-linebreak": ["warn", "after", { overrides: { "?": "before", ":": "before" } }],
    // jsdoc-plugin に設定を依存する
    "valid-jsdoc": [0],
    "require-jsdoc": [0],

    // prettier
    "prettier/prettier": [
      "warn",
      {
        semi: true,
        singleQuote: false,
        printWidth: 120,
        tabWidth: 2,
        bracketSpacing: true,
        bracketSameLine: true,
        useTabs: false,
      },
    ],

    // typescript
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": [0],
    "@typescript-eslint/ban-types": ["error", { types: { "{}": false } }],
    "@typescript-eslint/no-empty-function": ["warn", { allow: ["private-constructors", "protected-constructors"] }],

    // import
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", ["internal", "parent", "sibling", "index", "object", "type"]],
        "newlines-between": "always",
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: { order: "asc", caseInsensitive: true },
        pathGroups: [{ pattern: "src/config.ts", group: "external", position: "before" }],
      },
    ],
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,

    // unused-import
    "unused-imports/no-unused-imports": "warn",

    // jsdoc
    "jsdoc/require-jsdoc": [
      "warn",
      {
        publicOnly: { esm: true, cjs: true },
        require: {
          ArrowFunctionExpression: false,
          ClassDeclaration: true,
          ClassExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          MethodDefinition: false,
        },
        contexts: ["TSInterfaceDeclaration"],
      },
    ],
    "jsdoc/require-description": [
      "warn",
      {
        contexts: ["PropertyDefinition", "TSInterfaceDeclaration"],
      },
    ],
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
};
