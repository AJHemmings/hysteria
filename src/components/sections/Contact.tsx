import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';
import './Contact.css';

export default function Contact() {
  const { settings } = useSettings();

  return (
    <section className="section contact" id="contact">
      <div className="section__inner">
        <h2 className="heading-lg section__title">Contact Us</h2>

        <div className="contact__content">
          {/* Social icons */}
          <div className="contact__social">
            <a
              href={settings.facebook_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__social-btn"
              aria-label="Facebook"
            >
              <FaFacebookF />
              <span>Facebook</span>
            </a>
            <a
              href={settings.instagram_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__social-btn"
              aria-label="Instagram"
            >
              <FaInstagram />
              <span>Instagram</span>
            </a>
          </div>

          {/* Email */}
          <a 
            href={`mailto:${settings.contact_email || 'tomburden86@gmail.com'}`} 
            className="contact__email"
          >
            {settings.contact_email || 'tomburden86@gmail.com'}
          </a>
        </div>

        {/* Footer */}
        <footer className="contact__footer">
          <p>&copy; {new Date().getFullYear()} Hysteria — A Muse Tribute</p>
        </footer>
      </div>
    </section>
  );
}
