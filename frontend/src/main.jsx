import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal';


// This creates the Redux store
const store = configureStore();

// This is to make the store available in development mode only
// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.configureStore = store;
  window.sessionActions = sessionActions;
}

// This is to Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
    <Provider store={store}>
      <App />
      <Modal />
    </Provider>
    </ModalProvider>
  </React.StrictMode>
);
