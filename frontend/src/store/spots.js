// Action Types
const load_spots = 'spots/load_spots';
const add_spot = 'spots/add_spot';
const update_spot = 'spots/update_spot';
const delete_spot = 'spots/delete_spot';

// Action cretors
export const loadSpots = (spots) => ({
  type: load_spots,
  spots
});

export const addSpot = (spot) => ({
  type: add_spot,
  spot
});

export const updateSpot = (spot) => ({
  type: update_spot,
  spot
});

export const deleteSpot = (spotId) => ({
 type: delete_spot,
 spotId
});
