import React, { useState, useEffect } from 'react';
import { Package, Users, Truck, Tag, Plus, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Section, Contact, Label } from './types';
import { storageService } from './services/storageService';
import { ContactList } from './components/ContactList';
import { ContactForm } from './components/ContactForm';
import { LabelSection } from './components/LabelSection';

type DbStatus = 'connecting' | 'connected' | 'error';

function App() {
  const [activeSection, setActiveSection] = useState<Section>(Section.LABELS);
  
  // Data State
  const [senders, setSenders] = useState<Contact[]>([]);
  const [recipients, setRecipients] = useState<Contact[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus>('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // UI State for Forms
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

  // Load Initial Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ensure DB tables exist before querying
      await storageService.setup();

      const [s, r, l] = await Promise.all([
        storageService.getSenders(),
        storageService.getRecipients(),
        storageService.getLabels()
      ]);
      setSenders(s);
      setRecipients(r);
      setLabels(l);
      setDbStatus('connected');
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error fetching data", error);
      
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const is404 = error.message && error.message.includes('404');

      if (isLocalhost && is404) {
         setErrorMessage('In locale le API non funzionano. Pubblica su Vercel per testare.');
         // We set status to error, but the message explains it's expected locally
      } else {
         setErrorMessage(error.message || 'Errore di connessione');
      }
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Contacts (Generic for Senders/Recipients)
  const handleSaveContact = async (contact: Contact) => {
    setLoading(true);
    const type = activeSection === Section.SENDERS ? 'sender' : 'recipient';
    
    try {
      await storageService.saveContact(contact, type);
      await fetchData(); // Refresh all data
      setIsEditing(false);
      setEditingContact(undefined);
    } catch (error: any) {
      alert("Errore durante il salvataggio. Controlla la connessione al database.");
      setDbStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo contatto?")) return;
    setLoading(true);
    try {
      await storageService.deleteContact(id);
      await fetchData();
    } catch (error: any) {
      alert("Errore durante l'eliminazione");
      setDbStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (contact?: Contact) => {
    setEditingContact(contact);
    setIsEditing(true);
  };

  // Handlers for Labels
  const handleAddLabel = async (label: Label) => {
    setLoading(true);
    try {
      await storageService.addLabel(label);
      await fetchData();
    } catch (error: any) {
      alert("Errore salvataggio etichetta");
      setDbStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (!window.confirm("Eliminare questa etichetta?")) return;
    setLoading(true);
    try {
      await storageService.deleteLabel(id);
      await fetchData();
    } catch (error: any) {
      alert("Errore eliminazione etichetta");
      setDbStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigation Items
  const navItems = [
    { id: Section.LABELS, label: 'Etichette', icon: Tag },
    { id: Section.SENDERS, label: 'Mittenti', icon: Package },
    { id: Section.RECIPIENTS, label: 'Destinatari', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-indigo-800">
      
      {/* Sidebar */}
      <nav className="bg-indigo-800 text-white w-full md:w-64 flex-shrink-0 flex flex-col no-print">
        <div className="p-6 flex items-center space-x-3 border-b border-indigo-700">
          <Truck className="text-indigo-200" size={28} />
          <h1 className="text-xl font-bold tracking-tight">GiftShip</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Status & Footer */}
        <div className="p-4 border-t border-indigo-700">
           <div className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
             dbStatus === 'connected' ? 'bg-indigo-900/50 text-emerald-400' : 
             dbStatus === 'error' ? 'bg-red-900/30 text-red-400' : 
             'bg-indigo-900/50 text-yellow-400'
           }`}>
              {dbStatus === 'connected' && <CheckCircle2 size={16} />}
              {dbStatus === 'error' && (
                <div className="group relative flex items-center">
                   <AlertCircle size={16} className="cursor-help" />
                   {/* Tooltip always visible if it's the specific localhost error, otherwise on hover */}
                   <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs p-2 rounded z-50 transition-opacity ${errorMessage.includes('locale') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} pointer-events-none`}>
                     {errorMessage}
                   </div>
                </div>
              )}
              {dbStatus === 'connecting' && <Loader2 size={16} className="animate-spin" />}
              
              <span className="text-xs font-medium">
                {dbStatus === 'connected' && 'DB Connesso'}
                {dbStatus === 'error' && (errorMessage.includes('locale') ? 'Info Localhost' : 'Errore DB')}
                {dbStatus === 'connecting' && 'Connessione...'}
              </span>
           </div>
           
           <div className="text-xs text-indigo-300 text-center mt-3 opacity-75">
             &copy; {new Date().getFullYear()} GiftShip App
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto h-screen relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100 overflow-hidden z-50">
            <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
          </div>
        )}
        
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-5 flex justify-between items-center no-print">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-indigo-800">
              {activeSection === Section.LABELS && 'Gestione Etichette'}
              {activeSection === Section.SENDERS && 'Gestione Mittenti'}
              {activeSection === Section.RECIPIENTS && 'Gestione Destinatari'}
            </h2>
            {loading && <Loader2 className="animate-spin text-indigo-400" size={20} />}
          </div>
          
          {activeSection !== Section.LABELS && !isEditing && (
            <button
              onClick={() => startEdit()}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Aggiungi {activeSection === Section.SENDERS ? 'Mittente' : 'Destinatario'}</span>
            </button>
          )}
        </header>

        <div className="p-8">
          {/* Label Section */}
          {activeSection === Section.LABELS && (
            <LabelSection 
              senders={senders} 
              recipients={recipients} 
              labels={labels}
              onAddLabel={handleAddLabel}
              onDeleteLabel={handleDeleteLabel}
            />
          )}

          {/* Contact Sections (Senders/Recipients) */}
          {(activeSection === Section.SENDERS || activeSection === Section.RECIPIENTS) && (
            <>
              {isEditing ? (
                <div className="max-w-2xl mx-auto">
                  <ContactForm 
                    type={activeSection === Section.SENDERS ? 'Mittente' : 'Destinatario'}
                    initialData={editingContact}
                    onSubmit={handleSaveContact}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                <ContactList 
                  title={activeSection === Section.SENDERS ? 'Mittente' : 'Destinatario'}
                  contacts={activeSection === Section.SENDERS ? senders : recipients}
                  onEdit={startEdit}
                  onDelete={handleDeleteContact}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;