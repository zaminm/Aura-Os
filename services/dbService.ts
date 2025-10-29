
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Habit } from '../types';

const DB_NAME = 'aura-db';
const DB_VERSION = 1;
const MONTHLY_HABITS_STORE = 'monthlyHabits';
const APP_STATE_STORE = 'appState';

interface AuraDB extends DBSchema {
  [MONTHLY_HABITS_STORE]: {
    key: string; // monthKey e.g. "2024-09"
    value: Habit[];
  };
  [APP_STATE_STORE]: {
    key: string; // 'habit-notes' or 'monthly-reflection'
    value: string;
  };
}

let dbPromise: Promise<IDBPDatabase<AuraDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AuraDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(MONTHLY_HABITS_STORE)) {
          db.createObjectStore(MONTHLY_HABITS_STORE);
        }
        if (!db.objectStoreNames.contains(APP_STATE_STORE)) {
          db.createObjectStore(APP_STATE_STORE);
        }
      },
    });
  }
  return dbPromise;
};

// --- Habits ---
export const getAllHabits = async (): Promise<Record<string, Habit[]>> => {
  const db = await initDB();
  const tx = db.transaction(MONTHLY_HABITS_STORE, 'readonly');
  const store = tx.objectStore(MONTHLY_HABITS_STORE);
  const keys = await store.getAllKeys();
  const values = await store.getAll();
  await tx.done;

  const habits: Record<string, Habit[]> = {};
  keys.forEach((key, index) => {
    habits[String(key)] = values[index];
  });
  return habits;
};

export const saveHabitsForMonth = async (monthKey: string, habits: Habit[]): Promise<void> => {
  const db = await initDB();
  await db.put(MONTHLY_HABITS_STORE, habits, monthKey);
};

// --- App State (Notes, Reflection) ---
export const getAppState = async (key: string): Promise<string> => {
  const db = await initDB();
  return (await db.get(APP_STATE_STORE, key)) || '';
};

export const saveAppState = async (key: string, value: string): Promise<void> => {
  const db = await initDB();
  await db.put(APP_STATE_STORE, value, key);
};
