import Carousel from '../components/Carousel'
import SiteEffects from '../components/SiteEffects'
import BookingWidget from '../components/BookingWidget'

const B = ''

const galleryItems = [
  { src: `${B}/img/brow12.jpg`, alt: 'Full face lash extensions result',        label: 'Lash Extensions'  },
  { src: `${B}/img/brow9.jpg`,  alt: 'Both eyes with lash and brow definition', label: 'Volume Set'       },
  { src: `${B}/img/brow.jpg`,   alt: 'Brow lamination close-up result',         label: 'Brow Lamination'  },
  { src: `${B}/img/brow3.jpg`,  alt: 'Dramatic lash extensions green eye',      label: 'Stargazer Lashes' },
  { src: `${B}/img/brow6.jpg`,  alt: 'Classic lash extensions and brows',       label: 'Classic Set'      },
  { src: `${B}/img/brow7.jpg`,  alt: 'Lash extensions close-up result',         label: 'Hybrid Lashes'    },
  { src: `${B}/img/brow8.jpg`,  alt: 'Volume lash extensions result',           label: 'Volume Lashes'    },
  { src: `${B}/img/brow11.jpg`, alt: 'Studio lash extensions appointment',      label: 'Lash Extensions'  },
]

export default function Home() {
  return (
    <>
      <SiteEffects />

      {/* Navigation */}
      <nav className="site-nav" id="navbar">
        <div className="nav-brand">Dragonflybar</div>
        <div className="nav-links" id="nav-links">
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#testimonials">Reviews</a>
          <a href="#booking">Book Now</a>
        </div>
        <button className="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-slideshow">
          <Carousel />
        </div>
        <div className="hero-content">
          <p className="hero-tagline fade-in">Est. La Palma, CA</p>
          <h1 className="fade-in">Dragonflybar Studio</h1>
          <div className="hero-divider fade-in"></div>
          <p className="hero-subtitle fade-in">Enhancing Your Natural Beauty</p>
          <a href="#booking" className="btn-book fade-in">Book Appointment <span>&rarr;</span></a>
        </div>
      </header>

      {/* Services */}
      <section id="services" className="services-section">
        <div className="section-header fade-in">
          <p className="section-subtitle">What We Offer</p>
          <h2>Services &amp; Pricing</h2>
          <div className="header-line"></div>
        </div>
        <div className="services-grid">
          <div className="service-card fade-in">
            <div className="service-icon">&#10024;</div>
            <h3>Lashes &amp; Fill</h3>
            <ul className="price-list">
              <li><span>Classic</span><span>$50 / $30</span></li>
              <li><span>Hybrid</span><span>$55 / $35</span></li>
              <li><span>Volume</span><span>$60 / $45</span></li>
              <li><span>Stargazer</span><span>$55</span></li>
              <li><span>Foreign Fills</span><span>+$10</span></li>
              <li><span>Lash Lifts</span><span>$50</span></li>
            </ul>
          </div>
          <div className="service-card fade-in">
            <div className="service-icon">&#9883;</div>
            <h3>Eyebrows</h3>
            <ul className="price-list">
              <li><span>Lamination</span><span>$70</span></li>
              <li><span>Henna Tint</span><span>$40</span></li>
            </ul>
          </div>
          <div className="service-card fade-in">
            <div className="service-icon">&#10022;</div>
            <h3>Extras</h3>
            <ul className="price-list">
              <li><span>Foreign Fills</span><span>+$10</span></li>
              <li><span>Removals</span><span>$20</span></li>
              <li><span>Aftercare Kit</span><span>$10</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="gallery-section">
        <div className="section-header fade-in">
          <p className="section-subtitle">See the Difference</p>
          <h2>Our Transformations</h2>
          <div className="header-line"></div>
        </div>
        <div className="gallery-grid">
          {galleryItems.map(({ src, alt, label }) => (
            <div key={src} className="gallery-item fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} loading="lazy" />
              <div className="gallery-overlay"><span>{label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header fade-in">
          <p className="section-subtitle">Client Love</p>
          <h2>What They Say</h2>
          <div className="header-line"></div>
        </div>
        <div className="testimonials-grid">
          {[
            {
              text: '"Absolutely love my lashes! They look so natural and last so long. Best lash artist in La Palma hands down."',
              author: 'Jessica M.',
            },
            {
              text: '"My brow lamination turned out perfect! She really takes her time and makes sure everything looks flawless."',
              author: 'Sophia R.',
            },
            {
              text: '"So glad I found Dragonflybar Studio! The volume set is gorgeous and the studio is so clean and cozy."',
              author: 'Mia L.',
            },
          ].map(({ text, author }) => (
            <div key={author} className="testimonial-card fade-in">
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">{text}</p>
              <div className="testimonial-author">
                <span className="author-name">&mdash; {author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="booking-section">
        <div className="section-header fade-in">
          <p className="section-subtitle">Ready for Your Glow-Up?</p>
          <h2>Book Your Appointment</h2>
          <div className="header-line"></div>
        </div>
        <div className="booking-widget-wrapper fade-in">
          <BookingWidget />
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content fade-in">
          <div className="footer-brand">
            <h2>Dragonflybar Studio</h2>
            <p>Enhancing Your Natural Beauty</p>
            <div className="footer-divider"></div>
          </div>
          <div className="footer-info">
            <div className="footer-col">
              <h4>Visit</h4>
              <p>Home Based<br />La Palma, CA</p>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p><a href="mailto:Miaj.k.04@gmail.com">Miaj.k.04@gmail.com</a></p>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <a href="https://www.instagram.com/dragonflyybar/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @dragonflyybar
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Dragonflybar Studio. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
