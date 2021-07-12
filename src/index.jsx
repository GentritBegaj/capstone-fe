import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { StateProvider } from './contextAPI/StateProvider';
import { initialState, reducer } from './contextAPI/reducer';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <SnackbarProvider>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
        <App />
      </Router>
    </StateProvider>
  </SnackbarProvider>,
  document.getElementById('root')
);
