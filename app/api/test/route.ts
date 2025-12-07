// app/api/test/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Connexion MySQL (test)
const pool = mysql.createPool({
  host: '109.234.166.98',       // serveur MySQL
  user: 'kubi8227_kubi8227',          // utilisateur
  password: 'vn_F26rZFk{A',       // mot de passe
  database: 'kubi8227_elite',      // base
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur connexion MySQL', error: error.message }, { status: 500 });
  }
}
