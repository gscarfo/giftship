import { Contact, Label } from '../types';

export const storageService = {
  setup: async () => {
    const res = await fetch('/api/setup');
    if (!res.ok) throw new Error(`Setup failed: ${res.status}`);
  },

  getSenders: async (): Promise<Contact[]> => {
    const res = await fetch('/api/contacts?type=sender');
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  },

  saveContact: async (contact: Contact, type: 'sender' | 'recipient') => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, type: type === 'sender' ? 'sender' : 'recipient' })
    });
    if (!res.ok) throw new Error(`Save Error: ${res.status}`);
  },

  deleteContact: async (id: string) => {
    const res = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete Error: ${res.status}`);
  },

  getRecipients: async (): Promise<Contact[]> => {
    const res = await fetch('/api/contacts?type=recipient');
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  },

  getLabels: async (): Promise<Label[]> => {
    const res = await fetch('/api/labels');
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  },

  addLabel: async (label: Label) => {
    const res = await fetch('/api/labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label)
    });
    if (!res.ok) throw new Error(`Save Error: ${res.status}`);
  },

  deleteLabel: async (id: string) => {
    const res = await fetch(`/api/labels?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete Error: ${res.status}`);
  }
};