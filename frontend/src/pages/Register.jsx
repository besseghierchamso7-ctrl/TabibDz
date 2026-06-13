import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Inscription</h1>
        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
            <input type="text" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
            <input type="text" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white">Créer un compte</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà un compte ? <Link to="/login" className="text-blue-600">Connectez-vous</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
