'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Spot, SpotImage } = require('../models'); // Import the SpotImage model


module.exports = {
  async up(queryInterface, Sequelize) {
    const spots = await Spot.findAll({ order: [['createdAt', 'ASC']] });
    await SpotImage.bulkCreate(
      [
        {
          spotId: spots[0].id,
          url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
          preview: true,
        },
        {
          spotId: spots[0].id,
          url: 'https://images.pexels.com/photos/2029663/pexels-photo-2029663.jpeg',
          preview: false,
        },
        {
          spotId: spots[1].id,
          url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
          preview: true,
        },
        {
          spotId: spots[2].id,
          url: 'https://images.pexels.com/photos/4258275/pexels-photo-4258275.jpeg',
          preview: true,
        },
        {
          spotId: spots[3].id,
          url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          preview: true,
        },
        {
          spotId: spots[4].id,
          url: 'https://images.pexels.com/photos/12700376/pexels-photo-12700376.jpeg',
          preview: true,
        },
        {
          spotId: spots[5].id,
          url: 'https://images.pexels.com/photos/5178034/pexels-photo-5178034.jpeg',
          preview: true,
        },
        {
          spotId: spots[6].id,
          url: 'https://images.pexels.com/photos/4469137/pexels-photo-4469137.jpeg',
          preview: true,
        },
        {
          spotId: spots[7].id,
          url: 'https://images.pexels.com/photos/8583869/pexels-photo-8583869.jpeg',
          preview: true,
        },
        {
          spotId: spots[8].id,
          url: 'https://images.pexels.com/photos/8031956/pexels-photo-8031956.jpeg',
          preview: true,
        },
        {
          spotId: spots[9].id,
          url: 'https://images.pexels.com/photos/13544219/pexels-photo-13544219.jpeg',
          preview: true,
        },
      ],
      { validate: true, ...options } // Ensures data is validated against the model
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        'https://images.pexels.com/photos/2029663/pexels-photo-2029663.jpeg',
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
        'https://images.pexels.com/photos/4258275/pexels-photo-4258275.jpeg',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        'https://images.pexels.com/photos/12700376/pexels-photo-12700376.jpeg',
        'https://images.pexels.com/photos/5178034/pexels-photo-5178034.jpeg',
        'https://images.pexels.com/photos/4469137/pexels-photo-4469137.jpeg',
        'https://images.pexels.com/photos/8583869/pexels-photo-8583869.jpeg',
        'https://images.pexels.com/photos/8031956/pexels-photo-8031956.jpeg',
        'https://images.pexels.com/photos/13544219/pexels-photo-13544219.jpeg'
      ] }
    }, {});
  }
};
