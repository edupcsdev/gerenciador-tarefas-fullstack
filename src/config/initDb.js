import pool from './db.js';

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(50) DEFAULT 'Estudos',
      concluida BOOLEAN DEFAULT FALSE,
      usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    await pool.query(`ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) DEFAULT 'Estudos';`);
    console.log('Tabelas e colunas verificadas/criadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas no PostgreSQL:', err);
  }
};

export default createTables;
