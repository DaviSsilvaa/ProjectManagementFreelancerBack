'use strict';
const { Client } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { name, email, phone, company, notes } = req.body;

      // Verifica se os campos obrigatórios foram preenchidos
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
      }

      // Pega o ID do usuário que está logado, que vem do middleware de autenticação
      const owner_user_id = req.user.id;

      // Cria o cliente no banco de dados
      const client = await Client.create({
        owner_user_id,
        name,
        email,
        phone,
        company,
        notes
      });

      return res.status(201).json(client);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
    }
  },

  async listAll(req, res) {
    try {
      const clients = await Client.findAll({
        where: { owner_user_id: req.user.id }
      });

      return res.json(clients);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar clientes', details: error.message });
    }
  },

  async getById(request, response) {
  try {
    // 1. Pega o ID do cliente a partir da URL
    const { id } = request.params; 

    // 2. Pega o ID do usuário que está logado (vem do seu AuthMiddleware)
    const userId = request.user.id; // ou request.userId, dependendo de como o seu middleware guarda

    // 3. Procura o cliente no banco de dados
    const client = await Client.findOne({
      where: {
        id: id,               // Onde o 'id' é o que veio da URL
        owner_user_id: userId // E o dono é o usuário logado
      }
    });

    // 4. Se não encontrar (ou se o cliente for de outro usuário),
    //    retorna 404 Not Found.
    if (!client) {
      return response.status(404).json({ error: 'Cliente não encontrado' });
    }

    // 5. Se encontrar, retorna o cliente
    return response.status(200).json(client);

  } catch (err) {
    return response.status(500).json({ error: 'Erro interno no servidor' });
  }
},

async remove(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user.id;

      const deleted = await Client.destroy({
        where: { id, owner_user_id: ownerId }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Sem body por padrão para DELETE
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir cliente', details: error.message });
    }
  }

};