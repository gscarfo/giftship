import React, { useState, useRef } from 'react';
import { Contact, Label } from '../types';
import { LabelPreview } from './LabelPreview';
import { Trash2, Printer, Download, Plus, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LabelSectionProps {
  senders: Contact[];
  recipients: Contact[];
  labels: Label[];
  onAddLabel: (label: Label) => void;
  onDeleteLabel: (id: string) => void;
}

export const LabelSection: React.FC<LabelSectionProps> = ({ senders, recipients, labels, onAddLabel, onDeleteLabel }) => {
  const [selectedSenderId, setSelectedSenderId] = useState<string>('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [viewLabel, setViewLabel] = useState<Label | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    const sender = senders.find(s => s.id === selectedSenderId);
    const recipient = recipients.find(r => r.id === selectedRecipientId);

    if (sender && recipient) {
      const newLabel: Label = {
        id: crypto.randomUUID(),
        senderId: sender.id,
        recipientId: recipient.id,
        senderSnapshot: sender,
        recipientSnapshot: recipient,
        createdAt: Date.now()
      };
      onAddLabel(newLabel);
      setViewLabel(newLabel); // Auto view newly created
      // Reset dropdowns
      setSelectedSenderId('');
      setSelectedRecipientId('');
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      // A5 size in mm: 148 x 210
      const pdf = new jsPDF('p', 'mm', 'a5');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`etichetta_${viewLabel?.recipientSnapshot.lastName}_${viewLabel?.recipientSnapshot.firstName}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Errore durante la generazione del PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Creator Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Nuova Etichetta</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona Mittente</label>
            <select
              value={selectedSenderId}
              onChange={(e) => setSelectedSenderId(e.target.value)}
              className="w-full px-3 py-2 text-indigo-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">-- Seleziona --</option>
              {senders.map(s => (
                <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona Destinatario</label>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full px-3 py-2 text-indigo-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">-- Seleziona --</option>
              {recipients.map(r => (
                <option key={r.id} value={r.id}>{r.lastName} {r.firstName}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={!selectedSenderId || !selectedRecipientId}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>Crea Etichetta</span>
          </button>
        </div>
      </div>

      {/* List and Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* List of Labels */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-900">Etichette Recenti</h3>
          {labels.length === 0 ? (
            <p className="text-gray-500 italic">Nessuna etichetta creata.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {labels.slice().reverse().map(label => (
                <div 
                  key={label.id} 
                  onClick={() => setViewLabel(label)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    viewLabel?.id === label.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-indigo-900 text-sm">A: {label.recipientSnapshot.firstName} {label.recipientSnapshot.lastName}</p>
                      <p className="text-xs text-gray-500">Da: {label.senderSnapshot.firstName} {label.senderSnapshot.lastName}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(label.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteLabel(label.id); if(viewLabel?.id === label.id) setViewLabel(null); }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 bg-gray-200 p-8 rounded-xl flex flex-col items-center justify-center min-h-[500px]">
          {viewLabel ? (
            <div className="flex flex-col items-center space-y-6 w-full">
              <div className="flex space-x-4 no-print">
                <button 
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  <Printer size={18} />
                  <span>Stampa</span>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <Download size={18} />
                  <span>PDF</span>
                </button>
              </div>

              {/* The printable component wrapper */}
              <div className="printable-area transform scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top shadow-2xl">
                 <LabelPreview ref={printRef} label={viewLabel} />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Eye size={48} className="mx-auto mb-2 opacity-50" />
              <p>Seleziona o crea un'etichetta per visualizzarne l'anteprima</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};