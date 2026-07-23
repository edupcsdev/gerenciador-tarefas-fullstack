import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_yYrnvEi43sCH@ep-cool-waterfall-acjmf33j.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL com sucesso!');
});

export default pool;