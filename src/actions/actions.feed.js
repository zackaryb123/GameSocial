import * as firebase from 'firebase';
import _ from 'lodash';

// GET Action
export const FEED_REQUEST = 'FEED_REQUEST';
export const feedRequest = () => ({
  type: FEED_REQUEST
});

export const FEED_GET = 'FEED_GET';
export const feedGet = (newItem, date) => ({
  type: FEED_GET,
  newItem: newItem,
  date: date,

});

export const FEED_CLEAR = 'FEED_CLEAR';
export const feedClear = (data) => ({
  type: FEED_CLEAR,
  data
});

export const FEED_ERROR = 'FEED_ERROR';
export const feedError = error => ({
  type: FEED_ERROR,
  error
});

//Variables
const LOAD_COUNT = 10;
const ORDER_DATE = 'created_at';

// Function
export function getUploadSource(load, date) {
  console.log('getUserFavoriteVideos');
  return function (dispatch) {
    //Extract Videos Keys
    const videoKeys = Object.keys(load).map(function(key) {
      return key;
    });
    const databaseRef = firebase.database().ref('uploads');
    videoKeys.forEach((id) => {
      databaseRef.child(id).once('value', s => {
        const upload = s.val();
        dispatch(feedGet(upload, date));
      })
    });
  }
}

// Actions
export const getInitFeed = (authId, date, page, count) => dispatch => {
  dispatch(feedClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${authId}/feed`)
      .orderByChild(ORDER_DATE)
      .endAt(date)
      .limitToLast(LOAD_COUNT)
      .once("value", snap => {
        let load = snap.val();
        console.log(load);
        dispatch(getUploadSource(load));
      })
  // }).catch(error => dispatch(feedError(error)))
};

export const getNextFeed = (authId, date, page, count) => dispatch => {
  dispatch(feedClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${authId}/feed`)
    .orderByChild(ORDER_DATE)
    .endAt(date)
    .limitToLast(LOAD_COUNT)
    .once("value", snap => {
      let load = snap.val();
      console.log(load);
      dispatch(getUploadSource(load));
    })
  // }).catch(error => dispatch(feedError(error)))
};

export const getPrevFeed = (authId, date, page, count) => dispatch => {
  dispatch(feedClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${authId}/feed`)
    .orderByChild(ORDER_DATE)
    .startAt(date)
    .limitToFirst(LOAD_COUNT)
    .once("value", snap => {
      let load = snap.val();
      console.log(load);
      dispatch(getUploadSource(load));
    })
  // }).catch(error => dispatch(feedError(error)))
};