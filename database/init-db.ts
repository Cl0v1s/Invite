import { Database, OPEN_READWRITE, OPEN_CREATE, OPEN_FULLMUTEX } from 'sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
const { DATABASE_URL } = process.env;

const d = new Database(DATABASE_URL as string, OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX, (err: unknown) => {
  if (err) {
    console.error("Failed to open database:", err);
  }
  try {
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    d.exec(schema, (execErr: unknown) => {
      if (execErr) {
        console.error("Failed to execute schema.sql:", execErr);
      } else {
        console.log("Database schema initialized successfully.");
      }
    });
  } catch (readErr) {
    console.error("Failed to read schema.sql:", readErr);
  }

});