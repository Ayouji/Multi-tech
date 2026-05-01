import React from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

const HistoryPage = () => {
  const { tasks, tracking, lang } = useAppContext();

  // Sort tracking data by date descending
  const sortedTracking = [...tracking].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h2 className="heading-xl">{t(lang, 'task_history')}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Consultez vos interventions passées et les temps enregistrés.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sortedTracking.map((entry) => {
          const task = tasks.find(t => t.id === entry.task_id);
          const deviation = (entry.temps_reel || 0) - (entry.temps_estime || 0);

          return (
            <div key={entry.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700' }}>{task?.client_nom || 'Tâche libre'}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{task?.type || 'Inconnu'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {new Date(entry.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', padding: '15px', background: 'var(--bg-app)', borderRadius: '12px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Estimé</div>
                  <div style={{ fontWeight: '700' }}>{entry.temps_estime}h</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Réel</div>
                  <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{entry.temps_reel.toFixed(2)}h</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Écart</div>
                  <div style={{ fontWeight: '700', color: Math.abs(deviation) > 0.5 ? '#ef4444' : '#10b981' }}>
                    {deviation > 0 ? '+' : ''}{deviation.toFixed(2)}h
                  </div>
                </div>
              </div>

              {entry.contraintes && (
                <div style={{ display: 'flex', gap: '10px', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                  <AlertCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>"{entry.contraintes}"</span>
                </div>
              )}
            </div>
          );
        })}

        {sortedTracking.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <Clock size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <p>Aucun historique disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
