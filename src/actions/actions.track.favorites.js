import * as firebase from 'firebase';
import {TrackedFavoriteObject} from './models';

export const TRACK_FAVORITES_REQUEST = 'TRACK_FAVORITES_REQUEST';
export const trackFavoritesRequest = () => ({
  type: TRACK_FAVORITES_REQUEST,
});

export const TRACK_FAVORITES_GET_SUCCESS = 'TRACK_FAVORITES_GET_SUCCESS';
export const trackFavoritesGetSuccess = (data) => ({
  type: TRACK_FAVORITES_GET_SUCCESS,
  data
});

export const TRACK_FAVORITES_ERROR = 'TRACK_FAVORITES_ERROR';
export const trackFavoritesError = error => ({
  type: TRACK_FAVORITES_ERROR,
  error
});

//*** ACTIONS **//
export const getTrackedFavoritesPromise = (authId) => dispatch => {
  dispatch(trackFavoritesRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/${authId}/favoriteLikesList`).once('value', (data) => {
      let likes = data.val();
      resolve(dispatch(trackFavoritesGetSuccess(likes)));
    });
  }).catch(error => dispatch(trackFavoritesError(error)));
};

export const getTrackedFavoritesOnce = (authId) => dispatch => {
  dispatch(trackFavoritesRequest());
  return firebase.database().ref(`users/${authId}/likes`).once('value', (data) => {
    let likes = data.val();
    dispatch(trackFavoritesGetSuccess(likes));
  }).catch(error => dispatch(trackFavoritesError(error)));
};

//*** SERVICES ***//
export const addTrackedFavorite = (authId, upload) => dispatch => {
  let usersFavoirteOject = new TrackedFavoriteObject(authId, upload.publisher.id);
  firebase.database().ref(`users/${upload.publisher.id}/tracked_favorites/${upload.id}/${authId}`).set(usersFavoirteOject)
};

export const removeTrackedFavorite = (authId, upload) => dispatch => {
  firebase.database().ref(`users/${upload.publisher.id}/tracked_favorites/${upload.id}/${authId}`).remove();
};