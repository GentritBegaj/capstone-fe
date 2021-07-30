import React, { useState, useEffect } from 'react';
import {
  Paper,
  Avatar,
  Button,
  Modal,
  TextareaAutosize,
} from '@material-ui/core';
import { NavBar } from '../components';
import { makeStyles } from '@material-ui/core/styles';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../axios';
import moment from 'moment';
import ForumIcon from '@material-ui/icons/Forum';
import { useStateValue } from '../contextAPI/StateProvider.js';
import ReactStars from 'react-rating-stars-component';
import RateReviewIcon from '@material-ui/icons/RateReview';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    padding: 20,
    position: 'relative',
  },
  form: {
    width: 500,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    minWidth: '100%',
    marginBottom: '20px',
    margin: '2px',
    boxSizing: ' border-box',
  },
  paperStyle: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
  },
  infoDiv: {
    fontSize: 17,
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 25,
  },
  imageDiv: {
    display: 'flex',
  },
  sizeAvatar: {
    height: theme.spacing(15),
    width: theme.spacing(15),
  },
  editPen: {
    position: 'absolute',
    right: 20,
    top: 20,
    cursor: 'pointer',
  },
  bioDiv: {
    fontSize: 15,
    color: '#a38c8c',
    display: 'flex',
    alignItems: 'center',
  },
  bioIcon: {
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  tripsDiv: {
    fontSize: 15,
    color: '#a38c8c',
    margin: '25px 0',
  },
  buttonsDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  contactDiv: {
    width: 'fit-content',
    fontSize: 20,
    color: '#958de2',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  reviewButton: {
    width: 'fit-content',
    fontSize: 18,
    color: '#835f5ffc',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '20px 0',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,

    [theme.breakpoints.down('sm')]: {
      padding: 8,
    },
  },
  textArea: {
    width: '100%',
    maxWidth: '100%',
    minWidth: '100%',
    height: '200',
    maxHeight: 150,
    minHeight: 150,
    margin: '10px 0',
    padding: 5,
    color: 'gray',
    borderRadius: 5,
    outline: 'none',
  },
  ratingDiv: {
    display: 'flex',
    alignItems: 'center',

    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  formButton: {
    backgroundColor: '#0d8bdf',
    color: '#fff',
    marginTop: 20,
  },
  reviewDivWrapper: {
    margin: '10px 0',
  },
  reviewInfoWrapper: {
    margin: '10px 0',
    display: 'flex',
  },
  reviewTextWrapper: {
    marginLeft: 5,
  },
}));

const Profile = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [user, setUser] = useState();
  const history = useHistory();
  const [state, dispatch] = useStateValue();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleReview = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post(
          `users/${id}`,
          {
            text,
            rating,
          },
          { withCredentials: true }
        )
        .then((response) => {
          fetchUser();
          setText('');
          setRating(1);
          handleClose();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  function getModalStyle() {
    return {
      width: '50vw',
      height: 'fit-content',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: 'none',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };
  }

  const body = (
    <div style={modalStyle}>
      <form className={classes.modalForm} onSubmit={handleReview}>
        <div>
          <TextareaAutosize
            minRows="4"
            maxRows="5"
            className={classes.textArea}
            placeholder="Leave a review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={classes.ratingDiv}>
          <p style={{ marginRight: 5 }}>Rate experience with user: {'   '} </p>{' '}
          <ReactStars
            count={5}
            value={rating}
            onChange={(e) => setRating(e)}
            size={18}
            activeColor="#ffd700"
          />
        </div>
        <Button
          variant="contained"
          className={classes.formButton}
          type="submit"
        >
          Publish review
        </Button>
      </form>
    </div>
  );

  const fetchUser = async () => {
    try {
      await axios
        .get(`/users/${id}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const startConversation = async () => {
    try {
      const response = await axios.get('/conversations', {
        withCredentials: true,
      });
      const conversations = response.data;
      const existingConversation = conversations.find((conversation) =>
        conversation.members.find((member) => member._id === user._id)
      );
      if (existingConversation) {
        try {
          await axios
            .put(
              `conversations/${existingConversation._id}/retrieveConversation`,
              { receiverId: user._id },
              { withCredentials: true }
            )
            .then((response) => {
              dispatch({
                type: 'SET_CURRENT_CONVERSATION',
                payload: response.data,
              });
              history.push('/messages');
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const response = await axios.post(
            '/conversations',
            {
              receiverId: user._id,
            },
            { withCredentials: true }
          );
          dispatch({
            type: 'SET_CURRENT_CONVERSATION',
            payload: response.data,
          });
          history.push('/messages');
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        {user && (
          <Paper elevation={0} className={classes.paperStyle}>
            <div className={classes.infoDiv}>
              <div className={classes.imageDiv}>
                <Avatar
                  className={classes.sizeAvatar}
                  src={user?.profilePic && user.profilePic}
                />
              </div>
              <h2 className={classes.usernameHeader}>
                {user?.username &&
                  user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
              </h2>
              <p style={{ color: '#a38c8c', marginTop: 5 }}>
                {user?.dateOfBirth &&
                  moment(new Date()).diff(user.dateOfBirth, 'year')}{' '}
                years old
              </p>
            </div>
            <div className={classes.bioDiv}>
              <SmsOutlinedIcon className={classes.bioIcon} />
              {user?.bio && user.bio}
            </div>
            <div className={classes.tripsDiv}>
              <p style={{ textAlign: 'left' }}>
                {user?.trips &&
                  user.trips.filter((trip) => trip.owner === user._id)
                    .length}{' '}
                trips published
              </p>
            </div>
            <div className={classes.tripsDiv}>
              Member since {moment(user.createdAt).format(' MMMM Do YYYY')}
            </div>
            <div className={classes.contactDiv} onClick={startConversation}>
              <p style={{ marginRight: 5 }}>
                Contact{' '}
                {user &&
                  user?.username.charAt(0).toUpperCase() +
                    user?.username.slice(1)}
              </p>
              <ForumIcon />
            </div>
            <div className={classes.reviewButton} onClick={handleOpen}>
              <p style={{ marginRight: 5 }}>Leave a review</p>
              <RateReviewIcon />
            </div>
            {user?.reviews.map((review) => (
              <div className={classes.reviewDivWrapper} key={review._id}>
                <h5>Reviews</h5>
                <div className={classes.reviewInfoWrapper}>
                  <div
                    onClick={() =>
                      history.push(
                        review.user._id !== state.user._id
                          ? `/user/${review.user._id}`
                          : `/me`
                      )
                    }
                  >
                    <Avatar
                      src={review.user.profilePic}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className={classes.reviewTextWrapper}>
                    <p>{review.text || ''}</p>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  </div>
                  {state?.user?._id === review.user._id && (
                    <Tooltip title="Delete review" placement="top-end">
                      <DeleteSweepOutlinedIcon
                        onClick={async () => {
                          try {
                            axios
                              .delete(`users/${user._id}/${review._id}`, {
                                withCredentials: true,
                              })
                              .then((response) => fetchUser())
                              .catch((err) => console.log(err));
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </Paper>
        )}
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

export default Profile;
