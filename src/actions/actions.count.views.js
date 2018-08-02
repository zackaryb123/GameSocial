import * as firebase from  'firebase';
import _ from 'lodash';
const publicIp = require('public-ip');

export const COUNT_VIEWS_REQUEST = 'COUNT_VIEWS_REQUEST';
export const countViewsRequest = () => ({
  type: COUNT_VIEWS_REQUEST,
});

export const COUNT_VIEWS_GET = 'COUNT_VIEWS_GET';
export const countViewsGet = (data) => ({
  type: COUNT_VIEWS_GET,
  data
});

export const COUNT_VIEWS_ERROR = 'COUNT_VIEWS_ERROR';
export const countViewsError = error => ({
  type: COUNT_VIEWS_ERROR,
  error
});

//*** ACTIONS **//
export const getCountViewsOnce = (uploadId) => dispatch => {
  dispatch(countViewsRequest());
  return firebase.database().ref(`uploads/${uploadId}/views`).once('value', (snapshot) => {
    let viewsCount = _.size(snapshot.val());
    dispatch(countViewsGet(viewsCount));
  }).catch(error => dispatch(countViewsError(error)));
};

//*** SERVICES ***//
export const addCountViews = (ipAddress, upload) => dispatch => {
  firebase.database().ref(`uploads/${upload.id}/views/${ipAddress}`).set(ipAddress);
  firebase.database().ref(`users/${upload.publisher.id}/uploads/${upload.id}/views/${ipAddress}`).set(ipAddress)
};

export const checkUploadViewsList = (ipAddress, uploadId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`uploads/${uploadId}/views/${ipAddress}`)
      .once('value', snapshot => {
        resolve(!!snapshot.val())
      })
  })
};