'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_game_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      login_succeed: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      login_failed: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      win_total: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      lose_total: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      draw_total: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User_game_histories');
  }
};