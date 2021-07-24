import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    padding: 3,
    width: 'fit-content',
    maxWidth: '75%',
    flexWrap: 'wrap',
  },
  paper: {
    backgroundColor: '#b6b1f1',
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 40,
  },
  timeWrapper: {
    position: 'relative',
    marginTop: 10,
  },
  time: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 9,
  },
}));

const Message = ({ own, message }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={own ? { marginLeft: 'auto' } : null}>
      <Paper
        elevation={2}
        className={classes.paper}
        style={own ? { backgroundColor: '#ade66b6c' } : null}
      >
        <Typography style={{ wordWrap: 'break-word' }}>
          {message.text}
        </Typography>
        <div className={classes.timeWrapper}>
          <small className={classes.time}>
            {moment(message.createdAt).format('HH:mm')}
          </small>
        </div>
      </Paper>
    </div>
  );
};

export default Message;
