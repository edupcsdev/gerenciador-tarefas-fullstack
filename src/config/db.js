import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL com sucesso!');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do PostgreSQL:', err);
});

export default pool;
