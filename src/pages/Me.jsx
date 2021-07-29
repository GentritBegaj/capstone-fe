import React, { useState, useEffect } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { TextField, Button, Paper, Avatar } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import axios from '../axios';
import moment from 'moment';
import SingleTrip from '../components/SingleTrip';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    padding: 20,
    position: 'relative',
    overflow: 'scroll',
  },
  form: {
    width: 500,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    minWidth: '100%',
    marginBottom: '20px',
    margin: '2px',
    boxSizing: ' border-box',
  },
  paperStyle: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  infoDiv: {
    fontSize: 17,
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 25,
  },
  imageDiv: {
    display: 'flex',
  },
  sizeAvatar: {
    height: theme.spacing(15),
    width: theme.spacing(15),
  },
  editPen: {
    position: 'absolute',
    right: 20,
    top: 20,
    cursor: 'pointer',
  },
  bioDiv: {
    fontSize: 15,
    color: '#a38c8c',
    display: 'flex',
    alignItems: 'center',
  },
  bioIcon: {
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  tripsDiv: {
    fontSize: 15,
    color: '#a38c8c',
    margin: '25px 0',
  },
  buttonsDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  upcomingTripsDiv: {
    textAlign: 'center',
  },
}));

const Me = () => {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue({});
  const [userObject, setUserObject] = useState({
    username: user.username,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    bio: user.bio,
    profilePic: '',
  });
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    setUserObject({ ...userObject, [name]: e.target.value });
    console.log(userObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userObject.username !== '' &&
      userObject.bio !== '' &&
      userObject.email !== '' &&
      userObject.dateOfBirth !== '' &&
      userObject.profilePic !== ''
    ) {
      const formData = new FormData();
      formData.append('profilePic', userObject.profilePic);
      formData.append('dateOfBirth', userObject.dateOfBirth);
      formData.append('email', userObject.email);
      formData.append('bio', userObject.bio);
      formData.append('username', userObject.username);

      try {
        axios({
          method: 'PUT',
          url: '/users/me',
          data: formData,
          withCredentials: true,
        })
          .then((response) => {
            dispatch({
              type: 'SET_USER',
              payload: response.data,
            });
            setEditing(false);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    user.username === undefined ||
      (user.username === null && <Redirect to="/login" />);
    //eslint-disable-next-line
  }, []);

  let date = new Date();
  date.setDate(date.getDate() - 1);

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        {!editing && (
          <Paper elevation={0} className={classes.paperStyle}>
            {/* {!isAfterToday && (

            )} */}
            <div className={classes.infoDiv}>
              <div className={classes.imageDiv}>
                <Avatar
                  className={classes.sizeAvatar}
                  src={user?.profilePic && user.profilePic}
                />

                <EditOutlinedIcon
                  className={classes.editPen}
                  onClick={() => setEditing(true)}
                />
              </div>
              <h2 className={classes.usernameHeader}>
                {user?.username &&
                  user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
              </h2>
              <p style={{ color: '#a38c8c', marginTop: 5 }}>
                {user?.dateOfBirth &&
                  moment(new Date()).diff(user.dateOfBirth, 'year')}{' '}
                years old
              </p>
            </div>
            <div className={classes.bioDiv}>
              <SmsOutlinedIcon className={classes.bioIcon} />
              {user?.bio && user.bio}
            </div>
            <div className={classes.tripsDiv}>
              <p style={{ textAlign: 'left' }}>
                {user?.trips &&
                  user.trips.filter((trip) => trip.owner._id === user._id)
                    .length}{' '}
                trips published
              </p>
            </div>
            <div className={classes.tripsDiv}>
              Member since {moment(user.createdAt).format(' MMMM Do YYYY')}
            </div>
            <div className={classes.upcomingTripsDiv}>
              <h3>Upcoming trips</h3>
              <br />
              {user?.trips &&
                user.trips
                  .filter(
                    (trip) => new Date(trip.departureDate) > new Date(date)
                  )
                  .map((trip) => <SingleTrip trip={trip} key={trip._id} />)}
            </div>
          </Paper>
        )}
        {editing && (
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              type="text"
              name="username"
              label="Username"
              value={userObject.username}
              onChange={handleChange}
              className={classes.input}
            />
            <TextField
              type="email"
              name="email"
              label="Email address"
              value={userObject.email}
              onChange={handleChange}
              className={classes.input}
            />
            <TextField
              type="date"
              margin="normal"
              // id="date-picker-dialog"
              // format="MM/dd/yyyy"
              name="dateOfBirth"
              value={userObject.dateOfBirth}
              onChange={handleChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              className={classes.input}
            />
            <TextField
              type="text"
              margin="normal"
              name="bio"
              label="Bio"
              value={userObject.bio}
              onChange={handleChange}
              KeyboardButtonProps={{
                'aria-label': 'bio',
              }}
              className={classes.input}
            />
            <TextField
              label="Profile picture"
              type="file"
              onChange={(e) =>
                setUserObject({ ...userObject, profilePic: e.target.files[0] })
              }
              className={classes.input}
            />
            <div className={classes.buttonsDiv}>
              <Button
                type="button"
                contained
                className={classes.button}
                style={{ backgroundColor: '#d11111', color: '#fff' }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                contained
                className={classes.button}
                style={{ backgroundColor: '#7e6f6f', color: '#fff' }}
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Me;
