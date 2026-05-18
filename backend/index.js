require('dotenv').config();
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./src/routes/taskRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const trackingRoutes = require('./src/routes/trackingRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/reminders', reminderRoutes);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT} and available on your network`);
});

server.on('error', (err) => {
  console.error('❌ SERVER ERROR:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});


