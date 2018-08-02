import {
  FAVORITES_REQUEST, FAVORITES_ERROR, FAVORITES_GET
} from '../actions/actions.favorites';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (FAVORITES_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(FAVORITES_GET):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(FAVORITES_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}