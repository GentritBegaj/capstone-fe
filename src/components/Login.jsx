import React from 'react';
import { useState } from 'react';
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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
  btnStyle: { margin: '8px 0' },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios
      .post(
        '/users/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then(() => {
        localStorage.setItem('loggedIn', 'true');
        window.location.replace('/');
      })
      .catch((err) => console.log(err));
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login">
      <Grid className={classes.gridStyle}>
        <Paper elevation={0} className={classes.paperStyle}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar className={classes.avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2 className={classes.headerStyle}>Sign In</h2>
          </Grid>
          <form onSubmit={handleLogin}>
            <TextField
              className={classes.btnStyle}
              fullWidth
              required
              label="Email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className={classes.btnStyle}
              fullWidth
              required
              label="Password"
              placeholder="Enter password"
              autoComplete="false"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Button
              className={classes.btnStyle}
              type="submit"
              color="primary"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
            <Typography>
              <Link>Forgot password?</Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

export default Login;
