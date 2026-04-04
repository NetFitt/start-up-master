import { Pool } from 'pg'
import { readFileSync } from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
})

async function run() {
  const raw = readFileSync(
    path.join(process.cwd(), 'db', 'seeds', 'algeria_cities.sql'),
    'utf-8'
  )

  const normalized = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Fix unescaped apostrophes in French names like R'mel, M'lila, F'kirina
    // Match ' that has a letter on BOTH sides (i.e. it's inside a word, not a SQL delimiter)
    .replace(/([a-zA-Z])'([a-zA-Z])/g, "$1''$2")

  const statements = normalized
    .split(';')
    .map(s => s.trim())
    .filter(s => s.toUpperCase().startsWith('INSERT'))

  console.log(`⏳ Running ${statements.length} inserts...`)

  let success = 0
  let failed = 0

  for (const stmt of statements) {
    try {
      await pool.query(stmt)
      success++
    } catch (e: any) {
      failed++
      console.error('\nFailed:', e.message)
      console.error('Statement:', stmt.slice(0, 120))
    }

    if ((success + failed) % 200 === 0) {
      process.stdout.write(`\r   ✅ ${success} inserted ❌ ${failed} failed`)
    }
  }

  console.log(`\n\n✅ Done — ${success} inserted, ${failed} failed`)
  await pool.end()
}

run().catch(e => {
  console.error('❌', e.message)
  process.exit(1)
})