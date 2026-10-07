const path = require('node:path')
const { randomUUID } = require('node:crypto')
const { spawn } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const username = process.env.CONDUIT_TEST_USERNAME || `u${randomUUID().replaceAll('-', '')}`
const globals = {
  APIURL: process.env.APIURL || 'http://localhost:3000/api',
  USERNAME: username,
  EMAIL: process.env.CONDUIT_TEST_EMAIL || `${username}@mail.com`,
  PASSWORD: process.env.CONDUIT_TEST_PASSWORD || 'password',
}

try {
  const newman = require.resolve('newman/bin/newman.js')
  const args = [
    newman,
    'run',
    path.join(root, 'tests/api/Conduit.postman_collection.json'),
    '--delay-request', '500',
    ...Object.entries(globals).flatMap(([key, value]) => ['--global-var', `${key}=${value}`]),
    ...process.argv.slice(2),
  ]
  const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit', shell: false })
  child.on('error', error => {
    console.error(`API tests could not start: ${error.message}`)
    process.exitCode = 1
  })
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? 1
    if (signal) console.error(`API tests terminated by ${signal}`)
  })
} catch {
  console.error('Local Newman is missing. Run npm install before running API tests.')
  process.exitCode = 1
}
