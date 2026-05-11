import { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useSettings } from '../../hooks/useSettings';
import './Navbar.css';

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const scrollY = useScrollPosition();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isScrolled = scrollY > 50;

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${visible ? 'navbar--visible' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        {/* Logo / Brand */}
        <a
          href="#"
          className="navbar__brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          HYSTERIA
        </a>

        {/* Desktop nav links */}
        <ul className="navbar__links">
          <li>
            <button onClick={() => scrollToSection('hear-us')} className="navbar__link">
              Hear Us
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('gig-dates')} className="navbar__link">
              Gig Dates
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} className="navbar__link">
              Contact Us
            </button>
          </li>
        </ul>

        {/* Social icons */}
        <div className="navbar__social">
          {settings.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__social-icon"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
          )}
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button onClick={() => scrollToSection('hear-us')} className="navbar__mobile-link">
          Hear Us
        </button>
        <button onClick={() => scrollToSection('gig-dates')} className="navbar__mobile-link">
          Gig Dates
        </button>
        <button onClick={() => scrollToSection('contact')} className="navbar__mobile-link">
          Contact Us
        </button>
        <div className="navbar__mobile-social">
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
          )}
          {settings.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
