'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
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