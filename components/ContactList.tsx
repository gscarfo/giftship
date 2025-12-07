import React from 'react';
import { Contact } from '../types';
import { Edit2, Trash2, MapPin, Phone } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  title: string;
}

export const ContactList: React.FC<ContactListProps> = ({ contacts, onEdit, onDelete, title }) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-indigo-50/50 rounded-lg border-2 border-dashed border-indigo-200">
        <p className="text-indigo-400">Nessun {title.toLowerCase()} presente.</p>
        <p className="text-sm text-indigo-300 mt-1">Clicca su "Aggiungi" per iniziare.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="bg-white p-4 rounded-lg shadow border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-indigo-700 truncate">
              {contact.firstName} {contact.lastName}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(contact)}
                className="p-1 text-indigo-500 hover:bg-indigo-50 rounded"
                title="Modifica"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                title="Elimina"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-indigo-600">
            <div className="flex items-start space-x-2">
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-indigo-300" />
              <div>
                <p>{contact.address}</p>
                <p>{contact.zipCode} {contact.city} ({contact.province})</p>
              </div>
            </div>
            {contact.phone && (
              <div className="flex items-center space-x-2">
                <Phone size={16} className="flex-shrink-0 text-indigo-300" />
                <p>{contact.phone}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};