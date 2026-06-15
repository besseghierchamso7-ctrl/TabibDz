import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const DoctorQueuePanel = ({ doctorId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    if (!doctorId) return;
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/queues/doctor/${doctorId}/summary`);
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching queue summary:', err);
      setError(err.response?.data?.message || 'Impossible de charger la file d\'attente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 15000);
    return () => clearInterval(interval);
  }, [doctorId]);

  const handleCallNext = async () => {
    if (!doctorId) return;
    setActionLoading(true);
    setError('');
    try {
      await apiClient.post('/api/queues/call-next', { doctorId });
      await fetchSummary();
    } catch (err) {
      console.error('Error calling next patient:', err);
      setError(err.response?.data?.message || 'Impossible de passer au patient suivant');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!summary?.hasQueue) return 'Fermée';
    return summary.queueStatus === 'open' ? 'Active' : 'En pause';
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">File d'attente intelligente</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Suivi de la file</h2>
          <p className="mt-2 text-sm text-slate-600">Suivez le patient en cours, les patients restants et le temps d'attente estimé.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">{getStatusBadge()}</span>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-slate-600">Chargement...</div>
      ) : error ? (
        <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : !summary?.hasQueue ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
          <p className="font-medium">Aucune file d'attente active pour le moment.</p>
          <p className="mt-2 text-sm">Un patient doit rejoindre la file ou une file doit être ouverte pour commencer.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Position patient</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.nextQueueNumber || '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Patients restants</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.remainingPatients}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Numéro actuel</p>
              <p className="mt-3 text-3xl font-semibold text-blue-600">{summary.currentNumber || '—'}</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Attente estimée</p>
            <p className="mt-2 text-lg font-semibold text-blue-600">{summary.estimatedWaitTime} min</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-800">Vue d'ensemble de la file</p>
            <p className="mt-3 text-sm text-slate-600">Actuellement, {summary.totalInQueue} patient{summary.totalInQueue > 1 ? 's' : ''} attendent dans cette file.</p>
          </div>

          <button
            type="button"
            onClick={handleCallNext}
            disabled={actionLoading || summary.remainingPatients === 0}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {actionLoading ? 'En cours...' : 'Passer au patient suivant'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorQueuePanel;
