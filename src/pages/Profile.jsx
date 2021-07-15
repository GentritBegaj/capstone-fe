import React, { useState, useEffect } from 'react';
import { Paper, Avatar } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    padding: 20,
    position: 'relative',
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
    width: '70%',
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
}));

const Profile = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios
          .get(`/users/${id}`)
          .then((response) => {
            console.log(response.data);
            setUser(response.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        {user && (
          <Paper elevation={0} className={classes.paperStyle}>
            <div className={classes.infoDiv}>
              <div className={classes.imageDiv}>
                <Avatar
                  className={classes.sizeAvatar}
                  src={user?.profilePic && user.profilePic}
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
                  user.trips.filter((trip) => trip.owner === user._id)
                    .length}{' '}
                trips published
              </p>
            </div>
            <div className={classes.tripsDiv}>
              Member since {moment(user.createdAt).format(' MMMM Do YYYY')}
            </div>
          </Paper>
        )}
      </div>
    </>
  );
};

export default Profile;