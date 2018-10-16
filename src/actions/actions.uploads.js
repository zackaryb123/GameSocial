import  * as firebase from "firebase";
import _ from "lodash";
import { FeedItemObj } from "./models";

// GET Action
export const UPLOADS_REQUEST = 'UPLOADS_REQUEST';
export const uploadsRequest = () => ({
  type: UPLOADS_REQUEST
});

export const UPLOADS_GET = 'UPLOADS_GET';
export const uploadsGet = (newItem, date, page, total) => ({
  type: UPLOADS_GET,
  newItem: newItem,
  date: date,
  page: page,
  total: total
});

export const UPLOADS_TOTAL_GET = 'UPLOADS_TOTAL_GET';
export const uploadsTotalGet = (count) => ({
  type: UPLOADS_TOTAL_GET,
  count: count
});

export const UPLOADS_CLEAR = 'UPLOADS_CLEAR';
export const uploadsClear = (data) => ({
  type: UPLOADS_CLEAR,
  data
});


export const UPLOADS_ERROR = 'UPLOADS_ERROR';
export const uploadsError = error => ({
  type: UPLOADS_ERROR,
  error
});

// Variables
const LOAD_COUNT = 10;
const ORDER_DATE = 'created_at';

// Function
export function getUploadSource(load, date) {
  return function (dispatch) {
    //Extract Videos Keys
    const videoKeys = Object.keys(load).map(function(key) {
      return key;
    });
    const databaseRef = firebase.database().ref('uploads');
    videoKeys.forEach((id) => {
      databaseRef.child(id).once('value', s => {
        const upload = s.val();
        dispatch(uploadsGet(upload, date));
      })
    });
  }
}

/////////////// Uploads /////////////////////
export const getUploads = (date) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`uploads`)
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

export const getNextUploads = (date) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`uploads`)
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

export const getPrevUploads = (date) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`uploads`)
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


/////////// User Uploads ///////////////
export const getUserUploads = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/${state}`)
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

export const getNextUserUploads = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/${state}`)
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

export const getPrevUserUploads = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/${state}`)
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

///////////// Playlist Uploads ///////////////
export const getUserPlaylist = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/playlist/${state}`)
    .orderByChild(ORDER_DATE)
    .endAt(date)
    .limitToLast(LOAD_COUNT)
    .once("value", snap => {
      let load = snap.val();
      console.log(load);
      if(load['name']){delete load['name']}
      dispatch(getUploadSource(load));
    })
  // }).catch(error => dispatch(feedError(error)))
};

export const getNextUserPlaylist = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/playlist/${state}`)
    .orderByChild(ORDER_DATE)
    .endAt(date)
    .limitToLast(LOAD_COUNT)
    .once("value", snap => {
      let load = snap.val();
      if(load['name']){delete load['name']}
      console.log(load);
      dispatch(getUploadSource(load));
    })
  // }).catch(error => dispatch(feedError(error)))
};

export const getPrevUserPlaylist = (userId, date, page, state) => dispatch => {
  dispatch(uploadsClear());
  dispatch(uploadsRequest);
  // return new Promise((resolve, reject) => {
  return firebase
    .database()
    .ref(`users/${userId}/playlist/${state}`)
    .orderByChild(ORDER_DATE)
    .startAt(date)
    .limitToFirst(LOAD_COUNT)
    .once("value", snap => {
      let load = snap.val();
      if(load['name']){delete load['name']}
      console.log(load);
      dispatch(getUploadSource(load));
    })
  // }).catch(error => dispatch(feedError(error)))
};