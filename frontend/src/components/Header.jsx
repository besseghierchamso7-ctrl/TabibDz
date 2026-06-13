import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Chercher un médecin', to: '/search' },
    { label: 'Contact', to: '/contact' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/dashboard/admin';
    if (user?.role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

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
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200">
                  <span>{user.firstName} {user.lastName}</span>
                  <svg className={`h-4 w-4 transition ${userMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <Link to={getDashboardPath()} onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 border-b border-slate-200">
                      📊 Tableau de bord
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      🚪 Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                  Connexion
                </button>
                <button onClick={() => navigate('/register')} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                  S'inscrire
                </button>
              </>
            )}
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
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
                {user ? (
                  <>
                    <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded">
                      📊 Tableau de bord
                    </Link>
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded">
                      🚪 Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
                      Connexion
                    </button>
                    <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      S'inscrire
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
