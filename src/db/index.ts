import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from "./schema";

const sqlite = new Database('todo.db', { create: true });
sqlite.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, content TEXT NOT NULL, completed INTEGER NOT NULL);"
);

export const db: BunSQLiteDatabase = drizzle(sqlite, { schema, logger: true });
