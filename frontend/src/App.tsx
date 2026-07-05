import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  ClipboardList,
  DollarSign,
  Handshake,
  Home,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  ShieldQuestion,
  Star,
  UserRoundCheck,
} from 'lucide-react'
import './App.css'

const imagePath = '/images/'

const searchFields = [
  { label: 'Buy', icon: Home },
  { label: 'Location', icon: MapPin },
  { label: 'Type', icon: Home },
  { label: 'Price Range', icon: DollarSign },
]

const stats = [
  { value: '50K+', label: 'Houses Available' },
  { value: '100K+', label: 'Houses Sold' },
  { value: '10K+', label: 'Trusted Agents' },
]

const features = [
  {
    title: 'Expert Guidance',
    text: "Benefit from our team's seasoned expertise for a smooth buying experience in Addis ababa",
    icon: MapPin,
  },
  {
    title: 'Personalized Service',
    text: 'Our services adapt to your unique needs, making your journey stress-free',
    icon: UserRoundCheck,
  },
  {
    title: 'Transparent Process',
    text: 'Stay informed with our clear and honest approach to buying your home',
    icon: ClipboardList,
  },
  {
    title: 'Exceptional Support',
    text: 'Providing peace of mind with our responsive and attentive customer service',
    icon: Handshake,
  },
]

const residences = [
  {
    image: 'residence-photo_1.png',
    location: 'CCD, Addis Ababa',
    rooms: '4 Rooms',
    size: '300 sq m',
    price: 'ETB 20,500,000',
  },
  {
    image: 'residence-photo_2.png',
    location: 'Bole, Addis Ababa',
    rooms: '3 Rooms',
    size: '500 sq m',
    price: 'ETB 100,000,000',
  },
  {
    image: 'residence-photo_3.png',
    location: 'CMC, Addis ababa',
    rooms: '6 Rooms',
    size: '1000 sq m',
    price: 'ETB 120,700,000',
  },
]

const testimonials = [
  {
    name: 'Abebe Belete',
    city: 'Addis Ababa',
    image: 'avatar_1.png',
    quote:
      'Judah State truly cares about their clients. They listened to my exact needs and helped me find the perfect home in the Bay Area. Highly recommended!',
  },
  {
    name: 'Yahial Berreso',
    city: 'Addis Ababa',
    image: 'avatar_2.png',
    quote:
      'Judah State really listened to what I wanted and helped me find the perfect spot in CMC. Their dedication to finding the right home in Addis Ababa is unmatched!',
  },
  {
    name: 'Abiy Ahmed',
    city: 'Addis Ababa',
    image: 'avatar_3.png',
    quote:
      'Judah State truly understands the vision. They listened to my needs and helped me secure the ultimate presidential palace. Incredible service keep it up this is what Ethiopia needs!',
  },
]

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
        <img src={src} alt={alt} onError={() => setLoaded(false)} />
      ) : null}
    </span>
  )
}

function Logo() {
  const [loaded, setLoaded] = useState(true)

  return (
    <a className="brand" href="#top" aria-label="NOAH Real Estate PLC home">
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
    </a>
  )
}

function App() {
  return (
    <main id="top" className="page">
      <section className="hero-section">
        <header className="site-header">
          <Logo />
          <nav className="main-nav" aria-label="Main navigation">
            <a className="active" href="#top">
              Home
            </a>
            <a href="#agents">Agents</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="signup-button" type="button">
            Sign up
          </button>
          <button className="mobile-menu" type="button" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <h1>Find Your Dream Home</h1>
            <p>
              Explore our curated selection of exquisite properties meticulously
              tailored to your unique dream home vision
            </p>
            <button type="button">Sign up</button>
          </div>
          <OptionalImage
            className="hero-house"
            src={`${imagePath}hero-house.png`}
            alt="Modern luxury house"
          />
        </div>

        <form className="search-panel" aria-label="Property search">
          {searchFields.map(({ label, icon: Icon }) => (
            <label key={label} className="search-field">
              <span>{label}</span>
              <Icon size={15} strokeWidth={3} aria-hidden="true" />
            </label>
          ))}
        </form>
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
            From cozy cottages to luxurious estates, our dedicated team guides
            you through every step of the journey, ensuring your dream home
            becomes a reality
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
            Elevating Your Home Buying Experience with Expertise, Integrity,
            and Unmatched Personalized Service
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
        <h2>Our Popular Residences</h2>
        <div className="residence-grid">
          {residences.map((homeItem) => (
            <article className="residence-card" key={homeItem.location}>
              <OptionalImage
                className="residence-photo"
                src={`${imagePath}${homeItem.image}`}
                alt={`${homeItem.location} residence`}
              />
              <div className="residence-body">
                <h3>
                  <MapPin size={20} fill="currentColor" aria-hidden="true" />
                  {homeItem.location}
                </h3>
                <div className="residence-meta">
                  <span>
                    <BedDouble size={18} aria-hidden="true" />
                    {homeItem.rooms}
                  </span>
                  <span>
                    <Bath size={18} aria-hidden="true" />
                    {homeItem.size}
                  </span>
                </div>
                <div className="residence-actions">
                  <button type="button">Sign up</button>
                  <strong>{homeItem.price}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What People Say About Dwello</h2>
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

      <section id="contact" className="contact-section">
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
        <form className="email-form">
          <label>
            <Mail size={16} aria-hidden="true" />
            <input type="email" placeholder="Enter your email address..." />
          </label>
          <button type="button">Submit</button>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <Logo />
          <p>We find the perfect house and turn it to your home!</p>
        </div>
        <nav aria-label="About links">
          <h3>About</h3>
          <a href="#story">Story</a>
          <a href="#careers">Careers</a>
          <a href="#agents">Our Team</a>
        </nav>
        <nav aria-label="Support links">
          <h3>Support</h3>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact Us</a>
          <a href="#help">Help Center</a>
          <a href="#terms">Terms of Service</a>
        </nav>
        <nav aria-label="Find us links">
          <h3>Find Us</h3>
          <a href="#events">Events</a>
          <a href="#locations">Locations</a>
        </nav>
        <nav aria-label="Social links">
          <h3>Our Social</h3>
          <a href="#instagram">
            <span className="social-icon instagram-icon" aria-hidden="true" />
            Instagram
          </a>
          <a href="#facebook">
            <span className="social-icon facebook-icon" aria-hidden="true" />
            Facebook
          </a>
          <a href="#x">
            <span className="social-icon x-icon" aria-hidden="true" />
            Twitter (X)
          </a>
        </nav>
      </footer>
    </main>
  )
}

export default App
