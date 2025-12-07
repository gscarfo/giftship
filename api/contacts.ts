import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let client;

  try {
    client = await pool.connect();

    if (req.method === 'GET') {
      const { type } = req.query;
      const result = await client.query(
        'SELECT id, first_name as "firstName", last_name as "lastName", address, city, province, zip_code as "zipCode", phone FROM contacts WHERE type = $1',
        [type]
      );
      return res.status(200).json(result.rows);
    } 
    
    else if (req.method === 'POST') {
      const { id, firstName, lastName, address, city, province, zipCode, phone } = req.body.contact;
      const type = req.body.type;

      const query = `
        INSERT INTO contacts (id, first_name, last_name, address, city, province, zip_code, phone, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          province = EXCLUDED.province,
          zip_code = EXCLUDED.zip_code,
          phone = EXCLUDED.phone
      `;

      await client.query(query, [id, firstName, lastName, address, city, province, zipCode, phone, type]);
      return res.status(200).json({ success: true });
    } 
    
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      // First delete associated labels to avoid FK constraint error
      // Note: This relies on labels table existing.
      try {
        await client.query('DELETE FROM labels WHERE sender_id = $1 OR recipient_id = $1', [id]);
      } catch (e) {
        // Ignore if labels table doesn't exist yet
        console.warn('Labels table might not exist or other error', e);
      }
      await client.query('DELETE FROM contacts WHERE id = $1', [id]);
      
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