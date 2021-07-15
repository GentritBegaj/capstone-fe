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
import axios from '../axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const paperStyle = {
    padding: '30px 20px',
    width: 300,
    height: '50vh',
    margin: '2px auto',
  };

  const avatarStyle = { backgroundColor: '#1bbd7e' };
  const btnStyle = { margin: '8px 0' };

  return (
    <div className="login">
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Sign In</h2>
          </Grid>
          <form onSubmit={handleLogin}>
            <TextField
              style={btnStyle}
              fullWidth
              required
              label="Email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              style={btnStyle}
              fullWidth
              required
              label="Password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Button
              style={btnStyle}
              type="submit"
              color="primary"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
          </form>
          <Typography>
            <Link>Forgot password?</Link>
          </Typography>

          <Typography>
            Do you have an account? <Link>Sign Up</Link>
          </Typography>
        </Paper>
      </Grid>

      {/* <div className="login__inputs">
        <h2>Login</h2>
        <form>
          <div className="login__input">
            <h5>Email</h5>
            <input
              type="email"
              placeholder="Type your email here"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="login__input">
            <h5>Password</h5>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
        </form>
      </div> */}
    </div>
  );
};

export default Login;
