import * as firebase from 'firebase';
import {TrackedFavoritesObj} from '../../actions/models';

export const TRACK_FAVORITES_REQUEST = 'TRACK_FAVORITES_REQUEST';
export const trackFavoritesRequest = () => ({
  type: TRACK_FAVORITES_REQUEST,
});

export const TRACK_FAVORITES_GET = 'TRACK_FAVORITES_GET';
export const trackFavoritesGet = (data) => ({
  type: TRACK_FAVORITES_GET,
  data
});

export const TRACK_FAVORITES_ERROR = 'TRACK_FAVORITES_ERROR';
export const trackFavoritesError = error => ({
  type: TRACK_FAVORITES_ERROR,
  error
});

//*** ACTIONS **//
export const getTrackedFavoritesOnce = (authId) => dispatch => {
  dispatch(trackFavoritesRequest());
  return firebase.database().ref(`users/${authId}/likes`).once('value', (snapshot) => {
    let trackedFavorites = snapshot.val();
    dispatch(trackFavoritesGet(trackedFavorites));
  }).catch(error => dispatch(trackFavoritesError(error)));
};

//*** SERVICES ***//
export const addTrackedFavorite = (authId, upload) => dispatch => {
  let trackedFavoritesObj = new TrackedFavoritesObj(authId, upload.id);
  firebase.database().ref(`users/${upload.publisher.id}/tracked_favorites/${upload.id}/${authId}`).set(trackedFavoritesObj)
};

export const removeTrackedFavorite = (authId, upload) => dispatch => {
  firebase.database().ref(`users/${upload.publisher.id}/tracked_favorites/${upload.id}/${authId}`).remove();
};