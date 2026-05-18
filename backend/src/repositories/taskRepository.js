const db = require('../config/database');

const COLUMNS = [
  'client_id',
  'client_nom',
  'type',
  'importance',
  'duree',
  'date_fixee',
  'description',
  'task_libre',
  'statut',
];

const toRow = (obj) => {
  const out = {};
  for (const key of COLUMNS) {
    if (obj[key] === undefined) continue;
    let value = obj[key];
    if (key === 'task_libre') value = value ? 1 : 0;
    if (key === 'date_fixee' && value === '') value = null;
    out[key] = value;
  }
  return out;
};

const fromRow = (row) => {
  if (!row) return row;
  return { ...row, task_libre: row.task_libre === 1 };
};

class TaskRepository {
  findAll() {
    return db
      .prepare('SELECT * FROM tasks ORDER BY created_at DESC')
      .all()
      .map(fromRow);
  }

  findById(id) {
    return fromRow(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  }

  create(task) {
    const payload = toRow(task);
    const keys = Object.keys(payload);
    if (keys.length === 0) throw new Error('Aucune donnée à insérer');

    const placeholders = keys.map(() => '?').join(', ');
    const stmt = db.prepare(
      `INSERT INTO tasks (${keys.join(', ')}) VALUES (${placeholders})`
    );
    const info = stmt.run(keys.map((k) => payload[k]));
    return this.findById(info.lastInsertRowid);
  }

  update(id, updates) {
    const payload = toRow(updates);
    const keys = Object.keys(payload);
    if (keys.length === 0) return this.findById(id);

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`).run([
      ...keys.map((k) => payload[k]),
      id,
    ]);
    return this.findById(id);
  }

  delete(id) {
    const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return info.changes > 0;
  }
}

module.exports = new TaskRepository();
