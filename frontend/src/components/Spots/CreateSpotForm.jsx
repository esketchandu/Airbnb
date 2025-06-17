import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {createSpot} from "../../store/spots";
import "./CreateSpotForm.css";

function CreateSpotForm(){
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};

    // Validating required fields

    if(!country) newErrors.country = "Country is required";
    if(!address) newErrors.address = "Address is required";
    if(!city) newErrors.city = "City is required";
    if(!state) newErrors.state = "State is required";
    if(!description || description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if(!name) newErrors.name = "Name is required";
    if(!price) newErrors.price = "Price is required";
    if(!previewImage || !isValidImage(previewImage)) newErrors.previewImage = "Preview image URL is required and must end in .png, .jpg, or .jpeg";

    // validation for additional image URLs
    if(image1 && !isValidImage(image1)) newErrors.image1 = "Image URL must end in .png, .jpg, or .jpeg";
    if(image2 && !isValidImage(image2)) newErrors.image2 = "Image URL must end in .png, .jpg, or .jpeg";
    if(image3 && !isValidImage(image3)) newErrors.image3 = "Image URL must end in .png, .jpg, or .jpeg";
    if(image4 && !isValidImage(image4)) newErrors.image4 = "Image URL must end in .png, .jpg, or .jpeg";


    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors)
      return;
    }

    const spotData = {
      country,
      address,
      city,
      state,
      lat: parseFloat(lat) || null,
      lng: parseFloat(lng) || null,
      description,
      name,
      price: parseFloat(price),
      previewImage,
      image1,
      image2,
      image3,
      image4
    }

    try{
      const newSpot = await dispatch(createSpot(spotData))
      navigate(`/spots/${newSpot.id}`);
    } catch (resErrors) {
      setErrors(resErrors)
    }
  };

  const isValidImage = (url) => {
    return url.match(/\.(png|jpg|jpeg)$/);
  }

  return(
    <form className="create-spot-form" onSubmit={handleSubmit}>
      <h1>Create a New Spot</h1>

      <div className="location-section">
      {/* Information related to location */}
      <h2>Where&apos;s your place located?</h2>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
      {errors.country && <p className="error">{errors.country}</p>}

      <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      {errors.address && <p className="error">{errors.address}</p>}

      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      {errors.city && <p className="error">{errors.city}</p>}

      <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
      {errors.state && <p className="error">{errors.state}</p>}

      <input placeholder="Latitude (optional)" value={lat} onChange={(e) => setLat(e.target.value)} />
      <input placeholder="Longitude (optional)" value={lng} onChange={(e) => setLng(e.target.value)} />
      </div>

      {/* Information related to description */}
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, and special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
      <textarea placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} />
      {errors.description && <p className="error">{errors.description}</p>}

      {/* Information related to title */}
      <h2>Create a title for your spot</h2>
      <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
      <input type="text" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)} />
      {errors.name && <p className="error">{errors.name}</p>}

      {/* Information related to price */}
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
      <input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)} />
      {errors.price && <p className="error">{errors.price}</p>}

      {/* Information related to Image */}
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <input type="text" placeholder="Preview Image URL" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} />
      {errors.previewImage && <p className="error">{errors.previewImage}</p>}

      <input placeholder="Image URL" value={image1} onChange={(e) => setImage1(e.target.value)} />
      <input placeholder="Image URL" value={image2} onChange={(e) => setImage2(e.target.value)} />
      <input placeholder="Image URL" value={image3} onChange={(e) => setImage3(e.target.value)} />
      <input placeholder="Image URL" value={image4} onChange={(e) => setImage4(e.target.value)} />

      <button type="submit">Create Spot</button>
    </form>
  );

}

export default CreateSpotForm;
