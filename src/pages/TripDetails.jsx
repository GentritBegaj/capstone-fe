import React, { useEffect, useState } from 'react';
import { Grid, Paper, Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../contextAPI/StateProvider';
import ForumIcon from '@material-ui/icons/Forum';
import { MdEventSeat } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'space-between',
    },
  },
  cancelTicketsDiv: {
    display: 'flex',
    flexDirection: 'column',
    '& > input': { margin: '10px 0' },

    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },
}));

const TripDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [{ trip, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [refundedTickets, setRefundedTickets] = useState(null);

  useEffect(() => {
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
    fetchTrip();
    // eslint-disable-next-line
  }, []);

  const cancelTicket = async (e) => {
    e.preventDefault();

    try {
      await axios
        .put(
          `/trips/${trip._id}/refund`,
          {
            refundedTickets,
          },
          { withCredentials: true }
        )
        .then(() => window.location.reload())
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(trip);

  return (
    <>
      <NavBar />
      {trip?.owner && (
        <Grid
          container
          className={classes.root}
          style={
            trip?.owner._id !== user._id
              ? { height: 'calc(100vh - 104px)' }
              : { height: 'calc(100vh - 64px)' }
          }
        >
          <Paper className={classes.paperStyle}>
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
              <h3>${trip.pricePerPerson && trip.pricePerPerson.toFixed(2)}</h3>
            </div>
            <div
              className={classes.userDiv}
              onClick={() => {
                user._id === trip.owner._id
                  ? history.push('/me')
                  : history.push(`/user/${trip.owner._id}`);
              }}
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
            {trip?.description && (
              <div className={classes.descriptionDiv}>
                <p>{trip && trip.description}</p>
              </div>
            )}
            {trip?.owner._id !== user._id && (
              <div className={classes.contactDiv}>
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
              (participant) => participant._id === user._id
            ).length > 0 && (
              <div className={classes.reservedTickets}>
                <h4>
                  You have{'  '}
                  {
                    trip.participants.find(
                      (participant) => participant._id === user._id
                    ).tickets
                  }
                  {'   '}
                  reserved seats for this trip
                </h4>

                <div className={classes.cancelTicketsDiv}>
                  <p>Set the number of tickets you would like to cancel</p>
                  <form
                    onSubmit={cancelTicket}
                    className={classes.cancelTicketsDiv}
                  >
                    <input
                      type="number"
                      min={1}
                      max={
                        trip.participants.find(
                          (participant) => participant._id === user._id
                        ).tickets
                      }
                      value={refundedTickets}
                      onChange={(e) => setRefundedTickets(e.target.value)}
                    />
                    <Button
                      type="submit"
                      style={{ backgroundColor: '#f11919', color: '#fff' }}
                    >
                      Cancel ticket(s)
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </Paper>
          {trip?.owner._id !== user._id && (
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
    </>
  );
};

export default TripDetails;
