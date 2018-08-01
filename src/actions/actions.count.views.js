import * as firebase from  'firebase';
import _ from 'lodash';

export const COUNT_VIEWS_REQUEST = 'COUNT_VIEWS_REQUEST';
export const countViewsRequest = () => ({
  type: COUNT_VIEWS_REQUEST,
});

export const COUNT_VIEWS_GET_SUCCESS = 'COUNT_VIEWS_GET_SUCCESS';
export const countViewsGetSuccess = (data) => ({
  type: COUNT_VIEWS_GET_SUCCESS,
  data
});

export const COUNT_VIEWS_ERROR = 'COUNT_VIEWS_ERROR';
export const countViewsError = error => ({
  type: COUNT_VIEWS_ERROR,
  error
});

//*** ACTIONS **//
export const getCountViewsPromise = (uploadId, type) => dispatch => {
  dispatch(countViewsRequest());
  if(type === 'image') {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`uploads/images/${uploadId}/views`).on('value', (data) => {
        let views = data.val();
        let viewsCount = _.size(views);
        resolve(dispatch(countViewsGetSuccess(viewsCount)));
      });
    })
  }
  if(type === 'video') {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`uploads/videos/${uploadId}/views`).on('value', (data) => {
        let views = data.val();
        let viewsCount = _.size(views);
        resolve(dispatch(countViewsGetSuccess(viewsCount)));
      });
    })
  }
};

export const getCountViews = (uploadId, type) => dispatch => {
  dispatch(countViewsRequest());
  if(type === 'image') {
    return firebase.database().ref(`uploads/images/${uploadId}/views`).on('value', (data) => {
      let views = data.val();
      let viewsCount = _.size(views);
      dispatch(countViewsGetSuccess(viewsCount));
    });
  }
  if(type === 'video') {
    return firebase.database().ref(`uploads/videos/${uploadId}/views`).on('value', (data) => {
      let views = data.val();
      let viewsCount = _.size(views);
      dispatch(countViewsGetSuccess(viewsCount));
    });
  }
};

export const getCountViewsOnce = (uploadId, type) => dispatch => {
  dispatch(countViewsRequest());
  if(type === 'image') {
    return firebase.database().ref(`uploads/images/${uploadId}/views`).once('value', (data) => {
      let views = data.val();
      let viewsCount = _.size(views);
      dispatch(countViewsGetSuccess(viewsCount));
    }).catch(error => dispatch(countViewsError(error)));
  }
  if(type === 'video') {
    return firebase.database().ref(`uploads/videos/${uploadId}/views`).once('value', (data) => {
      let views = data.val();
      let viewsCount = _.size(views);
      dispatch(countViewsGetSuccess(viewsCount));
    }).catch(error => dispatch(countViewsError(error)));
  }
};

//*** SERVICES ***//
export const addCountViews = (ipAddress, uploadId, type) => dispatch => {
  if(type === 'image') {
    //const ipKey = database.ref(`uploads/images/${uploadId}/views/`).push().key;
    firebase.database().ref(`uploads/images/${uploadId}/views/${ipAddress}`).set(ipAddress)
  }

  if(type === 'video') {
    //const ipKey = database.ref(`uploads/videos/${uploadId}/views/`).push().key;
    firebase.database().ref(`uploads/videos/${uploadId}/views/${ipAddress}`).set(ipAddress)
  }
};

export const checkUploadViewsList = (ipAddress, uploadId, type) => dispatch => {
  return new Promise((resolve, reject) => {
    if(type === 'image') {
      firebase.database().ref(`uploads/images/${uploadId}/views/${ipAddress}`)
        .on('value', data => {
          resolve(!!data.val())
        });
    }

    if(type === 'video'){
      firebase.database().ref(`uploads/videos/${uploadId}/views/${ipAddress}`)
        .on('value', data => {
          resolve(!!data.val())
        })
    }
  })
};