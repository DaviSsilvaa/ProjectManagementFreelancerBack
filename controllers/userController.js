'use strict';
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Nome é obrigatório' });
      }
      if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Senha é obrigatória' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password_hash,
      });

      user.password_hash = undefined;  // Remove a senha da resposta
      return res.status(201).json(user);

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
      return res.status(500).json({ message: 'Erro ao registrar usuário', details: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Senha é obrigatória' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }

const token = jwt.sign(
  { 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

      user.password_hash = undefined;  // Remove a senha da resposta
      return res.json({
        user,
        token
      });

    } catch (error) {
      return res.status(500).json({ message: 'Erro ao fazer login', details: error.message });
    }
  },

async updateProfile(req, res) {
  try {
    const { name, role, specialty } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    await user.update({ 
      name, 
      role,
      specialty 
    });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar perfil no servidor." });
  }
},


async updateRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    await user.update({ role });
    return res.json({ message: "Role atualizado com sucesso!", user });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar role." });
  }
}



};
