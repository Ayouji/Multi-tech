import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Users, Timer, BarChart3, LogOut, LayoutGrid, History, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/translations';

export const Sidebar = () => {
  const { lang, logout, toggleLang } = useAppContext();
  
  const navItems = [
    { path: '/', icon: LayoutGrid, label: t(lang, 'dashboard') },
    { path: '/tasks', icon: ClipboardList, label: t(lang, 'tasks') },
    { path: '/history', icon: History, label: t(lang, 'history') },
    { path: '/reminders', icon: Bell, label: t(lang, 'reminders') },
    { path: '/clients', icon: Users, label: t(lang, 'clients') },
    { path: '/timer', icon: Timer, label: t(lang, 'timer') },
    { path: '/stats', icon: BarChart3, label: t(lang, 'statistics') },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img 
          src="/logo.jpeg" 
          alt="Logo" 
          style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
        />
        <span style={{ marginLeft: '12px' }}>EL IDRISSI</span>
      </div>

      <nav className="nav-group">
        {navItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="nav-link" onClick={toggleLang} style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%' }}>
          <span style={{ fontWeight: 'bold' }}>{lang === 'fr' ? 'Switch to English' : 'Passer au Français'}</span>
        </button>
        <button className="nav-link" onClick={logout} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', width: '100%' }}>
          <LogOut size={20} />
          <span>{t(lang, 'logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export const MobileHeader = () => {
  const { toggleLang, lang } = useAppContext();
  return (
    <header className="mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/logo.jpeg" 
          alt="Logo" 
          style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} 
        />
        <span style={{ fontWeight: '800', fontSize: '18px' }}>EL IDRISSI</span>
      </div>
      <button 
        className="btn" 
        style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}
        onClick={toggleLang}
      >
        {lang === 'fr' ? 'EN' : 'FR'}
      </button>
    </header>
  );
};

export const MobileNav = () => {
  const { lang } = useAppContext();
  const items = [
    { path: '/', icon: LayoutGrid },
    { path: '/tasks', icon: ClipboardList },
    { path: '/reminders', icon: Bell },
    { path: '/history', icon: History },
    { path: '/clients', icon: Users },
    { path: '/timer', icon: Timer },
    { path: '/stats', icon: BarChart3 },
  ];

  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <item.icon 
              size={24} 
              color={isActive ? 'var(--primary)' : 'var(--text-muted)'} 
              strokeWidth={isActive ? 2.5 : 2}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <MobileHeader />
      <main className="main-viewport">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
