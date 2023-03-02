module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  overrides: [
    {
      files: ["**/__tests__/**/*.{ts,tsx}", "**/?(*.)+(spec|test).{ts,tsx}"],
      env: {
        jest: true
      },
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    }
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        caughtErrors: "none",
        varsIgnorePattern: "^_"
      }
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          ["builtin", "external"],
          "internal",
          ["sibling", "parent"],
          "index",
          "object",
          "type"
        ],
        alphabetize: {
          order: "asc"
        }
      }
    ],
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true
      }
    ]
  }
}
