import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import PrescriptionViewer from '../components/PrescriptionViewer';
import { useTranslation } from 'react-i18next';

export default function MyPrescriptions() {
  const { t } = useTranslation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/api/prescriptions/my');
        setPrescriptions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">{t('common.loading')}...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('prescription.myPrescriptions')}</h2>
      {prescriptions.length === 0 && <p>{t('prescription.noPrescriptions')}</p>}
      <div className="grid gap-4">
        {prescriptions.map(p => (
          <PrescriptionViewer key={p._id} prescription={p} />
        ))}
      </div>
    </div>
  );
}
