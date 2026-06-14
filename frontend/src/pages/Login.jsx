import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white">
            <div className="rounded-full bg-blue-500 px-3 py-1.5 text-white text-sm font-bold">Tabib DZ</div>
          </Link>
          <p className="mt-2 text-slate-300">Connectez-vous à votre compte</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl border border-white/20">
          <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-600">Accédez à votre tableau de bord médical</p>

          {error && (
            <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm font-medium text-emerald-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Oublié ?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Rester connecté
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-center text-sm text-slate-600">
              Pas encore de compte?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-xs text-slate-300">
          <p>🔒 Vos données sont sécurisées et chiffrées</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
