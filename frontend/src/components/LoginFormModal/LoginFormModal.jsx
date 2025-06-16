import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // This clears form when modal opens
  useEffect(() => {
    setCredential("")
    setPassword("")
    setErrors({})
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear any existing errors
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  // Demo user button logic
  const handleDemoUser = () => {
    setErrors({}); // Clear errors when demo user button is clicked
    dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(() => {});
  };

  return (

    <div className="login-form-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}

        {/* Added disabled logic directly on button */}
        <button type="submit" disabled={credential.length < 4 || password.length < 6}>
          Log In
        </button>

        {/* Added Demo user button */}
        <button type="button" className="demo-button" onClick={handleDemoUser}>
          Log in as Demo User
        </button>

      </form>
    </div>
  );
}

export default LoginFormModal;
