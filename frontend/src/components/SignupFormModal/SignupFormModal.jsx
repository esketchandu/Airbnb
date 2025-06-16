import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // Reset form when modal opens
  useEffect(() => {
    setEmail("");           // This clears email field
    setUsername("");        // This clears username field
    setFirstName("");       // This clears first name field
    setLastName("");        // This clears last name field
    setPassword("");        // This clears password field
    setConfirmPassword(""); // This clears confirm password field
    setErrors({});          // This clears any error messages
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // check password match before making API call
    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
      return;
    }

    // Clear errors and attempt signup
    setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal) // Close modal on success and auto-login
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
  };

  const isButtonDisabled = (
    !email ||                           // Email is empty
    !username ||                        // Username is empty
    !firstName ||                       // First name is empty
    !lastName ||                        // Last name is empty
    !password ||                        // Password is empty
    !confirmPassword ||                 // Confirm password is empty
    username.length < 4 ||              // Username less than 4 characters
    password.length < 6 ||              // Password less than 6 characters
    password !== confirmPassword        // Passwords don't match
  );

   return (
    <div className="signup-form-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="error-message">{errors.username}</p>}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        <button type="submit" disabled={isButtonDisabled}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
