"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("appointments", "data", "date");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("appointments", "date", "data");
  }
};
