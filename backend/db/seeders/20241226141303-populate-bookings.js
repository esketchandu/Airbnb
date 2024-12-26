'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 2,
          startDate: '2021-11-19',
          endDate: '2021-11-20',
        },
        {
          spotId: 2,
          userId: 3,
          startDate: '2021-11-21',
          endDate: '2021-11-25',
        },
        {
          spotId: 3,
          userId: 1,
          startDate: '2021-11-22',
          endDate: '2021-11-24',
        },
        {
          spotId: 4,
          userId: 4,
          startDate: '2021-12-01',
          endDate: '2021-12-05',
        },
      ],
      { validate: true } // Ensures data is validated against the model
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'; // Specify the table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4] },
        userId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
