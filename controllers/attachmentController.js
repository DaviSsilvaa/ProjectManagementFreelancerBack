const { ProjectAttachment, AttachmentLog } = require('../models');

const fs = require('fs');
const path = require('path');

module.exports = {

  async store(req, res) {
    try {
      const { project_id } = req.params;
      if (!req.file) return res.status(400).json({ error: "Arquivo não enviado." });

      const attachment = await ProjectAttachment.create({
        project_id,
        original_name: req.file.originalname,
        file_name: req.file.filename,
        file_type: req.file.mimetype
      });

      await AttachmentLog.create({
        attachment_id: attachment.id,
        user_id: req.user?.id || null,
        action: 'UPLOAD',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      return res.status(201).json(attachment);
    } catch (err) {
      console.error("ERRO NO UPLOAD COM LOG:", err);
      return res.status(500).json({ error: err.message });
    }
  },


  async deleteAttachment(req, res) {
  try {
    const { id } = req.params;

    // Busca o anexo para ter os dados antes de deletar
    const attachment = await ProjectAttachment.findByPk(id);

    if (!attachment) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    // 1. LIMPEZA DE LOGS (Resolve o SequelizeForeignKeyConstraintError)
    // Deletamos todos os registros na tabela 'AttachmentLogs' que apontam para este ID
    await AttachmentLog.destroy({ 
      where: { attachment_id: id } 
    });

    // 2. EXCLUSÃO DO ARQUIVO FÍSICO (Linux)
    const filePath = path.resolve(__dirname, '..', 'uploads', 'projects', attachment.file_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3. REGISTRO FINAL DE AUDITORIA (Cybersecurity)
    // Criamos um log de sistema informando a remoção definitiva
    // Usamos o project_id para que este log não dependa mais do anexo deletado
    if (AttachmentLog) {
      await AttachmentLog.create({
        action: 'DELETE_PERMANENT',
        attachment_id: null, // Deixamos nulo pois o arquivo sumiu
        ip_address: req.ip || '127.0.0.1',
        user_agent: req.headers['user-agent'],
        // Detalhes extras para o seu TCC
        details: `Arquivo ${attachment.original_name} removido permanentemente.`
      }).catch(err => console.log("Erro ao logar exclusão final:", err));
    }

    // 4. DELEÇÃO DO REGISTRO DO ANEXO
    await attachment.destroy();

    return res.json({ message: 'Arquivo e históricos removidos com sucesso!' });
  } catch (error) {
    console.error('Erro na exclusão:', error);
    return res.status(500).json({ 
      message: 'Erro de integridade no banco de dados',
      error: error.name 
    });
  }
},

async getAuditLogs(req, res) {
  try {
    const { project_id } = req.params;
    
    const logs = await AttachmentLog.findAll({
      include: [{
        model: ProjectAttachment,
        where: { project_id },
        attributes: ['original_name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10 // Mostra apenas os 10 mais recentes para não poluir
    });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar logs de auditoria." });
  }
},


  async index(req, res) {
    try {
      const { project_id } = req.params;

      const attachments = await ProjectAttachment.findAll({
        where: { project_id },
        order: [['createdAt', 'DESC']]
      });

      return res.json(attachments);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar anexos." });
    }
  }
};