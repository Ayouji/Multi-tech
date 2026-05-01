import React from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Stats = () => {
  const { tasks, tracking, clients, lang } = useAppContext();

  const completedCount = tasks.filter(t => t.statut === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const totalDeviation = tracking.reduce((acc, curr) => {
    return acc + Math.abs((curr.temps_reel || 0) - (curr.temps_estime || 0));
  }, 0);
  const avgDeviation = tracking.length > 0 ? totalDeviation / tracking.length : 0;

  const clientTypes = {
    mon_client: clients.filter(c => c.type_client === 'mon_client').length,
    freelance: clients.filter(c => c.type_client === 'freelance').length,
    autre: clients.filter(c => c.type_client === 'autre').length
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>{t(lang, 'statistics')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
          <TrendingUp size={24} color="var(--success)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--success)' }}>{completionRate.toFixed(1)}%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t(lang, 'completion_rate')}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
          <Clock size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)' }}>{avgDeviation.toFixed(1)}h</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t(lang, 'avg_deviation')}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Répartition Clients</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(clientTypes).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginLeft: '20px' }}>
                <div style={{ 
                  height: '8px', 
                  background: type === 'mon_client' ? 'var(--primary)' : type === 'freelance' ? '#3B82F6' : '#9CA3AF', 
                  borderRadius: '4px',
                  width: `${(count / (clients.length || 1)) * 100}%`,
                  minWidth: count > 0 ? '5px' : '0'
                }}></div>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: '#F9FAFB' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Recommandations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {completionRate < 70 && (
            <div style={{ display: 'flex', gap: '10px', color: '#B45309', fontSize: '13px' }}>
              <AlertTriangle size={16} /> <span>Taux de complétion faible. Essayez de réduire la charge.</span>
            </div>
          )}
          {avgDeviation > 1 && (
            <div style={{ display: 'flex', gap: '10px', color: '#B45309', fontSize: '13px' }}>
              <AlertTriangle size={16} /> <span>Écarts de temps importants. Ajustez vos estimations.</span>
            </div>
          )}
          {completionRate >= 80 && (
            <div style={{ display: 'flex', gap: '10px', color: 'var(--success)', fontSize: '13px' }}>
              <CheckCircle size={16} /> <span>Excellente productivité cette période!</span>
            </div>
          )}
          {totalTasks === 0 && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pas assez de données.</div>}
        </div>
      </div>
    </div>
  );
};

export default Stats;
