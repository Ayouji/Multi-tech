const path = require('path');
const fs = require('fs');
const { Database } = require('node-sqlite3-wasm');

const DEFAULT_DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.join(DEFAULT_DATA_DIR, 'elidrissi.db');

const SCHEMA_PATH = path.join(__dirname, '..', 'db', 'schema.sql');
const LOCK_PATH = `${DB_PATH}.lock`;

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const openDatabase = () => {
  try {
    return new Database(DB_PATH);
  } catch (err) {
    if (err && err.message && err.message.includes('database is locked')) {
      if (fs.existsSync(LOCK_PATH)) {
        console.warn(
          `[db] Stale lock detected at ${LOCK_PATH} — removing and retrying...`
        );
        fs.rmSync(LOCK_PATH, { recursive: true, force: true });
        return new Database(DB_PATH);
      }
    }
    throw err;
  }
};

const db = openDatabase();

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);

console.log(`SQLite database ready at ${DB_PATH}`);

module.exports = db;
