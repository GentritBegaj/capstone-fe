import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import LoginAndRegister from './pages/LoginAndRegister';
import Trips from './pages/Trips';
import axios from './axios';
import { AddTrip } from './pages/AddTrip';
import { useStateValue } from './contextAPI/StateProvider';
import Profile from './pages/Profile';
import FindTrip from './components/FindTrip';

const App = () => {
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get('/users/me', { withCredentials: true })
        .then((response) => {
          dispatch({
            type: 'SET_USER',
            payload: response.data,
          });
        })
        .catch((err) => console.log(err));
    };
    fetchUser();
  }, []);

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/me" exact>
            <Profile />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/find-trip" exact>
            <FindTrip />
          </Route>
          <Route path="/trips" exact>
            <Trips />
          </Route>
          <Route path="/add-trip" exact>
            <AddTrip />
          </Route>
          <Route path="/login">
            <LoginAndRegister />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
