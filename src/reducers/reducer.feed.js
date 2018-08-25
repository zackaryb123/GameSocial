import {
  FEED_REQUEST,
  FEED_GET,
  FEED_INIT,
  FEED_NEXT,
  FEED_PREV,
  FEED_CLEAR,
  FEED_ERROR
} from "../actions/actions.feed";

const initialState = {
  loading: false,
  error: null,
  data: [],
  date: Date.now(),
  page: 0,
  total: 0,
  start: 0,
  count: 10
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FEED_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true
      });
    case FEED_GET:
      return Object.assign({}, state, {
        data: [action.newItem, ...state.data],
        date: action.date,
        page: action.page,
        total: action.total,
        start: action.start,
        loading: false,
        error: null
      });
    case FEED_CLEAR:
      return {...state,
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
