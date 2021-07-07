import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { StateProvider } from './contextAPI/StateProvider';
import { initialState, reducer } from './contextAPI/reducer';

ReactDOM.render(
  <SnackbarProvider maxSnacks={3}>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </SnackbarProvider>,
  document.getElementById('root')
);
