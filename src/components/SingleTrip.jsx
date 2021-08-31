import React from 'react';
import { Paper, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom';
import { useStateValue } from '../contextAPI/StateProvider';

const useStyles = makeStyles((theme) => ({
  paperStyle: {
    width: '100%',
    minHeight: 'fit-content',
    backgroundColor: '#fffefe',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    position: 'relative',

    '&:hover': { backgroundColor: '#e2dfdf' },
  },
  cancelledHeading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(' - (50 % ' ,') - (50 % ')'),

    [theme.breakpoints.down('xs')]: {
      left: '30%',
    },
  },
  topWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    height: 120,

    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: 13,
    },
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 15,
    },
  },
  topLeftLineWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 15px',
    height: '100%',
  },
  topLeftLine: {
    height: '100%',
    backgroundColor: 'black',
    width: '3px',
    border: '2px solid black',
  },
  topLeftCircle: {
    height: 8,
    width: 8,
    border: '3px solid black',
    borderRadius: '50%',
  },
  topLeftText: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  topRight: {
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
    },
  },
  bottomWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  bottomLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: '80px',
    marginRight: 30,
  },

  driverInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
  },
  driverInfoBottom: {
    display: 'flex',
    alignItems: 'center',
  },
  seats: {
    marginLeft: 'auto',
  },
  star: {
    fontSize: '10px',
    marginRight: '2px',
  },
  participants: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '25px 0',
    padding: '10px 0',
    borderTop: '1px solid gray',
    borderBottom: '1px solid gray',
  },
}));

const SingleTrip = ({ trip }) => {
  const history = useHistory();
  const classes = useStyles();
  const [{ user }] = useStateValue();

  return (
    <>
      <Paper
        elevation={5}
        className={classes.paperStyle}
        style={trip.cancelled ? { opacity: 0.4 } : null}
        onClick={() => history.push(`/trip-details/${trip._id}`)}
      >
        {trip.cancelled && (
          <h3 className={classes.cancelledHeading}>Cancelled</h3>
        )}
        <div className={classes.topWrapper}>
          <div className={classes.topLeft}>
            <div className={classes.topLeftText}>
              <p>{trip.departureTime}</p>
              <p>{trip.arrivalTime}</p>
            </div>
            <div className={classes.topLeftLineWrapper}>
              <div className={classes.topLeftCircle}></div>
              <div className={classes.topLeftLine}></div>
              <div className={classes.topLeftCircle}></div>
            </div>
            <div className={classes.topLeftText}>
              <p>{trip.originCity}</p>
              <p>{trip.destinationCity}</p>
            </div>
          </div>
          <Tooltip title="Price for one seat" placement="top-end">
            <div className={classes.topRight}>
              ${trip.pricePerPerson.toFixed(2)}
            </div>
          </Tooltip>
        </div>
        {trip?.owner._id === user?._id &&
          trip?.participants.length > 0 &&
          trip?.participants.map((p) => (
            <div className={classes.participants}>
              <h5>Confirmed participants</h5>
              <div>
                <Avatar src={p._id.profilePic} />
                <small>
                  {p?._id?.username?.charAt(0).toUpperCase() +
                    p?._id?.username?.slice(1)}
                </small>
              </div>
            </div>
          ))}
        <div className={classes.bottomWrapper}>
          <div className={classes.bottomLeft}>
            <Avatar src={trip.owner.profilePic} />
            <div className={classes.driverInfo}>
              <p>
                {trip?.owner.username &&
                  trip.owner.username.charAt(0).toUpperCase() +
                    trip.owner.username.slice(1)}
              </p>
              <p className={classes.driverInfoBottom}>
                <span className={classes.star}>⭐ </span>
                {(
                  trip?.owner.reviews?.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / trip.owner.reviews.length
                ).toFixed(1) || 'N/A'}
              </p>
            </div>
          </div>

          <div className={classes.bottomRight}>
            <Tooltip
              title={
                trip.seatsLeft > 1
                  ? `${trip.seatsLeft} seats available`
                  : `${trip.seatsLeft} seat available`
              }
              placement="top-end"
            >
              <p className={classes.seats}>
                {new Array(parseInt(trip.seatsLeft)).fill('💺')}
              </p>
            </Tooltip>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default SingleTrip;
