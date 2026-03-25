"use strict";
const { Client } = require("../models");

module.exports = {
  async create(req, res) {
    try {
      const { name, email, phone, company, notes } = req.body;

      if (!name || !email || !phone) {
        return res
          .status(400)
          .json({ error: "Nome, email e telefone são obrigatórios" });
      }

      const owner_user_id = req.user.id;

      const client = await Client.create({
        owner_user_id,
        name,
        email,
        phone,
        company,
        notes,
      });

      return res.status(201).json(client);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao criar cliente", details: error.message });
    }
  },

  async listAll(req, res) {
    try {
      const clients = await Client.findAll({
        where: { owner_user_id: req.user.id },
      });

      return res.json(clients);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao listar clientes", details: error.message });
    }
  },

  async getById(request, response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const client = await Client.findOne({
        where: { id: id, owner_user_id: userId },
        include: [
          {
            association: "Projects",
            attributes: ["id", "title", "budget", "status"],
          },
        ],
      });

      if (!client) {
        return response.status(404).json({ error: "Cliente não encontrado" });
      }

      return response.status(200).json(client);
    } catch (err) {
      console.error("Erro no getById:", err);
      return response.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user.id;

      const deleted = await Client.destroy({
        where: { id, owner_user_id: ownerId },
      });

      if (!deleted) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao excluir cliente", details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const owner_user_id = req.user.id;
      const { name, email, phone, company, notes } = req.body;

      const client = await Client.findOne({
        where: { id, owner_user_id }
      });

      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      await client.update({
        name,
        email,
        phone,
        company,
        notes
      });

      return res.json(client);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao atualizar cliente", details: error.message });
    }
  },
};
