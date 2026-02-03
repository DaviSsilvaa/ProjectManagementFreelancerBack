const { Project } = require("../models");

function pick(body) {
  return {
    client_id: body.client_id ?? null,
    title: body.title,
    description: body.description ?? null,
    status: body.status ?? "pending",
    budget: body.budget ?? null,
    start_date: body.start_date ?? null,
    end_date: body.end_date ?? null,
  };
}

module.exports = {
  async list(req, res) {
    try {
      const projects = await Project.findAll({
        order: [["createdAt", "DESC"]],
      });
      return res.json(projects);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar projetos." });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findByPk(id);
      if (!project) return res.status(404).json({ error: "Projeto não encontrado." });

      return res.json(project);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar projeto." });
    }
  },

async create(req, res) {
    try {
      const data = pick(req.body);

      if (data.budget && typeof data.budget === 'string') {
        data.budget = Number(data.budget.replace(/\D/g, "")) / 100;
      }

      if (!data.title || String(data.title).trim().length < 3) {
        return res.status(400).json({ error: "Título é obrigatório (mín. 3 caracteres)." });
      }

      const created = await Project.create({
        ...data,
        title: String(data.title).trim(),
      });

      return res.status(201).json(created);
    } catch (err) {
      console.error("[projects:create]", err);
      // Seu tratamento de erro já está excelente para o TCC
      return res.status(500).json({
        error: "Erro ao criar projeto.",
        message: err?.message,
        details: err?.errors?.map(e => ({ message: e.message, path: e.path })) ?? null,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).json({ error: "Projeto não encontrado." });

      const data = pick(req.body);

      if (data.title && String(data.title).trim().length < 3) {
        return res.status(400).json({ error: "Título deve ter no mínimo 3 caracteres." });
      }

      await project.update({
        ...data,
        title: data.title ? String(data.title).trim() : project.title,
      });

      return res.json(project);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar projeto." });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).json({ error: "Projeto não encontrado." });

      await project.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover projeto." });
    }
  },
};
