import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginAndRegister from './pages/LoginAndRegister';
import Trips from './pages/Trips';
import axios from './axios';
import { AddTrip } from './pages/AddTrip';
import { useStateValue } from './contextAPI/StateProvider';
import Me from './pages/Me';
import FindTrip from './components/FindTrip';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile';
import StripeContainer from './components/StripeContainer';
import scriptLoader from 'react-async-script-loader';
import Messages from './pages/Messages';
import { io } from 'socket.io-client';
import { Banner } from './components/Banner';

export const socket = io(`http://localhost:3001`, {
  withCredentials: true,
  transports: ['websocket'],
});

const App = ({ isScriptLoaded, isScriptLoadSucceed }) => {
  // eslint-disable-next-line no-unused-vars
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios
          .get('/users/me', { withCredentials: true })
          .then((response) => {
            dispatch({
              type: 'SET_USER',
              payload: response.data,
            });
            socket.emit('isOnline', { userID: response.data._id });
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };

    // localStorage.getItem('loggedIn') !== 'true'
    //   ? history.push('/login')
    fetchUser();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      // console.log(socket.id);
    });
  }, []);

  // useEffect(() => {
  //    history.push();
  // }, []);

  console.log(user);

  if (isScriptLoaded && isScriptLoadSucceed) {
    return (
      <div className="app">
        <Switch>
          <Route path="/me" exact>
            {!user.username ? <Redirect to="/login" /> : <Me />}
          </Route>
          <Route path="/" exact>
            <Banner />
          </Route>
          <Route path="/find-trip" exact>
            <FindTrip />
          </Route>
          <Route path="/trips" exact>
            <Trips />
          </Route>
          <Route path="/trip-details/:id">
            <TripDetails />
          </Route>
          <Route path="/user/:id">
            <Profile />
          </Route>
          <Route path="/add-trip" exact>
            <AddTrip />
          </Route>
          <Route path="/payment" exact>
            <StripeContainer />
          </Route>
          <Route path="/messages" exact>
            <Messages />
          </Route>
          <Route path="/login" exact>
            <LoginAndRegister />
          </Route>
        </Switch>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API}&libraries=places`,
])(App);
