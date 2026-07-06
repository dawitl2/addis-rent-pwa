export type PropertyStatus = 'Available' | 'Sold'
export type PropertyOwner = 'demo' | 'user'
export type PropertyIntent = 'Buy' | 'Rent'

export type Agent = {
  id: number
  name: string
  area: string
  specialty: string
  rating: number
  deals: number
  phone: string
  email: string
  image: string
  bio: string
}

export type Property = {
  id: number
  title: string
  location: string
  area: string
  type: string
  intent: PropertyIntent
  price: number
  rooms: number
  size: number
  status: PropertyStatus
  owner: PropertyOwner
  image: string
  images: string[]
  description: string
  agentId: number | null
  listedByUserId: number | null
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string | null
  preferredArea: string | null
}
