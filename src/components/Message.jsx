import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    padding: 3,
    width: 'fit-content',
    maxWidth: '55%',
    flexWrap: 'wrap',
  },
  paper: {
    backgroundColor: '#b6b1f1',
    padding: 5,
    // minHeight: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    // width: 'fit-content',
    minWidth: 40,
    // fontSize: 14,
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
