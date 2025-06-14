import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import AllSpotsPage from './components/Spots/AllSpotsPage';
import SpotDetailPage from './components/Spots/SpotDetailPage';
import CreateSpotForm from './components/Spots/CreateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // {
      //   path: '/',
      //   element: <h1>Welcome!</h1>
      // },
      {
        //path: '/spots',
        path: '/',
        element: <AllSpotsPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailPage />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
