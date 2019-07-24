"use strict";
import bcrypt from "bcryptjs";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const today = new Date(Date.UTC(2019, 6, 23, 21, 0, 0, 0));

    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Daniel Sena",
          email: "danielsena04@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: true,
          created_at: today,
          updated_at: today
        },
        {
          name: "Ana Sena",
          email: "anasena@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: true,
          created_at: today,
          updated_at: today
        },
        {
          name: "André Sena",
          email: "andre@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: true,
          created_at: today,
          updated_at: today
        },
        {
          name: "Albert Natividade",
          email: "albert@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: false,
          created_at: today,
          updated_at: today
        },
        {
          name: "Victor Nativo",
          email: "victor@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: false,
          created_at: today,
          updated_at: today
        },
        {
          name: "Angela Luna",
          email: "angela@gmail.com",
          password_hash: bcrypt.hashSync("abc1234", salt),
          provider: false,
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
    return queryInterface.bulkDelete("users", null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
