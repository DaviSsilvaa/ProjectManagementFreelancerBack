'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      client_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'Clients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      description: { type: Sequelize.TEXT },
      status: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'proposta'
      },
      budget: { type: Sequelize.DECIMAL(12, 2) },
      start_date: { type: Sequelize.DATEONLY },
      end_date: { type: Sequelize.DATEONLY },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
    await queryInterface.addIndex('Projects', ['status']);
    await queryInterface.addIndex('Projects', ['client_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Projects');
  }
};
