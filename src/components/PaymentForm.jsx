import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { makeStyles, Backdrop, CircularProgress } from '@material-ui/core';
import axios from '../axios';
import { NavBar } from './NavBar';
import { useStateValue } from '../contextAPI/StateProvider';
import { Grid, Paper } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '25%',
    marginTop: '5%',
    marginRight: '25%',

    [theme.breakpoints.down('md')]: {
      margin: '10%',
    },
  },
  FormGroup: {
    margin: '0 15px 20px',
    borderStyle: 'none',
    backgroundColor: '#7795f8',
    boxShadow:
      '0 6px 9px rgba(50,50,93,0.06), 0 2px 5px rgba(0,0,0,0.08), inset 0 1px 0 #829fff',
    borderRadius: 4,

    [theme.breakpoints.down('md')]: {
      margin: 0,
    },
  },
  FormRow: {
    marginLeft: 15,
    borderTop: '1px solid #819efc',
    [theme.breakpoints.down('md')]: {
      margin: 0,
    },
  },
  button: {
    display: 'block',
    fontSize: 18,
    width: 'calc(100% - 30px)',
    height: 40,
    margin: '40px 15px 0',
    backgroundColor: '#f6a4eb',
    boxShadow:
      '0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #ffb9f6',
    borderRadius: 4,
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 100 ease-in-out',
    willChange: 'transform, backgroundColor, boxShadow',
    border: 'none',

    '&.active': {
      backgroundColor: '#d782d9',
      boxShadow:
        '0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #e298d8',
      transform: 'scale(0.99)',
    },

    [theme.breakpoints.down('md')]: {
      margin: '40px auto',
      width: '100%',
    },
  },

  headerDiv: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
  },

  root2: {
    width: '100vw',
    height: 'calc(100vh - 64px)',
    backgroundColor: '#ebdddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 30,
    overflow: 'scroll',
    [theme.breakpoints.down('md')]: {
      height: 'calc(100vh - 56px)',
    },
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 48px)',
    },
  },
  paperStyle: {
    width: '70vw',
    backgroundColor: '#fffefe',
  },
  dateDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    padding: 20,
  },
  locationsDiv: {
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottom: '10px solid #f0e9e9',
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
    padding: 25,
    justifyContent: 'space-between',
    borderBottom: '10px solid #f0e9e9',
  },

  descriptionDiv: {
    padding: 20,
    fontWeight: 500,
    color: '#af9e9e',
  },

  totalDiv: {
    padding: 20,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    position: 'relative',
  },
}));

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#fce883' },
      '::placeholder': { color: '#87bbfd' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const PaymentForm = () => {
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [{ trip, passengers }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;

        const response = await axios.post('/payment', {
          amount: 100 * trip.pricePerPerson * passengers,
          id,
        });

        if (response.data.success) {
          console.log('Successful payment');

          try {
            await axios
              .post(
                `/trips/${trip._id}`,
                {
                  tickets: passengers,
                },
                { withCredentials: true }
              )
              .then((response) => {
                setLoading(false);
                setSuccess(true);
              })
              .catch((err) => console.log(err));
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(error);
    }
  };

  console.log(trip);
  console.log(typeof passengers);

  return (
    <>
      <NavBar />
      {!success && (
        <>
          <div className={classes.root}>
            <h2 style={{ textAlign: 'center', marginBottom: 50 }}>
              Enter your card details and press 'Pay' to confirm booking
            </h2>

            <form onSubmit={handleSubmit}>
              <fieldset className={classes.FormGroup}>
                <div className={classes.FormRow}>
                  <CardElement options={CARD_OPTIONS} />
                </div>
              </fieldset>
              <button className={classes.button}>
                Pay{' '}
                {trip?.pricePerPerson &&
                  passengers &&
                  `$${(trip.pricePerPerson * parseInt(passengers)).toFixed(2)}`}
              </button>
            </form>
          </div>
        </>
      )}
      {loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {success && (
        <Grid container className={classes.root2}>
          <Paper className={classes.paperStyle}>
            <h3 className={classes.headerDiv}>
              Here is your booking information
            </h3>
            <div className={classes.dateDiv}>
              <h3>Date of trip:</h3>
              <p>{moment(trip.departureDate).format('ddd, MMMM Do')}</p>
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
              <h3 style={{ fontWeight: 500 }}>Price for one passenger</h3>
              <p>${trip.pricePerPerson && trip.pricePerPerson.toFixed(2)}</p>
            </div>
            <div className={classes.descriptionDiv}>
              <p>{trip && trip.description}</p>
            </div>
            <div className={classes.totalDiv}>
              {passengers && (
                <>
                  <h3>
                    {passengers} x ${trip.pricePerPerson}
                  </h3>
                  <p>Total: ${passengers * trip.pricePerPerson}</p>
                </>
              )}
            </div>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default PaymentForm;
