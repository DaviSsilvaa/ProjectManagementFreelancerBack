module.exports = (sequelize, DataTypes) => {
  const ProjectLog = sequelize.define("ProjectLog", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    user_name: { type: DataTypes.STRING, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },    
    description: { type: DataTypes.TEXT },            
  });

  ProjectLog.associate = (models) => {
    // O Log pertence a um Projeto
    ProjectLog.belongsTo(models.Project, { foreignKey: "project_id", as: "project" });
  };

  return ProjectLog;
};