import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Edit3,
  Handshake,
  Home,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldQuestion,
  Star,
  Trash2,
  User,
  UserRoundCheck,
} from 'lucide-react'
import './App.css'

const imagePath = '/images/'

type Page = 'home' | 'properties' | 'agents' | 'contact'

type Property = {
  id: number
  title: string
  location: string
  area: string
  type: string
  intent: string
  price: number
  rooms: number
  size: number
  status: 'Available' | 'Sold'
  owner: 'demo' | 'user'
  image: string
  description: string
  agentId: number
}

type Agent = {
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

type Profile = {
  name: string
  email: string
  phone: string
  preferredArea: string
}

const birrFormatter = new Intl.NumberFormat('en-US')

const baseProperties: Property[] = [
  {
    id: 1,
    title: 'Warm Family Villa',
    location: 'CCD, Addis Ababa',
    area: 'CCD',
    type: 'Villa',
    intent: 'Buy',
    price: 20500000,
    rooms: 4,
    size: 300,
    status: 'Available',
    owner: 'demo',
    image: 'residence-photo_1.png',
    description:
      'A comfortable family villa with warm interiors, parking space, and easy access to daily essentials.',
    agentId: 1,
  },
  {
    id: 2,
    title: 'Bright Bole Residence',
    location: 'Bole, Addis Ababa',
    area: 'Bole',
    type: 'Apartment',
    intent: 'Buy',
    price: 100000000,
    rooms: 3,
    size: 500,
    status: 'Available',
    owner: 'demo',
    image: 'residence-photo_2.png',
    description:
      'A premium Bole home with generous glazing, formal rooms, and a calm private compound.',
    agentId: 2,
  },
  {
    id: 3,
    title: 'CMC Grand House',
    location: 'CMC, Addis ababa',
    area: 'CMC',
    type: 'House',
    intent: 'Buy',
    price: 120700000,
    rooms: 6,
    size: 1000,
    status: 'Available',
    owner: 'demo',
    image: 'residence-photo_3.png',
    description:
      'A large statement house with multiple living zones, premium finishes, and excellent frontage.',
    agentId: 3,
  },
  {
    id: 4,
    title: 'CCD Rental Home',
    location: 'CCD, Addis Ababa',
    area: 'CCD',
    type: 'House',
    intent: 'Rent',
    price: 95000,
    rooms: 4,
    size: 300,
    status: 'Available',
    owner: 'demo',
    image: 'residence-photo_1.png',
    description:
      'A practical rental home for families who want a quiet neighborhood and fast city access.',
    agentId: 1,
  },
  {
    id: 5,
    title: 'Bole Executive Apartment',
    location: 'Bole, Addis Ababa',
    area: 'Bole',
    type: 'Apartment',
    intent: 'Rent',
    price: 140000,
    rooms: 3,
    size: 420,
    status: 'Available',
    owner: 'demo',
    image: 'residence-photo_2.png',
    description:
      'A polished apartment option near business corridors, restaurants, and airport-side roads.',
    agentId: 2,
  },
  {
    id: 6,
    title: 'CMC Premium Villa',
    location: 'CMC, Addis ababa',
    area: 'CMC',
    type: 'Villa',
    intent: 'Buy',
    price: 118000000,
    rooms: 5,
    size: 880,
    status: 'Sold',
    owner: 'demo',
    image: 'residence-photo_3.png',
    description:
      'A refined CMC villa used here as a sold listing example for owner-side management flows.',
    agentId: 3,
  },
]

const agents: Agent[] = [
  {
    id: 1,
    name: 'Mekdes Alemu',
    area: 'CCD',
    specialty: 'Family Homes',
    rating: 4.9,
    deals: 42,
    phone: '+251 911 234 111',
    email: 'mekdes@noah.example',
    image: 'avatar_1.png',
    bio: 'Known for calm negotiation, clear paperwork guidance, and matching families with practical homes.',
  },
  {
    id: 2,
    name: 'Nahom Tesfaye',
    area: 'Bole',
    specialty: 'Luxury Apartments',
    rating: 4.8,
    deals: 37,
    phone: '+251 922 431 444',
    email: 'nahom@noah.example',
    image: 'avatar_2.png',
    bio: 'A Bole-focused broker with strong knowledge of apartment pricing, building quality, and rental yields.',
  },
  {
    id: 3,
    name: 'Saron Bekele',
    area: 'CMC',
    specialty: 'Premium Villas',
    rating: 5,
    deals: 55,
    phone: '+251 933 887 220',
    email: 'saron@noah.example',
    image: 'avatar_3.png',
    bio: 'Trusted for premium villa tours, buyer shortlists, and fast follow-up with serious property owners.',
  },
  {
    id: 4,
    name: 'Robel Hailu',
    area: 'Bole',
    specialty: 'Rentals',
    rating: 4.7,
    deals: 28,
    phone: '+251 944 190 515',
    email: 'robel@noah.example',
    image: 'avatar_1.png',
    bio: 'Helps renters compare value quickly and keeps communication simple between owners and tenants.',
  },
]

const stats = [
  { value: '50K+', label: 'Houses Available' },
  { value: '100K+', label: 'Houses Sold' },
  { value: '10K+', label: 'Trusted Agents' },
]

const features = [
  {
    title: 'Expert Guidance',
    text: "Benefit from our team's seasoned expertise for a smooth buying experience in Addis Ababa.",
    icon: MapPin,
  },
  {
    title: 'Personalized Service',
    text: 'Our services adapt to your unique needs, making your journey simple and stress-free.',
    icon: UserRoundCheck,
  },
  {
    title: 'Transparent Process',
    text: 'Stay informed with a clear and honest path from viewing to final decision.',
    icon: ClipboardList,
  },
  {
    title: 'Exceptional Support',
    text: 'Get responsive customer service before, during, and after every property visit.',
    icon: Handshake,
  },
]

const testimonials = [
  {
    name: 'Abebe Belete',
    city: 'Addis Ababa',
    image: 'avatar_1.png',
    quote:
      'NOAH listened closely and helped me compare homes without pressure. The process felt clear from the first visit.',
  },
  {
    name: 'Yahial Berreso',
    city: 'Addis Ababa',
    image: 'avatar_2.png',
    quote:
      'Their broker understood the area and showed me realistic options in CMC. The follow-up was excellent.',
  },
  {
    name: 'Abiy Ahmed',
    city: 'Addis Ababa',
    image: 'avatar_3.png',
    quote:
      'The team helped me move from searching to shortlisting fast. Good service, good communication, good people.',
  },
]

function formatPrice(property: Property) {
  return `${property.intent === 'Rent' ? 'ETB ' : 'ETB '}${birrFormatter.format(property.price)}`
}

function resolveImageSrc(src: string) {
  if (
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('http') ||
    src.startsWith('/')
  ) {
    return src
  }
  return `${imagePath}${src}`
}

function OptionalImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(true)

  return (
    <span className={`${className ?? ''} image-slot ${loaded ? '' : 'is-empty'}`}>
      {loaded ? (
        <img src={resolveImageSrc(src)} alt={alt} onError={() => setLoaded(false)} />
      ) : null}
    </span>
  )
}

function Logo({ onClick }: { onClick: () => void }) {
  const [loaded, setLoaded] = useState(true)

  return (
    <button className="brand" type="button" onClick={onClick}>
      {loaded ? (
        <img
          className="brand-image"
          src={`${imagePath}logo.png`}
          alt="NOAH Real Estate PLC"
          onError={() => setLoaded(false)}
        />
      ) : (
        <>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>NOAH</strong>
            <small>Real Estate PLC.</small>
          </span>
        </>
      )}
    </button>
  )
}

function Header({
  activePage,
  isSignedIn,
  onNavigate,
  onSignIn,
  searchQuery = '',
  setSearchQuery = () => undefined,
  isSearchOpen = false,
  setIsSearchOpen = () => undefined,
}: {
  activePage: Page
  isSignedIn: boolean
  onNavigate: (page: Page) => void
  onSignIn: () => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  isSearchOpen?: boolean
  setIsSearchOpen?: (open: boolean) => void
}) {
  return (
    <>
      <header className="site-header">
        <Logo onClick={() => onNavigate(isSignedIn ? 'properties' : 'home')} />
        <nav className="main-nav" aria-label="Main navigation">
          {(['home', 'agents', 'contact'] as Page[]).map((page) => (
            <button
              className={activePage === page ? 'active' : ''}
              key={page}
              type="button"
              onClick={() => onNavigate(page)}
            >
              {page === 'home' ? 'Home' : page[0].toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
        {isSignedIn ? (
          <div className="header-actions" aria-label="Signed in actions">
            <button
              type="button"
              onClick={() => {
                onNavigate('properties')
                setIsSearchOpen(!isSearchOpen)
              }}
              aria-label="Search homes"
            >
              <Search size={22} />
            </button>
            <button type="button" onClick={() => onNavigate('contact')} aria-label="Profile">
              <User size={22} />
            </button>
          </div>
        ) : (
          <button className="signup-button" type="button" onClick={onSignIn}>
            Sign up
          </button>
        )}
        {isSignedIn ? (
          <div className="mobile-signed-actions" aria-label="Mobile signed in actions">
            <button
              type="button"
              onClick={() => {
                onNavigate('properties')
                setIsSearchOpen(!isSearchOpen)
              }}
              aria-label="Search homes"
            >
              <Search size={20} />
            </button>
            <button type="button" onClick={() => onNavigate('contact')} aria-label="Profile">
              <User size={20} />
            </button>
          </div>
        ) : (
          <button className="mobile-menu" type="button" aria-label="Open menu">
            <Menu size={22} />
          </button>
        )}
      </header>
      {isSignedIn && isSearchOpen ? (
        <div className="header-search">
          <Search size={20} />
          <input
            autoFocus
            value={searchQuery}
            placeholder="Search location, type, price, broker..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery ? (
            <button type="button" onClick={() => setSearchQuery('')}>
              Clear
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

function FilterPanel({
  filters,
  setFilters,
  compact = false,
}: {
  filters: {
    intent: string
    area: string
    type: string
    price: string
    sort: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      intent: string
      area: string
      type: string
      price: string
      sort: string
    }>
  >
  compact?: boolean
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const controls = [
    { key: 'intent', label: 'Buy', icon: Home, options: ['All', 'Buy', 'Rent'] },
    { key: 'area', label: 'Location', icon: MapPin, options: ['All', 'CCD', 'Bole', 'CMC'] },
    { key: 'type', label: 'Type', icon: Home, options: ['All', 'House', 'Villa', 'Apartment'] },
    {
      key: 'price',
      label: 'Price Range',
      icon: DollarSign,
      options: ['All', 'Under 50M', '50M - 110M', 'Above 110M'],
    },
  ] as const

  return (
    <div className={`filter-panel ${compact ? 'compact' : ''}`}>
      {controls.map(({ key, label, icon: Icon, options }) => (
        <div className={`filter-field ${openKey === key ? 'open' : ''}`} key={key}>
          <button
            type="button"
            aria-expanded={openKey === key}
            onClick={() => setOpenKey((current) => (current === key ? null : key))}
          >
            <span>{filters[key] === 'All' ? label : filters[key]}</span>
            <Icon size={16} strokeWidth={2.8} aria-hidden="true" />
          </button>
          {openKey === key ? (
            <div className="filter-menu">
              {options.map((option) => (
                <button
                  className={filters[key] === option ? 'selected' : ''}
                  type="button"
                  key={option}
                  onClick={() => {
                    setFilters((current) => ({ ...current, [key]: option }))
                    setOpenKey(null)
                  }}
                >
                  {option === 'All' ? label : option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      {!compact ? (
        <div className={`filter-field sort-field ${openKey === 'sort' ? 'open' : ''}`}>
          <button
            type="button"
            aria-expanded={openKey === 'sort'}
            onClick={() => setOpenKey((current) => (current === 'sort' ? null : 'sort'))}
          >
            <span>{filters.sort}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          {openKey === 'sort' ? (
            <div className="filter-menu">
              {['Featured', 'Price Low', 'Price High', 'Most Rooms'].map((option) => (
                <button
                  className={filters.sort === option ? 'selected' : ''}
                  type="button"
                  key={option}
                  onClick={() => {
                    setFilters((current) => ({ ...current, sort: option }))
                    setOpenKey(null)
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function PropertyCard({
  property,
  isSignedIn,
  onOpen,
  onSignIn,
}: {
  property: Property
  isSignedIn: boolean
  onOpen: (property: Property) => void
  onSignIn: () => void
}) {
  return (
    <article className="residence-card property-card" onClick={() => onOpen(property)}>
      <OptionalImage
        className="residence-photo"
        src={property.image}
        alt={property.title}
      />
      <div className="residence-body">
        <div className="property-title-row">
          <h3>
            <MapPin size={20} fill="currentColor" aria-hidden="true" />
            {property.location}
          </h3>
          <span className={`status-pill ${property.status === 'Sold' ? 'sold' : ''}`}>
            {property.status}
          </span>
        </div>
        <div className="residence-meta">
          <span>
            <BedDouble size={18} aria-hidden="true" />
            {property.rooms} Rooms
          </span>
          <span>
            <Bath size={18} aria-hidden="true" />
            {property.size} sq m
          </span>
        </div>
        <div className="residence-actions">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              if (isSignedIn) {
                onOpen(property)
              } else {
                onSignIn()
              }
            }}
          >
            {isSignedIn ? 'Details' : 'Sign up'}
          </button>
          <strong>{formatPrice(property)}</strong>
        </div>
      </div>
    </article>
  )
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Logo onClick={() => onNavigate('home')} />
        <p>We find the perfect house and turn it to your home!</p>
      </div>
      <nav aria-label="About links">
        <h3>About</h3>
        <button type="button">Story</button>
        <button type="button">Careers</button>
        <button type="button" onClick={() => onNavigate('agents')}>
          Our Team
        </button>
      </nav>
      <nav aria-label="Support links">
        <h3>Support</h3>
        <button type="button">FAQ</button>
        <button type="button" onClick={() => onNavigate('contact')}>
          Contact Us
        </button>
        <button type="button">Help Center</button>
        <button type="button">Terms of Service</button>
      </nav>
      <nav aria-label="Find us links">
        <h3>Find Us</h3>
        <button type="button">Events</button>
        <button type="button">Locations</button>
      </nav>
      <nav aria-label="Social links">
        <h3>Our Social</h3>
        <button type="button">
          <span className="social-icon instagram-icon" aria-hidden="true" />
          Instagram
        </button>
        <button type="button">
          <span className="social-icon facebook-icon" aria-hidden="true" />
          Facebook
        </button>
        <button type="button">
          <span className="social-icon x-icon" aria-hidden="true" />
          Twitter (X)
        </button>
      </nav>
    </footer>
  )
}

function HomePage({
  properties,
  filters,
  setFilters,
  isSignedIn,
  onSignIn,
  onOpenProperty,
  onNavigate,
}: {
  properties: Property[]
  filters: {
    intent: string
    area: string
    type: string
    price: string
    sort: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      intent: string
      area: string
      type: string
      price: string
      sort: string
    }>
  >
  isSignedIn: boolean
  onSignIn: () => void
  onOpenProperty: (property: Property) => void
  onNavigate: (page: Page) => void
}) {
  return (
    <>
      <section className="hero-section">
        <Header
          activePage="home"
          isSignedIn={isSignedIn}
          onNavigate={onNavigate}
          onSignIn={onSignIn}
        />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Addis Ababa homes, curated</span>
            <h1>Find Your Dream Home</h1>
            <p>
              Explore a focused selection of homes and trusted brokers, with quick
              filters that help you compare by area, type, and price.
            </p>
            {!isSignedIn ? (
              <button type="button" onClick={onSignIn}>
                Sign up
              </button>
            ) : (
              <button type="button" onClick={() => onNavigate('properties')}>
                Browse
              </button>
            )}
          </div>
          <OptionalImage
            className="hero-house"
            src={`${imagePath}hero-house.png`}
            alt="Modern luxury house"
          />
        </div>
        <FilterPanel filters={filters} setFilters={setFilters} compact />
      </section>

      <section className="intro-section">
        <OptionalImage
          className="intro-photo"
          src={`${imagePath}intro-photo.png`}
          alt="Exterior of a house"
        />
        <div className="intro-copy">
          <h2>We Help You To Find Your Dream Home</h2>
          <p>
            From cozy cottages to premium villas, our team helps you shortlist,
            compare, and contact the right broker with less back and forth.
          </p>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>Why Choose Us</h2>
          <p>
            A modern home-buying experience with expertise, integrity, and
            personalized support.
          </p>
        </div>
        <div className="features-grid">
          {features.map(({ title, text, icon: Icon }) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon">
                <Icon size={43} strokeWidth={3} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="residences-section">
        <div className="section-heading">
          <h2>Our Popular Residences</h2>
          <p>Tap any property to preview the detail experience.</p>
        </div>
        <div className="residence-grid">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSignedIn={isSignedIn}
              onOpen={onOpenProperty}
              onSignIn={onSignIn}
            />
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What People Say About NOAH</h2>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-header">
                <OptionalImage
                  className="avatar"
                  src={`${imagePath}${testimonial.image}`}
                  alt={testimonial.name}
                />
                <div>
                  <h3>{testimonial.name}</h3>
                  <span>{testimonial.city}</span>
                </div>
                <div className="rating">
                  <Star size={13} fill="#f6c343" strokeWidth={0} />
                  <span>5.0</span>
                </div>
              </div>
              <p>{testimonial.quote}</p>
            </article>
          ))}
        </div>
        <div className="slider-buttons" aria-label="Testimonials controls">
          <button type="button" aria-label="Previous testimonial">
            <ArrowLeft size={22} />
          </button>
          <button type="button" aria-label="Next testimonial">
            <ArrowRight size={22} />
          </button>
        </div>
      </section>
    </>
  )
}

function PropertiesPage({
  properties,
  filters,
  setFilters,
  isSignedIn,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  onOpenProperty,
  onSignIn,
  onNavigate,
}: {
  properties: Property[]
  filters: {
    intent: string
    area: string
    type: string
    price: string
    sort: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      intent: string
      area: string
      type: string
      price: string
      sort: string
    }>
  >
  isSignedIn: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  onOpenProperty: (property: Property) => void
  onSignIn: () => void
  onNavigate: (page: Page) => void
}) {
  return (
    <section className="catalog-page">
      <Header
        activePage="home"
        isSignedIn={isSignedIn}
        onNavigate={onNavigate}
        onSignIn={onSignIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <FilterPanel filters={filters} setFilters={setFilters} />
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">Available homes</span>
          <h1>{properties.length} properties found</h1>
        </div>
        <button type="button" onClick={() => onNavigate('contact')}>
          <Plus size={18} />
          Add Property
        </button>
      </div>
      <div className="catalog-grid">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSignedIn={isSignedIn}
            onOpen={onOpenProperty}
            onSignIn={onSignIn}
          />
        ))}
      </div>
      <div className="slider-buttons catalog-controls">
        <button type="button" aria-label="Previous property page">
          <ArrowLeft size={22} />
        </button>
        <button type="button" aria-label="Next property page">
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  )
}

function PropertyDetailPage({
  property,
  similarByArea,
  similarByPrice,
  isSignedIn,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  onBack,
  onOpenProperty,
  onNavigate,
  onSignIn,
  onContactAgent,
}: {
  property: Property
  similarByArea: Property[]
  similarByPrice: Property[]
  isSignedIn: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  onBack: () => void
  onOpenProperty: (property: Property) => void
  onNavigate: (page: Page) => void
  onSignIn: () => void
  onContactAgent: (agent: Agent, property: Property) => void
}) {
  const agent = agents.find((item) => item.id === property.agentId) ?? agents[0]
  const gallery = [
    property.image,
    'residence-photo_1.png',
    'residence-photo_2.png',
    'residence-photo_3.png',
  ]
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const showPreviousImage = () =>
    setLightboxIndex((current) =>
      current === null ? 0 : (current - 1 + gallery.length) % gallery.length,
    )
  const showNextImage = () =>
    setLightboxIndex((current) => (current === null ? 0 : (current + 1) % gallery.length))

  return (
    <section className="detail-page">
      <Header
        activePage="home"
        isSignedIn={isSignedIn}
        onNavigate={onNavigate}
        onSignIn={onSignIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to listings
      </button>
      <div className="property-detail">
        <div>
          <button
            className="detail-main-button"
            type="button"
            onClick={() => setLightboxIndex(0)}
          >
            <OptionalImage
              className="detail-main-image"
              src={property.image}
              alt={property.title}
            />
          </button>
          <div className="detail-gallery">
            {gallery.slice(0, 4).map((image, index) => (
              <button
                className="detail-thumb-button"
                type="button"
                key={`${image}-${index}`}
                onClick={() => setLightboxIndex(index)}
              >
                <OptionalImage
                  className="detail-thumb"
                  src={image}
                  alt={`${property.title} gallery ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <span className={`status-pill ${property.status === 'Sold' ? 'sold' : ''}`}>
            {property.status}
          </span>
          <h1>{property.title}</h1>
          <p className="detail-location">
            <MapPin size={18} fill="currentColor" />
            {property.location}
          </p>
          <p>{property.description}</p>
          <div className="detail-stats">
            <span>
              <BedDouble size={20} />
              {property.rooms} Rooms
            </span>
            <span>
              <Bath size={20} />
              {property.size} sq m
            </span>
            <span>
              <Building2 size={20} />
              {property.type}
            </span>
          </div>
          <strong className="detail-price">{formatPrice(property)}</strong>
          <div className="agent-mini-card">
            <OptionalImage
              className="avatar"
              src={`${imagePath}${agent.image}`}
              alt={agent.name}
            />
            <div>
              <h3>{agent.name}</h3>
              <span>{agent.specialty}</span>
            </div>
            <button type="button" onClick={() => onContactAgent(agent, property)}>
              Contact
            </button>
          </div>
        </div>
      </div>
      <SimilarSection title="Similar by area" properties={similarByArea} onOpen={onOpenProperty} />
      <SimilarSection title="Similar by price" properties={similarByPrice} onOpen={onOpenProperty} />
      {lightboxIndex !== null ? (
        <div className="image-lightbox" role="dialog" aria-modal="true">
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setLightboxIndex(null)}
          >
            Close
          </button>
          <button className="lightbox-arrow left" type="button" onClick={showPreviousImage}>
            <ArrowLeft size={24} />
          </button>
          <OptionalImage
            className="lightbox-image"
            src={gallery[lightboxIndex]}
            alt={`${property.title} enlarged`}
          />
          <button className="lightbox-arrow right" type="button" onClick={showNextImage}>
            <ArrowRight size={24} />
          </button>
        </div>
      ) : null}
    </section>
  )
}

function SimilarSection({
  title,
  properties,
  onOpen,
}: {
  title: string
  properties: Property[]
  onOpen: (property: Property) => void
}) {
  return (
    <section className="similar-section">
      <h2>{title}</h2>
      <div className="similar-grid">
        {properties.map((property) => (
          <button className="similar-card" type="button" key={property.id} onClick={() => onOpen(property)}>
            <OptionalImage
              className="similar-image"
              src={property.image}
              alt={property.title}
            />
            <span>{property.location}</span>
            <strong>{formatPrice(property)}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

function AgentsPage({
  selectedAgent,
  setSelectedAgent,
  highlightedProperty,
  onNavigate,
  isSignedIn,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  onSignIn,
  properties,
}: {
  selectedAgent: Agent | null
  setSelectedAgent: (agent: Agent | null) => void
  highlightedProperty: Property | null
  onNavigate: (page: Page) => void
  isSignedIn: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  onSignIn: () => void
  properties: Property[]
}) {
  const [agentArea, setAgentArea] = useState('All')
  const [agentSpecialty, setAgentSpecialty] = useState('All')

  const filteredAgents = agents.filter((agent) => {
    const matchesArea = agentArea === 'All' || agent.area === agentArea
    const matchesSpecialty = agentSpecialty === 'All' || agent.specialty === agentSpecialty
    return matchesArea && matchesSpecialty
  })

  if (selectedAgent) {
    const brokered = properties.filter((property) => property.agentId === selectedAgent.id).slice(0, 3)
    return (
      <section className="agents-page">
        <Header
          activePage="agents"
          isSignedIn={isSignedIn}
          onNavigate={onNavigate}
          onSignIn={onSignIn}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
        <button className="back-button" type="button" onClick={() => setSelectedAgent(null)}>
          <ArrowLeft size={18} />
          Back to agents
        </button>
        <div className="agent-detail">
          <OptionalImage
            className="agent-detail-avatar"
            src={`${imagePath}${selectedAgent.image}`}
            alt={selectedAgent.name}
          />
          <div>
            <span className="eyebrow">{selectedAgent.area} specialist</span>
            <h1>{selectedAgent.name}</h1>
            <p>{selectedAgent.bio}</p>
            <div className="agent-facts">
              <span>
                <Star size={18} fill="#f6c343" strokeWidth={0} />
                {selectedAgent.rating} rating
              </span>
              <span>
                <Award size={18} />
                {selectedAgent.deals} brokered deals
              </span>
              <span>
                <Phone size={18} />
                {selectedAgent.phone}
              </span>
            </div>
          </div>
          <div className="agent-contact-card">
            <h3>Contact broker</h3>
            {highlightedProperty ? (
              <div className="highlighted-property">
                <OptionalImage
                  className="highlighted-property-image"
                  src={highlightedProperty.image}
                  alt={highlightedProperty.title}
                />
                <span>Interested in</span>
                <strong>{highlightedProperty.title}</strong>
                <small>{formatPrice(highlightedProperty)}</small>
              </div>
            ) : null}
            <a href={`mailto:${selectedAgent.email}`}>
              <Mail size={18} />
              {selectedAgent.email}
            </a>
            <a href={`tel:${selectedAgent.phone}`}>
              <Phone size={18} />
              {selectedAgent.phone}
            </a>
            <button type="button">Recommend this agent</button>
          </div>
        </div>
        <section className="similar-section">
          <h2>Recent brokered work</h2>
          <div className="similar-grid">
            {brokered.map((property) => (
              <article className="work-card" key={property.id}>
                <OptionalImage
                  className="similar-image"
                  src={property.image}
                  alt={property.title}
                />
                <strong>{property.title}</strong>
                <span>{property.location}</span>
                <small>
                  <CalendarDays size={14} />
                  Closed demo record
                </small>
              </article>
            ))}
          </div>
        </section>
      </section>
    )
  }

  return (
    <section className="agents-page">
      <Header
        activePage="agents"
        isSignedIn={isSignedIn}
        onNavigate={onNavigate}
        onSignIn={onSignIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">Trusted brokers</span>
          <h1>Find an agent for your next move</h1>
        </div>
      </div>
      <div className="agent-filters">
        <label>
          Area
          <select value={agentArea} onChange={(event) => setAgentArea(event.target.value)}>
            <option>All</option>
            <option>CCD</option>
            <option>Bole</option>
            <option>CMC</option>
          </select>
        </label>
        <label>
          Specialty
          <select
            value={agentSpecialty}
            onChange={(event) => setAgentSpecialty(event.target.value)}
          >
            <option>All</option>
            <option>Family Homes</option>
            <option>Luxury Apartments</option>
            <option>Premium Villas</option>
            <option>Rentals</option>
          </select>
        </label>
      </div>
      <div className="agents-grid">
        {filteredAgents.map((agent) => (
          <article className="agent-card" key={agent.id}>
            <OptionalImage
              className="agent-avatar"
              src={`${imagePath}${agent.image}`}
              alt={agent.name}
            />
            <span className="status-pill">{agent.area}</span>
            <h3>{agent.name}</h3>
            <p>{agent.specialty}</p>
            <div className="agent-rating">
              <Star size={16} fill="#f6c343" strokeWidth={0} />
              {agent.rating} rating · {agent.deals} deals
            </div>
            <button type="button" onClick={() => setSelectedAgent(agent)}>
              View profile
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ContactPage({
  profile,
  setProfile,
  properties,
  setProperties,
  onNavigate,
  isSignedIn,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  onSignIn,
}: {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
  properties: Property[]
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>
  onNavigate: (page: Page) => void
  isSignedIn: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  onSignIn: () => void
}) {
  const emptyForm = {
    id: 0,
    title: '',
    location: 'Bole, Addis Ababa',
    area: 'Bole',
    type: 'House',
    intent: 'Buy',
    price: 0,
    rooms: 3,
    size: 300,
    status: 'Available' as const,
    owner: 'user' as const,
    image: 'residence-photo_1.png',
    description: '',
    agentId: 1,
  }
  const [form, setForm] = useState<Property>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const userProperties = properties.filter((property) => property.owner === 'user')
  const handlePropertyImageUpload = (file: File | undefined) => {
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setForm((current) => ({ ...current, image: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const saveProperty = () => {
    if (!form.title.trim()) {
      return
    }
    if (editingId) {
      setProperties((current) =>
        current.map((property) =>
          property.id === editingId ? { ...form, id: editingId, owner: 'user' } : property,
        ),
      )
      setEditingId(null)
    } else {
      setProperties((current) => [
        ...current,
        { ...form, id: Date.now(), owner: 'user', agentId: 1 },
      ])
    }
    setForm(emptyForm)
  }

  return (
    <section className="contact-dashboard">
      <Header
        activePage="contact"
        isSignedIn={isSignedIn}
        onNavigate={onNavigate}
        onSignIn={onSignIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Session dashboard</span>
          <h1>Manage your contact info and properties</h1>
          <p>Everything here is local UI state for now. It resets when the app refreshes.</p>
        </div>
        {!isSignedIn ? (
          <button type="button" onClick={onSignIn}>
            Sign in to manage
          </button>
        ) : null}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Personal contact</h2>
          <label>
            Full name
            <input
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              value={profile.email}
              onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label>
            Phone
            <input
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>
          <label>
            Preferred area
            <input
              value={profile.preferredArea}
              onChange={(event) =>
                setProfile((current) => ({ ...current, preferredArea: event.target.value }))
              }
            />
          </label>
        </section>

        <section className="dashboard-card">
          <h2>{editingId ? 'Edit property' : 'Add property'}</h2>
          <label>
            Title
            <input
              value={form.title}
              placeholder="e.g. Bole guest house"
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <div className="form-row">
            <label>
              Area
              <select
                value={form.area}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    area: event.target.value,
                    location: `${event.target.value}, Addis Ababa`,
                  }))
                }
              >
                <option>CCD</option>
                <option>Bole</option>
                <option>CMC</option>
              </select>
            </label>
            <label>
              Type
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              >
                <option>House</option>
                <option>Villa</option>
                <option>Apartment</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Price
              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: Number(event.target.value) }))
                }
              />
            </label>
            <label>
              Rooms
              <input
                type="number"
                value={form.rooms}
                onChange={(event) =>
                  setForm((current) => ({ ...current, rooms: Number(event.target.value) }))
                }
              />
            </label>
          </div>
          <label className="image-upload-field">
            Property image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handlePropertyImageUpload(event.target.files?.[0])}
            />
            <span>Choose image for this listing</span>
          </label>
          <OptionalImage className="upload-preview" src={form.image} alt="Property preview" />
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
          <button className="save-button" type="button" onClick={saveProperty}>
            <Plus size={17} />
            {editingId ? 'Save changes' : 'Add property'}
          </button>
        </section>
      </div>

      <section className="managed-section">
        <h2>Your session properties</h2>
        {userProperties.length === 0 ? (
          <p className="empty-state">No properties added yet. Add one above to test the CRUD flow.</p>
        ) : (
          <div className="managed-list">
            {userProperties.map((property) => (
              <article className="managed-card" key={property.id}>
                <OptionalImage
                  className="managed-image"
                  src={property.image}
                  alt={property.title}
                />
                <div>
                  <h3>{property.title}</h3>
                  <span>{property.location}</span>
                  <strong>{formatPrice(property)}</strong>
                </div>
                <div className="managed-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(property)
                      setEditingId(property.id)
                    }}
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProperties((current) =>
                        current.map((item) =>
                          item.id === property.id
                            ? {
                                ...item,
                                status: item.status === 'Sold' ? 'Available' : 'Sold',
                              }
                            : item,
                        ),
                      )
                    }
                  >
                    <CheckCircle2 size={16} />
                    {property.status === 'Sold' ? 'Unsold' : 'Sold'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProperties((current) => current.filter((item) => item.id !== property.id))
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="contact-section compact-contact">
        <h2>Do You Have Any Questions? Get Help From Us</h2>
        <div className="contact-links">
          <span>
            <MessageCircle size={18} />
            Chat live with our support team
          </span>
          <span>
            <ShieldQuestion size={18} />
            Browse our FAQ
          </span>
        </div>
      </section>
    </section>
  )
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [activePage, setActivePage] = useState<Page>('home')
  const [properties, setProperties] = useState<Property[]>(baseProperties)
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: 'Guest User',
    email: 'guest@example.com',
    phone: '+251 900 000 000',
    preferredArea: 'Bole',
  })
  const [filters, setFilters] = useState({
    intent: 'All',
    area: 'All',
    type: 'All',
    price: 'All',
    sort: 'Featured',
  })

  const filteredProperties = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const filtered = properties.filter((property) => {
      const matchesIntent = filters.intent === 'All' || property.intent === filters.intent
      const matchesArea = filters.area === 'All' || property.area === filters.area
      const matchesType = filters.type === 'All' || property.type === filters.type
      const matchesPrice =
        filters.price === 'All' ||
        (filters.price === 'Under 50M' && property.price < 50000000) ||
        (filters.price === '50M - 110M' &&
          property.price >= 50000000 &&
          property.price <= 110000000) ||
        (filters.price === 'Above 110M' && property.price > 110000000)
      const searchText = [
        property.title,
        property.location,
        property.area,
        property.type,
        property.intent,
        property.status,
        property.description,
        formatPrice(property),
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch = !normalizedSearch || searchText.includes(normalizedSearch)
      return matchesIntent && matchesArea && matchesType && matchesPrice && matchesSearch
    })

    return [...filtered].sort((a, b) => {
      if (filters.sort === 'Price Low') return a.price - b.price
      if (filters.sort === 'Price High') return b.price - a.price
      if (filters.sort === 'Most Rooms') return b.rooms - a.rooms
      return a.id - b.id
    })
  }, [filters, properties, searchQuery])

  const selectedProperty = properties.find((property) => property.id === selectedPropertyId) ?? null
  const highlightedProperty =
    properties.find((property) => property.id === highlightedPropertyId) ?? null

  const navigate = (page: Page) => {
    setActivePage(page)
    setSelectedPropertyId(null)
    if (page !== 'agents') {
      setSelectedAgent(null)
      setHighlightedPropertyId(null)
    }
  }

  const signIn = () => {
    setIsSignedIn(true)
    setActivePage('properties')
    setSelectedPropertyId(null)
  }

  const openProperty = (property: Property) => {
    if (!isSignedIn) {
      signIn()
      return
    }
    setSelectedPropertyId(property.id)
    setActivePage('properties')
  }

  const contactAgentForProperty = (agent: Agent, property: Property) => {
    setSelectedPropertyId(null)
    setSelectedAgent(agent)
    setHighlightedPropertyId(property.id)
    setActivePage('agents')
  }

  let content
  if (selectedProperty) {
    const similarByArea = properties
      .filter((property) => property.id !== selectedProperty.id && property.area === selectedProperty.area)
      .slice(0, 3)
    const similarByPrice = properties
      .filter((property) => property.id !== selectedProperty.id)
      .sort(
        (a, b) =>
          Math.abs(a.price - selectedProperty.price) - Math.abs(b.price - selectedProperty.price),
      )
      .slice(0, 3)

    content = (
      <PropertyDetailPage
        property={selectedProperty}
        similarByArea={similarByArea.length ? similarByArea : properties.slice(0, 3)}
        similarByPrice={similarByPrice}
        isSignedIn={isSignedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        onBack={() => setSelectedPropertyId(null)}
        onOpenProperty={openProperty}
        onNavigate={navigate}
        onSignIn={signIn}
        onContactAgent={contactAgentForProperty}
      />
    )
  } else if (activePage === 'agents') {
    content = (
      <AgentsPage
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        highlightedProperty={highlightedProperty}
        onNavigate={navigate}
        isSignedIn={isSignedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        onSignIn={signIn}
        properties={properties}
      />
    )
  } else if (activePage === 'contact') {
    content = (
      <ContactPage
        profile={profile}
        setProfile={setProfile}
        properties={properties}
        setProperties={setProperties}
        onNavigate={navigate}
        isSignedIn={isSignedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        onSignIn={signIn}
      />
    )
  } else if (activePage === 'properties' || isSignedIn) {
    content = (
      <PropertiesPage
        properties={filteredProperties}
        filters={filters}
        setFilters={setFilters}
        isSignedIn={isSignedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        onOpenProperty={openProperty}
        onSignIn={signIn}
        onNavigate={navigate}
      />
    )
  } else {
    content = (
      <HomePage
        properties={filteredProperties}
        filters={filters}
        setFilters={setFilters}
        isSignedIn={isSignedIn}
        onSignIn={signIn}
        onOpenProperty={openProperty}
        onNavigate={navigate}
      />
    )
  }

  return (
    <main id="top" className="page">
      {content}
      <Footer onNavigate={navigate} />
    </main>
  )
}

export default App
