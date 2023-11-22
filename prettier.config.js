const vercelPrettierConfig = require("@vercel/style-guide/prettier")

/** @type {import('prettier').Config} */
module.exports = {
  ...vercelPrettierConfig,
  semi: false,
  singleQuote: false,
  trailingComma: "none"
}
