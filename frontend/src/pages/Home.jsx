import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const Home = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [specialties, setSpecialties] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [filters, setFilters] = useState({ specialty: '', wilaya: '', search: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, specialtiesRes, wilayasRes] = await Promise.all([
          apiClient.get('/stats/public'),
          apiClient.get('/specialties'),
          apiClient.get('/wilayas')
        ]);
        setStats(statsRes.data);
        setSpecialties(specialtiesRes.data);
        setWilayas(wilayasRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search with filters
    const params = new URLSearchParams();
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.wilaya) params.append('wilaya', filters.wilaya);
    if (filters.search) params.append('search', filters.search);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-blue-600 font-semibold">Plateforme médicale algérienne</p>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">Prenez votre rendez-vous médical en ligne</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">Tabib DZ est la plateforme leader pour trouver un médecin vérifié, réserver une consultation et gérer vos rendez-vous en toute simplicité.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/search" className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl">Chercher un médecin</Link>
              <Link to="/register" className="rounded-full border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">Créer un compte</Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-50 to-blue-100 p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">Recherche rapide</h2>
            <form onSubmit={handleSearch} className="mt-8 space-y-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="Nom du médecin, spécialité..."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="wilaya"
                  value={filters.wilaya}
                  onChange={handleFilterChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Wilaya</option>
                  {wilayas.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
                <select
                  name="specialty"
                  value={filters.specialty}
                  onChange={handleFilterChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Spécialité</option>
                  {specialties.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Rechercher</button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.patients}+</p>
              <p className="mt-2 text-slate-300">Patients actifs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.doctors}+</p>
              <p className="mt-2 text-slate-300">Médecins vérifiés</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.appointments}+</p>
              <p className="mt-2 text-slate-300">Rendez-vous</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-blue-600 font-semibold">Pourquoi Tabib DZ</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-900">Une plateforme pensée pour vous</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 hover:shadow-xl transition">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-lg">🔍</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Recherche facile</h3>
            <p className="mt-2 text-slate-600">Trouvez un médecin par spécialité, wilaya, genre ou avis patients vérifiés.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 hover:shadow-xl transition">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-lg">✓</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Médecins vérifiés</h3>
            <p className="mt-2 text-slate-600">Tous nos praticiens sont vérifiés et validés par nos administrateurs.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 hover:shadow-xl transition">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-lg">📅</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Réservation instant</h3>
            <p className="mt-2 text-slate-600">Réservez votre consultation en quelques clics, sans appels téléphoniques.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-600 font-semibold">3 étapes simples</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-900">Comment ça marche</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-4">1</div>
              <h3 className="text-xl font-semibold text-slate-900">Chercher</h3>
              <p className="mt-3 text-slate-600">Explorez notre catalogue de médecins vérifiés par spécialité, région ou genre.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-4">2</div>
              <h3 className="text-xl font-semibold text-slate-900">Réserver</h3>
              <p className="mt-3 text-slate-600">Sélectionnez une date et une heure disponibles qui vous convient.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-4">3</div>
              <h3 className="text-xl font-semibold text-slate-900">Consulter</h3>
              <p className="mt-3 text-slate-600">Gérez et suivez tous vos rendez-vous depuis votre tableau de bord personnel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-white shadow-xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-100 font-semibold">Commencez maintenant</p>
            <h2 className="mt-4 text-4xl font-bold">Prêt à prendre un rendez-vous ?</h2>
            <p className="mt-4 text-lg text-blue-100">Rejoignez des milliers de patients en Algérie qui font confiance à Tabib DZ.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/search" className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">Chercher un médecin</Link>
              <Link to="/register" className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10">S'inscrire</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
