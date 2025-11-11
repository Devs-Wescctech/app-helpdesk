import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const databaseUrl = process.env.DATABASE_URL;

// Detect if using Neon serverless (has neon.tech in URL)
const isNeonServerless = databaseUrl.includes('.neon.tech') || databaseUrl.includes('neon.tech');

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeonServerless) {
  // Use Neon serverless with WebSocket
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString: databaseUrl });
  db = drizzleNeon(pool, { schema });
  console.log('📊 Using Neon Serverless PostgreSQL');
} else {
  // Use standard PostgreSQL (node-pg)
  const pool = new PgPool({ connectionString: databaseUrl });
  db = drizzlePg(pool, { schema });
  console.log('📊 Using standard PostgreSQL');
}

export { db };
