import {
  FEED_REQUEST,
  FEED_GET,
  FEED_CLEAR,
  FEED_ERROR
} from "../actions/actions.feed";

const initialState = {
  loading: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FEED_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true
      });
    case FEED_GET:
      state.data.sort();
      if (!_.isEmpty(state.data[9])) {
        state.data.pop();
      }
      return {
        ...state,
        data: [action.newItem, ...state.data],
        loading: false,
        error: null
      };
    case FEED_CLEAR:
      return {
        ...state,
        data: [],
        lading: false,
        error: null
      };
    case FEED_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}
