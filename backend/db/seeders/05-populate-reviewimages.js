'use strict';

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Specify schema in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: 'https://image1.jpg',
        },
        {
          reviewId: 1,
          url: 'https://image2.jpg',
        },
        {
          reviewId: 2,
          url: 'https://image3.jpg',
        },
        {
          reviewId: 3,
          url: 'https://image4.jpg',
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'; // Specify the table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            'https://image1.jpg',
            'https://image2.jpg',
            'https://image3.jpg',
            'https://image4.jpg',
          ],
        },
      },
      {}
    );
  },
};
