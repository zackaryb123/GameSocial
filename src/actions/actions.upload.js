import * as firebase from "firebase";

export const UPLOAD_REQUEST = "UPLOAD_REQUEST";
export const uploadRequest = () => ({
  type: UPLOAD_REQUEST
});

export const UPLOAD_GET = "UPLOAD_GET";
export const uploadGet = data => ({
  type: UPLOAD_GET,
  data
});

export const UPLOAD_ERROR = "UPLOAD_ERROR";
export const uploadError = error => ({
  type: UPLOAD_ERROR,
  error
});

//*** ACTIONS ***//
export const getUploadOnce = (uploadId) => dispatch => {
  dispatch(uploadRequest());
  firebase.database().ref(`uploads/${uploadId}`).once("value", snapshot => {
    let upload = snapshot.val();
    dispatch(uploadGet(upload));
  });
};

//*** SERVICES **//
export const storeUpload = (upload) => dispatch => {
  dispatch(uploadGet(upload));
};

