import { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/apiClient';
import { useRTL } from '../i18n/useRTL';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';
import Toast from './Toast';

const QueueTracker = ({ doctorId, appointmentId }) => {
  const { t } = useTranslation();
  const isRTL = useRTL();
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  // Fetch queue status periodically
  useEffect(() => {
    const fetchStatus = async () => {
      if (!joined || !doctorId) return;
      try {
        const response = await apiClient.get(`/queues/status/${doctorId}`);
        setQueueStatus(response.data);
      } catch (err) {
        console.error('Error fetching queue status:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [joined, doctorId]);

  // Socket.io for live updates
  const socketRef = useRef(null);
  const authContext = useContext(AuthContext);
  const [currentOffer, setCurrentOffer] = useState(null);
  useEffect(() => {
    if (!joined || !doctorId) return;

    const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : 'http://localhost:10000';
    const token = localStorage.getItem('token');
    const socket = io(baseApi, { transports: ['websocket'], path: '/socket.io', auth: { token } });
    socketRef.current = socket;

    const room = `doctor_${doctorId}_clinic_${appointmentId || 'default'}`;
    socket.on('connect', () => {
      socket.emit('joinRoom', room);
    });

    const refresh = async () => {
      try {
        const res = await apiClient.get(`/queues/status/${doctorId}`);
        setQueueStatus(res.data);
      } catch (err) { console.error(err); }
    };

    socket.on('queue:joined', refresh);
    socket.on('queue:called', refresh);
    socket.on('queue:served', refresh);
    socket.on('waitingList:offer', (match) => {
      try {
        const myId = authContext?.user?._id || authContext?.user?.id;
        if (!myId) return;
        if (String(match.patientId) !== String(myId)) return;
        // show non-blocking toast offer
        setCurrentOffer(match);
      } catch (err) {
        console.error('Error handling waiting list offer:', err);
      }
    });

    return () => {
      socket.emit('leaveRoom', room);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [joined, doctorId, appointmentId]);

  const handleJoinQueue = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/api/queues/join', {
        doctorId,
        appointmentId
      });
      setQueueStatus({
        ...response.data,
        position: response.data.position
      });
      setJoined(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error joining queue');
    } finally {
      setLoading(false);
    }
  };

  if (!joined) {
    return (
      <div className={`rounded-2xl bg-blue-50 p-6 border-2 border-blue-200 ${isRTL ? 'rtl' : 'ltr'}`}>
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{t('queue.queue')}</h3>
        <p className="text-slate-600 mb-4">
          {t('common.loading')}... {t('queue.queueNumber')}
        </p>
        <button
          onClick={handleJoinQueue}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('common.loading') : `${t('queue.queue')} - ${t('common.save')}`}
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl bg-rose-50 p-6 border-2 border-rose-200 ${isRTL ? 'rtl' : 'ltr'}`}>
        <p className="text-rose-700">{error}</p>
      </div>
    );
  }

  if (!queueStatus) {
    return (
      <div className={`rounded-2xl bg-slate-50 p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <p className="text-slate-600">{t('common.loading')}...</p>
      </div>
    );
  }

  const getPositionColor = () => {
    if (queueStatus.position <= 3) return 'bg-emerald-100 border-emerald-200';
    if (queueStatus.position <= 7) return 'bg-amber-100 border-amber-200';
    return 'bg-rose-100 border-rose-200';
  };

  return (
    <div className={`rounded-2xl ${getPositionColor()} p-8 border-2 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Current Number Display */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-600 uppercase mb-2">{t('queue.currentNumber')}</p>
        <div className="text-5xl font-bold text-blue-600">
          {queueStatus.currentNumber || '—'}
        </div>
      </div>

      {/* Your Position */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Toast
            offer={currentOffer}
            onClose={() => setCurrentOffer(null)}
            onAccept={async () => {
              try {
                if (!currentOffer) return;
                await apiClient.post(`/waiting-list/${currentOffer.waitingListId}/accept`);
                setCurrentOffer(null);
                refresh();
                alert('Offer accepted');
              } catch (err) {
                console.error(err);
                alert('Failed to accept offer');
              }
            }}
            onDecline={async () => {
              try {
                if (!currentOffer) return;
                await apiClient.post(`/waiting-list/${currentOffer.waitingListId}/decline`);
                setCurrentOffer(null);
                refresh();
                alert('Offer declined');
              } catch (err) {
                console.error(err);
                alert('Failed to decline offer');
              }
            }}
          />
          <p className="text-xs font-semibold text-slate-600 uppercase">{t('queue.positionInQueue')}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{queueStatus.position}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase">{t('queue.patientsAhead')}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{Math.max(0, queueStatus.position - 1)}</p>
        </div>
      </div>

      {/* Estimated Wait Time */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-slate-600 uppercase mb-2">{t('queue.estimatedWaitTime')}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600">{queueStatus.estimatedWaitTime || 0}</span>
          <span className="text-lg text-slate-600">{t('queue.minutes')}</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {queueStatus.totalInQueue} {t('queue.patientsAhead')} {t('queue.queue')}
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm ${
          queueStatus.position <= 3
            ? 'bg-emerald-500 text-white'
            : queueStatus.position <= 7
            ? 'bg-amber-500 text-white'
            : 'bg-rose-500 text-white'
        }`}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          {queueStatus.queueStatus === 'open' ? '🟢 Active' : '🟡 Paused'}
        </span>
        <button
          onClick={() => setJoined(false)}
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          {t('common.cancel')}
        </button>
      </div>

      {/* Live Updates Info */}
      <p className="text-xs text-slate-500 mt-4 text-center">
        ⏱️ {t('common.loading')}...
      </p>
    </div>
  );
};

export default QueueTracker;
