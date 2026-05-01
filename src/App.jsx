import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import HistoryPage from './pages/History';
import Reminders from './pages/Reminders';
import Clients from './pages/Clients';
import TimerPage from './pages/Timer';
import Stats from './pages/Stats';
import Login from './pages/Login';
import './App.css';

const AppRoutes = () => {
  const { user } = useAppContext();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
