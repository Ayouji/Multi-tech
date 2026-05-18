const db = require('../config/database');

const COLUMNS = ['title', 'date'];

const pick = (obj) => {
  const out = {};
  for (const key of COLUMNS) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
};

class ReminderRepository {
  findAll() {
    return db.prepare('SELECT * FROM reminders ORDER BY date ASC').all();
  }

  findById(id) {
    return db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
  }

  create(reminder) {
    const payload = pick(reminder);
    const keys = Object.keys(payload);
    if (keys.length === 0) throw new Error('Aucune donnée à insérer');

    const placeholders = keys.map(() => '?').join(', ');
    const stmt = db.prepare(
      `INSERT INTO reminders (${keys.join(', ')}) VALUES (${placeholders})`
    );
    const info = stmt.run(keys.map((k) => payload[k]));
    return this.findById(info.lastInsertRowid);
  }

  delete(id) {
    const info = db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
    return info.changes > 0;
  }
}

module.exports = new ReminderRepository();
