import { Database } from "bun:sqlite";

// Initialize SQLite database
const db = new Database("rag.db");

// Initialize database schema
function initDB() {
  // Enable WAL mode for better concurrency
  db.run("PRAGMA journal_mode = WAL");

  // Create documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      filename TEXT NOT NULL,
      embedding BLOB NOT NULL
    )
  `);

  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_filename 
    ON documents(filename)
  `);
}

// Prepare statements for better performance
const insertDocument = db.prepare(`
  INSERT INTO documents (id, content, filename, embedding) 
  VALUES ($id, $content, $filename, $embedding)
`);

const getAllDocuments = db.prepare(`
  SELECT * FROM documents
`);

export { db, initDB, insertDocument, getAllDocuments };
