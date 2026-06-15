import React from 'react';

export default function Toast({ offer, onAccept, onDecline, onClose }) {
  if (!offer) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white shadow-lg rounded-lg border p-4">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="font-semibold">New Offer</div>
          <div className="text-sm text-gray-600">{offer.message || `Offered slot: ${offer.offeredSlot || offer.slot || ''}`}</div>
        </div>
        <button className="ml-2 text-gray-500" onClick={onClose}>✕</button>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={onAccept}>Accept</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={onDecline}>Decline</button>
      </div>
    </div>
  );
}
