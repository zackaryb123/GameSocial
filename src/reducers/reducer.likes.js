import {
  LIKES_REQUEST, LIKES_ERROR, LIKES_GET
} from '../actions/actions.likes';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (LIKES_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(LIKES_GET):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(LIKES_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}