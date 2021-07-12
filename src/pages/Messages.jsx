import React, { useState } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { Grid, TextField, Button, Paper, Avatar } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    height: 'calc(100vh - 64px)',
  },
  mainGrid: {
    height: '100%',
    width: '100vw',
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    height: '100%',
  },
}));

const Messages = () => {
  const classes = useStyles();

  return (
    <>
      <NavBar />
      <div className={classes.root}>
        <Grid container spacing={1} className={classes.mainGrid}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <p>All Conversations </p>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}> Conversation</Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Messages;
