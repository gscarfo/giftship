import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    // Create Contacts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        address TEXT,
        city TEXT,
        province TEXT,
        zip_code TEXT,
        phone TEXT,
        type TEXT NOT NULL -- 'sender' or 'recipient'
      );
    `);

    // Create Labels Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS labels (
        id TEXT PRIMARY KEY,
        sender_id TEXT REFERENCES contacts(id),
        recipient_id TEXT REFERENCES contacts(id),
        created_at BIGINT,
        sender_snapshot JSONB,
        recipient_snapshot JSONB
      );
    `);

    client.release();
    return res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
}