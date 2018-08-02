import {
  FEATURED_REQUEST, FEATURED_ERROR, FEATURED_GET_SUCCESS
} from '../actions/actions.featured';

const initialState = {
  loading: false,
  error: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (FEATURED_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(FEATURED_GET_SUCCESS):
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        loading: false
      });
    case(FEATURED_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}