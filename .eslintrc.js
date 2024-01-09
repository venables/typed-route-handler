/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/next"),
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    "next/core-web-vitals"
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true
  },
  overrides: [
    /**
     * Config files (ex: jest.config.js, prettier.config.js, tailwind.config.js)
     */
    {
      files: ["*.config.js"],
      env: {
        node: true
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    /**
     * Jest Configuration
     */
    {
      files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
      env: {
        jest: true
      },
      extends: [
        require.resolve("@vercel/style-guide/eslint/jest"),
        "plugin:jest/style"
      ],
      plugins: ["jest"],
      rules: {
        /**
         * Allow non-null assertions in tests
         */
        "@typescript-eslint/no-non-null-assertion": "off",
        "eslint-comments/require-description": "off"
      }
    }
  ],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-invalid-void-type": [
      "error",
      {
        allowInGenericTypeArguments: true
      }
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false
        }
      }
    ],
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
