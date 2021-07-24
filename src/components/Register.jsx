import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  FormControlLabel,
  TextField,
  Button,
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import axios from '../axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridStyle: {
    width: '100%',
    height: 'fit-content',
  },
  paperStyle: {
    padding: '50px 20px',
    width: '100%',
    height: 'fit-content',
    margin: '2px auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      padding: 15,
    },
  },
  headerStyle: { margin: '15px 0' },
  avatarStyle: { backgroundColor: '#1bbd7e' },
  btnStyle: { margin: '15px 0' },
}));

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const classes = useStyles();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      email !== '' &&
      password !== '' &&
      username !== '' &&
      dateOfBirth !== ''
    ) {
      await axios
        .post('/users/register', {
          username,
          email,
          password,
          dateOfBirth,
        })
        .then(() => history.push('/login'))
        .catch((err) => console.log(err));
      setUsername('');
      setEmail('');
      setPassword('');
      setDateOfBirth('');
    }
  };

  return (
    <Grid className={classes.gridStyle}>
      <Paper elevation={0} className={classes.paperStyle}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Avatar className={classes.avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 className={classes.headerStyle}>Sign up</h2>
          <Typography variant="caption">
            Fill in the fields required to sign up
          </Typography>
        </Grid>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            required
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            className={classes.headerStyle}
            fullWidth
            label="Email"
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className={classes.headerStyle}
            fullWidth
            label="Password"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <TextField style={inputStyle} fullWidth type="date" /> */}
          <FormControlLabel
            control={
              <TextField
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            }
            label="Date of birth:"
            labelPlacement="start"
            style={{ marginRight: 22, marginTop: 10 }}
          />

          <Button
            className={classes.btnStyle}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default Register;
