import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">Tabib DZ</h3>
            <p className="mt-2 text-sm text-slate-400">
              Plateforme médicale algérienne pour prendre rendez-vous en ligne facilement et simplement.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white">Navigation</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-sm text-slate-400 hover:text-white">Accueil</Link></li>
              <li><Link to="/search" className="text-sm text-slate-400 hover:text-white">Chercher un médecin</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white">Services</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white">Pour patients</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white">Pour médecins</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white">Pour administrateurs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-slate-400">📧 info@tabibdz.com</li>
              <li className="text-sm text-slate-400">📞 +213 (0) 123 45 67</li>
              <li className="text-sm text-slate-400">📍 Alger, Algérie</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
          <p>&copy; {currentYear} Tabib DZ. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Politique de confidentialité</a>
            <a href="#" className="hover:text-white">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
