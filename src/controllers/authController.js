import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserModel, findUserByEmailModel } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt_projeto_123';

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
    }

    const userExists = await findUserByEmailModel(email);
    if (userExists) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado!' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const newUser = await createUserModel(nome, email, senhaHash);

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: newUser
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios!' });
    }

    const user = await findUserByEmailModel(email);
    if (!user) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};