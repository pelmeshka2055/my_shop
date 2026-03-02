import pkg from 'pg';
import "dotenv/config"

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
// Обработка ошибок пула
pool.on('error', (err, client) => {
  console.error('Неожиданная ошибка пула:', err);
});

export default pool;