import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-blue-600">Plateforme médicale</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Prenez votre rendez-vous médical en Algérie</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">Tabib DZ vous aide à trouver un médecin vérifié, réserver une consultation et gérer vos rendez-vous facilement.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/search" className="rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700">Rechercher un médecin</Link>
            <Link to="/contact" className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 hover:bg-slate-100">Contact</Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-900">Recherche rapide</h2>
          <form className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Spécialité, docteur, wilaya" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option>Wilaya</option>
                <option>Alger</option>
                <option>Oran</option>
              </select>
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option>Spécialité</option>
                <option>Médecine Générale</option>
                <option>Cardiologie</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white">Lancer la recherche</button>
          </form>
        </div>
      </section>

      <section className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Spécialités</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Trouvez le bon soignant</h2>
          <p className="mt-3 text-slate-600">Consultez des médecins par spécialité, wilaya ou avis patients.</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Top médecins</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Profils vérifiés</h2>
          <p className="mt-3 text-slate-600">Nos médecins sont vérifiés par l'administrateur.</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Notifications</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Restez informé</h2>
          <p className="mt-3 text-slate-600">Recevez des rappels et des mises à jour de rendez-vous.</p>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-blue-600">Comment ça marche</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">3 étapes simples pour prendre rendez-vous</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="text-xl font-semibold">1. Cherchez un médecin</h3>
            <p className="mt-3 text-slate-600">Filtrez par wilaya, spécialité, genre et note.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="text-xl font-semibold">2. Réservez votre créneau</h3>
            <p className="mt-3 text-slate-600">Choisissez une date et une heure disponibles.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="text-xl font-semibold">3. Gérez vos rendez-vous</h3>
            <p className="mt-3 text-slate-600">Annulez, replanifiez et consultez l'historique.</p>
          </div>
        </div>
      </section>

      <section className="mt-20 rounded-3xl bg-blue-600 p-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em]">Témoignages</p>
          <h2 className="mt-4 text-3xl font-bold">Une expérience médicale plus simple</h2>
          <p className="mt-4 text-lg">« Tabib DZ m'a permis de réserver un rendez-vous en quelques clics, sans attente téléphonique. »</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
