import React, { useState, useEffect } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import {
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paperStyle: {
    width: '50vw',
    maxWidth: 400,
    margin: '20px auto',
    height: 'fit-content',
    maxHeight: '100vh',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
    },
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
}));

const LoginAndRegister = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  return (
    <Paper elevation={20} className={classes.paperStyle}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        className={classes.tabs}
      >
        <Tab label="Log In" />

        <Tab label="Sign Up" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Login />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Register />
      </TabPanel>
    </Paper>
  );
};

export default LoginAndRegister;
