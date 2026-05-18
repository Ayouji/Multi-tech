const db = require('../config/database');

const COLUMNS = ['nom', 'ville', 'type_client', 'email', 'telephone'];

const pick = (obj) => {
  const out = {};
  for (const key of COLUMNS) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
};

class ClientRepository {
  findAll() {
    return db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  }

  findById(id) {
    return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  }

  create(client) {
    const payload = pick(client);
    const keys = Object.keys(payload);
    if (keys.length === 0) throw new Error('Aucune donnée à insérer');

    const placeholders = keys.map(() => '?').join(', ');
    const stmt = db.prepare(
      `INSERT INTO clients (${keys.join(', ')}) VALUES (${placeholders})`
    );
    const info = stmt.run(keys.map((k) => payload[k]));
    return this.findById(info.lastInsertRowid);
  }

  delete(id) {
    const info = db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    return info.changes > 0;
  }
}

module.exports = new ClientRepository();
