'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          id: 1,
          userId: 1,
          spotId: 1,
          review: 'This was an awesome spot!',
          stars: 5,
        },
        {
          id: 2,
          userId: 2,
          spotId: 2,
          review: 'Family friendly place!',
          stars: 4,
        },
        {
          id: 3,
          userId: 3,
          spotId: 1,
          review: 'Great view but the place is not tidy',
          stars: 3,
        },
      ],
      { validate: true } // Ensures data is validated against the model
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
