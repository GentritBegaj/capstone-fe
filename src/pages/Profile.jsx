import React, { useState } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { TextField, Button } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '400px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    minWidth: '100%',
    marginBottom: '20px',
    margin: '2px',
    boxSizing: ' border-box',
  },
  button: {
    backgroundColor: '#cc7979',
    width: '100%',
  },
}));

const Profile = () => {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue({});
  const [userObject, setUserObject] = useState({
    username: user.username,
    email: user.email,
    dateOfBirth: '',
    profilePic: '',
  });
  const [changed, setChanged] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    setUserObject({ ...userObject, [name]: e.target.value });
    setChanged(true);
    console.log(userObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', userObject.username);
    formData.append('email', userObject.email);
    formData.append('dateOfBirth', userObject.dateOfBirth);
    formData.append('profilePic', userObject.profilePic);

    try {
      axios({
        method: 'PUT',
        url: '/users/me',
        data: formData,
        withCredentials: true,
      })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.container}>
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
            label="Profile picture"
            type="file"
            onChange={(e) =>
              setUserObject({ ...userObject, profilePic: e.target.files[0] })
            }
            className={classes.input}
          />
          <Button type="submit" contained className={classes.button}>
            Save
          </Button>
        </form>
      </div>
    </>
  );
};

export default Profile;
