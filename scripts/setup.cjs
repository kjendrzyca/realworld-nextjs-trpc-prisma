const fs = require('node:fs')
const path = require('node:path')
const { loadEnvConfig } = require('@next/env')
const { DatabaseSync } = require('node:sqlite')

const root = path.resolve(__dirname, '..')

/** @param {string} file */
function statIfPresent(file) {
  try { return fs.lstatSync(file) } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined
    throw error
  }
}

/** @param {string} file @param {string} label */
function checkRegularFile(file, label) {
  const stat = statIfPresent(file)
  if (!stat) return false
  if (stat.isSymbolicLink()) throw new Error(`${label} is a symbolic link; setup will not replace it.`)
  if (!stat.isFile()) throw new Error(`${label} is not a regular file; prepare it manually.`)
  return true
}

/** @param {string} source @param {string} destination @param {string} label */
function copyMissing(source, destination, label) {
  if (checkRegularFile(destination, label)) return
  try { fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL) } catch (error) {
    // A concurrent setup may have created the file. Never overwrite it.
    if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error
    checkRegularFile(destination, label)
  }
}

/** @param {string} mode */
function environment(mode) {
  return loadEnvConfig(root, mode === 'development', {
    info: console.log,
    error: message => { throw new Error(String(message)) },
  }).combinedEnv
}

/** @param {string} file */
function validateDatabase(file) {
  if (!checkRegularFile(file, 'Database')) throw new Error('Database is missing; prepare it manually.')
  if (fs.statSync(file).size === 0) throw new Error('Database is empty; setup will not overwrite it. Prepare it manually.')
  /** @type {import('node:sqlite').DatabaseSync | undefined} */
  let db
  try {
    db = new DatabaseSync(file, { readOnly: true })
    const checks = db.prepare('PRAGMA quick_check').all()
    if (checks.length !== 1 || checks[0]?.quick_check !== 'ok') throw new Error('integrity check failed')
  } catch {
    throw new Error('Database is invalid or corrupt; setup will not overwrite it. Prepare it manually.')
  } finally { db?.close() }
}

function setup() {
  const modeArg = process.argv.slice(2).find(arg => arg.startsWith('--mode='))
  const mode = process.env.NODE_ENV === 'test' ? 'test' : modeArg?.slice(7) || process.env.NODE_ENV || 'development'
  if (!['development', 'production', 'test'].includes(mode)) throw new Error('Unsupported environment mode.')
  copyMissing(path.join(root, '.env.example'), path.join(root, '.env'), '.env')
  const url = environment(mode).DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is missing. Set it in the environment or an env file.')
  if (!url.startsWith('file:')) throw new Error('DATABASE_URL must point to a local SQLite file. Prepare a custom database manually.')
  const databasePath = url.slice(5).split('?')[0]
  if (!databasePath || databasePath === ':memory:') throw new Error('Custom database must be a persistent SQLite file; prepare it manually.')
  const destination = path.resolve(root, 'prisma', databasePath)
  const defaultDatabase = path.join(root, 'prisma/db.sqlite')
  if (!statIfPresent(destination)) {
    if (destination !== defaultDatabase) throw new Error('Custom database is missing; prepare it manually before running the app.')
    const template = path.join(root, 'prisma/test.sqlite')
    validateDatabase(template)
    copyMissing(template, destination, 'Database')
  }
  validateDatabase(destination)
  console.log('Local environment and database ready; existing files preserved.')
}

try { setup() } catch (error) {
  console.error(`Setup failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
