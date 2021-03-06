import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../contextAPI/StateProvider';
import { socket } from '../App.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    padding: '10px 8px',
    width: '100%',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '5px 2px',
      fontSize: 12,
    },
    '&:hover': {
      backgroundColor: '#e9eaeb',
    },
  },
  avatar: {
    [theme.breakpoints.down('xs')]: {
      width: '30px',
      height: '30px',
    },
  },
  userInfoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(3),

    [theme.breakpoints.down('xs')]: {
      marginLeft: 5,
    },
  },
  avatarWrapper: {
    position: 'relative',
  },
  userInfoWrapperBottom: {
    whiteSpace: 'wrap',
  },
  shape: {
    backgroundColor: '#32CD32',
    width: 10,
    height: 10,
    borderRadius: '50%',
    position: 'absolute',
    right: 0,
    top: 1,
    zIndex: 2,
  },
  typography: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: 240,

    [theme.breakpoints.down('md')]: {
      width: 150,
    },
    [theme.breakpoints.down('sm')]: {
      width: 110,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      width: 25,
    },
  },
}));

const Contact = ({ conversation }) => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [{ user, currentConversation }, dispatch] = useStateValue();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversationCopy, setConversationCopy] = useState(conversation);
  const newMessagesNumberRef = useRef(0);

  const getReceiver = conversationCopy?.members?.find(
    (member) => member._id !== user?._id
  );

  const circle = <div className={classes.shape} />;

  useEffect(() => {
    socket.on('getUsers', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
  }, []);

  useEffect(() => {
    socket.emit('isOnline', { userID: user?._id });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('ownMessage', (message) => {
      if (
        message.sender === user?._id &&
        conversation._id === message.conversationId
      ) {
        // console.log(message);
        setConversationCopy({
          ...conversationCopy,
          messages: [...conversationCopy.messages, message],
          updatedAt: new Date(),
        });
      }
      // console.log(conversationCopy);
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (conversation._id === message.conversationId) {
        setConversationCopy({
          ...conversationCopy,
          messages: [...conversationCopy?.messages, message],
          updatedAt: new Date(),
        });
        // console.log(conversationCopy);
      }
    });
    //eslint-disable-next-line
  }, []);

  return (
    <div
      onClick={() => {
        currentConversation._id !== conversation._id &&
          dispatch({
            type: 'SET_CURRENT_CONVERSATION',
            payload: conversation,
          });
      }}
      style={
        currentConversation?._id === conversationCopy?._id
          ? { backgroundColor: '#dfcfcf' }
          : null
      }
      className={classes.root}
    >
      <div className={classes.avatarWrapper}>
        {onlineUsers?.filter((u) => u.userId === getReceiver._id).length === 1
          ? circle
          : null}

        <Avatar src={getReceiver?.profilePic} className={classes.avatar} />
      </div>
      <div className={classes.userInfoWrapper}>
        <h5>
          {getReceiver?.username.charAt(0).toUpperCase() +
            getReceiver?.username.slice(1)}
        </h5>
        <div className={classes.userInfoWrapperBottom}>
          <Typography className={classes.typography}>
            {conversationCopy?.messages.length > 0 &&
              conversationCopy?.messages[conversationCopy?.messages.length - 1]
                .text}
          </Typography>
        </div>
      </div>
      <div>
        {currentConversation?._id !== conversationCopy?._id &&
          newMessagesNumberRef.current > 0 && (
            <p>{newMessagesNumberRef.current}</p>
          )}
      </div>
    </div>
  );
};

export default Contact;
