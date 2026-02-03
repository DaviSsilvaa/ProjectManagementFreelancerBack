'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {

    static associate(models) {
  this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
}
  }
  Project.init({
    client_id: DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    budget: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};