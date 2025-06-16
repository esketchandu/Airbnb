import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigation">
      <div className="nav-left">
        <NavLink to="/" className="logo-link">
          <div className="logo">
            <img src="/eske-logo.png" alt="Eske Logo" className="logo-image" />
            <span className="logo-text">Your Home</span>
          </div>
        </NavLink>
      </div>

      <div className="nav-right">
        {isLoaded && (
          <>
            {sessionUser && (

              <NavLink to="/spots/new" className="create-spot-link">
                Create a New Spot
              </NavLink>
            )}

            <ProfileButton user={sessionUser} />
          </>
        )}
      </div>
    </nav>
  );
}
export default Navigation;
