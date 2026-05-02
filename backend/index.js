require('dotenv').config();
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./src/routes/taskRoutes');
// On pourrait ajouter clientRoutes, trackingRoutes, etc.

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/tasks', taskRoutes);

// Pour l'instant on garde les autres en inline pour gagner du temps 
// ou on peut tout migrer si l'utilisateur le souhaite.
// Mais le pattern est là.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Service/Repository pattern`);
});
