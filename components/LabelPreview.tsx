import React, { forwardRef } from 'react';
import { Label, LabelStyle } from '../types';
import { Gift, Package, MapPin, Send } from 'lucide-react';

interface LabelPreviewProps {
  label: Label;
  style: LabelStyle;
  className?: string;
}

// A5 Dimensions: 148mm x 210mm
const A5_STYLE = {
  width: '148mm',
  height: '210mm',
  padding: '10mm',
  boxSizing: 'border-box' as const,
  overflow: 'hidden'
};

export const LabelPreview = forwardRef<HTMLDivElement, LabelPreviewProps>(({ label, style, className = '' }, ref) => {
  const { senderSnapshot: sender, recipientSnapshot: recipient } = label;

  // 1. STYLE: CLASSIC (L'originale blu)
  if (style === 'classic') {
    return (
      <div 
        ref={ref}
        className={`bg-white text-gray-800 relative shadow-xl ${className}`}
        style={A5_STYLE}
      >
        {/* Sender */}
        <div className="absolute top-10 left-10 max-w-[50%] border-b pb-2 border-indigo-200">
          <p className="text-xs text-indigo-500 uppercase font-bold mb-1 tracking-wider">Mittente:</p>
          <div className="text-sm font-medium leading-tight text-gray-600">
            <p>{sender.firstName} {sender.lastName}</p>
            <p>{sender.address}</p>
            <p>{sender.zipCode} {sender.city} ({sender.province})</p>
            {sender.phone && <p className="text-xs mt-1">Tel: {sender.phone}</p>}
          </div>
        </div>

        {/* Recipient */}
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

        {/* Footer */}
        <div className="absolute bottom-10 left-10 right-10 text-center border-t border-dashed border-gray-300 pt-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Etichetta di Spedizione - GiftShip App</p>
        </div>
      </div>
    );
  }

  // 2. STYLE: MODERN (Sfondo scuro, alto contrasto)
  if (style === 'modern') {
    return (
      <div 
        ref={ref}
        className={`bg-white text-gray-900 relative shadow-xl ${className}`}
        style={A5_STYLE}
      >
        <div className="h-full border-8 border-gray-900 flex flex-col justify-between p-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6">
             <div>
                <span className="bg-gray-900 text-white text-xs px-2 py-1 font-bold uppercase">Mittente</span>
                <div className="mt-2 text-sm font-semibold">
                  <p>{sender.firstName} {sender.lastName}</p>
                  <p>{sender.address}</p>
                  <p>{sender.zipCode} {sender.city} ({sender.province})</p>
                </div>
             </div>
             <Package size={32} className="text-gray-900" />
          </div>

          {/* Main Body */}
          <div className="flex-1 flex flex-col justify-center">
             <span className="text-gray-500 text-sm uppercase tracking-[0.2em] mb-4 block">Destinazione</span>
             <div className="bg-gray-900 text-white p-8 shadow-2xl transform -rotate-1">
                <p className="text-3xl font-bold mb-2">{recipient.firstName} {recipient.lastName}</p>
                <p className="text-xl opacity-90">{recipient.address}</p>
                <p className="text-2xl font-bold mt-1">{recipient.zipCode} {recipient.city} ({recipient.province})</p>
             </div>
             {recipient.phone && (
               <div className="mt-6 flex items-center space-x-2 text-gray-900 font-bold">
                 <div className="w-8 h-[2px] bg-gray-900"></div>
                 <span>TEL: {recipient.phone}</span>
               </div>
             )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs font-mono uppercase border-t-2 border-gray-900 pt-4">
             Priority Shipping &bull; GiftShip Express
          </div>
        </div>
      </div>
    );
  }

  // 3. STYLE: MINIMAL (Solo testo, molto pulito, risparmio inchiostro)
  if (style === 'minimal') {
    return (
      <div 
        ref={ref}
        className={`bg-white text-black relative shadow-xl font-mono ${className}`}
        style={A5_STYLE}
      >
        {/* Sender - Top Left */}
        <div className="absolute top-12 left-12 p-4 border border-black">
          <p className="text-[10px] uppercase mb-1 border-b border-black inline-block">From:</p>
          <div className="text-sm leading-tight">
            <p>{sender.firstName} {sender.lastName}</p>
            <p>{sender.address}</p>
            <p>{sender.zipCode} {sender.city} {sender.province}</p>
          </div>
        </div>

        {/* Recipient - Large Center */}
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 text-center px-10">
          <div className="inline-block text-left">
            <p className="text-xs uppercase mb-4 pl-1">Ship To:</p>
            <p className="text-4xl font-bold mb-2 tracking-tighter">{recipient.firstName} {recipient.lastName}</p>
            <p className="text-2xl mb-1">{recipient.address}</p>
            <p className="text-3xl font-bold">{recipient.zipCode} {recipient.city} {recipient.province}</p>
            {recipient.phone && <p className="text-sm mt-4 border-t border-black inline-block pt-1">Tel: {recipient.phone}</p>}
          </div>
        </div>

        {/* Corner Markers */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-black"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-black"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-black"></div>
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-black"></div>
      </div>
    );
  }

  // 4. STYLE: FESTIVE (Colori caldi, etichetta regalo)
  if (style === 'festive') {
    return (
      <div 
        ref={ref}
        className={`bg-red-50 text-red-900 relative shadow-xl ${className}`}
        style={A5_STYLE}
      >
        <div className="h-full border-4 border-red-800 border-dashed rounded-xl p-8 flex flex-col relative overflow-hidden">
          
          {/* Decor corners */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-200 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-100 rounded-full opacity-50"></div>

          <div className="flex items-center space-x-2 mb-8 relative z-10">
            <Gift className="text-red-600" size={24} />
            <span className="font-serif italic text-xl text-red-600">Special Delivery</span>
          </div>

          <div className="bg-white/80 p-4 rounded-lg shadow-sm mb-12 backdrop-blur-sm relative z-10 w-2/3">
             <span className="text-xs font-bold text-red-400 uppercase">Da:</span>
             <p className="font-serif text-lg">{sender.firstName} {sender.lastName}</p>
             <p className="text-sm text-red-800">{sender.city}</p>
          </div>

          <div className="relative z-10 text-center mt-4">
             <span className="font-serif italic text-2xl text-red-500 mb-2 block">Per:</span>
             <div className="bg-white border-2 border-red-100 p-8 rounded-xl shadow-lg inline-block w-full">
               <p className="text-3xl font-bold text-red-900 mb-2">{recipient.firstName} {recipient.lastName}</p>
               <p className="text-xl text-red-800">{recipient.address}</p>
               <p className="text-2xl font-bold text-red-900 mt-1">{recipient.zipCode} {recipient.city}</p>
               <p className="text-lg text-red-700 font-serif mt-1">{recipient.province}</p>
             </div>
          </div>

          <div className="mt-auto text-center relative z-10">
            <p className="text-amber-600 font-serif italic">Handle with care &bull; Open with a smile</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

LabelPreview.displayName = 'LabelPreview';
