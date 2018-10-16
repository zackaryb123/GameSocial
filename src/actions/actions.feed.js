import * as firebase from 'firebase';
import _ from 'lodash';
// GET Action
export const FEED_REQUEST = 'FEED_REQUEST';
export const feedRequest = () => ({
  type: FEED_REQUEST
});

export const FEED_GET = 'FEED_GET';
export const feedGet = (newItem) => ({
  type: FEED_GET,
  newItem: newItem

});

export const FEED_CLEAR = 'FEED_CLEAR';
export const feedClear = () => ({
  type: FEED_CLEAR
});

export const FEED_ERROR = 'FEED_ERROR';
export const feedError = error => ({
  type: FEED_ERROR,
  error
});

//Variables
const LOAD_COUNT = 10;
const ORDER_DATE = 'created_at';

// Actions
export const getFeedUploads = (authId, date) => dispatch => {
  dispatch(feedClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${authId}/following`)
    .once("value", snap => {
      let following = snap.val() === null ? {} : snap.val();
      following[authId] = {id: authId};

      _.forEach(following, i => {
        dispatch(feedRequest);
        firebase
          .database()
          .ref(`users/${i.id}/uploads`)
          .orderByChild(ORDER_DATE)
          .endAt(date)
          .limitToLast(LOAD_COUNT)
          .once("value", snap => {
            let uploads = snap.val();
            _.forEach(uploads, i => {
              dispatch(feedGet(i));
            });
          });
      });
    })
  // }).catch(error => dispatch(feedError(error)))
};

export const getNextFeedUploads = (authId, date) => dispatch => {
  // dispatch(uploadsClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${authId}/following`)
    .once("value", snap => {
      let following = snap.val() === null ? {} : snap.val();
      following[authId] = {id: authId};

      _.forEach(following, i => {
        dispatch(feedRequest);
        firebase
          .database()
          .ref(`users/${i.id}/uploads`)
          .orderByChild(ORDER_DATE)
          .endAt(date)
          .limitToLast(LOAD_COUNT)
          .once("value", snap => {
            let uploads = snap.val();
            _.forEach(uploads, i => {
              dispatch(feedGet(i));
            });
          });
      });
    })
  // }).catch(error => dispatch(feedError(error)))
};


export const getPrevFeedUploads = (authId, date) => dispatch => {
  // dispatch(uploadsClear());
  dispatch(feedRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${authId}/following`)
    .once("value", snap => {
      let following = snap.val() === null ? {} : snap.val();
      following[authId] = {id: authId};

      _.forEach(following, i => {
        dispatch(feedRequest);
        firebase
          .database()
          .ref(`users/${i.id}/uploads`)
          .orderByChild(ORDER_DATE)
          .startAt(date)
          .limitToFirst(LOAD_COUNT)
          .once("value", snap => {
            let uploads = snap.val();
            _.forEach(uploads, i => {
              dispatch(feedGet(i));
            });
          });
      });
    })
  // }).catch(error => dispatch(feedError(error)))
};
