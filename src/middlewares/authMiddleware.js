import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt_projeto_123';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido. Acesso negado.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensagem: 'Formato de token inválido.' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; 
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado!' });
  }
};