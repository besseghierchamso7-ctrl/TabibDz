const ForgotPassword = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Mot de passe oublié</h1>
        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white">Envoyer le lien</button>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
