import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutGrid, Lock, User, ArrowRight } from 'lucide-react';
import { t } from '../utils/translations';

const Login = () => {
  const { login, lang } = useAppContext();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = login(formData.username, formData.password);
    if (!success) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 0% 0%, rgba(255,140,0,0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(255,95,109,0.1) 0%, transparent 50%)'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Brand Section */}
        <div className="animate-fade-in" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <img 
              src="/logo.jpeg" 
              alt="Logo" 
              style={{ width: '64px', height: '64px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
            />
            <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>EL IDRISSI</h1>
          </div>
          <h2 className="heading-xl" style={{ fontSize: '56px', lineHeight: '1.1', marginBottom: '24px' }}>
            Gérez vos <span className="text-gradient">Interventions</span> avec élégance.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '400px' }}>
            La plateforme de gestion nouvelle génération conçue pour les professionnels de l'installation.
          </p>
        </div>

        {/* Login Form Section */}
        <div className="glass-card animate-fade-in" style={{ padding: '48px', borderRadius: '40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Content de vous revoir</h3>
            <p style={{ color: 'var(--text-muted)' }}>Identifiez-vous pour accéder à votre espace.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">{t(lang, 'username')}</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input" 
                  style={{ paddingLeft: '52px' }}
                  placeholder="admin"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="input-label">{t(lang, 'password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="input" 
                  style={{ paddingLeft: '52px' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '16px', borderRadius: '16px', fontSize: '14px', marginBottom: '24px', textAlign: 'center', fontWeight: '600' }}>
                Identifiants incorrects. Veuillez réessayer.
              </div>
            )}

            <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '20px' }} disabled={loading}>
              {loading ? 'Connexion...' : (
                <>
                  Se connecter
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            © 2026 EL IDRISSI Management. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
