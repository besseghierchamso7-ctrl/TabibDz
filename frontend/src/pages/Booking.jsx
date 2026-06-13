import { useParams } from 'react-router-dom';

const Booking = () => {
  const { id } = useParams();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Réserver un rendez-vous</h1>
        <p className="mt-2 text-slate-600">Docteur sélectionné : {id}</p>
        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <input type="date" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Heure</label>
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3">
              <option>09:00</option>
              <option>10:00</option>
              <option>14:00</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Motif</label>
            <textarea className="w-full rounded-2xl border border-slate-200 px-4 py-3" rows="4" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white">Confirmer la réservation</button>
        </form>
      </div>
    </main>
  );
};

export default Booking;
