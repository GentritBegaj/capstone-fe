export const initialState = {
  user: null,
  trips: [],
  trip: {},
  origin: '',
  destination: '',
  departure: '',
  conversations: [],
  currentConversation: null,
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
    case 'SET_TRIP':
      return {
        ...state,
        trip: action.payload,
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
    case 'SET_NUMBER_OF_PASSENGERS':
      return {
        ...state,
        passengers: action.payload,
      };
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      };
    case 'SET_CURRENT_CONVERSATION':
      return {
        ...state,
        currentConversation: action.payload,
      };
    case 'SET_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: action.payload,
      };
    case 'EMPTY_STATE':
      return {
        user: null,
        trips: [],
        trip: {},
        origin: '',
        destination: '',
        departure: '',
      };
    default:
      return state;
  }
};
