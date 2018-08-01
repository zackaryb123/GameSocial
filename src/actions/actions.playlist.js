import * as firebase from 'firebase';
import {PlaylistObject} from './models';

export const PLAYLIST_REQUEST = 'PLAYLIST_REQUEST';
export const playlistRequest = () => ({
  type: PLAYLIST_REQUEST,
});

export const PLAYLIST_GET_SUCCESS = 'PLAYLIST_GET_SUCCESS';
export const playlistGetSuccess = (data) => ({
  type: PLAYLIST_GET_SUCCESS,
  data
});

export const PLAYLIST_ERROR = 'PLAYLIST_ERROR';
export const playlistError = error => ({
  type: PLAYLIST_ERROR,
  error
});

//*** ACTIONS **//
export const getPlaylistPromise = (authId) => dispatch => {
  dispatch(playlistRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/${authId}/playlist`).once('value', (data) => {
      let playlist = data.val();
      resolve(dispatch(playlistGetSuccess(playlist)));
    });
  }).catch(error => dispatch(playlistError(error)));
};

export const getPlaylistOnce = (authId) => dispatch => {
  dispatch(playlistRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/${authId}/playlist`).once('value', (data) => {
      let playlist = data.val();
      resolve(dispatch(playlistGetSuccess(playlist)));
    });
  })
};

export const getPlaylist = (authId) => dispatch => {
  dispatch(playlistRequest());
  return firebase.database().ref(`users/${authId}/playlist`).once('value', (data) => {
    let playlist = data.val();
    dispatch(playlistGetSuccess(playlist));
  }).catch(error => dispatch(playlistError(error)));
};

//*** SERVICES ***//
export const addToPlaylist = (authId, upload, playlistName) => dispatch => {
  let playlistObject = new PlaylistObject(upload, playlistName);
  firebase.database().ref(`users/${authId}/playlist/${playlistName}/${upload.id}`).set(playlistObject);
};

export const createPlaylist = (authId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}/name`).set(playlistName);
};

export const removePlaylist = (authId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}`).remove()
};

export const removeFromPlaylist = (authId, uploadId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}/${uploadId}`).remove()
};