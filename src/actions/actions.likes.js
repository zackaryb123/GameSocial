import * as firebase from 'firebase';

export const LIKES_REQUEST = 'LIKES_REQUEST';
export const likesRequest = () => ({
  type: LIKES_REQUEST,
});

export const LIKES_GET = 'LIKES_GET';
export const likesGet = (data) => ({
  type: LIKES_GET,
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
  return firebase.database().ref(`users/${authId}/likes`).once('value', (snapshot) => {
    let likes = snapshot.val();
    dispatch(likesGet(likes));
  }).catch(error => dispatch(likesError(error)));
};

//*** SERVICES ***//
export const getInitLikeState = (authId, uploadId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/likes/${uploadId}`).once('value', (snapshot) => {
      const exist = !!snapshot.val();
        resolve(exist);
    })
  })
};

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