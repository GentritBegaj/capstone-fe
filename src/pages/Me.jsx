import React, { useState } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { TextField, Button, Paper, Avatar } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import axios from '../axios';
import moment from 'moment';
import SingleTrip from '../components/SingleTrip';
import ReactStars from 'react-rating-stars-component';
import { useHistory } from 'react-router-dom';

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
    width: '85vw',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  input: {
    width: '100%',
    minWidth: '70%',
    marginBottom: '20px',
    margin: '2px',
    boxSizing: ' border-box',

    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
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

    [theme.breakpoints.down('md')]: {
      width: '80%',
      margin: '0 auto',
    },
  },
  upcomingTripsDiv: {
    textAlign: 'center',
  },
  reviewDivWrapper: {
    margin: '10px 0',
  },
  reviewInfoWrapper: {
    margin: '10px 0',
    display: 'flex',
  },
  reviewTextWrapper: {
    marginLeft: 5,
  },
  upperInfoWrapper: {
    display: 'flex',
    width: '100%',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  profilePicDiv: {
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
      textAlign: 'center',
    },
  },
  profilePic: {
    height: 150,
    width: 150,
    borderRadius: 30,
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
      width: '30vw',
      minWidth: 150,
    },
  },
  inputsWrapper: {
    marginLeft: 100,

    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: 20,
    },
  },
}));

const Me = () => {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue({});
  const [userObject, setUserObject] = useState({
    username: user?.username,
    email: user?.email,
    dateOfBirth: user?.dateOfBirth,
    bio: user?.bio,
    profilePic: '',
  });
  const [editing, setEditing] = useState(false);
  const history = useHistory();

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

  let date = new Date();
  date.setDate(date.getDate() - 1);

  console.log(user);

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        {!editing && (
          <Paper elevation={0} className={classes.paperStyle}>
            <div className={classes.infoDiv}>
              <div className={classes.imageDiv}>
                <Avatar
                  className={classes.sizeAvatar}
                  src={user?.profilePic && user?.profilePic}
                />

                <EditOutlinedIcon
                  className={classes.editPen}
                  onClick={() => setEditing(true)}
                />
              </div>
              <h2 className={classes.usernameHeader}>
                {user?.username &&
                  user?.username.charAt(0).toUpperCase() +
                    user?.username.slice(1)}
              </h2>
              <p style={{ color: '#a38c8c', marginTop: 5 }}>
                {user?.dateOfBirth &&
                  moment(new Date()).diff(user?.dateOfBirth, 'year')}{' '}
                years old
              </p>
            </div>
            <div className={classes.bioDiv}>
              <SmsOutlinedIcon className={classes.bioIcon} />
              {user?.bio && user?.bio}
            </div>
            <div className={classes.tripsDiv}>
              <p style={{ textAlign: 'left' }}>
                {user?.trips &&
                  user?.trips.filter((trip) => trip.owner._id === user?._id)
                    .length}{' '}
                trips published
              </p>
            </div>
            <div className={classes.tripsDiv}>
              Member since {moment(user?.createdAt).format(' MMMM Do YYYY')}
            </div>
            {user?.trips?.filter(
              (trip) => new Date(trip.departureDate) > new Date(date)
            ).length > 0 && (
              <div className={classes.upcomingTripsDiv}>
                <h3>Upcoming trips</h3>
                <br />
                {user?.trips
                  .filter(
                    (trip) => new Date(trip.departureDate) > new Date(date)
                  )
                  .map((trip) => (
                    <SingleTrip trip={trip} key={trip._id} />
                  ))}
              </div>
            )}
            {user?.reviews?.map((review) => (
              <div className={classes.reviewDivWrapper} key={review._id}>
                <h5>Reviews</h5>
                <div className={classes.reviewInfoWrapper}>
                  <div
                    onClick={() =>
                      history.push(
                        review.user?._id !== user?._id
                          ? `/user/${review.user?._id}`
                          : null
                      )
                    }
                  >
                    <Avatar
                      src={review.user?.profilePic}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className={classes.reviewTextWrapper}>
                    <p>{review.text || ''}</p>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Paper>
        )}
        {editing && (
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.upperInfoWrapper}>
              <div className={classes.profilePicDiv}>
                <label htmlFor="profilePic">
                  <img
                    src={user.profilePic}
                    alt="profile-pic"
                    className={classes.profilePic}
                  />
                </label>
                <TextField
                  label="Profile picture"
                  type="file"
                  id="profilePic"
                  onChange={(e) =>
                    setUserObject({
                      ...userObject,
                      profilePic: e.target.files[0],
                    })
                  }
                  className={classes.input}
                  style={{ display: 'none' }}
                />
              </div>
              <div className={classes.inputsWrapper}>
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
              </div>
            </div>

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
