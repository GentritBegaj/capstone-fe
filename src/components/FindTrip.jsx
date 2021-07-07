import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { TextField, InputAdornment } from '@material-ui/core';
import axios from '../axios';
import { useStateValue } from '../contextAPI/StateProvider';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { NavBar } from './NavBar';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      marginTop: '20%',
      width: 500,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e6cdcd',
    },
    input: {
      border: 'none',
      outline: 'none',
      width: '90%',
      marginBottom: 30,
    },
    adornment: {
      width: 1,
    },
    adornmentPassenger: {
      width: 100,
    },
  })
);

const FindTrip = () => {
  const [state, dispatch] = useStateValue();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(1);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (from !== '' && to !== '' && date !== '') {
      const query = `/trips${from !== '' ? `?originCity=${from}` : ''}${
        to !== '' ? `&destinationCity=${to}` : ''
      }${
        date !== '' ? `&departureDate=${date}` : ''
      }&maxParticipants=${maxParticipants}`;
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
      <div className={classes.root}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.input}
            type="text"
            label="From"
            InputProps={{ disableUnderline: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextField
            className={classes.input}
            type="text"
            label="To"
            InputProps={{ disableUnderline: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
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
            label="Number of passengers"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
          <button
            className={classes.input}
            type="submit"
            style={{
              backgroundColor: '#8c7c7c',
              height: 85,
              cursor: 'pointer',
            }}
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </>
  );
};

export default FindTrip;
