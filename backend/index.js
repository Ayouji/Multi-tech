require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./src/config/database');
const taskRoutes = require('./src/routes/taskRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const trackingRoutes = require('./src/routes/trackingRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // ou l'URL de votre frontend (ex: 'http://localhost:5173')
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/tasks', taskRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/reminders', reminderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} introuvable` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Erreur serveur' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Service/Repository pattern`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — closing server and database...`);
  server.close(() => {
    try {
      db.close();
      console.log('Database closed cleanly.');
    } catch (err) {
      console.error('Error closing database:', err.message);
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
