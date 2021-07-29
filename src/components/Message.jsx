import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ModalImage from 'react-modal-image';

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
  image: {
    width: 350,
    height: 200,
    [theme.breakpoints.down('md')]: {
      marginBottom: 3,
      width: 250,
      height: 170,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 3,
      height: 150,
      width: 200,
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: 3,
      height: '100%',
      width: '100%',
      maxWidth: 180,
    },
  },
  location: {
    width: 100,
    height: 60,
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
        {message?.picture &&
          (message.location ? (
            // eslint-disable-next-line react/jsx-no-target-blank
            <a
              href={`http://maps.google.com?q=${message.latitude},${message.longitude}`}
              target="_blank"
            >
              <img
                className={classes.location}
                src={message.picture}
                alt="message-img"
              />
            </a>
          ) : (
            <ModalImage
              small={message.picture}
              className={classes.image}
              large={message.picture}
              alt="message-img"
              hideZoom="false"
              hideDownload="false"
            />
          ))}
        {message.text !== '' && (
          <Typography style={{ wordWrap: 'break-word' }}>
            {message.text}
          </Typography>
        )}
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
