import React from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { calculateAvailability } from '../utils/availability';
import { Clock, Calendar, CheckCircle2, ListTodo, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const { tasks, clients, lang } = useAppContext();
  
  const completed = tasks.filter(t => t.statut === 'completed').length;
  const pending = tasks.filter(t => t.statut === 'pending' && !t.task_libre).length;
  const upcoming = tasks.filter(t => t.statut === 'pending').slice(0, 5);
  const availability = calculateAvailability(tasks);

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h2 className="heading-xl">Tableau de Bord <span className="text-gradient">Premium</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Bienvenue sur votre espace de gestion EL IDRISSI.</p>
      </header>
      
      <div className="stat-grid">
        <StatCard 
          icon={<CheckCircle2 />} 
          label={t(lang, 'completed')} 
          value={completed} 
          color="#10b981" 
          trend="+12% cette semaine" 
        />
        <StatCard 
          icon={<ListTodo />} 
          label={t(lang, 'pending')} 
          value={pending} 
          color="var(--primary)" 
          trend="Action requise" 
        />
        <StatCard 
          icon={<Users />} 
          label={t(lang, 'clients')} 
          value={clients.length} 
          color="#3b82f6" 
          trend="Total base" 
        />
        <StatCard 
          icon={<TrendingUp />} 
          label="Productivité" 
          value="94%" 
          color="#8b5cf6" 
          trend="Excellent" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Availability Section */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--primary)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,140,0,0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{t(lang, 'availability')}</h3>
          </div>
          
          <div style={{ padding: '20px', background: 'var(--bg-app)', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
              {availability.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-muted)' }}>
              Prochaine disponibilité à <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{availability.getHours()}h{availability.getMinutes().toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '10px', borderRadius: '12px', color: '#3b82f6' }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{t(lang, 'upcoming')}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcoming.map((task, i) => (
              <div key={task.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px', 
                background: i % 2 === 0 ? 'white' : 'var(--bg-app)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{task.client_nom || 'Tâche libre'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.type} • {task.duree}h</div>
                </div>
                <div style={{ 
                  background: 'var(--primary-gradient)', 
                  color: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '100px', 
                  fontSize: '11px', 
                  fontWeight: 'bold' 
                }}>
                  {new Date(task.date_fixee).toLocaleDateString()}
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                {t(lang, 'no_tasks')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ background: `${color}15`, padding: '16px', borderRadius: '16px', color: color }}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '700' }}>{value}</div>
      <div style={{ fontSize: '12px', color: color, fontWeight: '600', marginTop: '2px' }}>{trend}</div>
    </div>
  </div>
);

export default Dashboard;
