import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'patient' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit avoir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/dashboard/patient');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white">
            <div className="rounded-full bg-blue-500 px-3 py-1.5 text-white text-sm font-bold">Tabib DZ</div>
          </Link>
          <p className="mt-2 text-slate-300">Créez votre compte</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl border border-white/20">
          <h1 className="text-2xl font-bold text-slate-900">S'inscrire</h1>
          <p className="mt-2 text-sm text-slate-600">Rejoignez notre plateforme médicale</p>

          {error && (
            <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
                placeholder="jean@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-500">Minimum 8 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Je suis</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition text-sm"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Médecin</option>
              </select>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="agree" required className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
              <label htmlFor="agree" className="ml-2 text-xs text-slate-600">
                J'accepte les{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  conditions d'utilisation
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-center text-sm text-slate-600">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-xs text-slate-300">
          <p>🔒 Inscription sécurisée et vérifiée</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
