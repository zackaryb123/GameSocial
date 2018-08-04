import {
  UPLOAD_REQUEST,
  UPLOAD_ERROR,
  UPLOAD_GET
} from "../actions/actions.upload";

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case UPLOAD_GET:
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case UPLOAD_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}
