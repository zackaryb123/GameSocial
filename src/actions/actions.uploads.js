import * as firebase from "firebase";

export const UPLOAD_REQUEST = 'UPLOAD_REQUEST';
export const uploadRequest = () => ({
  type: UPLOAD_REQUEST
});

export const UPLOAD_GET = 'UPLOAD_GET';
export const uploadGet = (data) => ({
  type: UPLOAD_GET,
  data
});

export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const uploadError = error => ({
  type: UPLOAD_ERROR,
  error
});

// Actions
export const getUploads = () => dispatch => {
  dispatch(uploadRequest());
  return firebase.database().ref('uploads/').on('value', data => {
    dispatch(uploadGet(data.val()));
  })
};

export const getUploadsPromise = () => dispatch => {
  dispatch(uploadRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref('uploads/').on('value', data => {
      let uploads = data.val();
      resolve(dispatch(uploadGet(uploads)));
    })
  });
};