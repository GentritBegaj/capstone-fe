import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, InputAdornment } from '@material-ui/core';
import axios from '../axios';
import { useStateValue } from '../contextAPI/StateProvider';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import PlacesAutocomplete from 'react-places-autocomplete';
import { NavBar } from './NavBar';
import moment from 'moment';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 'calc(100vh - 64px)',
      backgroundImage: 'url(banner.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      display: 'flex',
      justifyContent: 'center',

      [theme.breakpoints.down('sm')]: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px)',
      },
      [theme.breakpoints.down('xs')]: {
        height: 'calc(100vh - 48px)',
      },
    },
    form: {
      height: 55,
      display: 'flex',
      alignItems: 'center',
      borderRadius: 20,
      position: 'relative',
      width: '70vw',
      maxWidth: 1200,
      top: 100,
      backgroundColor: '#d4b8b8',
      opacity: 0.9,
      padding: 10,

      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        minHeight: 250,
        height: 'fit-content',
        width: '75vw',
        backgroundColor: '#ffffff',
        opacity: 0.9,
      },
    },
    input: {
      border: 'none',
      outline: 'none',
      width: '15vw',
      height: '100%',
      backgroundColor: '#ccc5c50',

      [theme.breakpoints.down('md')]: {
        width: '69vw',
        color: 'black',
        marginBottom: 5,
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
      top: 57,
      zIndex: 200,
      width: '30vw',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('md')]: {
        width: '69vw',
        top: 'initial',
      },
    },
    divider: {
      margin: '0 5px',
    },
  })
);
export const Banner = () => {
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useStateValue();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [seatsLeft, setSeatsLeft] = useState(1);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const localTime = new Date();
  const maxDate = moment(localTime).format('YYYY-MM-DD');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = `/trips${from !== '' ? `?originCity='${from}'` : ''}${
      to !== '' ? `&destinationCity='${to}'` : ''
    }${
      date !== '' ? `&departureDate=${date}` : ''
    }&seatsLeft=${seatsLeft}&cancelled=false`;
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
    <>
      <NavBar />
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
                  {suggestions.map((suggestion, i) => {
                    const style = suggestion.active
                      ? { backgroundColor: '#e04040', cursor: 'pointer' }
                      : { backgroundColor: '#d4b8b8', cursor: 'pointer' };

                    return (
                      <div
                        key={i}
                        {...getSuggestionItemProps(suggestion, { style })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <Divider
            orientation="vertical"
            flexItem
            className={classes.divider}
          />

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
                  {suggestions.map((suggestion, i) => {
                    const style = suggestion.active
                      ? { backgroundColor: '#e04040', cursor: 'pointer' }
                      : { backgroundColor: '#d4b8b8', cursor: 'pointer' };

                    return (
                      <div
                        key={22222 + i}
                        {...getSuggestionItemProps(suggestion, { style })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <Divider
            orientation="vertical"
            flexItem
            className={classes.divider}
          />
          <TextField
            className={classes.input}
            label="When"
            type="date"
            value={date}
            InputProps={{
              inputProps: { min: `${maxDate}`, max: '' },
              startAdornment: (
                <InputAdornment
                  className={classes.adornment}
                  position="start"
                />
              ),
              disableUnderline: true,
            }}
            onChange={(e) => setDate(e.target.value)}
          />
          <Divider
            orientation="vertical"
            flexItem
            className={classes.divider}
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
              backgroundColor: '#3f98bb',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '30px',
            }}
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </>
  );
};
