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
}));

const SingleTrip = ({ trip }) => {
  const history = useHistory();
  // const location = useLocation();
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [{ user }, dispatch] = useStateValue();

  return (
    <>
      <Paper
        elevation={5}
        className={classes.paperStyle}
        onClick={() => history.push(`/trip-details/${trip._id}`)}
      >
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
        <div className={classes.bottomWrapper}>
          <div className={classes.bottomLeft}>
            <Avatar src={trip.owner.profilePic} />
            <div className={classes.driverInfo}>
              <p>
                {trip.owner.username &&
                  trip.owner.username.charAt(0).toUpperCase() +
                    trip.owner.username.slice(1)}
              </p>
              <p className={classes.driverInfoBottom}>
                <span className={classes.star}>⭐ </span> 5.0
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
