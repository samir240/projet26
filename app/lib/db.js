// lib/db.js
import mysql from 'mysql2/promise';

// Connexion MySQL pour test direct
const pool = mysql.createPool({
  host: 'kubi8228.mysql.db',      // serveur MySQL fourni par o2switch
  user: 'kubi8227_kubi8227',         // utilisateur MySQL
  password: 'vn_F26rZFk{A',      // mot de passe utilisateur
  database: 'kubi8228_elite',     // nom de la base de données
  port: 3306,                      // port MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
