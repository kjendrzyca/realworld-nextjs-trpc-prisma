const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const runner = path.resolve(__dirname, '../scripts/run-api-tests.cjs')

/** @param {import('node:test').TestContext} t */
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'conduit-api-runner-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.mkdirSync(path.join(root, 'scripts'))
  fs.mkdirSync(path.join(root, 'tests/api'), { recursive: true })
  fs.mkdirSync(path.join(root, 'node_modules/newman/bin'), { recursive: true })
  if (fs.existsSync(runner)) fs.copyFileSync(runner, path.join(root, 'scripts/run-api-tests.cjs'))
  fs.writeFileSync(path.join(root, 'tests/api/Conduit.postman_collection.json'), '{}')
  fs.writeFileSync(path.join(root, 'node_modules/newman/bin/newman.js'), `console.log(JSON.stringify(process.argv.slice(2))); process.exit(Number(process.env.TEST_NEWMAN_EXIT || 0))`)
  return root
}
/** @param {string} root @param {Record<string, string | undefined>} extra @param {string[]} args */
function run(root, extra = {}, args = []) {
  const env = { ...process.env }
  for (const key of ['APIURL', 'CONDUIT_TEST_USERNAME', 'CONDUIT_TEST_EMAIL', 'CONDUIT_TEST_PASSWORD']) delete env[key]
  return spawnSync(process.execPath, [path.join(root, 'scripts/run-api-tests.cjs'), ...args], { cwd: os.tmpdir(), env: { ...env, ...extra }, encoding: 'utf8' })
}
/** @param {import('node:child_process').SpawnSyncReturns<string>} result */
function variables(result) {
  assert.equal(result.status, 0, result.stderr)
  /** @type {string[]} */
  const args = JSON.parse(result.stdout)
  const values = args.filter((arg, index) => args[index - 1] === '--global-var')
  return { args, vars: Object.fromEntries(values.map(value => { const i = value.indexOf('='); return [value.slice(0, i), value.slice(i + 1)] })) }
}
test('CLI uses local Newman and collection with unique defaults', t => {
  const root = fixture(t)
  const first = variables(run(root)); const second = variables(run(root))
  assert.equal(first.args[0], 'run')
  assert.equal(first.args[1], fs.realpathSync(path.join(root, 'tests/api/Conduit.postman_collection.json')))
  assert.equal(first.vars.APIURL, 'http://localhost:3000/api')
  assert.equal(first.vars.PASSWORD, 'password')
  assert.equal(first.vars.EMAIL, `${first.vars.USERNAME}@mail.com`)
  assert.notEqual(first.vars.USERNAME, second.vars.USERNAME)
})
test('CLI preserves environment overrides and argument boundaries', t => {
  const root = fixture(t)
  const forwarded = ['--folder', 'User and Login', '--env-var', 'value=with spaces & symbols']
  const result = variables(run(root, { APIURL: 'http://localhost:4020/api', CONDUIT_TEST_USERNAME: 'custom user', CONDUIT_TEST_EMAIL: 'custom@example.test', CONDUIT_TEST_PASSWORD: 'pass with spaces' }, forwarded))
  assert.deepEqual(result.vars, { APIURL: 'http://localhost:4020/api', USERNAME: 'custom user', EMAIL: 'custom@example.test', PASSWORD: 'pass with spaces' })
  assert.deepEqual(result.args.slice(-forwarded.length), forwarded)
})
for (const exit of [1, 2]) {
  test(`CLI preserves failed assertion/request exit code ${exit}`, t => {
    const root = fixture(t)
    const result = run(root, { TEST_NEWMAN_EXIT: String(exit) })
    assert.equal(result.status, exit)
    assert.equal(JSON.parse(result.stdout)[0], 'run')
  })
}
test('missing local Newman fails clearly without fetching dependencies', t => {
  const root = fixture(t)
  fs.rmSync(path.join(root, 'node_modules'), { recursive: true })
  const result = run(root)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Newman.*npm install/i)
})
test('system USERNAME and generic credentials do not override generated test accounts', t => {
  const root = fixture(t)
  const first = variables(run(root, { USERNAME: 'runneradmin', EMAIL: 'system@example.test', PASSWORD: 'system secret' }))
  const second = variables(run(root, { USERNAME: 'runneradmin' }))
  assert.ok(first.vars.USERNAME)
  assert.match(first.vars.USERNAME, /^u[a-f0-9]{32}$/)
  assert.notEqual(first.vars.USERNAME, second.vars.USERNAME)
  assert.equal(first.vars.EMAIL, `${first.vars.USERNAME}@mail.com`)
  assert.equal(first.vars.PASSWORD, 'password')
})
