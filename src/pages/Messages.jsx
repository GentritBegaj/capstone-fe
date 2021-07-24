import React, { useState, useEffect } from 'react';
import { useStateValue } from '../contextAPI/StateProvider';
import { Grid, Paper } from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../axios';
import Contact from '../components/Contact';
import Chat from '../components/Chat';
import uniqid from 'uniqid';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - 64px)',
    backgroundColor: '#ebdddd',
    overflow: 'hidden',
  },
  mainGrid: {
    height: '100%',
    width: '100vw',
    padding: theme.spacing(1),
  },
  sidebar: {
    padding: theme.spacing(1),
    height: 'calc(100vh - 80px)',
    width: '100%',
  },
  chat: {
    padding: theme.spacing(1),
    height: 'calc(100vh - 80px)',
    width: '100%',
  },
}));

const Messages = () => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [{ user, currentConversation }, dispatch] = useStateValue();
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    setLoadingMessages(true);
    try {
      await axios
        .get('/conversations', { withCredentials: true })
        .then((response) => {
          setConversations(response.data);
          setLoadingMessages(false);
          console.log(response.data);
          if (currentConversation === null) {
            dispatch({
              type: 'SET_CURRENT_CONVERSATION',
              payload: response.data[0],
            });
          }
        })
        .catch((error) => {
          setLoadingMessages(false);
          console.log(error);
        });
    } catch (error) {
      setLoadingMessages(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchConversations();
    //eslint-disable-next-line
  }, [currentConversation]);

  return (
    <>
      <NavBar />
      <div className={classes.root}>
        <Grid container spacing={1} className={classes.mainGrid} key={uniqid()}>
          <Grid item xs={4}>
            <Paper className={classes.sidebar} key={uniqid()}>
              {conversations &&
                conversations
                  ?.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                  )
                  .map((conversation) => (
                    <div>
                      <Contact
                        key={conversation._id}
                        conversation={conversation}
                      />
                    </div>
                  ))}
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.chat}>
              {currentConversation && currentConversation !== null ? (
                <Chat
                  key={uniqid()}
                  conversations={conversations}
                  fetchConversations={fetchConversations}
                  setConversations={setConversations}
                  loadingMessages={loadingMessages}
                />
              ) : (
                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '30%',
                    transform: 'translateY(50%)',
                  }}
                >
                  Click on a contact on the left to see the messages
                </p>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Messages;
