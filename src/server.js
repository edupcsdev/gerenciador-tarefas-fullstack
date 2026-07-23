import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createTables from './config/initDb.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

const app = express();
app.use(cors());
app.use(express.json());

createTables();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Gerenciador de Tarefas funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
