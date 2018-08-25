import  * as firebase from "firebase";

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

// Actions
export const getUploads = (date, page, count, state) => dispatch => {
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

export const getNextUploads = (date, page, count, state) => dispatch => {
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

export const getPrevUploads = (date, page, count, state) => dispatch => {
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



export const getUserUploads = (userId, date, page, count, state) => dispatch => {
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

export const getNextUserUploads = (userId, date, page, count, state) => dispatch => {
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

export const getPrevUserUploads = (userId, date, page, count, state) => dispatch => {
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


export const getUserPlaylist = (userId, date, page, count, state) => dispatch => {
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

export const getNextUserPlaylist = (userId, date, page, count, state) => dispatch => {
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

export const getPrevUserPlaylist = (userId, date, page, count, state) => dispatch => {
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