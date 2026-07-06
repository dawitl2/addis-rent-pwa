import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { query, closePool } from '../db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..', '..')

const command = process.argv[2]
const files = command === 'seed' ? ['schema.sql', 'seed.sql'] : ['schema.sql']

try {
  for (const file of files) {
    const sql = await readFile(path.join(rootDir, 'sql', file), 'utf8')
    await query(sql)
    console.log(`Applied ${file}`)
  }
} finally {
  await closePool()
}
