import React, { forwardRef } from 'react';
import { Label } from '../types';

interface LabelPreviewProps {
  label: Label;
  className?: string;
}

// A5 Dimensions: 148mm x 210mm
// Using Tailwind arbitrary values to enforcing sizing for print/preview.
// Scale down for preview if needed by parent.

export const LabelPreview = forwardRef<HTMLDivElement, LabelPreviewProps>(({ label, className = '' }, ref) => {
  const { senderSnapshot: sender, recipientSnapshot: recipient } = label;

  return (
    <div 
      ref={ref}
      className={`bg-white text-gray-800 relative shadow-xl ${className}`}
      style={{
        width: '148mm',
        height: '210mm',
        padding: '10mm',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Sender - Top Left - Small */}
      <div className="absolute top-10 left-10 max-w-[50%] border-b pb-2 border-indigo-200">
        <p className="text-xs text-indigo-500 uppercase font-bold mb-1 tracking-wider">Mittente:</p>
        <div className="text-sm font-medium leading-tight text-gray-600">
          <p>{sender.firstName} {sender.lastName}</p>
          <p>{sender.address}</p>
          <p>{sender.zipCode} {sender.city} ({sender.province})</p>
          {sender.phone && <p className="text-xs mt-1">Tel: {sender.phone}</p>}
        </div>
      </div>

      {/* Recipient - Middle Right - Large */}
      <div className="absolute top-1/2 left-1/2 w-full transform -translate-y-1/2 -translate-x-1/4 pl-8">
        <div className="border-4 border-indigo-600 p-6 rounded-lg bg-indigo-50 bg-opacity-50">
           <p className="text-sm text-indigo-500 uppercase font-bold mb-3 tracking-wider">Destinatario:</p>
           <div className="text-indigo-900 leading-tight">
             <p className="text-3xl font-bold mb-2">{recipient.firstName} {recipient.lastName}</p>
             <p className="text-xl mb-1">{recipient.address}</p>
             <p className="text-2xl font-semibold">{recipient.zipCode} {recipient.city} <span className="text-xl font-normal">({recipient.province})</span></p>
             {recipient.phone && <p className="text-lg mt-3 text-indigo-800">Tel: {recipient.phone}</p>}
           </div>
        </div>
      </div>

      {/* Footer / Notes */}
      <div className="absolute bottom-10 left-10 right-10 text-center border-t border-dashed border-gray-300 pt-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Etichetta di Spedizione - GiftShip App</p>
      </div>
    </div>
  );
});

LabelPreview.displayName = 'LabelPreview';