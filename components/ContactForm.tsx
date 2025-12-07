import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { Save, X } from 'lucide-react';

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
  type: 'Mittente' | 'Destinatario';
}

const emptyContact: Contact = {
  id: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  province: '',
  zipCode: '',
  phone: ''
};

export const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSubmit, onCancel, type }) => {
  const [formData, setFormData] = useState<Contact>(initialData || { ...emptyContact, id: crypto.randomUUID() });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-3 py-2 text-indigo-600 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-300 bg-white";
  const labelClasses = "block text-sm font-medium text-indigo-500 mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-indigo-700">
          {initialData ? 'Modifica' : 'Nuovo'} {type}
        </h3>
        <button type="button" onClick={onCancel} className="text-indigo-400 hover:text-indigo-600">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Nome</label>
          <input
            required
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Cognome</label>
          <input
            required
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClasses}>Indirizzo</label>
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Via, Piazza, Numero Civico"
          />
        </div>
        <div>
          <label className={labelClasses}>Città</label>
          <input
            required
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Provincia</label>
            <input
              required
              type="text"
              name="province"
              maxLength={2}
              value={formData.province}
              onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value.toUpperCase() }))}
              className={inputClasses}
              placeholder="MI"
            />
          </div>
          <div>
            <label className={labelClasses}>CAP</label>
            <input
              required
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelClasses}>Telefono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Salva</span>
        </button>
      </div>
    </form>
  );
};