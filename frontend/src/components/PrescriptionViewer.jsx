import React from 'react';
import { useTranslation } from 'react-i18next';

const PrescriptionViewer = ({ prescription }) => {
  const { t } = useTranslation();
  if (!prescription) return null;

  const { medications = [], notes, issuedAt, validUntil, qrHash, doctor } = prescription;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{doctor?.user?.firstName} {doctor?.user?.lastName}</h3>
          <p className="text-sm text-slate-500">{doctor?.specialty?.name}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>{new Date(issuedAt).toLocaleString()}</div>
          {validUntil && <div>{t('prescription.validUntil')}: {new Date(validUntil).toLocaleDateString()}</div>}
        </div>
      </div>

      <ul className="mb-3">
        {medications.map((m, idx) => (
          <li key={idx} className="mb-2">
            <div className="font-medium">{m.name}</div>
            <div className="text-sm text-slate-600">{m.dosage} {m.instructions ? `· ${m.instructions}` : ''}</div>
          </li>
        ))}
      </ul>

      {notes && <div className="text-sm text-slate-700 mb-3">{notes}</div>}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">QR: {qrHash || '—'}</div>
        <a
          href={prescription.pdfUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {t('prescription.viewPdf')}
        </a>
      </div>
    </div>
  );
};

export default PrescriptionViewer;
