/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { Avatar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';
import Message from './Message';
import uniqid from 'uniqid';
import { socket } from '../App.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  userInfoWrapper: {
    display: 'flex',
    borderBottom: '1px solid gray',
    padding: 10,
  },
  userInfoRight: {
    display: 'flex',
    marginLeft: theme.spacing(2),
  },
  middleWrapper: {
    flex: 1,
    overflow: 'hidden',
    overflowY: 'scroll',
  },
  bottomWrapper: {
    // width: '100%',
  },
  inputField: {
    border: '1px solid gray',
    borderRadius: 15,
    padding: 10,
  },
}));

const Chat = ({
  conversations,
  fetchConversations,
  setConversations,
  loadingMessages,
}) => {
  const classes = useStyles();
  const [{ user, currentConversation }, dispatch] = useStateValue();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  const getReceiver = () => {
    return conversations
      ?.find((conversation) => conversation?._id === currentConversation?._id)
      ?.members?.find((member) => member._id !== user._id);
  };

  useEffect(() => {
    setMessages(
      conversations?.find(
        (conversation) => conversation._id === currentConversation?._id
      )?.messages
    );
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      // if (currentConversation?._id !== message.conversationId) {
      //   let actualConversation = conversations.find(
      //     (c) => c._id === message.conversationId
      //   );
      //   actualConversation = {
      //     ...actualConversation,
      //     messages: [...actualConversation.messages, message],
      //   };
      //   setConversations((prevConversations) => [
      //     ...prevConversations.filter((c) => c._id !== message.conversationId),
      //     actualConversation,
      //   ]);
      // }
      if (currentConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (input !== '') {
        await axios
          .post(
            '/messages',
            {
              conversationId: currentConversation._id,
              sender: user._id,
              text: input,
            },
            { withCredentials: true }
          )
          .then((response) => {
            const messageToDisplay = {
              sender: user._id,
              conversationId: currentConversation._id,
              text: input,
              key: uniqid(),
              receiverId: getReceiver()._id,
              createdAt: new Date(),
            };

            // let actualConversation = conversations.find(
            //   (c) => c._id === messageToDisplay.conversationId
            // );
            // actualConversation = {
            //   ...actualConversation,
            //   messages: [...actualConversation.messages, messageToDisplay],
            // };
            // setConversations((prevConversations) => [
            //   ...prevConversations.filter(
            //     (c) => c._id !== messageToDisplay.conversationId
            //   ),
            //   actualConversation,
            // ]);

            setMessages((prevMessages) => [...prevMessages, messageToDisplay]);

            socket.emit('sendMessage', messageToDisplay);

            setInput('');
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.userInfoWrapper}>
          <Avatar src={getReceiver()?.profilePic} />
          <div className={classes.userInfoRight}>
            <p>
              {getReceiver()?.username.charAt(0).toUpperCase() +
                getReceiver()?.username.slice(1)}
            </p>
          </div>
        </div>
        <div className={classes.middleWrapper}>
          {!loadingMessages &&
            messages?.length > 0 &&
            messages?.map((message) => (
              <div ref={scrollRef}>
                <Message
                  message={message}
                  key={message._id}
                  own={message.sender === user._id}
                />
              </div>
            ))}
          {!loadingMessages && messages?.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '30%' }}>
              No messages to show
            </p>
          )}
          {loadingMessages && (
            <p style={{ textAlign: 'center', marginTop: '30%' }}>
              Loading messages...
            </p>
          )}
        </div>
        <div className={classes.bottomWrapper}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="text"
              placeholder="Type a message..."
              InputProps={{ disableUnderline: true }}
              className={classes.inputField}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" hidden></button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
