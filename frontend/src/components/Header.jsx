import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Chercher un médecin', to: '/search' },
    { label: 'Contact', to: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-blue-600 px-3 py-2 text-white font-bold text-xl">
              Tabib DZ
            </div>
            <span className="hidden text-xl font-bold text-slate-900 sm:inline">Tabib DZ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <button onClick={() => navigate('/login')} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
              Connexion
            </button>
            <button onClick={() => navigate('/register')} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              S'inscrire
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 md:hidden hover:bg-slate-100">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-slate-200 pt-4 md:hidden">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-blue-600">
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-wrap gap-2 pt-3">
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
                  Connexion
                </button>
                <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
