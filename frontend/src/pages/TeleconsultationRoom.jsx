import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TeleconsultationRoom() {
  const { t } = useTranslation();
  const { roomName } = useParams();
  const [roomUrl, setRoomUrl] = useState('');

  useEffect(() => {
    if (!roomName) return;
    // Use Jitsi public instance for MVP
    const url = `https://meet.jit.si/${encodeURIComponent(roomName)}`;
    setRoomUrl(url);
  }, [roomName]);

  if (!roomName) return <div className="p-6">{t('teleconsult.invalidRoom')}</div>;

  return (
    <div className="p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">{t('teleconsult.room')}: {roomName}</h2>
      <div className="w-full h-[80vh] border rounded overflow-hidden">
        <iframe
          src={roomUrl}
          title={`Jitsi - ${roomName}`}
          width="100%"
          height="100%"
          allow="camera; microphone; fullscreen; display-capture"
          frameBorder="0"
        />
      </div>
    </div>
  );
}
