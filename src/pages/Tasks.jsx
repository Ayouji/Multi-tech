import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { Plus, Trash2, CheckCircle, Circle, Search, Eye, Edit2, Image as ImageIcon, Upload, X } from 'lucide-react';

const Tasks = () => {
  const { tasks, lang, updateTask, deleteTask, tracking } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const importanceColors = {
    urgent_important: '#EF4444',
    important_not_urgent: '#F59E0B',
    urgent_not_important: '#3B82F6',
    not_urgent_not_important: '#9CA3AF'
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.importance === filter;
    const matchesSearch = (t.client_nom || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTaskStatus = (task) => {
    const hasTracking = tracking.some(tr => tr.task_id === task.id);
    if (task.statut === 'completed' || hasTracking) return { label: 'Terminé', color: '#10b981' };
    return { label: 'En cours', color: '#3b82f6' };
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 className="heading-xl">Gestion des <span className="text-gradient">Tâches</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Organisez et suivez l'avancement de vos interventions.</p>
        </div>
        <button className="btn-premium" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          {t(lang, 'add_task')}
        </button>
      </header>

      <div className="glass-card" style={{ marginBottom: '30px', padding: '12px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Rechercher une tâche..." 
              style={{ marginBottom: 0, paddingLeft: '45px', background: 'var(--bg-app)', border: 'none' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {['all', 'urgent_important', 'important_not_urgent', 'urgent_not_important', 'not_urgent_not_important'].map(f => (
              <button 
                key={f}
                className={`btn ${filter === f ? 'btn-premium' : ''}`}
                style={{ 
                  whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '13px', 
                  background: filter === f ? 'var(--primary-gradient)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-muted)',
                  border: filter === f ? 'none' : '1px solid var(--border-color)'
                }}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? t(lang, 'all') : t(lang, f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {filteredTasks.map(task => {
          const status = getTaskStatus(task);
          return (
            <div key={task.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `6px solid ${importanceColors[task.importance]}` }}>
              <button 
                onClick={() => {
                  if (task.statut !== 'completed') setShowArchiveModal(task);
                  else updateTask(task.id, { statut: 'pending' });
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.statut === 'completed' ? '#10b981' : '#cbd5e1' }}
              >
                {task.statut === 'completed' ? <CheckCircle size={32} /> : <Circle size={32} />}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: task.statut === 'completed' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.statut === 'completed' ? 'line-through' : 'none' }}>
                    {task.client_nom || 'Tâche libre'}
                  </h4>
                  <div style={{ background: `${status.color}15`, color: status.color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {status.label}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {task.type} • {task.task_libre ? 'Libre' : `${task.duree}h`}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {task.statut !== 'completed' && (
                  <button onClick={() => setShowArchiveModal(task)} className="action-btn" style={{ color: '#10b981' }} title="Terminer"><CheckCircle size={18} /></button>
                )}
                <button onClick={() => setShowDetailsModal(task)} className="action-btn" title="Détails"><Eye size={18} /></button>
                <button onClick={() => setShowEditModal(task)} className="action-btn" title="Modifier"><Edit2 size={18} /></button>
                <button onClick={() => { if(confirm('Supprimer cette tâche ?')) deleteTask(task.id) }} className="action-btn" style={{ color: '#ef4444' }} title="Supprimer"><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && <TaskFormModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && <TaskFormModal task={showEditModal} onClose={() => setShowEditModal(null)} />}
      {showDetailsModal && <TaskDetailsModal task={showDetailsModal} onClose={() => setShowDetailsModal(null)} />}
      {showArchiveModal && <ArchiveModal task={showArchiveModal} onClose={() => setShowArchiveModal(null)} />}

      <style>{`
        .action-btn {
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          padding: 8px;
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }
        .action-btn:hover {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
};

const TaskFormModal = ({ task, onClose }) => {
  const { clients, addTask, updateTask, lang } = useAppContext();
  const [formData, setFormData] = useState(task || {
    clientId: '',
    type: 'intervention',
    importance: 'urgent_important',
    duree: '',
    date_fixee: '',
    description: '',
    task_libre: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.task_libre && !formData.clientId && !task) return alert('Sélectionnez un client');
    const client = clients.find(c => c.id === parseInt(formData.clientId || formData.client_id));
    const taskData = {
      ...formData,
      client_id: formData.clientId ? parseInt(formData.clientId) : (task?.client_id || null),
      client_nom: client ? client.nom : (task?.client_nom || null),
      duree: formData.task_libre ? 0 : parseInt(formData.duree) || 0,
    };
    if (task) updateTask(task.id, taskData);
    else addTask(taskData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="heading-xl" style={{ textAlign: 'center', marginBottom: '32px' }}>
          {task ? 'Modifier' : 'Nouvelle'} <span className="text-gradient">Intervention</span>
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label">Client</label>
              <select className="input" value={formData.clientId || formData.client_id || ''} onChange={e => setFormData({...formData, clientId: e.target.value})} disabled={formData.task_libre}>
                <option value="">Sélectionner un client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Type de mission</label>
              <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="intervention">Intervention</option>
                <option value="installation">Installation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Niveau de priorité</label>
              <select className="input" value={formData.importance} onChange={e => setFormData({...formData, importance: e.target.value})}>
                <option value="urgent_important">{t(lang, 'urgent_important')}</option>
                <option value="important_not_urgent">{t(lang, 'important_not_urgent')}</option>
                <option value="urgent_not_important">{t(lang, 'urgent_not_important')}</option>
                <option value="not_urgent_not_important">{t(lang, 'not_urgent_not_important')}</option>
              </select>
            </div>
            {!formData.task_libre && (
              <div className="form-group">
                <label className="input-label">Durée estimée (h)</label>
                <input type="number" className="input" placeholder="Ex: 2" value={formData.duree} onChange={e => setFormData({...formData, duree: e.target.value})} />
              </div>
            )}
            <div className="form-group" style={{ gridColumn: formData.task_libre ? 'span 2' : 'auto' }}>
              <label className="input-label">Planification</label>
              <input type="datetime-local" className="input" value={formData.date_fixee} onChange={e => setFormData({...formData, date_fixee: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label">Notes & Description</label>
              <textarea className="input" placeholder="Détails supplémentaires..." rows="3" style={{ resize: 'none' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="button" className="btn-premium" style={{ flex: 1, background: 'var(--bg-app)', color: 'var(--text-muted)', boxShadow: 'none' }} onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-premium" style={{ flex: 2, justifyContent: 'center' }}>{task ? 'Mettre à jour' : 'Planifier la mission'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskDetailsModal = ({ task, onClose }) => {
  const { tracking } = useAppContext();
  const taskLogs = tracking.filter(tr => tr.task_id === task.id);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 className="heading-xl">Détails de l'intervention</h3>
        <div className="glass-card" style={{ background: 'var(--bg-app)', border: 'none' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{task.client_nom || 'Tâche libre'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type:</span><br/><strong>{task.type}</strong></div>
            <div><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priorité:</span><br/><strong>{task.importance}</strong></div>
            <div><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date:</span><br/><strong>{task.date_fixee ? new Date(task.date_fixee).toLocaleString() : 'N/A'}</strong></div>
            <div><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Statut:</span><br/><strong>{task.statut}</strong></div>
          </div>
          {task.description && (
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Description:</span>
              <p style={{ marginTop: '5px', fontSize: '14px' }}>{task.description}</p>
            </div>
          )}
        </div>
        {taskLogs.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px' }}>Suivi temporel & Photos</h4>
            {taskLogs.map(log => (
              <div key={log.id} className="glass-card" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Réalisé: <strong>{log.temps_real ? log.temps_reel.toFixed(2) : log.temps_reel}h</strong></span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(log.date).toLocaleDateString()}</span>
                </div>
                {log.contraintes && <p style={{ fontSize: '13px', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '10px', marginBottom: '10px' }}>{log.contraintes}</p>}
                {log.images?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {log.images.map((img, i) => <img key={i} src={img} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button className="btn-premium" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

const ArchiveModal = ({ task, onClose }) => {
  const { addTracking, updateTask } = useAppContext();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };
  const handleArchive = () => {
    addTracking({
      task_id: task.id,
      temps_estime: task.duree || 0,
      temps_reel: 0, 
      contraintes: text,
      images: images,
      date: new Date().toISOString()
    });
    updateTask(task.id, { statut: 'completed' });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle size={40} />
          </div>
          <h3 className="heading-xl" style={{ fontSize: '28px' }}>Finaliser <span className="text-gradient">la mission</span></h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Enregistrez les détails finaux et les preuves photos.</p>
        </div>
        <div className="form-group">
          <label className="input-label">Notes de clôture</label>
          <textarea className="input" placeholder="Observations, difficultés..." rows="4" style={{ resize: 'none' }} value={text} onChange={e => setText(e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label className="input-label">Photos de réalisation ({images.length})</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                <img src={img} style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
                <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} strokeWidth={3} /></button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current.click()} style={{ aspectRatio: '1', border: '2px dashed var(--border-color)', borderRadius: '16px', background: 'rgba(241, 245, 249, 0.5)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Upload size={24} /><span style={{ fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>Ajouter</span></button>
          </div>
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button className="btn-premium" style={{ flex: 1, background: 'var(--bg-app)', color: 'var(--text-muted)', boxShadow: 'none' }} onClick={onClose}>Annuler</button>
          <button className="btn-premium" style={{ flex: 2, justifyContent: 'center' }} onClick={handleArchive}>Clôturer la mission</button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
