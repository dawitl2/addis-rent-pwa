import type { Agent, Property, User } from './types.js'

export type AgentRow = Record<string, unknown> & {
  id: string | number
  name: string
  area: string
  specialty: string
  rating: string | number
  deals: number
  phone: string
  email: string
  image: string
  bio: string
}

export type PropertyRow = Record<string, unknown> & {
  id: string | number
  title: string
  location: string
  area: string
  property_type: string
  intent: 'Buy' | 'Rent'
  price: string | number
  rooms: number
  size_sqm: number
  status: 'Available' | 'Sold'
  owner_kind: 'demo' | 'user'
  cover_image: string
  description: string
  agent_id: string | number | null
  listed_by_user_id: string | number | null
  images?: string[] | null
}

export type UserRow = Record<string, unknown> & {
  id: string | number
  name: string
  email: string
  phone: string | null
  preferred_area: string | null
}

export function mapAgent(row: AgentRow): Agent {
  return {
    id: Number(row.id),
    name: row.name,
    area: row.area,
    specialty: row.specialty,
    rating: Number(row.rating),
    deals: row.deals,
    phone: row.phone,
    email: row.email,
    image: row.image,
    bio: row.bio,
  }
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: Number(row.id),
    title: row.title,
    location: row.location,
    area: row.area,
    type: row.property_type,
    intent: row.intent,
    price: Number(row.price),
    rooms: row.rooms,
    size: row.size_sqm,
    status: row.status,
    owner: row.owner_kind,
    image: row.cover_image,
    images: row.images?.length ? row.images : [row.cover_image],
    description: row.description,
    agentId: row.agent_id == null ? null : Number(row.agent_id),
    listedByUserId: row.listed_by_user_id == null ? null : Number(row.listed_by_user_id),
  }
}

export function mapUser(row: UserRow): User {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    preferredArea: row.preferred_area,
  }
}
