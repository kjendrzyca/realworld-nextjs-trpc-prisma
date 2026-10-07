const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

/** @param {(db: DatabaseSync) => void} check */
function readTemplate(check) {
  const db = new DatabaseSync(path.join(__dirname, '../prisma/test.sqlite'), { readOnly: true })
  try { check(db) } finally { db.close() }
}

test('the supplied database is healthy and has enough articles for pagination and tags', () => {
  readTemplate(db => {
    assert.equal(db.prepare('PRAGMA integrity_check').get()?.integrity_check, 'ok')
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), [])
    assert.ok(Number(db.prepare('SELECT count(*) AS n FROM Article').get()?.n) >= 190)
    assert.ok(Number(db.prepare('SELECT count(*) AS n FROM ArticelTags').get()?.n) >= 20)
  })
})

test('the supplied articles have readable titles and both short and genuinely long content', () => {
  readTemplate(db => {
    const articles = db.prepare('SELECT title, body FROM Article').all()
    assert.ok(articles.every(article => typeof article.title === 'string' && article.title.length <= 160), 'Titles should fit article cards')
    assert.ok(articles.some(article => typeof article.body === 'string' && article.body.length < 600), 'A short article is needed')
    assert.ok(articles.some(article => typeof article.body === 'string' && article.body.trim().split(/\s+/).length >= 1000), 'A multi-screen article is needed')
  })
})

test('demo users have examples of comments, favorites and followed authors', () => {
  readTemplate(db => {
    assert.ok(Number(db.prepare('SELECT count(*) AS n FROM Comment').get()?.n) > 0)
    assert.ok(Number(db.prepare('SELECT count(*) AS n FROM _favouriteArticles').get()?.n) > 0)
    assert.ok(Number(db.prepare('SELECT count(*) AS n FROM _user_follows').get()?.n) > 0)
    assert.equal(db.prepare('SELECT count(*) AS n FROM _user_follows WHERE A = B').get()?.n, 0)
  })
})

test('fixture accounts contain only demo contacts and no remote avatar dependency', () => {
  readTemplate(db => {
    const users = db.prepare('SELECT email, image FROM User').all()
    assert.ok(users.some(user => user.email === 'test@user.com'))
    assert.ok(users.some(user => user.email === 'author@of.all.com'))
    assert.ok(users.every(user => user.image === null))
    assert.ok(users.every(user => typeof user.email === 'string' && (['test@user.com', 'author@of.all.com'].includes(user.email) || user.email.endsWith('@example.test'))))
  })
})
