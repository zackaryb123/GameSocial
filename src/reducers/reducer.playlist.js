import {
  PLAYLIST_REQUEST, PLAYLIST_ERROR, PLAYLIST_GET_SUCCESS
} from '../actions/actions.playlist';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (PLAYLIST_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(PLAYLIST_GET_SUCCESS):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(PLAYLIST_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}