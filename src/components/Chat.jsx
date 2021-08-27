/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { Avatar, TextField, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';
import Message from './Message';
import uniqid from 'uniqid';
import { socket } from '../App.jsx';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { Modal } from '@material-ui/core';
import { Button } from '@material-ui/core';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import ImageIcon from '@material-ui/icons/Image';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  userInfoWrapper: {
    display: 'flex',
    borderBottom: '1px solid gray',
    padding: 10,
    justifyContent: 'space-between',
  },
  userInfoRight: {
    display: 'flex',
    alignItems: 'start',
  },
  userInfoRightUsername: {
    marginLeft: 10,
    paddingTop: 5,
  },
  deleteButtonDiv: {
    cursor: 'pointer',
  },
  middleWrapper: {
    flex: 1,
    overflow: 'hidden',
    overflowY: 'scroll',
  },
  bottomWrapper: {
    display: 'flex',
    border: '1px solid gray',
    borderRadius: 15,
  },
  form: {
    flexGrow: 1,
  },
  inputField: {
    padding: 10,
    flexGrow: 1,
  },
  modalButtonsDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  locationButton: {
    border: 'none',
    outline: 'none',
    borderRadius: 15,
    backgroundColor: 'white',
    color: 'red',
    cursor: 'pointer',
    marginRight: 5,
  },
}));

const Chat = ({ conversations, loadingMessages, fetchConversations }) => {
  const classes = useStyles();
  const [{ user, currentConversation }, dispatch] = useStateValue();
  const [input, setInput] = useState('');
  const [file, setFile] = useState('');
  const [messages, setMessages] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const scrollRef = useRef();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteConversation = async () => {
    try {
      await axios
        .delete(`/conversations/${currentConversation._id}`, {
          withCredentials: true,
        })
        .then(() => fetchConversations())
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  function getModalStyle() {
    return {
      width: '40vw',
      minHeight: 'fit-content',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20',
      border: 'none',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h3 style={{ textAlign: 'center' }}>
        Are you sure you want to delete conversation?
      </h3>
      <div className={classes.modalButtonsDiv}>
        <Button onClick={deleteConversation}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </div>
    </div>
  );

  const getReceiver = () => {
    return conversations
      ?.find((conversation) => conversation?._id === currentConversation?._id)
      ?.members?.find((member) => member._id !== user?._id);
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
      if (input !== '' && file === '') {
        await axios
          .post(
            '/messages',
            {
              conversationId: currentConversation._id,
              sender: user?._id,
              text: input,
            },
            { withCredentials: true }
          )
          .then((response) => {
            const messageToDisplay = {
              sender: user?._id,
              senderUsername: user?.username,
              conversationId: currentConversation._id,
              text: input,
              key: uniqid(),
              receiverId: getReceiver()._id,
              createdAt: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, messageToDisplay]);

            socket.emit('sendMessage', messageToDisplay);

            setInput('');
          })
          .catch((err) => console.log(err));
      } else if (file !== '') {
        const formData = new FormData();

        formData.append('picture', file);
        formData.append('conversationId', currentConversation._id);
        formData.append('sender', user?._id);
        if (input !== '') formData.append('text', input);
        await axios
          .post('/messages', formData, { withCredentials: true })
          .then((response) => {
            const messageToDisplay = {
              sender: user?._id,
              senderUsername: user?.username,
              conversationId: currentConversation._id,
              text: input,
              key: uniqid(),
              receiverId: getReceiver()._id,
              createdAt: new Date(),
              picture: response.data.picture,
            };
            setMessages((prevMessages) => [...prevMessages, messageToDisplay]);
            socket.emit('sendMessage', messageToDisplay);
            setInput('');
            setFile('');
          })
          .catch((err) => console.log(err));
      }
      await axios.put(
        `conversations/${currentConversation._id}/retrieveConversation`,
        { receiverId: getReceiver()._id },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        await axios
          .post(
            '/messages?location=true',
            {
              conversationId: currentConversation._id,
              sender: user?._id,
              text: '📌 Location',
              location: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            { withCredentials: true }
          )
          .then((response) => {
            const messageToDisplay = {
              sender: user?._id,
              senderUsername: user?.username,
              conversationId: currentConversation._id,
              text: '📌 Location',
              key: uniqid(),
              receiverId: getReceiver()._id,
              createdAt: new Date(),
              picture: response.data.picture,
              location: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setMessages((prevMessages) => [...prevMessages, messageToDisplay]);

            socket.emit('sendMessage', messageToDisplay);

            setInput('');
          })
          .catch((err) => console.log(err));
      });
    } else {
      console.log(`Geolocation is not supported`);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.userInfoWrapper}>
          <div className={classes.userInfoRight}>
            <Avatar
              src={getReceiver()?.profilePic}
              style={{ cursor: 'pointer' }}
              onClick={() => history.push(`/user/${getReceiver()._id}`)}
            />
            <div className={classes.userInfoRightUsername}>
              <p>
                {getReceiver()?.username.charAt(0).toUpperCase() +
                  getReceiver()?.username.slice(1)}
              </p>
            </div>
          </div>
          <div onClick={handleOpen} className={classes.deleteButtonDiv}>
            <Tooltip title="Delete conversation" placement="top-end">
              <DeleteOutlineOutlinedIcon />
            </Tooltip>
          </div>
        </div>
        <div className={classes.middleWrapper}>
          {!loadingMessages &&
            messages?.length > 0 &&
            messages?.map((message) => (
              <div ref={scrollRef} key={uniqid()}>
                <Message
                  key={message._id}
                  message={message}
                  own={message.sender === user?._id}
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
          <form onSubmit={handleSubmit} className={classes.form}>
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
          <button className={classes.locationButton}>
            <label htmlFor="file" style={{ cursor: 'pointer' }}>
              <Tooltip title="Send attachment">
                <ImageIcon fontSize="large" />
              </Tooltip>
            </label>
            <TextField
              id="file"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </button>
          <Tooltip title="Share location">
            <button className={classes.locationButton} onClick={getLocation}>
              <PersonPinCircleIcon fontSize="large" />
            </button>
          </Tooltip>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
};

export default Chat;
