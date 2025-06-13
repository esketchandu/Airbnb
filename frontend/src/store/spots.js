import { csrfFetch } from "./csrf";

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
    dispatch(loadSpots(data.Spots));  // reused existing action creator
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
