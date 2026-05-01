import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { Plus, Bell, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

const Reminders = () => {
  const { reminders, addReminder, deleteReminder, lang } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 className="heading-xl">Mes <span className="text-gradient">Rappels</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Ne manquez aucune échéance importante.</p>
        </div>
        <button className="btn-premium" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          {t(lang, 'add_reminder')}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {sortedReminders.map(reminder => (
          <div key={reminder.id} className="glass-card" style={{ borderLeft: '6px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255, 140, 0, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                <Bell size={24} />
              </div>
              <button 
                onClick={() => deleteReminder(reminder.id)}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '5px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{reminder.title}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>{new Date(reminder.date).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <Clock size={14} />
                <span>{new Date(reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {new Date(reminder.date) < new Date() && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '12px', fontWeight: '600' }}>
                <AlertCircle size={14} />
                <span>Échéance passée</span>
              </div>
            )}
          </div>
        ))}

        {sortedReminders.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <Bell size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <p>Aucun rappel programmé.</p>
          </div>
        )}
      </div>

      {showModal && <AddReminderModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const AddReminderModal = ({ onClose }) => {
  const { addReminder } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return alert('Titre et date requis');
    addReminder(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <h3 className="heading-xl" style={{ textAlign: 'center', marginBottom: '32px' }}>
          Nouveau <span className="text-gradient">Rappel</span>
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Objet du rappel</label>
            <input 
              type="text" className="input" placeholder="Ex: Appeler client Dupont" required
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="input-label">Date & Heure</label>
            <input 
              type="datetime-local" className="input" required
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="button" className="btn-premium" style={{ flex: 1, background: 'var(--bg-app)', color: 'var(--text-muted)', boxShadow: 'none' }} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-premium" style={{ flex: 2, justifyContent: 'center' }}>
              Programmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reminders;
