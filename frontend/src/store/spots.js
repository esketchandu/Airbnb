import { csrfFetch } from "./csrf";

// Action Types
const load_spots = 'spots/load_spots';
const load_user_spots = 'spots/load_user_spots' // This is to separate the action for user spots
const add_spot = 'spots/add_spot';
const update_spot = 'spots/update_spot';
const delete_spot = 'spots/delete_spot';
const load_spot_details = 'spots/load_spot_details'
const clear_spots = 'spots/clear_spots'

// These are Action creators for spot
export const loadSpots = (spots) => ({
  type: load_spots,
  spots
});

// This is to separate action creator for user spots
export const loadUserSpots = (spots) => ({
  type: load_user_spots,
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

// this is action creator to clear the spots
export const clearSpots = () => ({
  type: clear_spots
});


// These are reducers for spot
// Better initial state structure

const initialState = {
  allSpots: {},
  userSpots: {}
}

export default function spotsReducer(state = initialState, action) {
  switch(action.type) {
    case load_spots:{
      const allSpots = {};
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      });
      return {
        ...state,
        allSpots };
    }

    case load_user_spots:{
      const userSpots = {};
      action.spots.forEach(spot => {
        userSpots[spot.id] = spot;
      });
      return {
        ...state,
        userSpots
      };
    }

    // add spot to both allSpots and userSpots
    case add_spot:
      return{
        ...state,
        allSpots: { ...state.allSpots, [action.spot.id]: action.spot},
        userSpots: {...state.userSpots, [action.spot.id]: action.spot}
      }

    // update both allSpots and userSpots
    case update_spot:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.spot.id]: action.spot},
        userSpots: { ...state.userSpots, [action.spot.id]: action.spot}
      }

    // delete from both allSpots and userSpots
    case delete_spot:{
      const newAllSpots = {...state.allSpots}
      const newUserSpots = {...state.userSpots}
      delete newAllSpots[action.spotId]
      delete newUserSpots[action.spotId]
      return {
        ...state,
        allSpots: newAllSpots,
        userSpots: newUserSpots
      };
    }

    // update allSpots (spot details go to all spots)
    case load_spot_details:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot
        }
    };

    // Clear all spots data
    case clear_spots:
      return {
        allSpots: {},
        userSpots: {}
      };
    default:
      return state;

  }
}

// thunk to fetch all spots

export const fetchAllSpots = () => async(dispatch) => {
  const res = await fetch('/api/spots')

  if(res.ok){
    const data = await res.json()
    dispatch(loadSpots(data.Spots));
  }
};

// thunk to fetch current user's spots
export const fetchUserSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current', { credentials: 'include' });
  if (res.ok) {
    const data = await res.json();
    dispatch(loadUserSpots(data.Spots));  // Here I am using separate action
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

// thunk to create a new spot

export const createSpot = (spotData) => async(dispatch) => {

  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price
    })
  });

  if(!res.ok) {
    const errorData = await res.json()
    throw errorData
  }

  const newSpot = await res.json()

  const imageUrls = [
    {url: spotData.previewImage, preview: true},
    ...(spotData.image1 ? [{url: spotData.image1, preview: false}] : []),
    ...(spotData.image2 ? [{url: spotData.image2, preview: false}] : []),
    ...(spotData.image3 ? [{url: spotData.image3, preview: false}] : []),
    ...(spotData.image4 ? [{url: spotData.image4, preview: false}] : [])
  ]

  for(let img of imageUrls) {
    await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(img)
    })

    if(img.preview === true){
      newSpot.previewImage = img.url // this is to make sure that newSpot gets previewImage when added to redux
    }
  }

  // Next is to dispatch to redux so the new spot will appear in the all spots list
  dispatch(addSpot(newSpot))

  return newSpot
}

// thunk to update a spot

export const updateSpotThunk = (spotId, spotData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }

  const updatedSpot = await res.json();

  dispatch(updateSpot(updatedSpot));  // this updates Redux store
  return updatedSpot;
};
