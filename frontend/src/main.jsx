import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';


// This creates the Redux store
const store = configureStore();

// This is to make the store available in development mode only
if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

// This is to Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
