import React, { useState } from 'react';
import { NavBar } from '../components';
import {
  Grid,
  Paper,
  makeStyles,
  TextField,
  Button,
  List,
  ListItem,
} from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useForm } from 'react-hook-form';
import axios from '../axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: '#f0e6e6',
    height: '100%',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    overflowY: 'scroll',
  },
  paperStyleSingle: {
    width: '60%',
    // minHeight: '60%',
    height: 'fit-content',
    backgroundColor: '#fffefe',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textInput: {
    width: '100%',
    margin: '15px auto',
  },
  buttonsDiv: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  error: {
    fontSize: '13px',
    color: 'red',
    margin: '5px',
  },
  spanText: {
    fontSize: '16px',
    fontWeight: 'normal',
    display: 'inline-block',
    marginLeft: 'auto',
  },
}));

export const AddTrip = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' });

  const [formStep, setFormStep] = useState(0);
  const [tripObject, setTripObject] = useState({
    originCity: '',
    destinationCity: '',
    maxParticipants: '',
    departureDate: '',
    arrivalDate: '',
    departureTime: '',
    arrivalTime: '',
    pricePerPerson: null,
    description: '',
  });

  const nextStep = (e) => {
    e.preventDefault();
    setFormStep((prevFormStep) => setFormStep(prevFormStep + 1));
  };
  const prevStep = (e) => {
    e.preventDefault();
    setFormStep((prevFormStep) => setFormStep(prevFormStep - 1));
  };

  const handleChange = (e) => {
    const name = e.target.name;

    setTripObject({ ...tripObject, [name]: e.target.value });
  };

  const submitForm = async (values) => {
    try {
      axios({
        method: 'POST',
        url: '/trips',
        data: tripObject,
        withCredentials: true,
      })
        .then((response) => {
          enqueueSnackbar(`Trip was successfully published`, 'success');
        })
        .catch((err) => enqueueSnackbar(err.message), 'error');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <NavBar />
      <Grid container className={classes.mainGrid}>
        <Paper elevation={5} className={classes.paperStyleSingle}>
          <p>Step {formStep + 1} of 7</p>
          <form
            onSubmit={handleSubmit(submitForm)}
            className={classes.form}
            style={{ margin: '15px 0' }}
          >
            {formStep >= 0 && (
              <>
                <section
                  style={
                    formStep === 0 ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <h2>What is the origin and destination of your trip?</h2>
                  <TextField
                    type="text"
                    label="Where are you leaving from?"
                    placeholder="Enter the city name you are leaving from..."
                    className={classes.textInput}
                    name="originCity"
                    {...register('originCity', {
                      required: {
                        value: true,
                        message: 'Origin city of trip is required',
                      },
                    })}
                    value={tripObject.originCity}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Where are you going?"
                    type="text"
                    placeholder="Enter the city name you are travelling to..."
                    className={classes.textInput}
                    name="destinationCity"
                    {...register('destinationCity', {
                      required: {
                        value: true,
                        message: 'Destination city of trip is required',
                      },
                    })}
                    value={tripObject.destinationCity}
                    onChange={handleChange}
                  />
                  {errors.originCity && (
                    <p className={classes.error}>{errors.originCity.message}</p>
                  )}
                  {errors.destinationCity && (
                    <p className={classes.error}>
                      {errors.destinationCity.message}
                    </p>
                  )}
                </section>
              </>
            )}
            {formStep >= 1 && (
              <>
                <section
                  style={
                    formStep === 1 ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <h2>Departure and arrival date of trip</h2>

                  <TextField
                    label="Departure date of trip?"
                    type="date"
                    className={classes.textInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="departureDate"
                    {...register('departureDate', {
                      required: {
                        value: true,
                        message: 'Departure date of trip is required',
                      },
                    })}
                    value={tripObject.departureDate}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Arrival date of trip?"
                    type="date"
                    className={classes.textInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="arrivalDate"
                    {...register('arrivalDate', {
                      required: {
                        value: true,
                        message: 'Arrival date of trip is required',
                      },
                    })}
                    value={tripObject.arrivalDate}
                    onChange={handleChange}
                  />
                  {errors.departureDate && (
                    <p className={classes.error}>
                      {errors.departureDate.message}
                    </p>
                  )}
                  {errors.arrivalDate && (
                    <p className={classes.error}>
                      {errors.arrivalDate.message}
                    </p>
                  )}
                </section>
              </>
            )}
            {formStep >= 2 && (
              <>
                <section
                  style={
                    formStep === 2 ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <h2>Departure and arrival time of trip</h2>

                  <TextField
                    label="Departure time of trip?"
                    type="time"
                    className={classes.textInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="departureTime"
                    {...register('departureTime', {
                      required: {
                        value: true,
                        message: 'Departure time of trip is required',
                      },
                    })}
                    value={tripObject.departureTime}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Arrival time of trip?"
                    type="time"
                    className={classes.textInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="arrivalTime"
                    {...register('arrivalTime', {
                      required: {
                        value: true,
                        message: 'Arrival time of trip is required',
                      },
                    })}
                    value={tripObject.arrivalTime}
                    onChange={handleChange}
                  />
                  {errors.departureTime && (
                    <p className={classes.error}>
                      {errors.departureTime.message}
                    </p>
                  )}
                  {errors.arrivalTime && (
                    <p className={classes.error}>
                      {errors.arrivalTime.message}
                    </p>
                  )}
                </section>
              </>
            )}
            {formStep >= 3 && (
              <>
                <section
                  style={
                    formStep === 3 ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <h2>How many free seats do you have?</h2>
                  <TextField
                    type="number"
                    inputProps={{ min: 1, max: 10 }}
                    placeholder="Set the number of free seats you have..."
                    className={classes.textInput}
                    name="maxParticipants"
                    {...register('maxParticipants', {
                      required: {
                        value: true,
                        message: 'Number of free for trip is required',
                      },
                    })}
                    value={tripObject.maxParticipants}
                    onChange={handleChange}
                  />
                  {errors.maxParticipants && (
                    <p className={classes.error}>
                      {errors.maxParticipants.message}
                    </p>
                  )}
                </section>
              </>
            )}
            {formStep >= 4 && (
              <>
                <section
                  style={
                    formStep === 4 ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <h2>What is your asking price per seat?</h2>
                  <TextField
                    type="number"
                    inputProps={{ min: 5 }}
                    placeholder="Set price per seat..."
                    className={classes.textInput}
                    name="pricePerPerson"
                    {...register('pricePerPerson', {
                      required: {
                        value: true,
                        message: 'Number of free seats for trip is required',
                      },
                    })}
                    value={tripObject.pricePerPerson}
                    onChange={handleChange}
                  />
                  {errors.pricePerPerson && (
                    <p className={classes.error}>
                      {errors.pricePerPerson.message}
                    </p>
                  )}
                </section>
              </>
            )}
            {formStep >= 5 && (
              <section
                style={
                  formStep === 5 ? { display: 'block' } : { display: 'none' }
                }
              >
                <h4>
                  Any details you would like people to know regarding to this
                  trip?(Optional)
                </h4>
                <TextareaAutosize
                  rowsMax={5}
                  placeholder="Share details about trip"
                  className={classes.textInput}
                  name="description"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '200px',
                    maxHeight: '200px',
                    padding: '10px',
                  }}
                  {...register('description', {
                    required: {
                      value: false,
                    },
                  })}
                  value={tripObject.description}
                  onChange={handleChange}
                />
              </section>
            )}
            {formStep === 6 && (
              <List>
                <ListItem>
                  <h5>From:</h5>
                  <span className={classes.spanText}>
                    {tripObject.originCity}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>To: </h5>
                  <span className={classes.spanText}>
                    {tripObject.destinationCity}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>Number of seats available: </h5>
                  <span className={classes.spanText}>
                    {tripObject.maxParticipants}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>Departure time: </h5>
                  <span className={classes.spanText}>
                    {tripObject.departureTime}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>Arrival time: </h5>
                  <span className={classes.spanText}>
                    {tripObject.arrivalTime}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>Price per seat: </h5>
                  <span className={classes.spanText}>
                    {tripObject.pricePerPerson}
                  </span>
                </ListItem>
                <ListItem>
                  <h5>Description: </h5>
                  <span className={classes.spanText}>
                    {tripObject.description}
                  </span>
                </ListItem>
              </List>
            )}
            <div className={classes.buttonsDiv}>
              {formStep > 0 && (
                <Button
                  variant="contained"
                  onClick={prevStep}
                  style={{ backgroundColor: '#f70909', color: '#fff' }}
                >
                  Back
                </Button>
              )}
              {formStep < 6 && (
                <Button
                  variant="contained"
                  disabled={!isValid}
                  onClick={isValid && nextStep}
                  style={{ marginLeft: 'auto', backgroundColor: '#0ab858eb' }}
                >
                  Next
                </Button>
              )}
              {formStep === 6 && (
                <Button
                  variant="contained"
                  type="submit"
                  style={{ marginLeft: 'auto', backgroundColor: '#077e3ceb' }}
                >
                  Publish
                </Button>
              )}
            </div>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};
