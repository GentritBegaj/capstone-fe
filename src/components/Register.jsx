import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import axios from '../axios';

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios
      .post('/users/register', {
        username,
        email,
        password,
      })
      .then(() => history.push('/login'))
      .catch((err) => console.log(err));
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const paperStyle = {
    padding: '30px 20px',
    width: 300,
    height: '50vh',
    margin: '2px auto',
  };

  const headerStyle = { margin: '5px 0' };
  const btnStyle = { margin: '15px 0' };
  const avatarStyle = { backgroundColor: '#1bbd7e' };
  return (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign up</h2>
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
            style={headerStyle}
            fullWidth
            label="Email"
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            style={headerStyle}
            fullWidth
            label="Password"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            style={btnStyle}
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
