import {
  UPLOADS_REQUEST,
  UPLOADS_ERROR,
  UPLOADS_TOTAL_GET,
  UPLOADS_CLEAR,
  UPLOADS_GET,
} from "../actions/actions.uploads";

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPLOADS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case UPLOADS_GET:
      return Object.assign({}, state, {
        data: [action.newItem, ...state.data],
        date: action.date,
        pages: action.pages,
        error: null,
        loading: false
      });
    case UPLOADS_TOTAL_GET:
      return {...state,
        count: action.count,
        error: null,
      };
    case UPLOADS_CLEAR:
      return {...state,
        data: [],
        loading: false,
        error: null
      };
    case UPLOADS_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}
