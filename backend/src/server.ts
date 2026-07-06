import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PoolClient } from 'pg'
import { hashPassword, verifyPassword } from './auth.js'
import { pool, query } from './db.js'
import { mapAgent, mapProperty, mapUser, type AgentRow, type PropertyRow, type UserRow } from './mappers.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sqlDir = path.resolve(__dirname, '..', 'sql')

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') ?? true,
  }),
)
app.use(express.json({ limit: '12mb' }))

app.get('/api/health', async (_request, response) => {
  try {
    const result = await query<{ now: string }>('SELECT now()')
    response.json({ ok: true, databaseTime: result.rows[0]?.now })
  } catch (error) {
    response.status(503).json({ ok: false, error: getErrorMessage(error) })
  }
})

app.post('/api/admin/schema', async (_request, response) => {
  await runSqlFile('schema.sql')
  response.json({ ok: true })
})

app.post('/api/admin/seed', async (_request, response) => {
  await runSqlFile('schema.sql')
  await runSqlFile('seed.sql')
  response.json({ ok: true })
})

app.get('/api/bootstrap', async (_request, response) => {
  const [propertiesResult, agentsResult, usersResult] = await Promise.all([
    getProperties({}),
    query<AgentRow>('SELECT * FROM agents ORDER BY id'),
    query<UserRow>('SELECT * FROM users ORDER BY id LIMIT 20'),
  ])

  response.json({
    properties: propertiesResult,
    agents: agentsResult.rows.map(mapAgent),
    users: usersResult.rows.map(mapUser),
  })
})

app.get('/api/users', async (_request, response) => {
  const result = await query<UserRow>('SELECT * FROM users ORDER BY id')
  response.json(result.rows.map(mapUser))
})

app.post('/api/auth/signup', async (request, response) => {
  const {
    name,
    username,
    email,
    phone = null,
    preferredArea = null,
    password,
    confirmPassword,
  } = request.body
  const cleanUsername = normalizeUsername(username)
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!name || !cleanUsername || !cleanEmail || !password || !confirmPassword) {
    response.status(400).json({ error: 'name, username, email, password, and confirmation are required' })
    return
  }
  if (String(password).length < 6) {
    response.status(400).json({ error: 'password must be at least 6 characters' })
    return
  }
  if (password !== confirmPassword) {
    response.status(400).json({ error: 'passwords do not match' })
    return
  }

  const existing = await query<UserRow>(
    'SELECT * FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1',
    [cleanUsername, cleanEmail],
  )
  if (existing.rowCount) {
    response.status(409).json({ error: 'username or email is already registered' })
    return
  }

  const passwordHash = await hashPassword(password)
  const result = await query<UserRow>(
    `
      INSERT INTO users (name, username, email, password_hash, phone, preferred_area)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [name, cleanUsername, cleanEmail, passwordHash, phone, preferredArea],
  )
  response.status(201).json({ user: mapUser(result.rows[0]) })
})

app.post('/api/auth/signin', async (request, response) => {
  const { username, password } = request.body
  const login = normalizeUsername(username)
  if (!login || !password) {
    response.status(400).json({ error: 'username and password are required' })
    return
  }

  const result = await query<UserRow & { password_hash: string }>(
    'SELECT * FROM users WHERE lower(username) = $1 OR lower(email) = $1 LIMIT 1',
    [login],
  )
  if (!result.rowCount) {
    response.status(401).json({ error: 'No account found for that username or email' })
    return
  }

  const isValid = await verifyPassword(password, result.rows[0].password_hash)
  if (!isValid) {
    response.status(401).json({ error: 'Incorrect password' })
    return
  }

  response.json({ user: mapUser(result.rows[0]) })
})

app.post('/api/users', async (request, response) => {
  const { name, username, email, phone = null, preferredArea = null, password } = request.body
  const cleanUsername = normalizeUsername(username ?? email)
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!name || !cleanEmail || !password) {
    response.status(400).json({ error: 'name, email, and password are required' })
    return
  }

  const passwordHash = await hashPassword(password)
  const result = await query<UserRow>(
    `
      INSERT INTO users (name, username, email, password_hash, phone, preferred_area)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        phone = EXCLUDED.phone,
        preferred_area = EXCLUDED.preferred_area,
        updated_at = now()
      RETURNING *
    `,
    [name, cleanUsername, cleanEmail, passwordHash, phone, preferredArea],
  )
  response.status(201).json(mapUser(result.rows[0]))
})

app.put('/api/users/:id', async (request, response) => {
  const { name, email, phone = null, preferredArea = null } = request.body
  const result = await query<UserRow>(
    `
      UPDATE users
      SET name = $1, email = $2, phone = $3, preferred_area = $4, updated_at = now()
      WHERE id = $5
      RETURNING *
    `,
    [name, email, phone, preferredArea, request.params.id],
  )
  if (!result.rowCount) {
    response.status(404).json({ error: 'User not found' })
    return
  }
  response.json(mapUser(result.rows[0]))
})

app.get('/api/agents', async (request, response) => {
  const params: unknown[] = []
  const where: string[] = []

  if (request.query.area && request.query.area !== 'All') {
    params.push(request.query.area)
    where.push(`area = $${params.length}`)
  }
  if (request.query.specialty && request.query.specialty !== 'All') {
    params.push(request.query.specialty)
    where.push(`specialty = $${params.length}`)
  }

  const result = await query<AgentRow>(
    `SELECT * FROM agents ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY rating DESC, deals DESC`,
    params,
  )
  response.json(result.rows.map(mapAgent))
})

app.get('/api/agents/:id', async (request, response) => {
  const result = await query<AgentRow>('SELECT * FROM agents WHERE id = $1', [request.params.id])
  if (!result.rowCount) {
    response.status(404).json({ error: 'Agent not found' })
    return
  }
  const brokered = await getProperties({ agentId: request.params.id })
  response.json({ ...mapAgent(result.rows[0]), brokered })
})

app.get('/api/properties', async (request, response) => {
  response.json(
    await getProperties({
      intent: stringQuery(request.query.intent),
      area: stringQuery(request.query.area),
      type: stringQuery(request.query.type),
      price: stringQuery(request.query.price),
      sort: stringQuery(request.query.sort),
      search: stringQuery(request.query.search),
    }),
  )
})

app.get('/api/properties/:id', async (request, response) => {
  const properties = await getProperties({ id: request.params.id })
  if (!properties.length) {
    response.status(404).json({ error: 'Property not found' })
    return
  }
  response.json(properties[0])
})

app.post('/api/properties', async (request, response) => {
  const property = request.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      `
        INSERT INTO properties
          (title, location, area, property_type, intent, price, rooms, size_sqm, status,
           owner_kind, description, cover_image, agent_id, listed_by_user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'Available'), $10, $11, $12, $13, $14)
        RETURNING id
      `,
      [
        property.title,
        property.location,
        property.area,
        property.type,
        property.intent,
        Number(property.price ?? 0),
        Number(property.rooms ?? 0),
        Number(property.size ?? 0),
        property.status,
        property.owner ?? 'user',
        property.description ?? '',
        property.image ?? 'residence-photo_1.png',
        property.agentId ?? 1,
        property.listedByUserId ?? null,
      ],
    )
    await replacePropertyImages(
      client,
      Number(result.rows[0].id),
      property.images?.length ? property.images : [property.image ?? 'residence-photo_1.png'],
    )
    await client.query('COMMIT')
    const created = await getProperties({ id: String(result.rows[0].id) })
    response.status(201).json(created[0])
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400).json({ error: getErrorMessage(error) })
  } finally {
    client.release()
  }
})

app.put('/api/properties/:id', async (request, response) => {
  const property = request.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      `
        UPDATE properties
        SET title = $1,
            location = $2,
            area = $3,
            property_type = $4,
            intent = $5,
            price = $6,
            rooms = $7,
            size_sqm = $8,
            status = $9,
            owner_kind = $10,
            description = $11,
            cover_image = $12,
            agent_id = $13,
            listed_by_user_id = $14,
            updated_at = now()
        WHERE id = $15
        RETURNING id
      `,
      [
        property.title,
        property.location,
        property.area,
        property.type,
        property.intent,
        Number(property.price ?? 0),
        Number(property.rooms ?? 0),
        Number(property.size ?? 0),
        property.status ?? 'Available',
        property.owner ?? 'user',
        property.description ?? '',
        property.image ?? 'residence-photo_1.png',
        property.agentId ?? 1,
        property.listedByUserId ?? null,
        request.params.id,
      ],
    )
    if (!result.rowCount) {
      await client.query('ROLLBACK')
      response.status(404).json({ error: 'Property not found' })
      return
    }
    await replacePropertyImages(
      client,
      Number(request.params.id),
      property.images?.length ? property.images : [property.image ?? 'residence-photo_1.png'],
    )
    await client.query('COMMIT')
    const updated = await getProperties({ id: request.params.id })
    response.json(updated[0])
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400).json({ error: getErrorMessage(error) })
  } finally {
    client.release()
  }
})

app.patch('/api/properties/:id/status', async (request, response) => {
  const status = request.body.status === 'Sold' ? 'Sold' : 'Available'
  const result = await query<PropertyRow>(
    'UPDATE properties SET status = $1, updated_at = now() WHERE id = $2 RETURNING id',
    [status, request.params.id],
  )
  if (!result.rowCount) {
    response.status(404).json({ error: 'Property not found' })
    return
  }
  const updated = await getProperties({ id: request.params.id })
  response.json(updated[0])
})

app.delete('/api/properties/:id', async (request, response) => {
  const result = await query('DELETE FROM properties WHERE id = $1 RETURNING id', [request.params.id])
  if (!result.rowCount) {
    response.status(404).json({ error: 'Property not found' })
    return
  }
  response.status(204).end()
})

app.post('/api/inquiries', async (request, response) => {
  const { propertyId = null, agentId = null, userId = null, name, email = null, phone = null, message } =
    request.body
  if (!name || !message) {
    response.status(400).json({ error: 'name and message are required' })
    return
  }

  const result = await query<PropertyRow>(
    `
      INSERT INTO inquiries (property_id, agent_id, user_id, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [propertyId, agentId, userId, name, email, phone, message],
  )
  response.status(201).json(result.rows[0])
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  response.status(500).json({ error: getErrorMessage(error) })
})

app.listen(port, () => {
  console.log(`NOAH backend listening on http://localhost:${port}`)
})

type PropertyQuery = {
  id?: string
  agentId?: string
  intent?: string
  area?: string
  type?: string
  price?: string
  sort?: string
  search?: string
}

async function getProperties(filters: PropertyQuery) {
  const params: unknown[] = []
  const where: string[] = []

  if (filters.id) {
    params.push(filters.id)
    where.push(`p.id = $${params.length}`)
  }
  if (filters.agentId) {
    params.push(filters.agentId)
    where.push(`p.agent_id = $${params.length}`)
  }
  if (filters.intent && filters.intent !== 'All') {
    params.push(filters.intent)
    where.push(`p.intent = $${params.length}`)
  }
  if (filters.area && filters.area !== 'All') {
    params.push(filters.area)
    where.push(`p.area = $${params.length}`)
  }
  if (filters.type && filters.type !== 'All') {
    params.push(filters.type)
    where.push(`p.property_type = $${params.length}`)
  }
  if (filters.price === 'Under 50M') {
    where.push('p.price < 50000000')
  } else if (filters.price === '50M - 110M') {
    where.push('p.price >= 50000000 AND p.price <= 110000000')
  } else if (filters.price === 'Above 110M') {
    where.push('p.price > 110000000')
  }
  if (filters.search) {
    params.push(`%${filters.search.toLowerCase()}%`)
    where.push(`
      (
        lower(p.title) LIKE $${params.length}
        OR lower(p.location) LIKE $${params.length}
        OR lower(p.area) LIKE $${params.length}
        OR lower(p.property_type) LIKE $${params.length}
        OR lower(p.description) LIKE $${params.length}
      )
    `)
  }

  const orderBy =
    filters.sort === 'Price Low'
      ? 'p.price ASC'
      : filters.sort === 'Price High'
        ? 'p.price DESC'
        : filters.sort === 'Most Rooms'
          ? 'p.rooms DESC'
          : 'p.id ASC'

  const result = await query<PropertyRow>(
    `
      SELECT
        p.*,
        COALESCE(
          array_agg(pi.image ORDER BY pi.sort_order, pi.id) FILTER (WHERE pi.id IS NOT NULL),
          ARRAY[p.cover_image]
        ) AS images
      FROM properties p
      LEFT JOIN property_images pi ON pi.property_id = p.id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY p.id
      ORDER BY ${orderBy}
    `,
    params,
  )

  return result.rows.map(mapProperty)
}

async function replacePropertyImages(
  client: PoolClient,
  propertyId: number,
  images: string[],
) {
  await client.query('DELETE FROM property_images WHERE property_id = $1', [propertyId])
  const uniqueImages = [...new Set(images.filter(Boolean))]
  for (const [index, image] of uniqueImages.entries()) {
    await client.query(
      'INSERT INTO property_images (property_id, image, sort_order) VALUES ($1, $2, $3)',
      [propertyId, image, index],
    )
  }
}

async function runSqlFile(fileName: string) {
  const sql = await readFile(path.join(sqlDir, fileName), 'utf8')
  await query(sql)
}

function stringQuery(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function normalizeUsername(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected server error'
}
