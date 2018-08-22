import * as firebase from 'firebase';
import _ from 'lodash';

// GET Action
export const FEED_REQUEST = 'FEED_REQUEST';
export const feedRequest = () => ({
  type: FEED_REQUEST
});

export const FEED_GET = 'FEED_GET';
export const feedGet = (data, date, page, total) => ({
  type: FEED_GET,
  data: data,
  date: date,
  page: page,
  total: total

});

export const FEED_INDEX_INC = 'FEED_INDEX_INC';
export const feedIndexInc = (begIndex, endIndex) => ({
  type: FEED_INDEX_INC,
  begIndex: begIndex,
  endIndex: endIndex,
});

export const FEED_INDEX_DEC = 'FEED_INDEX_DEC';
export const feedIndexDec = (begIndex, endIndex) => ({
  type: FEED_INDEX_DEC,
  begIndex: begIndex,
  endIndex: endIndex,
});

// export const FEED_ADD = 'FEED_ADD';
// export const feedAdd = (newUpload) => ({
//   type: FEED_ADD,
//   newUpload
// });
//
// export const FEED_REMOVE = 'FEED_REMOVE';
// export const feedRemove = () => ({
//   type: FEED_REMOVE
// });


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
const LOAD_COUNT = 20;
const ORDER_DATE = 'created_at';

// Actions
export const getFeedOnce = (authId, date, page, count) => dispatch => {
  dispatch(feedRequest);

  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/feed`)
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToLast(count)
      .once('value', snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });
        loadArray.reverse();

        firebase.database().ref(`users/${authId}/feed`).once('value', snap => {
          let total = snap.numChildren();
          console.log(total);
          const data = {page: 1, date: date, total: total };

          resolve(data);
          dispatch(feedGet(loadArray, date, page, total))
        });
      })
  }).catch(error => dispatch(feedError(error)))
};



export const getNextFeedOnce = (authId, date, page, count) => dispatch => {
  dispatch(feedRequest);

  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/feed`)
      .orderByChild(ORDER_DATE)
      .endAt(date)
      .limitToLast(count+1)
      .once('value', snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });
        loadArray.reverse();
        loadArray.shift();

        firebase.database().ref(`users/${authId}/feed`).once('value', snap => {
          let total = snap.numChildren();
          const data = { page: page+1, date: date, total: total };
          resolve(data);
          dispatch(feedGet(loadArray, date, total))
        });
      })
  }).catch(error => dispatch(feedError(error)))
};


export const getPrevFeedOnce = (authId, date, page, count) => dispatch => {
  dispatch(feedRequest);

  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/feed`)
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToFirst(count+1)
      .once('value', snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });

        loadArray.reverse();
        loadArray.pop();

        firebase.database().ref(`users/${authId}/feed`).once('value', snap => {
          let total = snap.numChildren();

          const data = { page: page-1, date: date, total: total };

          resolve(data);
          dispatch(feedGet(loadArray, date, total))
        });
      })
  }).catch(error => dispatch(feedError(error)))
};

export const decFeedIndex = (index) => dispatch => {
  dispatch(feedIndexDec(index))
};


export const incFeedIndex = (index) => dispatch => {
  dispatch(feedIndexInc(index))
};

// Service
export const clearFeed = () => dispatch => {
  dispatch(feedClear());
};