import { Database } from "bun:sqlite";

// Initialize SQLite database
const db = new Database(process.env.DATABASE_URL);

// Initialize database schema
function initDB() {
  // Enable WAL mode for better concurrency
  db.run("PRAGMA journal_mode = WAL");

  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      file_id TEXT NOT NULL PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      filename TEXT NOT NULL,
      file BLOB NOT NULL,
      file_type TEXT NOT NULL
    )
  `);

  // Create documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      file_id TEXT NOT NULL REFERENCES files(file_id),
      content TEXT NOT NULL,
      embedding BLOB NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      session_name TEXT NOT NULL,
      messages TEXT NOT NULL
    )
  `);

  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_filename 
    ON files(filename)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_file_id 
    ON documents(file_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_file_type 
    ON files(file_type)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_chat_sessions_id 
    ON chat_sessions(id)
  `);
}

function insertDocument(params: {
  $id: string;
  $content: string;
  $file_id: string;
  $embedding: Buffer;
}) {
  const stmt = db.prepare(`
        INSERT INTO documents (id, file_id, content, embedding)
        VALUES ($id, $file_id, $content, $embedding)
        `);
  return stmt.run(params);
}

function insertFile(params: {
  $file_id: string;
  $filename: string;
  $file: Buffer;
  $file_type: string;
}) {
  const stmt = db.prepare(`
        INSERT INTO files (file_id, filename, file, file_type) 
        VALUES ($file_id, $filename, $file, $file_type)
    `);
  return stmt.run(params);
}

function getAllDocuments() {
  const stmt = db.prepare(`SELECT * FROM documents`);
  return stmt.all();
}

function getUniqueDocuments() {
  const stmt = db.prepare(`SELECT * from files ORDER BY created_at DESC`);
  return stmt.all();
}

function getFileById(fileId: string) {
  const stmt = db.prepare(`SELECT * FROM files WHERE file_id = ?`);
  return stmt.get(fileId);
}

function deleteDocument(fileId: string) {
  const deleteDocuments = db.prepare(`DELETE FROM documents WHERE file_id = ?`);
  return deleteDocuments.run(fileId);
}

function deleteFile(fileId: string) {
  const deleteFile = db.prepare(`DELETE FROM files WHERE file_id = ?`);
  return deleteFile.run(fileId);
}

function getAllChatSessions() {
  const stmt = db.query(`SELECT id, session_name FROM chat_sessions`);
  return stmt.all();
}

function createChatSession(params: {
  $session_name: string;
  $messages: string;
}) {
  const stmt = db.prepare(
    `INSERT INTO chat_sessions (session_name, messages) VALUES (?, ?)`
  );
  return stmt.run(params);
}

function getChatSession(id: number) {
  const stmt = db.prepare(`SELECT * FROM chat_sessions WHERE id = ?`);
  return stmt.get(id);
}

export {
  db,
  initDB,
  insertDocument,
  insertFile,
  getAllDocuments,
  getUniqueDocuments,
  getFileById,
  deleteDocument,
  deleteFile,
  getAllChatSessions,
  createChatSession,
  getChatSession,
};
