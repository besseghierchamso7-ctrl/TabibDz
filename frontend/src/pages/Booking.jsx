import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ date: '', time: '', reason: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState({ dateRanges: [], availability: null });

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const [{ data: doctorData }, { data: availabilityData }] = await Promise.all([
          apiClient.get(`/doctors/${id}`),
          apiClient.get(`/doctors/${id}/availability?days=14`)
        ]);
        setDoctor(doctorData);
        setAvailability(availabilityData);
        if (availabilityData.dateRanges?.length) {
          setFormData((prev) => ({ ...prev, date: availabilityData.dateRanges[0].date, time: availabilityData.dateRanges[0].times[0] || '' }));
        }
      } catch (err) {
        console.error('Error fetching doctor or availability:', err);
        setError('Impossible de charger les informations du médecin ou ses créneaux disponibles.');
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!user) {
      setError('Vous devez être connecté pour réserver');
      setIsLoading(false);
      return;
    }

    try {
      const scheduledAt = `${formData.date}T${formData.time}:00.000Z`;
      await apiClient.post('/appointments', {
        doctorId: id,
        scheduledAt,
        reason: formData.reason,
        price: doctor?.consultationPrice || doctor?.price || 3000
      });
      alert('Rendez-vous réservé avec succès!');
      navigate('/dashboard/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Réserver une consultation</h1>
          <p className="mt-2 text-blue-100">Choisissez votre créneau préféré</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
          <div className="mb-8 border-b border-slate-200 pb-8">
            {doctor ? (
              <>
                <h2 className="text-xl font-semibold text-slate-900">Dr. {doctor.user?.firstName || doctor.firstName} {doctor.user?.lastName || doctor.lastName}</h2>
                <p className="mt-2 text-slate-600">{doctor.specialty?.name || doctor.specialty} • {doctor.wilaya?.name || doctor.wilaya} • {doctor.rating || 0} ⭐</p>
                <p className="mt-3 text-2xl font-bold text-blue-600">{doctor.consultationPrice || doctor.consultationFee || 4500} DA</p>
              </>
            ) : (
              <p className="text-slate-600">Chargement des informations du médecin...</p>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}

          {!user && (
            <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-700">Vous devez <a href="/login" className="font-semibold underline">vous connecter</a> pour réserver un rendez-vous</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Date de consultation</label>
              <select
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
              >
                <option value="">-- Sélectionner une date --</option>
                {availability.dateRanges?.map((range) => (
                  <option key={range.date} value={range.date}>
                    {new Date(range.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-600">Sélectionnez une date disponible affichée par créneaux.</p>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Heure préférée</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                disabled={!formData.date || !availability.dateRanges?.length}
              >
                <option value="">-- Sélectionner une heure --</option>
                {availability.dateRanges
                  .find((range) => range.date === formData.date)
                  ?.times.map((time) => (
                    <option key={`${formData.date}-${time}`} value={time}>{time}</option>
                  ))}
              </select>
              {!formData.date && (
                <p className="mt-2 text-xs text-slate-600">Choisissez d'abord une date pour voir les créneaux horaires disponibles.</p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Motif de la consultation</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none transition resize-none"
                placeholder="Décrivez brièvement votre motif de consultation..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Réservation en cours...' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              ✓ Vous recevrez une confirmation par SMS et email<br/>
              ✓ Vous pourrez modifier ou annuler jusqu'à 24h avant<br/>
              ✓ La consultation se fera en ligne ou au cabinet
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
