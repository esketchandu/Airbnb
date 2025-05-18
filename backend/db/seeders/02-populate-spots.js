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
        {
          ownerId: 1,
          address: '46040 Galileo Dr',
          city: 'Fishers',
          state: 'Indiana',
          country: 'United States of America',
          lat: 39.9569,
          lng: -86.015547,
          name: 'Spacious Master Bedroom Flat',
          description: 'A cozy place for family vacation',
          price: 95,
        },
        {
          ownerId: 2,
          address: '99 Ocean View',
          city: 'Miami',
          state: 'Florida',
          country: 'United States of America',
          lat: 25.76,
          lng: -80.2928,
          name: 'Great Place With Water View',
          description: 'Ideal place for beach lovers!',
          price: 275,
        },
        {
          ownerId: 3,
          address: '4300 The Woods Dr',
          city: 'San Jose',
          state: 'California',
          country: 'United States of America',
          lat: 34.106,
          lng: -118.293683,
          name: 'Kids friendly neighborhood',
          description: 'Townhouse with community swimming pool',
          price: 100,
        },
        {
          ownerId: 4,
          address: '33 Quiet Lane',
          city: 'Seattle',
          state: 'Washington',
          country: 'United States of America',
          lat: 47.6778,
          lng: -122.3957,
          name: 'Great for Rain Lovers',
          description: 'Cozy and peaceful escape',
          price: 120,
        },
        {
          ownerId: 2,
          address: '101 Hilltop Drive',
          city: 'Nashville',
          state: 'Tennessee',
          country: 'United States of America',
          lat: 37.1078,
          lng: -86.7997,
          name: 'Windy city view',
          description: 'Great view',
          price: 110,
        },
        {
          ownerId: 3,
          address: '2350 Cresthaven St',
          city: 'Milpitas',
          state: 'California',
          country: 'United States of America',
          lat: 37.4323,
          lng: 121.8996,
          name: 'Calm place for work',
          description: 'Family friendly location',
          price: 150,
        }

      ],
      { validate: true,
        ...options
       } // Ensure data is validated against the model
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'App Academy',
        'Tech House',
        'Creative Space',
        'Startup Central',
        'Spacious Master Bedroom Flat',
        'Great Place With Water View',
        'Kids friendly neighborhood',
        'Great for Rain Lovers',
        'Windy city view',
        'Calm place for work'
      ]}
    }, {});
  }
};
