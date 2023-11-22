#!/usr/bin/env node

/* eslint-disable no-console -- CLI scripts should use the console */

import { hello } from "./hello"

/**
 * Main entrypoint for the cli
 */
async function main() {
  const args = process.argv.slice(2)
  const name = args[0]

  console.log(hello(name))

  return Promise.resolve()
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
