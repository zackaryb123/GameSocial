import * as firebase from 'firebase';

export const LIKES_REQUEST = 'LIKES_REQUEST';
export const likesRequest = () => ({
  type: LIKES_REQUEST,
});

export const LIKES_GET_SUCCESS = 'LIKES_GET_SUCCESS';
export const likesGetSuccess = (data) => ({
  type: LIKES_GET_SUCCESS,
  data
});

export const LIKES_ERROR = 'LIKES_ERROR';
export const likesError = error => ({
  type: LIKES_ERROR,
  error
});

//*** ACTIONS **//
export const getLikesOnce = (authId) => dispatch => {
  dispatch(likesRequest());
  return firebase.database().ref(`users/${authId}/likes`).once('value', (data) => {
    let likes = data.val();
    dispatch(likesGetSuccess(likes));
  }).catch(error => dispatch(likesError(error)));
};

export const getLikesPromise = (authId) => dispatch => {
  dispatch(likesRequest());
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/likes`).once('value', (data) => {
      let likes = data.val();
      resolve(dispatch(likesGetSuccess(likes)));
    });
  }).catch(error => dispatch(likesError(error)));
};

//*** SERVICES ***//
export const addLike = (authId, uploadId, publisherId) => dispatch => {
  firebase.database().ref(`users/${authId}/likes/${uploadId}/id`).set(uploadId);
  firebase.database().ref(`users/${publisherId}/uploads/${uploadId}/likes/${authId}/id`).set(authId);
  firebase.database().ref(`uploads/${uploadId}/likes/${authId}/id`).set(authId);

};

export const removeLike = (authId, uploadId, publisherId) => dispatch => {
  firebase.database().ref(`users/${authId}/likes/${uploadId}`).remove();
  firebase.database().ref(`users/${publisherId}/uploads/${uploadId}/likes/${authId}`).remove();
  firebase.database().ref(`uploads/${uploadId}/likes/${authId}`).remove()
};