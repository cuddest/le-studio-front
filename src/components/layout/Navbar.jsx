import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Container from '../ui/Container';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Classes', path: '/classes' },
  { name: 'Coaches', path: '/coaches' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const accountLink = isAuthenticated
    ? { name: 'My Account', path: '/profile' }
    : { name: 'Login', path: '/login' };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal-deep/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-18 sm:h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20">
              <span className="font-serif text-charcoal-deep text-sm font-bold leading-none">LC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-sans text-[10px] font-semibold tracking-[0.35em] uppercase block leading-tight">
                Le Studio
              </span>
              <span className="text-oak font-sans text-[9px] font-medium tracking-[0.3em] uppercase block leading-tight">
                Contrology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-oak'
                    : 'text-white/70 hover:text-oak'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={accountLink.path}
              className={`font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                location.pathname === accountLink.path
                  ? 'text-oak'
                  : 'text-white/70 hover:text-oak'
              }`}
            >
              {accountLink.name}
            </Link>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 hover:text-oak transition-colors duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <Link to="/booking">
              <div className="ml-2 px-6 py-2.5 bg-oak text-charcoal-deep font-sans text-[10px] font-semibold tracking-[0.2em] uppercase rounded cursor-pointer hover:bg-oak-dark transition-colors duration-300">
                Book Now
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:text-oak transition-colors cursor-pointer"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
        >
          <div className="pt-2 border-t border-white/10">
            <div className="flex flex-col gap-1 mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3.5 rounded font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-oak bg-white/5'
                      : 'text-white/60 hover:text-oak hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={accountLink.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3.5 rounded font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
                  location.pathname === accountLink.path
                    ? 'text-oak bg-white/5'
                    : 'text-white/60 hover:text-oak hover:bg-white/5'
                }`}
              >
                {accountLink.name}
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="mx-4 px-4 py-3 rounded font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-white/60 hover:text-oak hover:bg-white/5 transition-all duration-200 text-left cursor-pointer"
                >
                  Sign Out
                </button>
              )}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="mx-4 mt-2 px-6 py-3 bg-oak text-charcoal-deep font-sans text-[10px] font-semibold tracking-[0.2em] uppercase rounded text-center hover:bg-oak-dark transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
