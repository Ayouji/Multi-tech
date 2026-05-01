import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { Plus, Trash2, Mail, Phone, MapPin, Search, UserPlus } from 'lucide-react';

const Clients = () => {
  const { clients, lang, deleteClient, addClient } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const typeColors = {
    mon_client: 'var(--primary)',
    freelance: '#3B82F6',
    autre: '#64748b'
  };

  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 className="heading-xl">Base <span className="text-gradient">Clients</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Gérez vos relations et coordonnées clients.</p>
        </div>
        <button className="btn-premium" onClick={() => setShowModal(true)}>
          <UserPlus size={20} />
          {t(lang, 'add_client')}
        </button>
      </header>

      <div className="glass-card" style={{ marginBottom: '40px', padding: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Rechercher un client par nom ou ville..." 
            style={{ marginBottom: 0, paddingLeft: '45px', background: 'var(--bg-app)', border: 'none' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredClients.map(client => (
          <div key={client.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '4px', 
              background: typeColors[client.type_client] 
            }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{client.nom}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {client.ville}
                </div>
              </div>
              <div style={{ 
                background: `${typeColors[client.type_client]}15`, 
                color: typeColors[client.type_client], 
                fontSize: '10px', 
                fontWeight: 'bold', 
                padding: '4px 10px', 
                borderRadius: '100px',
                textTransform: 'uppercase'
              }}>
                {client.type_client.replace('_', ' ')}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', marginBottom: '20px' }}>
              {client.email ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <Mail size={16} color="var(--text-muted)" /> 
                  <span style={{ fontWeight: '500' }}>{client.email}</span>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Pas d'email</div>
              )}
              {client.telephone ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <Phone size={16} color="var(--text-muted)" /> 
                  <span style={{ fontWeight: '500' }}>{client.telephone}</span>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Pas de téléphone</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => { if(confirm('Supprimer ce client ?')) deleteClient(client.id) }}
                className="btn"
                style={{ background: 'transparent', color: '#EF4444', padding: '8px', fontSize: '12px' }}
              >
                <Trash2 size={18} style={{ marginRight: '6px' }} />
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '80px 0' }}>
            <Users size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <p>Aucun client trouvé pour votre recherche.</p>
          </div>
        )}
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const AddClientModal = ({ onClose }) => {
  const { addClient, lang } = useAppContext();
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    type_client: 'mon_client',
    email: '',
    telephone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.ville) return alert('Nom et ville requis');
    addClient(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <h3 className="heading-xl" style={{ textAlign: 'center', marginBottom: '32px' }}>
          Nouveau <span className="text-gradient">Client</span>
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Nom complet ou Entreprise</label>
            <input 
              type="text" className="input" placeholder="Ex: Jean Dupont" required
              value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label className="input-label">Ville</label>
              <input 
                type="text" className="input" placeholder="Ex: Paris" required
                value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})}
              />
            </div>
            <div>
              <label className="input-label">Catégorie</label>
              <select 
                className="input" 
                value={formData.type_client} onChange={e => setFormData({...formData, type_client: e.target.value})}
              >
                <option value="mon_client">Mon client</option>
                <option value="freelance">Freelance</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Adresse Email</label>
            <input 
              type="email" className="input" placeholder="client@exemple.com"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="input-label">Numéro de Téléphone</label>
            <input 
              type="tel" className="input" placeholder="+33 6 ..."
              value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="button" className="btn-premium" style={{ flex: 1, background: 'var(--bg-app)', color: 'var(--text-muted)', boxShadow: 'none' }} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-premium" style={{ flex: 1, justifyContent: 'center' }}>
              Ajouter le client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Clients;
