import * as firebase from "firebase";
import _ from "lodash";
import { getFeedOnce } from "./actions.feed";

// GET Action
export const LAZY_FEED_REQUEST = "LAZY_FEED_REQUEST";
export const lazyFeedRequest = () => ({
  type: LAZY_FEED_REQUEST
});

export const LAZY_FEED_GET = "LAZY_FEED_GET";
export const lazyFeedGet = (data, begIndex, endIndex) => ({
  type: LAZY_FEED_GET,
  data: data,
  begIndex: begIndex,
  endIndex: endIndex
});

export const UP_SCROLL = 'UP_SCROLL';
export const upScroll = (newItem, begIndex, endIndex, windowWidth) => ({
  type: UP_SCROLL,
  newItem,
  begIndex: begIndex,
  endIndex: endIndex,
  windowWidth: windowWidth
});

export const DOWN_SCROLL = 'DOWN_SCROLL';
export const downScroll = (newItem, begIndex, endIndex, windowWidth) => ({
  type: DOWN_SCROLL,
  newItem,
  begIndex: begIndex,
  endIndex: endIndex,
  windowWidth: windowWidth
});

export const LAZY_FEED_CLEAR = "LAZY_FEED_CLEAR";
export const lazyFeedClear = data => ({
  type: LAZY_FEED_CLEAR,
  data
});

export const LAZY_FEED_ERROR = "LAZY_FEED_ERROR";
export const lazyFeedError = error => ({
  type: LAZY_FEED_ERROR,
  error
});

//Variables
const LOAD_COUNT = 20;
const LAZY_COUNT = 10;
const ORDER_DATE = "created_at";
const ORDER_INDEX = "index";

// Actions
export const getLazyFeed = (load, begIndex, endIndex) => dispatch => {
  const lazy = load.slice(begIndex, endIndex);
  console.log('Lazy:', lazy);
  // let indexedLazyArray = [];
  // _.forEach(lazy, item => {
  //   indexedLazyArray.push(item);
  // });

  dispatch(lazyFeedGet(lazy, begIndex, endIndex));
};

// Services
export const scrollDown = (authId, load, begIndex, endIndex, page, thisComp, dbIndex, windowWidth) => dispatch => {
  if(endIndex === LOAD_COUNT * page - 1){ // - 1
    let dbIndex = dbIndex > 0 ? dbIndex : endIndex+1;
    thisComp.props.getFeedOnce(authId, begIndex, endIndex, page+1, dbIndex)
      .then(data => {
        thisComp.props.getLazyFeed(data.load, 0, 10, data.page);
        dispatch(downScroll(data.load, -1, 9, windowWidth)); // data.load[0]
      })
  } else if(endIndex < LOAD_COUNT * page){
    console.log('new Item:', load[endIndex+1]);
    dispatch(downScroll(load, begIndex, endIndex, windowWidth)); // load[endIndex+1]
    // dispatch(lazyFeedRemoveBeg());
    // dispatch(lazyFeedAddEnd(load[endIndex+1]));
  } else {}
};

export const scrollUp = (authId, load, begIndex, endIndex, page, thisComp, windowWidth) => dispatch => {
  if(begIndex === 0){
    // thisComp.props.getFeedOnce(authId, begIndex, endIndex, page-1)
    //   .then(data => thisComp.props.getLazyFeed(data.load, data.begIndex, data.endIndex, data.page));
  } else if(begIndex > 0){
    // console.log(load[begIndex-1]);
    // dispatch(upScroll(load[begIndex-1], begIndex, endIndex));
    // dispatch(lazyFeedRemoveEnd());
    // dispatch(lazyFeedAddBeg(load[begIndex-1]));
  } else {}
};
