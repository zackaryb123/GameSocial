import {
  FAVORITE_REQUEST, FAVORITE_ERROR, FAVORITE_GET_SUCCESS, FAVORITE_DELETE_SUCCESS
} from '../actions/action.favorite';

const initialState = {
  loading: false,
  error: null,
  data: []
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (FAVORITE_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(FAVORITE_GET_SUCCESS):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(FAVORITE_DELETE_SUCCESS):
      return Object.assign({}, state, {
        data: [],
        error: null,
        loading: false
      });
    case(FAVORITE_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}