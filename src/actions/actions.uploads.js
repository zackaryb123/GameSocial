import  * as firebase from "firebase";

// GET Action
export const UPLOADS_REQUEST = 'UPLOADS_REQUEST';
export const uploadsRequest = () => ({
  type: UPLOADS_REQUEST
});

export const UPLOADS_GET = 'UPLOADS_GET';
export const uploadsGet = (data) => ({
  type: UPLOADS_GET,
  data
});

export const UPLOADS_ERROR = 'UPLOADS_ERROR';
export const uploadsError = error => ({
  type: UPLOADS_ERROR,
  error
});

// Actions
export const getUploadsOnce = () => dispatch => {
  dispatch(uploadsRequest());
  let uploadsArray = [];
  return firebase.database().ref('uploads/').once('value', snapshot => {
    let uploads = snapshot.val();
    _.forEach(uploads, upload => {
      uploadsArray.push(upload);
    });
    uploadsArray.reverse();
    dispatch(uploadsGet(uploadsArray));
  }).catch(error => dispatch(uploadsError(error)))
};

export const getUploadsOncePromise = () => dispatch => {
  dispatch(uploadsRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref('uploads/').on('value', snapshot => {
      let uploads = snapshot.val();
      resolve(dispatch(uploadsGet(uploads)));
    })
  }).catch(error => dispatch(uploadsError(error)));
};