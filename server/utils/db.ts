import { Database } from "bun:sqlite";

// Initialize SQLite database
const db = new Database(process.env.DATABASE_URL);

// Initialize database schema
function initDB() {
  // Enable WAL mode for better concurrency
  db.run("PRAGMA journal_mode = WAL");

  // Create documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      file_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      embedding BLOB NOT NULL,
      file BLOB NOT NULL,
      file_type TEXT NOT NULL
    )
  `);

  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_filename 
    ON documents(filename)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_file_id 
    ON documents(file_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_file_type 
    ON documents(file_type)
  `);
}

function insertDocument(params: {
  $id: string;
  $content: string;
  $file_id: string;
  $filename: string;
  $embedding: Buffer;
  $file: Buffer;
  $file_type: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO documents (id, content, filename, embedding, file_id, file, file_type) 
    VALUES ($id, $content, $filename, $embedding, $file_id, $file, $file_type)
  `);
  return stmt.run(params);
}

function getAllDocuments() {
  const stmt = db.prepare(`SELECT * FROM documents`);
  return stmt.all();
}

function getUniqueDocuments() {
  const stmt = db.prepare(
    `SELECT DISTINCT file_id, filename, file_type FROM documents`
  );
  return stmt.all();
}

export { db, initDB, insertDocument, getAllDocuments, getUniqueDocuments };
