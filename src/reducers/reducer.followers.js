import {
  FOLLOWERS_REQUEST, FOLLOWERS_ERROR, FOLLOWERS_GET
} from '../actions/actions.followers';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (FOLLOWERS_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(FOLLOWERS_GET):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(FOLLOWERS_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}