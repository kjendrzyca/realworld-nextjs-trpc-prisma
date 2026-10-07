const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { DatabaseSync } = require('node:sqlite')
const setupScript = path.resolve(__dirname, '../scripts/setup.cjs')

/** @param {import('node:test').TestContext} t */
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'conduit-setup-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.mkdirSync(path.join(root, 'scripts'))
  fs.mkdirSync(path.join(root, 'prisma'))
  fs.writeFileSync(path.join(root, 'no-network.cjs'), `global.fetch = () => { throw new Error('Network forbidden during setup') }; for (const name of ['node:http', 'node:https']) { const module = require(name); module.request = module.get = () => { throw new Error('Network forbidden during setup') } }`)
  if (fs.existsSync(setupScript)) fs.copyFileSync(setupScript, path.join(root, 'scripts/setup.cjs'))
  fs.writeFileSync(path.join(root, '.env.example'), 'DATABASE_URL="file:./db.sqlite"\nJWT_SECRET="fixture"\n')
  const db = new DatabaseSync(path.join(root, 'prisma/test.sqlite'))
  db.exec("CREATE TABLE article (title TEXT); INSERT INTO article VALUES ('Offline article')")
  db.close()
  return root
}
/** @param {string} root @param {Record<string, string | undefined>} extra @param {string[]} args */
function run(root, extra = {}, args = []) {
  const env = { ...process.env }
  for (const key of ['DATABASE_URL', 'NODE_ENV', 'DB_NAME', 'npm_lifecycle_event']) delete env[key]
  return spawnSync(process.execPath, ['--require', './no-network.cjs', 'scripts/setup.cjs', ...args], {
    cwd: root, env: { ...env, NODE_PATH: path.resolve(__dirname, '../node_modules'), ...extra }, encoding: 'utf8',
  })
}
/** @param {import('node:child_process').SpawnSyncReturns<string>} result */
function succeeded(result) { assert.equal(result.status, 0, result.stderr) }
/** @param {import('node:child_process').SpawnSyncReturns<string>} result @param {RegExp} pattern */
function failed(result, pattern) { assert.notEqual(result.status, 0); assert.match(result.stderr, pattern) }

test('fresh CLI setup copies local env and SQLite data without network', t => {
  const root = fixture(t)
  succeeded(run(root, { HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1' }))
  assert.equal(fs.readFileSync(path.join(root, '.env'), 'utf8'), fs.readFileSync(path.join(root, '.env.example'), 'utf8'))
  assert.deepEqual(fs.readFileSync(path.join(root, 'prisma/db.sqlite')), fs.readFileSync(path.join(root, 'prisma/test.sqlite')))
  const db = new DatabaseSync(path.join(root, 'prisma/db.sqlite'), { readOnly: true })
  assert.equal(db.prepare('SELECT title FROM article').get()?.title, 'Offline article')
  db.close()
})
test('repeat setup preserves env and modified data', t => {
  const root = fixture(t)
  succeeded(run(root))
  const env = 'DATABASE_URL="file:./db.sqlite"\nJWT_SECRET="changed"\n'
  fs.writeFileSync(path.join(root, '.env'), env)
  const db = new DatabaseSync(path.join(root, 'prisma/db.sqlite'))
  db.exec("INSERT INTO article VALUES ('User work')"); db.close()
  const before = fs.readFileSync(path.join(root, 'prisma/db.sqlite'))
  succeeded(run(root))
  assert.equal(fs.readFileSync(path.join(root, '.env'), 'utf8'), env)
  assert.deepEqual(fs.readFileSync(path.join(root, 'prisma/db.sqlite')), before)
})
test('process URL wins over env.local and missing custom DB is never copied', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL=file:./local.sqlite\n')
  failed(run(root, { DATABASE_URL: 'file:./process.sqlite' }), /custom.*database.*prepare/i)
  assert.equal(fs.existsSync(path.join(root, 'prisma/process.sqlite')), false)
  assert.equal(fs.existsSync(path.join(root, 'prisma/local.sqlite')), false)
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
test('env.local URL wins over default env and existing custom DB stays untouched', t => {
  const root = fixture(t)
  fs.copyFileSync(path.join(root, 'prisma/test.sqlite'), path.join(root, 'prisma/local.sqlite'))
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL=file:./local.sqlite\n')
  const before = fs.readFileSync(path.join(root, 'prisma/local.sqlite'))
  succeeded(run(root))
  assert.deepEqual(fs.readFileSync(path.join(root, 'prisma/local.sqlite')), before)
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
test('Next mode precedence and test exclusion of env.local', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL=file:./missing.sqlite\n')
  fs.writeFileSync(path.join(root, '.env.production.local'), 'DATABASE_URL=file:./db.sqlite\n')
  succeeded(run(root, {}, ['--mode=production']))
  fs.unlinkSync(path.join(root, 'prisma/db.sqlite'))
  succeeded(run(root, { NODE_ENV: 'test' }))
})
test('env variable expansion and paths with spaces resolve from prisma', t => {
  const root = fixture(t)
  fs.copyFileSync(path.join(root, 'prisma/test.sqlite'), path.join(root, 'prisma/custom name.sqlite'))
  fs.writeFileSync(path.join(root, '.env.local'), 'DB_NAME="custom name"\nDATABASE_URL="file:./${DB_NAME}.sqlite"\n')
  succeeded(run(root))
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
for (const content of ['', 'broken', 'SQLite format 3\0truncated']) {
  test(`existing invalid database stays untouched (${content.length} bytes)`, t => {
    const root = fixture(t)
    fs.writeFileSync(path.join(root, 'prisma/db.sqlite'), content)
    failed(run(root), /database.*(empty|invalid|corrupt)/i)
    assert.equal(fs.readFileSync(path.join(root, 'prisma/db.sqlite'), 'utf8'), content)
  })
}
test('symlink database is rejected without changing its target', t => {
  const root = fixture(t)
  const target = path.join(root, 'outside.sqlite')
  fs.writeFileSync(target, 'precious')
  try { fs.symlinkSync(target, path.join(root, 'prisma/db.sqlite')) } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EPERM') return t.skip('Windows host does not permit symlinks')
    throw error
  }
  failed(run(root), /symbolic link/i)
  assert.equal(fs.readFileSync(target, 'utf8'), 'precious')
})
test('existing empty env is preserved and diagnosed', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.env'), '')
  failed(run(root), /DATABASE_URL.*missing/i)
  assert.equal(fs.readFileSync(path.join(root, '.env'), 'utf8'), '')
})
test('corrupt template fails without creating database', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, 'prisma/test.sqlite'), 'broken')
  failed(run(root), /database.*(invalid|corrupt)/i)
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
test('missing template reports failure without creating a blank database', t => {
  const root = fixture(t)
  fs.unlinkSync(path.join(root, 'prisma/test.sqlite'))
  failed(run(root), /database.*missing/i)
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
test('env symlink is never replaced or followed for writes', t => {
  const root = fixture(t)
  const target = path.join(root, 'outside.env')
  fs.writeFileSync(target, 'precious')
  try { fs.symlinkSync(target, path.join(root, '.env')) } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EPERM') return t.skip('Windows host does not permit symlinks')
    throw error
  }
  failed(run(root), /symbolic link/i)
  assert.equal(fs.readFileSync(target, 'utf8'), 'precious')
})
test('process URL can select an existing absolute SQLite path without copying defaults', t => {
  const root = fixture(t)
  const custom = path.join(root, 'custom.sqlite')
  fs.copyFileSync(path.join(root, 'prisma/test.sqlite'), custom)
  const before = fs.readFileSync(custom)
  succeeded(run(root, { DATABASE_URL: `file:${custom}` }))
  assert.deepEqual(fs.readFileSync(custom), before)
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), false)
})
test('NODE_ENV test wins over a production lifecycle and excludes env.local like Next', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL=file:./missing.sqlite\n')
  succeeded(run(root, { NODE_ENV: 'test' }, ['--mode=production']))
})
test('Next env default-value expansion initializes the intended default database', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.env.local'), 'DATABASE_URL="file:./${DB_NAME:-db}.sqlite"\n')
  succeeded(run(root))
  assert.equal(fs.existsSync(path.join(root, 'prisma/db.sqlite')), true)
  assert.equal(fs.existsSync(path.join(root, 'prisma/${DB_NAME:-db}.sqlite')), false)
})
