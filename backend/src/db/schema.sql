CREATE TABLE IF NOT EXISTS clients (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  nom         TEXT    NOT NULL,
  ville       TEXT    NOT NULL,
  type_client TEXT    NOT NULL DEFAULT 'mon_client',
  email       TEXT,
  telephone   TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  client_id   INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  client_nom  TEXT,
  type        TEXT    NOT NULL DEFAULT 'intervention',
  importance  TEXT    NOT NULL DEFAULT 'urgent_important',
  duree       REAL    NOT NULL DEFAULT 0,
  date_fixee  TEXT,
  description TEXT,
  task_libre  INTEGER NOT NULL DEFAULT 0,
  statut      TEXT    NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS tracking (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  task_id      INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  temps_estime REAL    NOT NULL DEFAULT 0,
  temps_reel   REAL    NOT NULL DEFAULT 0,
  contraintes  TEXT,
  images       TEXT    NOT NULL DEFAULT '[]',
  date         TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reminders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  title      TEXT    NOT NULL,
  date       TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_statut   ON tasks(statut);
CREATE INDEX IF NOT EXISTS idx_tasks_client   ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tracking_task  ON tracking(task_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(date);
