import {
  COMMENTS_ERROR, COMMENTS_GET, COMMENTS_REQUEST
} from '../actions/actions.comments';

const initialState = {
  loading: false,
  error: null,
  data: {}
};

export default function reducer(state = initialState, action) {
  switch(action.type){
    case (COMMENTS_REQUEST):
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    case(COMMENTS_GET):
      return { ...state,
        data : {[action.comment.commentId] : action.comment},
        error: null,
        loading: false
      };
    case(COMMENTS_ERROR):
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}