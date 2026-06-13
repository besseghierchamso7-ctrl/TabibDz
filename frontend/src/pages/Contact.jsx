const Contact = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Contactez-nous</h1>
        <p className="mt-4 text-slate-600">Pour toute question ou demande de support, envoyez-nous un message.</p>
        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
            <input type="text" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
            <textarea className="w-full rounded-2xl border border-slate-200 px-4 py-3" rows="5" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white">Envoyer</button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
