export const initialState = {
  user: {},
  trips: [],
  origin: '',
  destination: '',
  departure: '',
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_TRIPS':
      return {
        ...state,
        trips: [...action.payload],
      };
    case 'SET_ORIGIN':
      return {
        ...state,
        origin: action.payload,
      };
    case 'SET_DESTINATION':
      return {
        ...state,
        destination: action.payload,
      };
    case 'SET_DEPARTURE_DATE':
      return {
        ...state,
        departure: action.payload,
      };
    case 'EMPTY_STATE':
      return {
        user: {},
      };
    default:
      return state;
  }
};
