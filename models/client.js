'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      this.hasMany(models.Project, {
    foreignKey: 'client_id', // Certifique-se que este é o nome da coluna no seu banco
    as: 'Projects' // Este apelido deve bater com o 'include' do Controller
  });
    }
  }
  Client.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    owner_user_id: DataTypes.UUID,
    name: DataTypes.STRING,
    email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
    phone: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('phone', value.replace(/\D/g, ''));
    }
  },
    company: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};