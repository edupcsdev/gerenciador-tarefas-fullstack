import pool from '../config/db.js';

export const createUserModel = async (nome, email, senhaHash) => {
  const query = `
    INSERT INTO usuarios (nome, email, senha)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email, criado_em;
  `;
  const values = [nome, email, senhaHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmailModel = async (email) => {
  const query = `SELECT * FROM usuarios WHERE email = $1;`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};