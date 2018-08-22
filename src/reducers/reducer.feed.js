import {
  FEED_REQUEST,
  FEED_GET,
  FEED_INDEX_INC,
  FEED_INDEX_DEC,
  FEED_ERROR
} from '../actions/actions.feed';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case FEED_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true
      });
    case FEED_GET:
      return Object.assign({}, state, {
        data: action.data,
        date: action.date,
        page: action.page,
        loading: false,
        error: null
      });
    case FEED_INDEX_INC:
      return { ...state,
        index: action.index,
        loading: false,
        error: null
      };
    case FEED_INDEX_DEC:
      return { ...state,
        index: action.index,
        loading: false,
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
