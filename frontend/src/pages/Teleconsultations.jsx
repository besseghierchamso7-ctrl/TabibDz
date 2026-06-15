import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Teleconsultations() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/api/teleconsultations/my');
        setSessions(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="p-6">{t('common.loading')}...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('teleconsult.title')}</h2>
      {sessions.length === 0 && <p>{t('teleconsult.noSessions')}</p>}
      <div className="grid gap-4">
        {sessions.map(s => (
          <div key={s._id} className="p-4 bg-white rounded shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{s.doctor?.user?.firstName} {s.doctor?.user?.lastName}</div>
                <div className="text-sm text-slate-500">{new Date(s.scheduledAt).toLocaleString()}</div>
              </div>
              <div>
                <Link to={`/teleconsultations/room/${s.roomName}`} className="text-blue-600 hover:underline">{t('teleconsult.join')}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
