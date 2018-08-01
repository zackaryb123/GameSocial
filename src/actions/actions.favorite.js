import * as firebase from 'firebase';
import {FavoriteObject} from './models';

export const FAVORITE_REQUEST = 'FAVORITE_REQUEST';
export const favoriteRequest = () => ({
  type: FAVORITE_REQUEST,
});

export const FAVORITE_GET_SUCCESS = 'FAVORITE_GET_SUCCESS';
export const favoriteGetSuccess = (data) => ({
  type: FAVORITE_GET_SUCCESS,
  data
});

export const FAVORITE_ERROR = 'FAVORITE_ERROR';
export const favoriteError = error => ({
  type: FAVORITE_ERROR,
  error
});

//*** ACTIONS **//
export const getFavoritesPromise = (authId) => dispatch => {
  dispatch(favoriteRequest());
  return new Promise((resolve, reject) => {
    firiebase.database().ref(`users/${authId}/favorites`).once('value', (data) => {
      let favorites = data.val();
      resolve(dispatch(favoriteGetSuccess(favorites)));
    });
  })
};

export const getFavoritesOnce = (authId) => dispatch => {
  dispatch(favoriteRequest());
  return firiebase.database().ref(`users/${authId}/favorites`).once('value', (data) => {
    let favorites = data.val();
    dispatch(favoriteGetSuccess(favorites));
  }).catch(error => dispatch(followersError(error)));
};

//*** SERVICES ***//
export const addFavorite = (authId, upload) => dispatch => {
  let favoriteObject = new FavoriteObject(upload);
  const favoritesRef = firiebase.database().ref(`users/${authId}/favorites`);
  favoritesRef.child(`/${upload.id}`).set(favoriteObject);
};

export const removeFavorite = (authId, upload) => dispatch => {
  firiebase.database().ref(`users/${authId}/favorites/${upload.id}`).remove();
};