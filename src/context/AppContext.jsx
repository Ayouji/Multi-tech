import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem('clients')) || []);
  const [tracking, setTracking] = useState(() => JSON.parse(localStorage.getItem('tracking')) || []);
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem('reminders')) || []);
  const [lang, setLang] = useState('fr');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('tracking', JSON.stringify(tracking));
    localStorage.setItem('reminders', JSON.stringify(reminders));
    localStorage.setItem('user', JSON.stringify(user));
  }, [tasks, clients, tracking, user, reminders]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'elidrissi') {
      const userData = { username, role: 'admin' };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now(), statut: 'pending' }]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: Date.now() }]);
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTracking = (entry) => {
    setTracking(prev => [...prev, { 
      ...entry, 
      id: Date.now(),
      images: entry.images || [] 
    }]);
  };

  const addReminder = (reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleLang = () => setLang(prev => prev === 'fr' ? 'en' : 'fr');

  return (
    <AppContext.Provider value={{ 
        tasks, addTask, updateTask, deleteTask,
        clients, addClient, deleteClient,
        tracking, addTracking,
        reminders, addReminder, deleteReminder,
        lang, toggleLang,
        user, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
