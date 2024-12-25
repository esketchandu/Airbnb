'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: '123 Disney Lane',
          city: 'San Francisco',
          state: 'California',
          country: 'United States of America',
          lat: 37.7645358,
          lng: -122.4730327,
          name: 'App Academy',
          description: 'Place where web developers are created',
          price: 123,
        },
        {
          ownerId: 2,
          address: '4500 The Woods Dr',
          city: 'San Jose',
          state: 'California',
          country: 'United States of America',
          lat: 34.052235,
          lng: -118.243683,
          name: 'Tech House',
          description: 'A tech house for tech enthusiasts.',
          price: 200,
        },
        {
          ownerId: 3,
          address: '789 Creative Ave',
          city: 'New York',
          state: 'New York',
          country: 'United States of America',
          lat: 40.712776,
          lng: -74.005974,
          name: 'Creative Space',
          description: 'Inspiring space for creative minds.',
          price: 150,
        },
        {
          ownerId: 4,
          address: '101 Startup Blvd',
          city: 'Austin',
          state: 'Texas',
          country: 'United States of America',
          lat: 30.267153,
          lng: -97.743057,
          name: 'Startup Central',
          description: 'Perfect place for startups to thrive.',
          price: 175,
        },
      ],
      { validate: true } // Ensure data is validated against the model
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy','Tech House','Creative Space','Startup Central'] }
    }, {});
  }
};
