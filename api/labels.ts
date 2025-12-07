import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let client;

  try {
    client = await pool.connect();

    if (req.method === 'GET') {
      const result = await client.query(`
        SELECT 
          id, 
          sender_id as "senderId", 
          recipient_id as "recipientId", 
          created_at as "createdAt", 
          sender_snapshot as "senderSnapshot", 
          recipient_snapshot as "recipientSnapshot" 
        FROM labels
      `);
      // Convert createdAt from string (Postgres BigInt) to number for JS
      const formattedRows = result.rows.map(row => ({
        ...row,
        createdAt: Number(row.createdAt)
      }));
      return res.status(200).json(formattedRows);
    } 
    
    else if (req.method === 'POST') {
      const { id, senderId, recipientId, senderSnapshot, recipientSnapshot, createdAt } = req.body;

      await client.query(
        `INSERT INTO labels (id, sender_id, recipient_id, created_at, sender_snapshot, recipient_snapshot)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, senderId, recipientId, createdAt, JSON.stringify(senderSnapshot), JSON.stringify(recipientSnapshot)]
      );
      
      return res.status(200).json({ success: true });
    } 
    
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      await client.query('DELETE FROM labels WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    if (client) client.release();
  }
}