import {
  TRACK_FAVORITES_REQUEST, TRACK_FAVORITES_ERROR, TRACK_FAVORITES_GET_SUCCESS
} from '../actions/actions.track.favorites';

const initialState = {
  loading: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (TRACK_FAVORITES_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(TRACK_FAVORITES_GET_SUCCESS):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(TRACK_FAVORITES_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}