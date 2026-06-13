import { useParams, Link } from 'react-router-dom';

const DoctorProfile = () => {
  const { id } = useParams();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-28 w-28 rounded-3xl bg-slate-100" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dr. Yasmine Ben</h1>
              <p className="mt-2 text-slate-600">Dermatologie • Alger • 4.9</p>
            </div>
          </div>
          <div className="mt-8 space-y-4 text-slate-600">
            <p>Spécialisée en dermatologie esthétique et maladies cutanées, Dr. Yasmine propose des consultations en cabinet et en téléconsultation.</p>
            <p>Disponibilité : Lun, Mer, Ven</p>
            <p>Tarif : 4500 DA</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={`/booking/${id}`} className="rounded-full bg-blue-600 px-6 py-3 text-white">Réserver</Link>
          </div>
        </section>
        <aside className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Informations</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            <li>Wilaya : Alger</li>
            <li>Langues : Français, Arabe</li>
            <li>Diplôme : Médecine Générale, Dermatologie</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default DoctorProfile;
