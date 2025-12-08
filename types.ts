export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
}

export interface Label {
  id: string;
  senderId: string;
  recipientId: string;
  senderSnapshot: Contact; // Store snapshot in case contact is deleted/changed
  recipientSnapshot: Contact;
  createdAt: number;
}

export enum Section {
  SENDERS = 'SENDERS',
  RECIPIENTS = 'RECIPIENTS',
  LABELS = 'LABELS'
}

export type ContactType = 'sender' | 'recipient';

export type LabelStyle = 'classic' | 'modern' | 'minimal' | 'festive';
