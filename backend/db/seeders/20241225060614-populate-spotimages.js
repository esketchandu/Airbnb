'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { SpotImage } = require('../models'); // Import the SpotImage model

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: 'https://image1.jpg',
          preview: true,
        },
        {
          spotId: 1,
          url: 'https://image2.jpg',
          preview: false,
        },
        {
          spotId: 2,
          url: 'https://image3.jpg',
          preview: true,
        },
        {
          spotId: 3,
          url: 'https://image4.jpg',
          preview: true,
        },
        {
          spotId: 4,
          url: 'https://image5.jpg',
          preview: true,
        },
      ],
      { validate: true } // Ensures data is validated against the model
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'SpotImages', // Table name
      {
        url: {
          [Op.in]: [
            'https://image1.jpg',
            'https://image2.jpg',
            'https://image3.jpg',
            'https://image4.jpg',
            'https://image5.jpg',
          ],
        },
      },
      {}
    );
  },
};
