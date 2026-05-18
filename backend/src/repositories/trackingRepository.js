const db = require('../config/database');

const COLUMNS = ['task_id', 'temps_estime', 'temps_reel', 'contraintes', 'images', 'date'];

const toRow = (obj) => {
  const out = {};
  for (const key of COLUMNS) {
    if (obj[key] === undefined) continue;
    let value = obj[key];
    if (key === 'images' && Array.isArray(value)) value = JSON.stringify(value);
    out[key] = value;
  }
  return out;
};

const fromRow = (row) => {
  if (!row) return row;
  let images = [];
  try {
    images = row.images ? JSON.parse(row.images) : [];
  } catch {
    images = [];
  }
  return { ...row, images };
};

class TrackingRepository {
  findAll() {
    return db
      .prepare('SELECT * FROM tracking ORDER BY date DESC')
      .all()
      .map(fromRow);
  }

  findById(id) {
    return fromRow(db.prepare('SELECT * FROM tracking WHERE id = ?').get(id));
  }

  create(entry) {
    const payload = toRow(entry);
    const keys = Object.keys(payload);
    if (keys.length === 0) throw new Error('Aucune donnée à insérer');

    const placeholders = keys.map(() => '?').join(', ');
    const stmt = db.prepare(
      `INSERT INTO tracking (${keys.join(', ')}) VALUES (${placeholders})`
    );
    const info = stmt.run(keys.map((k) => payload[k]));
    return this.findById(info.lastInsertRowid);
  }

  delete(id) {
    const info = db.prepare('DELETE FROM tracking WHERE id = ?').run(id);
    return info.changes > 0;
  }
}

module.exports = new TrackingRepository();
