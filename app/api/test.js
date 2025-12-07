// pages/api/test.js
import db from '.db./lib/db';

export default async function handler(req, res) {
  try {
    const [rows] = await db.query('SHOW TABLES');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur connexion MySQL' });
  }
}