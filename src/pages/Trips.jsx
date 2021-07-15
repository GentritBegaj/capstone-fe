import React, { useEffect } from 'react';
import { NavBar } from '../components';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SingleTrip from '../components/SingleTrip';
import moment from 'moment';
import { useStateValue } from '../contextAPI/StateProvider';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: '#f0e6e6',
    height: 'calc(100vh - 64px)',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    overflowY: 'scroll',
  },
  paperStyleSingle: {
    width: '70%',
    minHeight: '24%',
    backgroundColor: '#fffefe',
    zIndex: 100,
    position: 'sticky',
    top: theme.spacing(0),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripsDiv: {
    width: '67vw',
  },
}));

const Trips = () => {
  const history = useHistory();
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [{ user, trips, origin, destination, departure }, dispatch] =
    useStateValue();
  let today = moment(new Date()).clone().startOf('day');
  const tripDate = moment(departure).clone().startOf('day');
  const diffDays = tripDate.diff(today, 'days');

  useEffect(() => {
    if (departure === '') {
      history.push('/find-trip');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <NavBar />
      <Grid container className={classes.mainGrid}>
        <Paper elevation={0} className={classes.paperStyleSingle}>
          <h4>
            {diffDays < 1
              ? 'Today'
              : diffDays !== 1
              ? moment(tripDate).format('dddd, MMMM Do YYYY')
              : 'Tomorrow'}
          </h4>
          <p>
            {origin} 🡢 {destination}
          </p>

          <p>
            {trips &&
            trips.filter((trip) => trip.owner._id !== user._id).length !== 1
              ? `${
                  trips.filter((trip) => trip.owner._id !== user._id).length
                } rides available`
              : `${
                  trips.filter((trip) => trip.owner._id !== user._id).length
                } ride available`}
          </p>
        </Paper>
        <div className={classes.tripsDiv}>
          {trips &&
            trips.map((trip) => <SingleTrip trip={trip} key={trip._id} />)}
        </div>
      </Grid>
    </div>
  );
};

export default Trips;
