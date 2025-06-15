import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpotDetails, updateSpotThunk } from "../../store/spots";
import './EditSpotPage.css';

function EditSpotPage() {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const spot = useSelector(state => state.spots[spotId])
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [stateField, setStateField] = useState("")
  const [country, setCountry] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [errors, setErrors] = useState([])

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId))
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setAddress(spot.address || "")
      setCity(spot.city || "");
      setStateField(spot.state || "")
      setCountry(spot.country || "")
      setName(spot.name || "");
      setDescription(spot.description || "");
      setPrice(spot.price || "")
      setLat(spot.lat || "")
      setLng(spot.lng || "")
    }
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const spotData = {
      address, city, state: stateField, country, name, description, price, lat, lng
    };

    try {
      await dispatch(updateSpotThunk(spotId, spotData));
      navigate(`/spots/${spotId}`);
    } catch (data) {
      if (data?.errors) setErrors(data.errors)
      else setErrors(["Something went wrong."]);
    }
  };

  if (!spot) return <div>Loading...</div>;

  return (
    <div className="edit-spot-form">
      <h1>Update Your Spot</h1>

      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((err, idx) => <li key={idx}>{err}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <label>Address</label>
        <input value={address} onChange={e => setAddress(e.target.value)} required />

        <label>City</label>
        <input value={city} onChange={e => setCity(e.target.value)} required />

        <label>State</label>
        <input value={stateField} onChange={e => setStateField(e.target.value)} required />

        <label>Country</label>
        <input value={country} onChange={e => setCountry(e.target.value)} required />

        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />

        <label>Price per night (USD)</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />

        <label>Latitude</label>
        <input type="number" value={lat} onChange={e => setLat(e.target.value)} />

        <label>Longitude</label>
        <input type="number" value={lng} onChange={e => setLng(e.target.value)} />

        <button type="submit">Update Spot</button>
      </form>
    </div>
  )
}

export default EditSpotPage;
