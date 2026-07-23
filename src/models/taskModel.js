import pool from '../config/db.js';

export const createTaskModel = async (titulo, categoria, usuario_id) => {
  const query = `
    INSERT INTO tarefas (titulo, categoria, usuario_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [titulo, categoria || 'Estudos', usuario_id]);
  return rows[0];
};

export const getTasksByUserModel = async (usuario_id) => {
  const query = `
    SELECT * FROM tarefas 
    WHERE usuario_id = $1 
    ORDER BY criado_em DESC;
  `;
  const { rows } = await pool.query(query, [usuario_id]);
  return rows;
};

export const toggleTaskModel = async (id, usuario_id) => {
  const query = `
    UPDATE tarefas 
    SET concluida = NOT concluida 
    WHERE id = $1 AND usuario_id = $2 
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id, usuario_id]);
  return rows[0];
};

export const deleteTaskModel = async (id, usuario_id) => {
  const query = `
    DELETE FROM tarefas 
    WHERE id = $1 AND usuario_id = $2 
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id, usuario_id]);
  return rows[0];
};