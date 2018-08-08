import {
  FOLLOWING_REQUEST, FOLLOWING_ERROR, FOLLOWING_GET
} from '../actions/actions.following';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (FOLLOWING_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(FOLLOWING_GET):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(FOLLOWING_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}