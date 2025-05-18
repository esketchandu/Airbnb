// Action Types
const load_spots = 'spots/load_spots';
const add_spot = 'spots/add_spot';
const update_spot = 'spots/update_spot';
const delete_spot = 'spots/delete_spot';
const load_spot_details = 'spots/load_spot_details'

// These are Action creators for spot
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

export const loadSpotDetails = (spot) => ({
  type: load_spot_details,
  spot
});


// These are reducers for spot

const initialState = {}

export default function spotsReducer(state = initialState, action) {
  switch(action.type) {
    case load_spots:{
      const allSpots = {};
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      });
      return allSpots;
    }
    case add_spot:
      return{...state, [action.spot.id]: action.spot};

    case update_spot:
      return {...state, [action.spot.id]: action.spot};

    case delete_spot:{
      const newState = {...state}
      delete newState[action.spotId]
      return newState;
    }
    case load_spot_details:
      return {
        ...state,
        [action.spot.id]: action.spot
    }
    default:
      return state;

  }
}

// spots thunk to fetch all spots

export const fetchAllSpots = () => async(dispatch) => {
  const res = await fetch('/api/spots')

  if(res.ok){
    const data = await res.json()
    dispatch(loadSpots(data.Spots));
  }
};

// thunk to get the details of a single spot

export const fetchSpotDetails = (spotId) => async(dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`)
  if(res.ok){
    const spot = await res.json();
    dispatch(loadSpotDetails(spot));
  }
};
