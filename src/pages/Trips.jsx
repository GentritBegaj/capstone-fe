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
    width: '50%',
    minHeight: '18%',
    backgroundColor: '#fffefe',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
  },
}));

const Trips = () => {
  const history = useHistory();
  const classes = useStyles();
  const [{ trips, origin, destination, departure }, dispatch] = useStateValue();
  let today = moment(new Date()).clone().startOf('day');
  const tripDate = moment(departure).clone().startOf('day');
  const diffDays = tripDate.diff(today, 'days');

  useEffect(() => {
    if (departure === '') {
      history.push('/find-trip');
    }
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
            {trips.length !== 1
              ? `${trips.length} rides available`
              : `${trips.length} ride available`}
          </p>
        </Paper>
        {trips && trips.map((trip) => <SingleTrip trip={trip} />)}
      </Grid>
    </div>
  );
};

export default Trips;
