'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};