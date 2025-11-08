'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      project_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'Projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2)
      },
      due_date: { type: Sequelize.DATEONLY },
      paid_at: { type: Sequelize.DATE },
      status: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'pendente'
      },
      notes: { type: Sequelize.TEXT },
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
    await queryInterface.addIndex('Invoices', ['status']);
    await queryInterface.addIndex('Invoices', ['project_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Invoices');
  }
};
