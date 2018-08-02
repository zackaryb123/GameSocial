import * as firebase from 'firebase';

export const FAVORITES_REQUEST = 'FAVORITES_REQUEST';
export const favoritesRequest = () => ({
  type: FAVORITES_REQUEST,
});

export const FAVORITES_GET = 'FAVORITES_GET';
export const favoritesGet = (data) => ({
  type: FAVORITES_GET,
  data
});

export const FAVORITES_ERROR = 'FAVORITES_ERROR';
export const favoritesError = error => ({
  type: FAVORITES_ERROR,
  error
});

//*** ACTIONS **//
export const getFavoritesOnce = (authId) => dispatch => {
  dispatch(favoritesRequest());
  return firebase.database().ref(`users/${authId}/favorites`).once('value', (snapshot) => {
    let favorites = snapshot.val();
    dispatch(favoritesGet(favorites));
  }).catch(error => dispatch(favoritesError(error)));
};

//*** SERVICES ***//
export const getInitFavoriteState = (authId, uploadId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/favorites/${uploadId}`).once('value', (snapshot) => {
      const isFavorite = !!snapshot.val();
      resolve(isFavorite);
    })
  })
};

export const addFavorite = (authId, upload) => dispatch => {
  firebase.database().ref(`users/${authId}/favorites/${upload.id}/id`).set(upload.id);
};

export const removeFavorite = (authId, uploadId) => dispatch => {
  firebase.database().ref(`users/${authId}/favorites/${uploadId}`).remove();
};