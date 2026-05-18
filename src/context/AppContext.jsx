import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [lang, setLang] = useState('fr');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  // Initial Fetch from Backend
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [tRes, cRes, trRes, rRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/tracking`),
        fetch(`${API_URL}/reminders`)
      ]);
      
      const tData = await tRes.json();
      const cData = await cRes.json();
      const trData = await trRes.json();
      const rData = await rRes.json();

      setTasks(tData);
      setClients(cData);
      setTracking(trData);
      setReminders(rData);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
    }
  };

  const login = (username, password) => {
    if (username === 'admin' && password === 'elidrissi') {
      const userData = { username, role: 'admin' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addTask = async (task) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const data = await res.json();
      setTasks(prev => [data, ...prev]);
    } catch (err) { console.error(err); }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const addClient = async (client) => {
    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      const data = await res.json();
      setClients(prev => [data, ...prev]);
    } catch (err) { console.error(err); }
  };

  const deleteClient = async (id) => {
    try {
      await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const addTracking = async (entry) => {
    try {
      const res = await fetch(`${API_URL}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      const data = await res.json();
      setTracking(prev => [data, ...prev]);
    } catch (err) { console.error(err); }
  };

  const addReminder = async (reminder) => {
    try {
      const res = await fetch(`${API_URL}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)
      });
      const data = await res.json();
      setReminders(prev => [...prev, data]);
    } catch (err) { console.error(err); }
  };

  const deleteReminder = async (id) => {
    try {
      await fetch(`${API_URL}/reminders/${id}`, { method: 'DELETE' });
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) { console.error(err); }
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
