const { Project, ProjectAttachment, Client, ProjectLog } = require("../models");

function pick(body) {
  return {
    client_id: body.client_id ?? null,
    title: body.title,
    description: body.description ?? null,
    status: body.status,
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
      include: [
        { model: Client, as: "client" },
        { association: "ProjectAttachments" },
        { association: "ProjectLogs" }
      ],
    });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao listar projetos." });
  }
},

  async listAll(req, res) {
    try {
      const projects = await Project.findAll({
        where: { owner_user_id: req.user.id },
        include: [{ 
          association: 'client', 
          attributes: ['name']
        },
        {
          association: "ProjectAttachments"
        },
        {
          association: "ProjectLogs",
        }
      ],
        order: [['updatedAt', 'DESC']]
      });
      return res.json(projects);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao carregar projetos." });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id, {
        include: [
          { association: "ProjectAttachments" },
          { association: "client" },
          { association: "ProjectLogs" }
        ],
      });

      if (!project) return res.status(404).json({ error: "Projeto não encontrado." });
      return res.json(project);
    } catch (err) {
      console.error("[projects:getById] Erro:", err);
      return res.status(500).json({ error: "Erro ao buscar projeto.", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = pick(req.body);

      if (data.budget && typeof data.budget === "string") {
        data.budget = Number(data.budget.replace(/\D/g, "")) / 100;
      }

      if (!data.title || String(data.title).trim().length < 3) {
        return res.status(400).json({ error: "Título é obrigatório (mín. 3 caracteres)." });
      }

      const created = await Project.create({
        ...data,
        title: String(data.title).trim(),
        owner_user_id: req.user.id 
      });

      await ProjectLog.create({
        project_id: created.id,
        user_name: req.user.name || "Davi Developer",
        action: "CRIAÇÃO",
        description: `Projeto formalizado com orçamento inicial de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(created.budget)}.`
      });

      return res.status(201).json(created);
    } catch (err) {
      console.error("[projects:create]", err);
      return res.status(500).json({ error: "Erro ao criar projeto." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).json({ error: "Projeto não encontrado." });

      const isAdmin = req.user.role === 'admin';
      const isOwner = project.owner_user_id === req.user.id;

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Acesso negado a este projeto." });
      }

      const oldStatus = project.status;
      const updates = req.body;

      if (updates.title && String(updates.title).trim().length < 3) {
        return res.status(400).json({ error: "Título deve ter no mínimo 3 caracteres." });
      }

      if (updates.status) updates.status = updates.status.toUpperCase();

      await project.update(updates);

      if (updates.status && updates.status !== oldStatus) {
        await ProjectLog.create({
          project_id: id,
          user_name: req.user.name || "Davi Developer",
          action: "MUDANÇA DE STATUS",
          description: `O projeto foi movido de "${oldStatus}" para "${updates.status}".`
        });
      }

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
      
      // Bloqueio de deleção para não-donos ou não-admins
      if (project.owner_user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Acesso negado." });
      }

      await project.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover projeto." });
    }
  },

  async getAiAnalysis(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id, { include: [{ model: Client, as: "client" }] });

      if (!project) return res.status(404).json({ error: "Projeto não encontrado para análise." });

      const aiService = require("../api/services/aiServices");
      const insights = await aiService.generateProjectInsights(project, project.client, { name: "Davi" });

      return res.json(insights);
    } catch (err) {
      console.error("[AI Analysis Error]:", err);
      return res.status(500).json({ error: "Falha na comunicação com a IA." });
    }
  }
};