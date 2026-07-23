import { Router } from 'express';
import { getTasks, createTask, toggleTask, deleteTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', toggleTask);
router.delete('/:id', deleteTask);

export default router;