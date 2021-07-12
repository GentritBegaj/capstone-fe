import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, InputAdornment } from '@material-ui/core';
import axios from '../axios';
import { useStateValue } from '../contextAPI/StateProvider';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

import PlacesAutocomplete from 'react-places-autocomplete';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 'calc(100vh - 64px)',
      backgroundImage:
        'url(https://i2.wp.com/www.theengineblock.com/wp-content/uploads/2019/09/ridesharing_future.png?w=800&ssl=1)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: 200,

      [theme.breakpoints.down('sm')]: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px)',
        paddingBottom: 0,
      },
      [theme.breakpoints.down('xs')]: {
        height: 'calc(100vh - 48px)',
      },
    },
    form: {
      height: 55,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#b7c5ce',
      borderRadius: 10,
      position: 'relative',
      width: '70vw',

      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        minHeight: 250,
        height: '50vh',
        width: '75vw',
        padding: 5,
      },
    },
    input: {
      border: 'none',
      outline: 'none',
      width: '15vw',
      height: '100%',

      [theme.breakpoints.down('sm')]: {
        width: '69vw',
        padding: 0,
      },
    },
    adornment: {
      width: 1,
    },
    adornmentPassenger: {
      width: 100,
    },
    suggestionsDiv: {
      position: 'absolute',
      zIndex: 200,
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
    },
  })
);
export const Banner = () => {
  const [state, dispatch] = useStateValue();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seatsLeft, setSeatsLeft] = useState(1);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = `/trips${from !== '' ? `?originCity='${from}'` : ''}${
      to !== '' ? `&destinationCity='${to}'` : ''
    }${date !== '' ? `&departureDate=${date}` : ''}&seatsLeft=${seatsLeft}`;
    dispatch({
      type: 'SET_ORIGIN',
      payload: from,
    });
    dispatch({
      type: 'SET_ORIGIN',
      payload: from,
    });
    dispatch({
      type: 'SET_DESTINATION',
      payload: to,
    });
    dispatch({
      type: 'SET_DESTINATION',
      payload: to,
    });
    dispatch({
      type: 'SET_DEPARTURE_DATE',
      payload: date,
    });
    dispatch({
      type: 'SET_NUMBER_OF_PASSENGERS',
      payload: seatsLeft,
    });

    try {
      await axios
        .get(query)
        .then((response) => {
          dispatch({
            type: 'SET_TRIPS',
            payload: response.data,
          });
        })
        .then(() => {
          enqueueSnackbar('Finding trips...', {
            autoHideDuration: 2000,
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
          });
          setTimeout(() => {
            history.push('/trips');
          }, 2000);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <PlacesAutocomplete
          value={from}
          onChange={(e) => setFrom(e)}
          onSelect={(e) => setFrom(e)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <TextField
                className={classes.input}
                type="text"
                InputProps={{ disableUnderline: true }}
                {...getInputProps({
                  label: 'From',
                })}
              />
              <div className={classes.suggestionsDiv}>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: '#e04040', cursor: 'pointer' }
                    : { backgroundColor: '#fff', cursor: 'pointer' };

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <PlacesAutocomplete
          value={to}
          onChange={(e) => setTo(e)}
          onSelect={(e) => setTo(e)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <TextField
                className={classes.input}
                type="text"
                InputProps={{ disableUnderline: true }}
                {...getInputProps({
                  label: 'To',
                })}
              />
              <div className={classes.suggestionsDiv}>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: '#e04040', cursor: 'pointer' }
                    : { backgroundColor: '#fff', cursor: 'pointer' };

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <TextField
          className={classes.input}
          label="When"
          type="date"
          value={date}
          InputProps={{
            startAdornment: (
              <InputAdornment className={classes.adornment} position="start" />
            ),
            disableUnderline: true,
          }}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          className={classes.input}
          type="number"
          inputProps={{ min: 1, max: 4 }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment
                className={classes.adornmentPassenger}
                position="start"
              >
                Passengers:
              </InputAdornment>
            ),
          }}
          label="# of passengers"
          value={seatsLeft}
          onChange={(e) => setSeatsLeft(e.target.value)}
        />
        <button
          className={classes.input}
          disabled={!(from !== '' && to !== '' && date !== '')}
          type="submit"
          style={{
            backgroundColor: '#227cb8',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};
