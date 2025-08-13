// DO NOT PUT use server here as it would open a security breach by allowing frontend code to call all of this
import { Database, OPEN_READWRITE, OPEN_CREATE, OPEN_FULLMUTEX } from 'sqlite3';
export let db: Database;

// eslint-disable-next-line prefer-const
export let ready: Promise<void> | undefined;

async function initDB() {
  if (ready) return;
  try {
    db = await new Promise((resolve, reject) => {
      const d = new Database(process.env.DATABASE_URL as string, OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX, (err) => {
        if (err) {
          console.error("Failed to open database:", err);
          reject(err);
        } else {
          resolve(d);
        }
      });
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

ready = initDB()
