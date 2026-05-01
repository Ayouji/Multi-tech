import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';
import { Play, Square, AlertCircle } from 'lucide-react';

const TimerPage = () => {
  const { tasks, lang, addTracking, updateTask } = useAppContext();
  const [activeTaskId, setActiveTaskId] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showConstraintModal, setShowConstraintModal] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!activeTaskId) return alert('Sélectionnez une tâche');
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowConstraintModal(true);
  };

  const handleSaveTracking = (constraints) => {
    const task = tasks.find(t => t.id === parseInt(activeTaskId));
    const timeInHours = seconds / 3600;
    
    addTracking({
      task_id: task.id,
      temps_estime: task.duree,
      temps_reel: timeInHours,
      contraintes: constraints,
      date: new Date().toISOString()
    });
    
    updateTask(task.id, { statut: 'completed' });
    setSeconds(0);
    setActiveTaskId('');
    setShowConstraintModal(false);
  };

  const pendingTasks = tasks.filter(t => t.statut === 'pending' && !t.task_libre);

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
      <div className="card" style={{ padding: '40px 20px', marginBottom: '30px' }}>
        <div style={{ fontSize: '64px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)', marginBottom: '30px' }}>
          {formatTime(seconds)}
        </div>
        
        <select 
          className="input" 
          value={activeTaskId} 
          onChange={e => setActiveTaskId(e.target.value)}
          disabled={isRunning}
          style={{ maxWidth: '300px', margin: '0 auto 20px' }}
        >
          <option value="">{t(lang, 'tasks')}</option>
          {pendingTasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.client_nom || 'Sans client'} - {task.type} ({task.duree}h)
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {!isRunning ? (
            <button className="btn btn-primary" style={{ padding: '15px 40px', borderRadius: '50px' }} onClick={handleStart}>
              <Play size={24} /> {t(lang, 'start')}
            </button>
          ) : (
            <button className="btn" style={{ padding: '15px 40px', borderRadius: '50px', background: '#EF4444', color: 'white' }} onClick={handleStop}>
              <Square size={24} /> {t(lang, 'stop')}
            </button>
          )}
        </div>
      </div>

      {showConstraintModal && (
        <ConstraintModal 
          task={tasks.find(t => t.id === parseInt(activeTaskId))}
          timeInHours={seconds / 3600}
          onSave={handleSaveTracking}
          onCancel={() => setShowConstraintModal(false)}
        />
      )}
    </div>
  );
};

const ConstraintModal = ({ task, timeInHours, onSave, onCancel }) => {
  const [constraints, setConstraints] = useState('');
  const deviation = Math.abs(timeInHours - (task?.duree || 0));

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
          Enregistrer le temps
        </h3>
        <div className="card" style={{ background: '#F9FAFB', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Temps estimé:</span> <strong>{task?.duree}h</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Temps réel:</span> <strong>{timeInHours.toFixed(2)}h</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Écart:</span> 
            <strong style={{ color: deviation > 0.5 ? '#EF4444' : '#10B981' }}>{deviation.toFixed(2)}h</strong>
          </div>
        </div>
        
        <textarea 
          className="input" placeholder="Contraintes ou notes..." rows="3"
          value={constraints} onChange={e => setConstraints(e.target.value)}
          style={{ marginTop: '15px' }}
        ></textarea>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" style={{ flex: 1, background: '#EEE' }} onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(constraints)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
