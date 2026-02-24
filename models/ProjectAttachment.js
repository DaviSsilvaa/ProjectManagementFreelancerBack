module.exports = (sequelize, DataTypes) => {
  const ProjectAttachment = sequelize.define('ProjectAttachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'ProjectAttachments',
    timestamps: true
  });

  ProjectAttachment.associate = (models) => {
    ProjectAttachment.belongsTo(models.Project, { 
      foreignKey: 'project_id',
      as: 'project'
    });
  };

  return ProjectAttachment;
};