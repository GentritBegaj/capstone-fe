import React from 'react';
import { Paper, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useStateValue } from '../contextAPI/StateProvider';

const useStyles = makeStyles((theme) => ({
  paperStyleSingle: {
    width: '50%',
    minHeight: '18%',
    backgroundColor: '#fffefe',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  paperStyle: {
    width: '50%',
    minHeight: '23%',
    backgroundColor: '#fffefe',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  topLeftLineWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 15px',
  },
  topLeftLine: {
    height: '55px',
    backgroundColor: 'black',
    width: '3px',
    border: '2px solid black',
  },
  topLeftCircle: {
    height: '8px',
    width: '8px',
    border: '2px solid black',
    borderRadius: '50%',
  },
  topLeftText: {
    height: '77px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRight: {
    fontWeight: 'bold',
  },
  bottomWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: '80px',
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
    hover: {},
  },
  star: {
    fontSize: '10px',
    marginRight: '2px',
  },
}));

const SingleTrip = ({ trip }) => {
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <>
      <Paper elevation={5} className={classes.paperStyle}>
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
                {user.username &&
                  user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
              </p>
              <p className={classes.driverInfoBottom}>
                <span className={classes.star}>⭐ </span> 5.0
              </p>
            </div>
          </div>
          <div className={classes.bottomRight}>
            <Tooltip
              title={
                trip.maxParticipants > 1
                  ? `${trip.maxParticipants} seats available`
                  : `${trip.maxParticipants} seat available`
              }
              placement="top-end"
            >
              <p className={classes.seats}>
                {new Array(parseInt(trip.maxParticipants)).fill('💺')}
              </p>
            </Tooltip>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default SingleTrip;
