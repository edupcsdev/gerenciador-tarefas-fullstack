import { 
  createTaskModel, 
  getTasksByUserModel, 
  toggleTaskModel, 
  deleteTaskModel 
} from '../models/taskModel.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksByUserModel(req.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { titulo, categoria } = req.body;

    if (!titulo) {
      return res.status(400).json({ mensagem: 'O título da tarefa é obrigatório!' });
    }

    const newTask = await createTaskModel(titulo, categoria, req.userId);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await toggleTaskModel(id, req.userId);

    if (!updatedTask) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await deleteTaskModel(id, req.userId);

    if (!deletedTask) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }

    res.json({ mensagem: 'Tarefa removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};