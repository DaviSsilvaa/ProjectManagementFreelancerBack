module.exports = (sequelize, DataTypes) => {
  const AttachmentLog = sequelize.define('AttachmentLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Pode ser nulo se você ainda não tiver sistema de login pronto
    },
    action: {
      type: DataTypes.STRING, // Ex: 'UPLOAD', 'DELETE', 'VIEW'
      allowNull: false
    },
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING
  }, {
    tableName: 'AttachmentLogs',
    timestamps: true
  });

  AttachmentLog.associate = (models) => {
    AttachmentLog.belongsTo(models.ProjectAttachment, { foreignKey: 'attachment_id' });
  };

  return AttachmentLog;
};