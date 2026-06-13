import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
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
          <p className="mt-2 text-slate-300">Réinitialisez votre mot de passe</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl border border-white/20">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900">Vérifiez votre email</h1>
              <p className="mt-3 text-slate-600">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
              </p>
              <p className="mt-4 text-sm text-slate-600">
                Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe. Le lien expire dans 24 heures.
              </p>
              <Link to="/login" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
              <p className="mt-2 text-sm text-slate-600">Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

              {error && (
                <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3">
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Adresse email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                    placeholder="votre@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-center text-sm text-slate-600">
                  Vous vous souvenez de votre mot de passe?{' '}
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
