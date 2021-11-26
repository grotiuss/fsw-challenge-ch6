'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_game_biodata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        unique:true,
        allowNull:false,
        type: Sequelize.STRING
      },
      fullname: {
        defaultValue: '',
        type: Sequelize.STRING
      },
      age: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      address: {
        defaultValue: '',
        type: Sequelize.STRING
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
    await queryInterface.dropTable('User_game_biodata');
  }
};