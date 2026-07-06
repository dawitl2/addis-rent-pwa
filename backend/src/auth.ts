import { randomBytes, timingSafeEqual, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const keyLength = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, keyLength)) as Buffer
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [method, salt, key] = storedHash.split(':')
  if (method !== 'scrypt' || !salt || !key) {
    return false
  }

  const derivedKey = (await scrypt(password, salt, keyLength)) as Buffer
  const storedKey = Buffer.from(key, 'hex')
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey)
}
