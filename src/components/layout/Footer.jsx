import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';
import Container from '../ui/Container';

export default function Footer() {
  return (
    <footer className="bg-charcoal-deep text-white">
      {/* Main Footer */}
      <div className="border-t border-white/10 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white overflow-hidden">
                  <img src="/logo.jpg" alt="Le Studio Contrology" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase block text-white leading-tight">
                    Le Studio
                  </span>
                  <span className="font-sans text-[9px] font-medium tracking-[0.3em] uppercase block text-oak leading-tight">
                    Contrology
                  </span>
                </div>
              </div>
              <p className="font-serif italic text-lg text-text-warm leading-relaxed max-w-xs mb-6">
                "Strength in control,<br />beauty in flow."
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-muted hover:text-oak transition-colors text-xs font-sans tracking-wider uppercase"
              >
                <Instagram size={16} />
                Follow Our Journey
              </a>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2">
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-oak mb-6">
                Studio
              </h4>
              <ul className="space-y-3.5">
                <li><Link to="/classes" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Classes & Schedule</Link></li>
                <li><Link to="/coaches" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Our Coaches</Link></li>
                <li><a href="#disciplines" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Disciplines</a></li>
                <li><a href="#membership" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Membership</a></li>
              </ul>
            </div>

            {/* Info */}
            <div className="md:col-span-3">
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-oak mb-6">
                Informations
              </h4>
              <ul className="space-y-3.5">
                <li><a href="#rules" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Studio Rules</a></li>
                <li><Link to="/booking" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Private Sessions</Link></li>
                <li><a href="#" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">Gift Cards</a></li>
                <li><a href="#" className="text-text-warm text-sm hover:text-oak transition-colors duration-300">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-oak mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-warm text-sm">
                  <MapPin size={14} className="text-oak mt-1 shrink-0" />
                  <span>Chemin Said Hamdine,<br />Algiers, Algeria</span>
                </li>
                <li className="flex items-center gap-3 text-text-warm text-sm">
                  <Mail size={14} className="text-oak shrink-0" />
                  <span>contact@lestudiocontrology.com</span>
                </li>
                <li className="flex items-center gap-3 text-text-warm text-sm">
                  <Phone size={14} className="text-oak shrink-0" />
                  <span>+213 (0) 555 123 456</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-[11px] font-sans tracking-wider">
              &copy; {new Date().getFullYear()} Le Studio Contrology. All rights reserved.
            </p>
            <p className="text-text-muted text-[11px] font-sans tracking-wider">
              Women-only safe space · Algiers, Algeria
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
