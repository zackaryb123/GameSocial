import {
  LAZY_FEED_REQUEST,
  LAZY_FEED_GET,
  UP_SCROLL,
  DOWN_SCROLL,
  LAZY_FEED_ERROR
} from "./actions.lazy.feed";

const initialState = {
  loading: false,
  error: null,
  data: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LAZY_FEED_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true
      });
    case LAZY_FEED_GET:
      console.log(...action.data);
      return {
        ...state,
        data: [...action.data],
        endIndex: action.endIndex,
        begIndex: action.begIndex,
        loading: false,
        error: null
      };
    case UP_SCROLL:
      state.data.pop();
      return {
        ...state,
        data: [action.newItem, ...state.data],
        begIndex: action.begIndex - 1,
        endIndex: action.endIndex - 1
      };
    case DOWN_SCROLL:
      // if(action.windowWidth > 1199){
      //   state.data.shift();
      //   state.data.shift();
      //   state.data.shift();
      //   return { ...state,
      //     data:  [
      //       ...state.data,
      //       action.newItem[action.endIndex+1],
      //       action.newItem[action.endIndex+2],
      //       action.newItem[action.endIndex+3]
      //     ],
      //     begIndex: action.begIndex+3,
      //     endIndex: action.endIndex+3
      //   };
      // } else if(action.windowWidth > 991){
      //   state.data.shift();
      //   state.data.shift();
      //   return { ...state,
      //     data:  [
      //       ...state.data,
      //       action.newItem[action.endIndex+1],
      //       action.newItem[action.endIndex+2]
      //     ],
      //     begIndex: action.begIndex+2,
      //     endIndex: action.endIndex+2
      //   };
      // }else {
      state.data.shift();
      return {
        ...state,
        data: [...state.data, action.newItem[action.endIndex + 1]],
        begIndex: action.begIndex + 1,
        endIndex: action.endIndex + 1
      };
      // }
      state.data.shift();
      return {
        ...state,
        data: [...state.data, action.newItem],
        begIndex: action.begIndex + 1,
        endIndex: action.endIndex + 1
      };
    case LAZY_FEED_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      });
    default:
      return state;
  }
}
