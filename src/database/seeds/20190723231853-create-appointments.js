"use strict";

import User from "../../app/models/User";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Users providers
     */
    const user = User.init(queryInterface.sequelize);
    const today = new Date(Date.UTC(2019, 6, 23, 21, 0, 0, 0));

    const userDaniel = await user.findOne({
      where: { email: "danielsena04@gmail.com" }
    });

    const userAna = await user.findOne({
      where: { email: "anasena@gmail.com" }
    });

    const userAndre = await user.findOne({
      where: { email: "andre@gmail.com" }
    });

    /**
     * Users not providers
     */
    const userVictor = await user.findOne({
      where: { email: "victor@gmail.com" }
    });

    const userAngela = await user.findOne({
      where: { email: "angela@gmail.com" }
    });

    const userAlbert = await user.findOne({
      where: { email: "albert@gmail.com" }
    });

    return queryInterface.bulkInsert(
      "appointments",
      [
        {
          date: today,
          cancelled_at: null,
          provider_id: userDaniel.id,
          user_id: userAlbert.id,
          created_at: today,
          updated_at: today
        },
        {
          date: today,
          cancelled_at: null,
          provider_id: userAna.id,
          user_id: userVictor.id,
          created_at: today,
          updated_at: today
        },
        {
          date: today,
          cancelled_at: null,
          provider_id: userAndre.id,
          user_id: userAngela.id,
          created_at: today,
          updated_at: today
        }
      ],
      {}
    );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("appointments", null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
