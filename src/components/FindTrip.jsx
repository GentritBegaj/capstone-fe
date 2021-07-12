import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, InputAdornment, Grid } from '@material-ui/core';
import axios from '../axios';
import { useStateValue } from '../contextAPI/StateProvider';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { NavBar } from './NavBar';
import PlacesAutocomplete from 'react-places-autocomplete';

const useStyles = makeStyles((theme) =>
  createStyles({
    mainGrid: {
      height: 'calc(100vh - 63px)',
      backgroundColor: '#ebdddd',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflowX: 'hidden',

      [theme.breakpoints.down('md')]: {
        height: 'calc(100vh - 56px) !important',
      },
    },
    form: {
      width: '70vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      height: 'fit-content',
      borderRadius: 10,
    },
    input: {
      border: 'none',
      outline: 'none',
      width: '68vw',
      marginBottom: 30,
      color: '#221c1c',
      overflow: 'hidden',
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
      width: '68vw',
    },
  })
);

const FindTrip = () => {
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

    if (from !== '' && to !== '' && date !== '') {
      const query = `/trips${from !== '' ? `?originCity='${from}'` : ''}${
        to !== '' ? `&destinationCity='${to}'` : ''
      }${date !== '' ? `&departureDate=${date}` : ''}&seatsLeft=${seatsLeft}`;

      dispatch({
        type: 'SET_ORIGIN',
        payload: from,
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
    }
  };

  return (
    <>
      <NavBar />
      <Grid
        container
        className={classes.mainGrid}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ height: 'calc(100vh - 64px)', backgroundColor: '#ebdddd' }}
      >
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
                      : { backgroundColor: '#aaa', cursor: 'pointer' };

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
                      : { backgroundColor: '#aaa', cursor: 'pointer' };

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
                <InputAdornment
                  className={classes.adornment}
                  position="start"
                ></InputAdornment>
              ),
              disableUnderline: true,
            }}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            className={classes.input}
            type="number"
            placeholder="Passengers"
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
            type="submit"
            disabled={!(from !== '' && to !== '' && date !== '')}
            style={{
              backgroundColor: '#227cb8',
              color: '#fff',
              height: 85,
              cursor: 'pointer',
            }}
          >
            <SearchIcon />
          </button>
        </form>
      </Grid>
    </>
  );
};

export default FindTrip;
