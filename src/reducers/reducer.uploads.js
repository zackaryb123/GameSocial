import {
  UPLOADS_REQUEST,
  UPLOADS_ERROR,
  UPLOADS_GET
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
        data: action.data,
        date: action.date,
        pages: action.pages,
        error: null,
        loading: false
      });
    case UPLOADS_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}
