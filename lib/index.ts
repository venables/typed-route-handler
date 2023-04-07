export async function hello() {
  return Promise.resolve(`👋 Hello, ${process.env.DEFAULT_NAME}.`)
}

hello().then(console.log)
