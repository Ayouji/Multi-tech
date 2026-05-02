require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERREUR: SUPABASE_URL ou SUPABASE_KEY manquante dans le fichier .env");
  console.error("Vérifiez que vous avez créé le fichier backend/.env avec les bonnes valeurs.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- ROUTES CLIENTS ---
app.get('/api/clients', async (req, res) => {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.post('/api/clients', async (req, res) => {
  const { data, error } = await supabase.from('clients').insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

app.delete('/api/clients/:id', async (req, res) => {
  const { error } = await supabase.from('clients').delete().eq('id', req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ success: true });
});

// --- ROUTES TASKS ---
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.post('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').insert([{ ...req.body, statut: 'pending' }]).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { data, error } = await supabase.from('tasks').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { error } = await supabase.from('tasks').delete().eq('id', req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ success: true });
});

// --- ROUTES TRACKING ---
app.get('/api/tracking', async (req, res) => {
  const { data, error } = await supabase.from('tracking').select('*').order('date', { ascending: false });
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.post('/api/tracking', async (req, res) => {
  const { data, error } = await supabase.from('tracking').insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

// --- ROUTES REMINDERS ---
app.get('/api/reminders', async (req, res) => {
  const { data, error } = await supabase.from('reminders').select('*').order('date', { ascending: true });
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.post('/api/reminders', async (req, res) => {
  const { data, error } = await supabase.from('reminders').insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

app.delete('/api/reminders/:id', async (req, res) => {
  const { error } = await supabase.from('reminders').delete().eq('id', req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
