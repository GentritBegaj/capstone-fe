import React, { useEffect, useState } from 'react';
import { Grid, Paper, Avatar, Button, Tooltip, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../contextAPI/StateProvider';
import ForumIcon from '@material-ui/icons/Forum';
import { MdEventSeat } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import axios from '../axios';
import { NavBar } from '../components';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    backgroundColor: '#ebdddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '30px 0 40px',
    overflow: 'scroll',
  },
  paperStyle: {
    width: '80vw',
    backgroundColor: '#fffefe',
  },
  moreIconWrapper: {
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
  },
  dateDiv: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  locationsDiv: {
    height: 120,
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottom: '10px solid #f0e9e9',
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
  },
  locationsDivLeft: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 30,
  },
  locationsDivCenter: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  locationsDivCenterCircle: {
    height: 9,
    width: 9,
    border: '3px solid black',
    borderRadius: '50%',
  },
  locationsDivCenterLine: {
    height: '77%',
    width: 5,
    backgroundColor: 'black',
  },
  locationsDivRight: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  priceDiv: {
    display: 'flex',
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    borderBottom: '10px solid #f0e9e9',
  },
  userDiv: {
    weight: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    padding: 20,
    '&:hover': { backgroundColor: '#e0d3d3', cursor: 'pointer' },
  },
  descriptionDiv: {
    padding: 20,
    marginTop: 20,
    fontWeight: 500,
    color: '#af9e9e',
  },
  contactDiv: {
    padding: 20,
    width: 'fit-content',
    fontSize: 20,
    color: '#958de2',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  seatsDiv: {
    padding: 20,
    position: 'relative',
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
  },
  seat: {
    fontSize: 20,
    marginRight: 3,
  },
  bottomDiv: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    position: 'fixed',
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: 5,
  },
  button: {
    width: '30%',
    backgroundColor: '#7f8cd1',
    borderRadius: 25,

    '&:hover': {
      backgroundColor: '#d8bebe',
      color: '#1734c7',
    },
  },
  reservedTickets: {
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'column',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'space-between',
    },
  },
  cancelTicketsDiv: {
    display: 'flex',
    margin: '10px 0',
  },
  ticketWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  ticketRemoveWrapper: {
    position: 'absolute',
    left: 28,
    top: -2,
    width: 12,
    height: 12,
    border: '1px solid gray',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  ticketRightLine: {
    width: 10,
    height: 1,
    border: '1px solid gray',
    transform: 'rotate(45deg)',
    position: 'absolute',
    top: 4,
  },
  ticketLeftLine: {
    width: 10,
    height: 1,
    border: '1px solid gray',
    transform: 'rotate(-45deg)',
    position: 'absolute',
    top: 4,
  },
  modalButtonsDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  participants: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 20px',
    borderBottom: '10px solid #f0e9e9',
  },
  participantsRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

const TripDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [{ trip, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenRefundModal = () => {
    setOpenRefundModal(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRefundModal = () => {
    setOpenRefundModal(false);
  };

  const fetchTrip = async () => {
    try {
      await axios
        .get(`/trips/${id}`)
        .then((response) => {
          dispatch({
            type: 'SET_TRIP',
            payload: response.data,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {}
  };

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line
  }, []);

  const cancelTicket = async (e) => {
    try {
      await axios
        .put(`/trips/${trip._id}/refund`, {}, { withCredentials: true })
        .then(() => window.location.reload())
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const cancelTrip = async () => {
    try {
      await axios
        .put(`/trips/${trip._id}/cancel`, {}, { withCredentials: true })
        .then(() => {
          fetchTrip();
          handleClose();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const startConversation = async () => {
    try {
      const response = await axios.get('/conversations', {
        withCredentials: true,
      });
      const conversations = response.data;
      const existingConversation = conversations.find((conversation) =>
        conversation.members.find((member) => member._id === trip.owner._id)
      );
      if (existingConversation) {
        try {
          await axios
            .put(
              `conversations/${existingConversation._id}/retrieveConversation`,
              { receiverId: trip.owner._id },
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
              receiverId: trip.owner._id,
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

  function getModalStyle() {
    return {
      width: '50vw',
      height: 'fit-content',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '5',
      border: 'none',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };
  }

  const body = (
    <div style={modalStyle}>
      <h3 style={{ textAlign: 'center' }}>
        Are you sure you want to cancel trip?
      </h3>
      <div className={classes.modalButtonsDiv}>
        <Button onClick={cancelTrip}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </div>
    </div>
  );

  const bodyRefundModal = (
    <div style={modalStyle}>
      <h3 style={{ textAlign: 'center' }}>
        Are you sure you want to cancel ticket?
      </h3>
      <div className={classes.modalButtonsDiv}>
        <Button onClick={cancelTicket}>Yes</Button>
        <Button onClick={handleCloseRefundModal}>No</Button>
      </div>
    </div>
  );

  console.log(trip);

  return (
    <div>
      <NavBar />
      {trip?.owner && (
        <Grid
          container
          className={classes.root}
          style={
            trip?.owner._id !== user?._id
              ? { height: 'calc(100vh - 104px)' }
              : { height: 'calc(100vh - 64px)' }
          }
        >
          <Paper className={classes.paperStyle}>
            {trip.owner._id === user?._id && trip?.cancelled === false && (
              <div className={classes.moreIconWrapper}>
                <Tooltip title="Cancel trip">
                  <BlockIcon onClick={handleOpen} />
                </Tooltip>
              </div>
            )}

            {trip.owner._id === user?._id && trip?.cancelled && (
              <div className={classes.moreIconWrapper}>
                <Tooltip title="Publish trip">
                  <CheckCircleIcon onClick={cancelTrip} />
                </Tooltip>
              </div>
            )}
            {trip?.cancelled && (
              <h1
                style={{
                  color: 'red',
                  textAlign: 'center',
                }}
              >
                Trip is currently cancelled
              </h1>
            )}
            <div style={trip?.cancelled ? { opacity: 0.3 } : null}>
              <div className={classes.dateDiv}>
                <h1>{moment(trip.departureDate).format('ddd, MMMM Do')}</h1>
              </div>
              <div className={classes.locationsDiv}>
                <div className={classes.locationsDivLeft}>
                  <h4>{trip.departureTime}</h4>
                  <h4>{trip.arrivalTime}</h4>
                </div>
                <div className={classes.locationsDivCenter}>
                  <div className={classes.locationsDivCenterCircle}></div>
                  <div className={classes.locationsDivCenterLine}></div>
                  <div className={classes.locationsDivCenterCircle}></div>
                </div>
                <div className={classes.locationsDivRight}>
                  <h4>{trip.originCity}</h4>
                  <h4>{trip.destinationCity}</h4>
                </div>
              </div>
              <div className={classes.priceDiv}>
                <h3 style={{ color: '#c2a0a0', fontWeight: 500 }}>
                  Price per passenger
                </h3>
                <h3>
                  ${trip.pricePerPerson && trip.pricePerPerson.toFixed(2)}
                </h3>
              </div>
              {trip?.owner._id === user?._id &&
                trip?.participants.length > 0 &&
                trip?.participants.map((p) => (
                  <div className={classes.participants}>
                    <h5>Confirmed participants:</h5>
                    <div
                      className={classes.participantsRight}
                      onClick={() => history.push(`/user/${p._id._id}`)}
                    >
                      <Avatar src={p._id.profilePic} />
                      <small>
                        {p?._id.username?.charAt(0).toUpperCase() +
                          p?._id.username?.slice(1)}
                      </small>
                    </div>
                  </div>
                ))}
              {trip.owner._id !== user?._id && (
                <div
                  className={classes.userDiv}
                  onClick={() => history.push(`/user/${trip.owner._id}`)}
                >
                  <h3>
                    {trip?.owner &&
                      trip.owner.username.charAt(0).toUpperCase() +
                        trip.owner.username.slice(1)}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={trip?.owner && trip.owner.profilePic} />
                    <ChevronRightIcon />
                  </div>
                </div>
              )}
              {trip?.description && (
                <div className={classes.descriptionDiv}>
                  <p>{trip && trip.description}</p>
                </div>
              )}
              {trip?.owner._id !== user?._id && (
                <div className={classes.contactDiv} onClick={startConversation}>
                  <p style={{ marginRight: 5 }}>
                    Contact{' '}
                    {trip?.owner &&
                      trip.owner.username.charAt(0).toUpperCase() +
                        trip.owner.username.slice(1)}
                  </p>
                  <ForumIcon />
                </div>
              )}
              <div className={classes.seatsDiv}>
                {trip?.seatsLeft !== undefined && (
                  <>
                    <MdEventSeat className={classes.seat} />{' '}
                    <p>{trip.seatsLeft} seats available</p>
                  </>
                )}
              </div>
              {trip?.participants.filter(
                (participant) => participant._id._id === user?._id
              ).length > 0 && (
                <div className={classes.reservedTickets}>
                  <h4>
                    You have{'  '}
                    {
                      trip.participants.find(
                        (participant) => participant._id._id === user?._id
                      ).tickets
                    }
                    {'   '}
                    reserved seats for this trip
                  </h4>
                  {trip?.participants.find(
                    (participant) => participant._id._id === user?._id
                  ).tickets > 0 && (
                    <div className={classes.cancelTicketsDiv}>
                      {[
                        ...new Array(
                          trip.participants.find(
                            (participant) => participant._id._id === user?._id
                          ).tickets
                        ),
                      ].map((ticket) => (
                        <div className={classes.ticketWrapper}>
                          <Tooltip title="Cancel ticket" placement="top-right">
                            <div
                              onClick={() => handleOpenRefundModal()}
                              className={classes.ticketRemoveWrapper}
                            >
                              <div className={classes.ticketLeftLine}></div>
                              <div className={classes.ticketRightLine}></div>
                            </div>
                          </Tooltip>
                          <ConfirmationNumberOutlinedIcon fontSize="large" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Paper>
          {trip?.owner._id !== user?._id && (
            <div className={classes.bottomDiv}>
              <Button
                onClick={() => history.push('/payment')}
                className={classes.button}
              >
                Continue
              </Button>
            </div>
          )}
        </Grid>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <Modal
        open={openRefundModal}
        onClose={handleCloseRefundModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {bodyRefundModal}
      </Modal>
    </div>
  );
};

export default TripDetails;
